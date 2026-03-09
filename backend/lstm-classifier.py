import pandas as pd
import numpy as np
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.model_selection import train_test_split
from sklearn.utils.class_weight import compute_class_weight
from sklearn.metrics import classification_report, confusion_matrix, accuracy_score
from keras.models import Sequential
from keras.layers import LSTM, Dropout, Dense
from keras.optimizers import Adam
from keras.callbacks import EarlyStopping, ModelCheckpoint
import matplotlib.pyplot as plt
import seaborn as sns

# Load dataset
df = pd.read_csv('simulated_battery_dataset_with_critical.csv')

# Feature engineering
features = df[['Resistance', 'delta-Resistance', 'SoC_%', 'SoH_%', 'Temperature']].values
target = df['Label'].values  # Class labels (Critical, Early, Normal)

# Scaling features
scaler_X = StandardScaler()
X_scaled = scaler_X.fit_transform(features)

# Encoding target labels
label_enc = LabelEncoder()
y_encoded = label_enc.fit_transform(target)

# Function to create windows for LSTM (sequence of time steps)
def create_windows(X, y, window_size):
    Xs, ys = [], []
    for i in range(len(X) - window_size):
        Xs.append(X[i:i + window_size])
        ys.append(y[i + window_size])
    return np.array(Xs), np.array(ys)

# Define sequence length (number of time steps in the LSTM model)
window_size = 10  # You can experiment with this (e.g., 10, 20, 30)
X_windows, y_windows = create_windows(X_scaled, y_encoded, window_size)

# Split into train and test sets (80-20 split)
split = int(0.8 * len(X_windows))
X_train, X_test = X_windows[:split], X_windows[split:]
y_train, y_test = y_windows[:split], y_windows[split:]

# Compute class weights to handle class imbalance
class_weights = compute_class_weight('balanced', classes=np.unique(y_train), y=y_train)
class_weights = dict(enumerate(class_weights))

# LSTM model architecture
time_steps = X_train.shape[1]  # This corresponds to the window size
num_features = X_train.shape[2]  # Number of input features per time step

model = Sequential([
    LSTM(64, return_sequences=True, input_shape=(time_steps, num_features)),
    Dropout(0.3),
    LSTM(32),
    Dropout(0.3),
    Dense(3, activation='softmax')  # Output layer for classification (3 classes)
])

# Compile the model
model.compile(optimizer=Adam(learning_rate=5e-4), loss='sparse_categorical_crossentropy', metrics=['accuracy'])

# Model summary
model.summary()

# Callbacks: Early stopping and model checkpoint
es = EarlyStopping(monitor='val_loss', patience=3, restore_best_weights=True)
mc = ModelCheckpoint("best_lstm_model.h5", save_best_only=True)

# Train the model
history = model.fit(
    X_train, y_train,
    epochs=50,
    batch_size=32,
    validation_data=(X_test, y_test),
    callbacks=[es, mc],
    class_weight=class_weights
)

# Plotting loss curve
plt.plot(history.history['loss'], label='Train loss')
plt.plot(history.history['val_loss'], label='Validation loss')
plt.legend()
plt.xlabel('Epochs')
plt.ylabel('Loss')
plt.title('Training vs Validation Loss')
plt.show()

# Evaluate the model
y_pred = model.predict(X_test)
y_pred = np.argmax(y_pred, axis=1)

# Classification report and confusion matrix
print("Classification Report:\n", classification_report(y_test, y_pred, target_names=label_enc.classes_))

# Confusion Matrix
conf_matrix = confusion_matrix(y_test, y_pred)
plt.figure(figsize=(6, 5))
sns.heatmap(conf_matrix, annot=True, fmt='d', cmap='Blues',
            xticklabels=label_enc.classes_,
            yticklabels=label_enc.classes_)
plt.xlabel('Predicted')
plt.ylabel('True')
plt.title('Confusion Matrix - LSTM Classifier')
plt.show()

# Final evaluation metrics
acc = accuracy_score(y_test, y_pred)
print(f"Accuracy: {acc}")
