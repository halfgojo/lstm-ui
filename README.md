# Battery Swelling Prediction System

A web app that predicts early battery swelling using Delta-Resistance analysis and LSTM neural networks. Upload your battery CSV data and get instant predictions on whether the battery is healthy, showing early signs of swelling, or in critical condition.

## How it works

The core idea is based on **Delta-Resistance (ΔR)** — when a lithium-ion battery starts to swell, its internal resistance increases. By tracking how much the resistance changes from the initial value, we can detect swelling early.

```
ΔR = Current Resistance - Initial Resistance
```

The system uses a trained LSTM model to predict future resistance values from the battery data, and then classifies the health status:

| ΔR Change | Status | What it means |
|-----------|--------|---------------|
| < 5% | Normal | Battery is fine |
| 5% - 15% | Warning | Early signs of swelling, keep an eye on it |
| > 15% | Critical | Battery needs to be replaced |

## Tech Stack

**Frontend:**
- React 18 with Vite
- TailwindCSS for styling
- Recharts for the charts
- PapaParse for CSV parsing

**Backend:**
- Python with FastAPI
- TensorFlow/Keras (LSTM model)
- scikit-learn for data preprocessing

## Project Structure

```
lstm-ui/
├── src/
│   ├── components/      # React components (Charts, FileUpload, etc)
│   ├── pages/           # Dashboard, Home, Analysis, Methodology
│   ├── services/        # API calls and prediction logic
│   └── utils/           # CSV parser
├── public/              # Sample CSV files for testing
├── backend/
│   ├── main.py          # FastAPI server
│   ├── best_model.h5    # Trained LSTM model
│   ├── scaler_X.pkl     # Feature scaler
│   ├── scaler_y.pkl     # Target scaler
│   ├── lstm.py          # Training script (regression)
│   ├── lstm-classifier.py  # Training script (classification)
│   └── requirements.txt
└── package.json
```

## Getting Started

### Prerequisites

- Node.js (v18+)
- Python 3.12 (TensorFlow doesnt support 3.13+ yet)

### Setup

1. Clone the repo
```bash
git clone https://github.com/halfgojo/lstm-ui.git
cd lstm-ui
```

2. Install frontend dependencies
```bash
npm install
```

3. Setup the backend
```bash
cd backend
python3.12 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### Running

You need two terminals:

**Terminal 1 - Backend:**
```bash
cd backend
source venv/bin/activate
uvicorn main:app --reload --port 8000
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

Then open `http://localhost:5173` in your browser.

If the backend is running, the dashboard will show a green "ML Backend Connected" badge. If the backend is down, it falls back to client-side analysis (basic delta-resistance calculation without the ML model).

## CSV Format

Your CSV needs these columns:

| Column | Required | Description |
|--------|----------|-------------|
| Resistance | Yes | Internal resistance in Ω |
| Temperature | Yes | Temperature in °C |
| SoC | Optional | State of Charge (%) |

There are sample CSV files in the `public/` folder you can use to test:
- `sample_normal.csv` - healthy battery data
- `sample_warning.csv` - early swelling indicators  
- `sample_critical.csv` - critical condition

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Check if API is running |
| GET | `/health` | Health check (model loaded status) |
| POST | `/predict` | Upload CSV and get predictions |

## About the Model

The LSTM model was trained on simulated battery data with features like Resistance, delta-Resistance, SoC, SoH, and Temperature. It uses a sliding window of 5 timesteps to predict the next resistance value.

Architecture:
- LSTM(64) → Dropout(0.2) → LSTM(32) → Dropout(0.25) → Dense(1)
- Optimizer: Adam (lr=5e-4)
- Loss: MSE

The model weights and scalers are included in the `backend/` directory so you dont need to retrain anything.

## Known Issues

- The regression model sometimes predicts lower resistance values than actual, which can affect classification accuracy. This is because the model was trained on simulated data.
- Python 3.13+ is not supported yet because TensorFlow hasnt released a compatible version.
- The `.h5` model file was saved with an older Keras version, so the backend has a fallback that rebuilds the model architecture and loads just the weights.

## Future Plans

- Integrate TensorFlow.js so the model can run directly in the browser
- Add a backend endpoint for batch predictions
- Real-time monitoring with WebSocket
- PDF report generation
