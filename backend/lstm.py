import pandas as pd
import pickle
df = pd.read_csv('simulated_battery_realistic.csv')

features = df[['Resistance', 'delta-Resistance', 'SoC_%', 'SoH_%' , 'Temperature']].values
target = df['Resistance'].values.reshape(-1,1)

from sklearn.preprocessing import MinMaxScaler

scaler_X = MinMaxScaler()
X_scaled = scaler_X.fit_transform(features)

scaler_y = MinMaxScaler()
y_scaled = scaler_y.fit_transform(target)

with open("scaler_X.pkl", "wb") as f:
    pickle.dump(scaler_X, f)

with open("scaler_y.pkl", "wb") as f:
    pickle.dump(scaler_y, f)
import numpy as np
def create_windows(X,y,window_size):
    Xs,ys = [],[]
    for i in range(len(X) - window_size):
        Xs.append(X[i:i+window_size])
        ys.append(y[i+window_size])
    return np.array(Xs), np.array(ys)

window_size = 5
X_windows, y_windows = create_windows(X_scaled,y_scaled,window_size)

split = int(0.8*len(X_windows))
X_train,X_test = X_windows[:split],X_windows[split:]
y_train,y_test = y_windows[:split],y_windows[split:]

from keras.models import Sequential
from keras.layers import LSTM, Dropout, Dense
from keras.optimizers import Adam

time_steps = X_train.shape[1]
num_features = X_train.shape[2]

model = Sequential([
    LSTM(64,
         return_sequences=True,
         input_shape = (time_steps, num_features)),
    Dropout(0.2),
    LSTM(32),
    Dropout(0.25),
    Dense(1,activation='linear')
])
model.compile(
    optimizer = Adam(learning_rate=5e-4),
    loss = 'mse',
    metrics = ['mae']
)
model.summary()

from keras.callbacks import EarlyStopping, ModelCheckpoint

es = EarlyStopping(monitor='val_loss',patience=1,restore_best_weights=True)
mc = ModelCheckpoint("best_model.h5", save_best_only=True)

# from tf_keras.regularizers import l2
# model.add(LSTM(64,kernel_regularizer=l2(1e-4),return_sequences=True))
history = model.fit(
    X_train,y_train,
    epochs = 100,
    batch_size = 16,
    validation_data = (X_test,y_test),
    callbacks=[es,mc]
)
import matplotlib.pyplot as plt

plt.plot(history.history['loss'], label='train loss')
plt.plot(history.history['val_loss'], label='val loss')
plt.legend()
plt.xlabel('Epoch')
plt.ylabel('MSE Loss')
plt.title('Training vs. Validation Loss')
plt.show()

