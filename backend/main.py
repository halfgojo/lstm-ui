import os
import pickle
import numpy as np
import pandas as pd
from io import StringIO
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional

os.environ["TF_CPP_MIN_LOG_LEVEL"] = "3"
import tensorflow as tf

app = FastAPI(
    title="Battery Swelling Prediction API",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

MODEL_PATH = os.path.join(BASE_DIR, "best_model.h5")
SCALER_X_PATH = os.path.join(BASE_DIR, "scaler_X.pkl")
SCALER_Y_PATH = os.path.join(BASE_DIR, "scaler_y.pkl")

model = None
scaler_X = None
scaler_y = None


def _build_model_from_scratch():
    # had to do this because the saved model uses old keras format
    # and the new keras throws error about time_major kwarg
    from tensorflow.keras.models import Sequential
    from tensorflow.keras.layers import LSTM, Dropout, Dense

    m = Sequential([
        LSTM(64, return_sequences=True, input_shape=(5, 5)),
        Dropout(0.2),
        LSTM(32),
        Dropout(0.25),
        Dense(1, activation='linear'),
    ])
    m.compile(optimizer='adam', loss='mse', metrics=['mae'])
    m.load_weights(MODEL_PATH)
    return m


def load_artifacts():
    global model, scaler_X, scaler_y

    if not os.path.exists(MODEL_PATH):
        raise RuntimeError(f"Model file not found: {MODEL_PATH}")
    if not os.path.exists(SCALER_X_PATH):
        raise RuntimeError(f"Scaler X file not found: {SCALER_X_PATH}")
    if not os.path.exists(SCALER_Y_PATH):
        raise RuntimeError(f"Scaler Y file not found: {SCALER_Y_PATH}")

    # try loading full model first, fallback to rebuilding if keras version mismatch
    try:
        model = tf.keras.models.load_model(MODEL_PATH, compile=False)
    except (ValueError, TypeError) as e:
        print(f"Full model load failed ({e}), rebuilding architecture...")
        model = _build_model_from_scratch()

    with open(SCALER_X_PATH, "rb") as f:
        scaler_X = pickle.load(f)
    with open(SCALER_Y_PATH, "rb") as f:
        scaler_y = pickle.load(f)

    print("Model and scalers loaded successfully")


@app.on_event("startup")
async def startup_event():
    load_artifacts()


WINDOW_SIZE = 5

# thresholds for classification
THRESHOLD_WARNING = 5.0
THRESHOLD_CRITICAL = 15.0


class PredictionResult(BaseModel):
    cycle: int
    resistance: float
    predicted_resistance: float
    delta_resistance: float
    delta_resistance_percent: float
    temperature: float
    soc: float
    status: str


class PredictionResponse(BaseModel):
    success: bool
    message: str
    data: List[PredictionResult]
    summary: dict


def classify_status(delta_r_percent):
    # only positive delta means swelling (resistance increasing)
    if delta_r_percent >= THRESHOLD_CRITICAL:
        return "Critical"
    elif delta_r_percent >= THRESHOLD_WARNING:
        return "Warning"
    return "Normal"


def preprocess_dataframe(df):
    col_map = {}
    for col in df.columns:
        lower = col.strip().lower()
        if lower in ("resistance", "resistance(ω)", "resistance (ω)"):
            col_map[col] = "Resistance"
        elif lower in ("temperature", "temperature(°c)", "temperature (°c)", "temp"):
            col_map[col] = "Temperature"
        elif lower in ("soc", "soc_%", "soc %", "state of charge"):
            col_map[col] = "SoC_%"
        elif lower in ("soh", "soh_%", "soh %", "state of health"):
            col_map[col] = "SoH_%"
        elif lower in ("delta-resistance", "delta_resistance", "deltares", "δr"):
            col_map[col] = "delta-Resistance"

    df = df.rename(columns=col_map)

    if "Resistance" not in df.columns:
        raise ValueError("CSV must contain a 'Resistance' column.")
    if "Temperature" not in df.columns:
        raise ValueError("CSV must contain a 'Temperature' column.")

    if "delta-Resistance" not in df.columns:
        initial_r = df["Resistance"].iloc[0]
        df["delta-Resistance"] = df["Resistance"] - initial_r

    if "SoC_%" not in df.columns:
        if "SoC" in df.columns:
            df["SoC_%"] = df["SoC"]
        else:
            df["SoC_%"] = 100.0

    # default SoH to 100 since most csvs dont have it
    if "SoH_%" not in df.columns:
        df["SoH_%"] = 100.0

    return df


def predict_from_dataframe(df):
    initial_resistance = df["Resistance"].iloc[0]

    feature_cols = ["Resistance", "delta-Resistance", "SoC_%", "SoH_%", "Temperature"]
    features = df[feature_cols].values

    X_scaled = scaler_X.transform(features)

    if len(X_scaled) < WINDOW_SIZE:
        raise ValueError(
            f"Need at least {WINDOW_SIZE} data rows for prediction, got {len(X_scaled)}."
        )

    # create sliding windows same as training
    windows = []
    for i in range(len(X_scaled) - WINDOW_SIZE):
        windows.append(X_scaled[i : i + WINDOW_SIZE])
    X_windows = np.array(windows)

    y_pred_scaled = model.predict(X_windows, verbose=0)
    y_pred = scaler_y.inverse_transform(y_pred_scaled).flatten()

    results = []
    for i, pred_r in enumerate(y_pred):
        actual_idx = i + WINDOW_SIZE
        actual_r = df["Resistance"].iloc[actual_idx]
        temp = df["Temperature"].iloc[actual_idx]
        soc = df["SoC_%"].iloc[actual_idx]

        delta_r = pred_r - initial_resistance
        delta_r_pct = (delta_r / initial_resistance * 100) if initial_resistance != 0 else 0

        results.append(
            PredictionResult(
                cycle=actual_idx + 1,
                resistance=round(float(actual_r), 6),
                predicted_resistance=round(float(pred_r), 6),
                delta_resistance=round(float(delta_r), 6),
                delta_resistance_percent=round(float(delta_r_pct), 4),
                temperature=round(float(temp), 2),
                soc=round(float(soc), 2),
                status=classify_status(delta_r_pct),
            )
        )

    return results


@app.get("/")
async def root():
    return {"message": "Battery Swelling Prediction API is running"}


@app.get("/health")
async def health():
    return {
        "status": "healthy",
        "model_loaded": model is not None,
        "scaler_loaded": scaler_X is not None and scaler_y is not None,
    }


@app.post("/predict", response_model=PredictionResponse)
async def predict(file: UploadFile = File(...)):
    if not file.filename.endswith(".csv"):
        raise HTTPException(status_code=400, detail="Only CSV files are accepted.")

    try:
        contents = await file.read()
        text = contents.decode("utf-8")
        df = pd.read_csv(StringIO(text))
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to parse CSV: {str(e)}")

    if df.empty:
        raise HTTPException(status_code=400, detail="CSV file is empty.")

    try:
        df = preprocess_dataframe(df)
        results = predict_from_dataframe(df)
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")

    statuses = [r.status for r in results]
    normal_count = statuses.count("Normal")
    warning_count = statuses.count("Warning")
    critical_count = statuses.count("Critical")

    if critical_count > 0:
        overall = "Critical"
    elif warning_count > 0:
        overall = "Warning"
    else:
        overall = "Normal"

    summary = {
        "total_predictions": len(results),
        "normal_count": normal_count,
        "warning_count": warning_count,
        "critical_count": critical_count,
        "overall_status": overall,
        "avg_predicted_resistance": round(
            float(np.mean([r.predicted_resistance for r in results])), 6
        ),
        "max_delta_resistance_percent": round(
            float(max(r.delta_resistance_percent for r in results)), 4
        ),
    }

    return PredictionResponse(
        success=True,
        message=f"Processed {len(results)} predictions. Overall status: {overall}.",
        data=results,
        summary=summary,
    )
