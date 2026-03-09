import matplotlib.pyplot as plt
import numpy as np

# Simulated data for each model
iterations = np.arange(100)

# Gradient Boosting
train_loss_gb = np.exp(-iterations / 20)
val_loss_gb = np.exp(-iterations / 50)

# Logistic Regression
train_loss_lr = np.log(1 + iterations) / 10
val_loss_lr = np.log(1 + iterations) / 12

# Random Forest
train_loss_rf = np.full_like(iterations, 0.03)
val_loss_rf = np.full_like(iterations, 0.08)

# Create subplots
fig, axs = plt.subplots(1, 3, figsize=(18, 6))

# Gradient Boosting Plot
axs[0].plot(iterations, train_loss_gb, label="Train Loss", color="blue")
axs[0].plot(iterations, val_loss_gb, label="Validation Loss", color="orange")
axs[0].set_title("Gradient Boosting")
axs[0].set_xlabel("Iteration")
axs[0].set_ylabel("Log Loss")
axs[0].annotate(f'{val_loss_gb[-1]:.4f}', xy=(90, val_loss_gb[-1]), xytext=(80, val_loss_gb[-1] + 0.05),
                arrowprops=dict(facecolor='orange', shrink=0.05), color='orange')
axs[0].annotate(f'{train_loss_gb[-1]:.4f}', xy=(90, train_loss_gb[-1]), xytext=(80, train_loss_gb[-1] - 0.05),
                arrowprops=dict(facecolor='blue', shrink=0.05), color='blue')

# Logistic Regression Plot
axs[1].plot(iterations, train_loss_lr, label="Train Loss", color="blue")
axs[1].plot(iterations, val_loss_lr, label="Validation Loss", color="orange")
axs[1].set_title("Logistic Regression")
axs[1].set_xlabel("Iteration")
axs[1].set_ylabel("Log Loss")
axs[1].annotate(f'{val_loss_lr[-1]:.4f}', xy=(90, val_loss_lr[-1]), xytext=(80, val_loss_lr[-1] + 0.05),
                arrowprops=dict(facecolor='orange', shrink=0.05), color='orange')
axs[1].annotate(f'{train_loss_lr[-1]:.4f}', xy=(90, train_loss_lr[-1]), xytext=(80, train_loss_lr[-1] - 0.05),
                arrowprops=dict(facecolor='blue', shrink=0.05), color='blue')

# Random Forest Plot
axs[2].plot(iterations, train_loss_rf, label="Train Loss", color="blue")
axs[2].plot(iterations, val_loss_rf, label="Validation Loss", color="orange")
axs[2].set_title("Random Forest")
axs[2].set_xlabel("Iteration")
axs[2].set_ylabel("Log Loss")
axs[2].annotate(f'{val_loss_rf[-1]:.4f}', xy=(90, val_loss_rf[-1]), xytext=(80, val_loss_rf[-1] + 0.005),
                arrowprops=dict(facecolor='orange', shrink=0.05), color='orange')
axs[2].annotate(f'{train_loss_rf[-1]:.4f}', xy=(90, train_loss_rf[-1]), xytext=(80, train_loss_rf[-1] - 0.005),
                arrowprops=dict(facecolor='blue', shrink=0.05), color='blue')

# Display legends
for ax in axs:
    ax.legend()

plt.tight_layout()
plt.show()
