# import pandas as pd
# import matplotlib.pyplot as plt
# from sklearn.model_selection import train_test_split
# from sklearn.preprocessing import StandardScaler, LabelEncoder
# from sklearn.ensemble import GradientBoostingClassifier
# from sklearn.linear_model import LogisticRegression
# from sklearn.naive_bayes import GaussianNB
# from sklearn.metrics import log_loss
#
# # 1. Load and prepare data
# df = pd.read_csv('simulated_battery_dataset_with_critical.csv')
# X = df[['Resistance','delta-Resistance','SoC_%','SoH_%','Temperature']].values
# y = LabelEncoder().fit_transform(df['Label'])  # 0=Critical,1=Early,2=Normal (or similar)
#
# # Train/test split
# X_train, X_test, y_train, y_test = train_test_split(
#     X, y, test_size=0.2, stratify=y, random_state=42
# )
#
# # Scale features
# scaler = StandardScaler()
# X_train_s = scaler.fit_transform(X_train)
# X_test_s = scaler.fit_transform(X_test)
#
# # Number of iterations/estimators
# n_iters = 200
#
# # 2. GBDT: record log-loss at each boosting stage
# gb = GradientBoostingClassifier(n_estimators=n_iters, learning_rate=0.1, random_state=42)
# gb.fit(X_train_s, y_train)
#
# train_loss_gb = list(gb.staged_predict_proba(X_train_s))
# test_loss_gb  = list(gb.staged_predict_proba(X_test_s))
#
# train_loss_gb = [log_loss(y_train, p) for p in train_loss_gb]
# test_loss_gb  = [log_loss(y_test,  p) for p in test_loss_gb]
#
# # 3. Logistic Regression (proxy for SVM with log-loss) via warm_start
# logreg = LogisticRegression(
#     solver='sag', multi_class='multinomial',
#     max_iter=1, warm_start=True, tol=1e-4, random_state=42
# )
# train_loss_lr = []
# test_loss_lr  = []
# for _ in range(n_iters):
#     logreg.fit(X_train_s, y_train)
#     p_tr = logreg.predict_proba(X_train_s)
#     p_te = logreg.predict_proba(X_test_s)
#     train_loss_lr.append(log_loss(y_train, p_tr))
#     test_loss_lr.append(log_loss(y_test,  p_te))
#
# # 4. Naive Bayes (flat log-loss)
# nb = GaussianNB()
# nb.fit(X_train_s, y_train)
# p_tr_nb = nb.predict_proba(X_train_s)
# p_te_nb = nb.predict_proba(X_test_s)
# loss_tr_nb = log_loss(y_train, p_tr_nb)
# loss_te_nb = log_loss(y_test,  p_te_nb)
# train_loss_nb = [loss_tr_nb] * n_iters
# test_loss_nb  = [loss_te_nb] * n_iters
#
# # 5. Elastic Net (logistic with elasticnet penalty)
# en = LogisticRegression(
#     solver='saga', penalty='elasticnet', l1_ratio=0.5,
#     multi_class='multinomial', max_iter=1, warm_start=True, tol=1e-4, random_state=42
# )
# train_loss_en = []
# test_loss_en  = []
# for _ in range(n_iters):
#     en.fit(X_train_s, y_train)
#     p_tr_en = en.predict_proba(X_train_s)
#     p_te_en = en.predict_proba(X_test_s)
#     train_loss_en.append(log_loss(y_train, p_tr_en))
#     test_loss_en.append(log_loss(y_test,  p_te_en))
#
# # 6. Plotting the four models
# fig, axes = plt.subplots(2, 2, figsize=(12, 10))
# axes = axes.ravel()
# models = [
#     ('GBDT',          train_loss_gb, train_loss_gb, test_loss_gb),
#     ('Logistic (SVM)',train_loss_lr, train_loss_lr, test_loss_lr),
#     ('Naive Bayes',   train_loss_nb, train_loss_nb, test_loss_nb),
#     ('Elastic Net',   train_loss_en, train_loss_en, test_loss_en),
# ]
#
# for ax, (name, _, tr, te) in zip(axes, models):
#     ax.plot(range(n_iters), tr, label='Train Loss')
#     ax.plot(range(n_iters), te, label='Test Loss')
#     ax.set_title(name)
#     ax.set_xlabel('Iteration')
#     ax.set_ylabel('Log Loss')
#     ax.legend()
#     ax.grid(True)
#
# fig.tight_layout()
# plt.show()
#



import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from sklearn.model_selection import StratifiedKFold
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.ensemble import GradientBoostingClassifier, RandomForestClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import log_loss

# Load and preprocess data
df = pd.read_csv('Filtered_Simulated_Battery_Data_Corrected.csv')
X = df[['Resistance', 'delta-Resistance', 'SoC_%', 'SoH_%', 'Temperature']]
y = LabelEncoder().fit_transform(df['Label'])

scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# Stratified K-Fold setup
skf = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
n_iters = 200

# Storage for plotting
results = {
    "Gradient Boosting": {"train": [], "val": []},
    "Logistic Regression": {"train": [], "val": []},
    "Random Forest": {"train": [], "val": []}
}

# ----- Gradient Boosting -----
for train_idx, val_idx in skf.split(X_scaled, y):
    X_train, X_val = X_scaled[train_idx], X_scaled[val_idx]
    y_train, y_val = y[train_idx], y[val_idx]

    gb = GradientBoostingClassifier(
        n_estimators=30,
        learning_rate=0.05,
        max_depth=2,
        subsample=0.6,
        random_state=42

    )
    n_iters = 20

    gb.fit(X_train, y_train)

    train_loss = [log_loss(y_train, p) for p in gb.staged_predict_proba(X_train)]
    val_loss = [log_loss(y_val, p) for p in gb.staged_predict_proba(X_val)]

    results["Gradient Boosting"]["train"].append(train_loss)
    results["Gradient Boosting"]["val"].append(val_loss)

# ----- Logistic Regression (Warm Start) -----
for train_idx, val_idx in skf.split(X_scaled, y):
    X_train, X_val = X_scaled[train_idx], X_scaled[val_idx]
    y_train, y_val = y[train_idx], y[val_idx]

    logreg = LogisticRegression(solver='saga', penalty='elasticnet', l1_ratio=0.5,
                                multi_class='multinomial', max_iter=1, warm_start=True,
                                class_weight='balanced', random_state=42)
    tr_loss, val_loss = [], []
    for _ in range(n_iters):
        logreg.fit(X_train, y_train)
        tr_loss.append(log_loss(y_train, logreg.predict_proba(X_train)))
        val_loss.append(log_loss(y_val, logreg.predict_proba(X_val)))

    results["Logistic Regression"]["train"].append(tr_loss)
    results["Logistic Regression"]["val"].append(val_loss)

# ----- Random Forest (no stage prediction; use final) -----
for train_idx, val_idx in skf.split(X_scaled, y):
    X_train, X_val = X_scaled[train_idx], X_scaled[val_idx]
    y_train, y_val = y[train_idx], y[val_idx]

    rf = RandomForestClassifier(n_estimators=100, class_weight='balanced', random_state=42)
    rf.fit(X_train, y_train)

    train_loss = [log_loss(y_train, rf.predict_proba(X_train))] * n_iters
    val_loss = [log_loss(y_val, rf.predict_proba(X_val))] * n_iters

    results["Random Forest"]["train"].append(train_loss)
    results["Random Forest"]["val"].append(val_loss)

# ----- Plotting -----
import matplotlib.pyplot as plt

fig, axes = plt.subplots(1, 3, figsize=(18, 5))
titles = ["Gradient Boosting", "Logistic Regression", "Random Forest"]

for i, (name, data) in enumerate(results.items()):
    avg_train = np.mean(data["train"], axis=0)
    avg_val = np.mean(data["val"], axis=0)

    axes[i].plot(range(n_iters), avg_train, label='Train Loss', color='blue')
    axes[i].plot(range(n_iters), avg_val, label='Validation Loss', color='orange')

    # Final loss values
    final_train_loss = avg_train[-1]
    final_val_loss = avg_val[-1]

    # Add final loss text annotation (like in research papers)
    axes[i].text(0.05, 0.95, f"Final Train Loss = {final_train_loss:.4f}",
                 transform=axes[i].transAxes, fontsize=10, color='blue', verticalalignment='top')

    axes[i].text(0.05, 0.88, f"Final Val Loss = {final_val_loss:.4f}",
                 transform=axes[i].transAxes, fontsize=10, color='orange', verticalalignment='top')

    axes[i].set_title(titles[i])
    axes[i].set_xlabel('Iteration')
    axes[i].set_ylabel('Log Loss')
    axes[i].legend()
    axes[i].grid(True)

plt.tight_layout()
plt.show()
#
# import pandas as pd
# import numpy as np
# import matplotlib.pyplot as plt
# from sklearn.model_selection import StratifiedKFold
# from sklearn.preprocessing import StandardScaler, LabelEncoder
# from sklearn.ensemble import GradientBoostingClassifier, RandomForestClassifier
# from sklearn.linear_model import LogisticRegression
# from sklearn.metrics import log_loss
#
# # Load and preprocess data
# df = pd.read_csv('Filtered_Simulated_Battery_Data_Corrected.csv')
# X = df[['Resistance', 'delta-Resistance', 'SoC_%', 'SoH_%', 'Temperature']]
# y = LabelEncoder().fit_transform(df['Label'])
#
# scaler = StandardScaler()
# X_scaled = scaler.fit_transform(X)
#
# # Stratified K-Fold setup
# skf = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
# n_iters = 100
#
# # Storage for plotting
# results = {
#     "Gradient Boosting": {"train": [], "val": []},
#     "Logistic Regression": {"train": [], "val": []},
#     "Random Forest": {"train": [], "val": []}
# }
#
# # ----- Gradient Boosting (Tuned) -----
# for train_idx, val_idx in skf.split(X_scaled, y):
#     X_train, X_val = X_scaled[train_idx], X_scaled[val_idx]
#     y_train, y_val = y[train_idx], y[val_idx]
#
#     # Reduce learning rate and increase max_depth to tweak the performance
#     gb = GradientBoostingClassifier(n_estimators=200, learning_rate=0.02, max_depth=4, random_state=42)
#     gb.fit(X_train, y_train)
#
#     train_loss = [log_loss(y_train, p) for p in gb.staged_predict_proba(X_train)]
#     val_loss = [log_loss(y_val, p) for p in gb.staged_predict_proba(X_val)]
#
#     results["Gradient Boosting"]["train"].append(train_loss)
#     results["Gradient Boosting"]["val"].append(val_loss)
#
# # ----- Logistic Regression (Warm Start) -----
# for train_idx, val_idx in skf.split(X_scaled, y):
#     X_train, X_val = X_scaled[train_idx], X_scaled[val_idx]
#     y_train, y_val = y[train_idx], y[val_idx]
#
#     logreg = LogisticRegression(solver='saga', penalty='elasticnet', l1_ratio=0.5,
#                                 multi_class='multinomial', max_iter=1, warm_start=True,
#                                 class_weight='balanced', random_state=42)
#     tr_loss, val_loss = [], []
#     for _ in range(n_iters):
#         logreg.fit(X_train, y_train)
#         tr_loss.append(log_loss(y_train, logreg.predict_proba(X_train)))
#         val_loss.append(log_loss(y_val, logreg.predict_proba(X_val)))
#
#     # Ensure both train_loss and val_loss are the same length
#     if len(tr_loss) == n_iters and len(val_loss) == n_iters:
#         results["Logistic Regression"]["train"].append(tr_loss)
#         results["Logistic Regression"]["val"].append(val_loss)
#
# # ----- Random Forest (Increased max_depth) -----
# for train_idx, val_idx in skf.split(X_scaled, y):
#     X_train, X_val = X_scaled[train_idx], X_scaled[val_idx]
#     y_train, y_val = y[train_idx], y[val_idx]
#
#     # Increase max_depth to get better performance
#     rf = RandomForestClassifier(n_estimators=100, max_depth=10, class_weight='balanced', random_state=42)
#     rf.fit(X_train, y_train)
#
#     # Ensure the train_loss and val_loss have n_iters values
#     train_loss = [log_loss(y_train, rf.predict_proba(X_train))] * n_iters
#     val_loss = [log_loss(y_val, rf.predict_proba(X_val))] * n_iters
#
#     results["Random Forest"]["train"].append(train_loss)
#     results["Random Forest"]["val"].append(val_loss)
#
# # ----- Plotting -----
# fig, axes = plt.subplots(1, 3, figsize=(18, 5))
# titles = ["Gradient Boosting", "Logistic Regression", "Random Forest"]
#
# for i, (name, data) in enumerate(results.items()):
#     avg_train = np.mean(data["train"], axis=0)
#     avg_val = np.mean(data["val"], axis=0)
#
#     # Ensure both avg_train and avg_val are the same length
#     if len(avg_train) == n_iters and len(avg_val) == n_iters:
#         axes[i].plot(range(n_iters), avg_train, label='Train Loss', color='blue')
#         axes[i].plot(range(n_iters), avg_val, label='Validation Loss', color='orange')
#
#         # Final loss values
#         final_train_loss = avg_train[-1]
#         final_val_loss = avg_val[-1]
#
#         # Add final loss text annotation (like in research papers)
#         axes[i].text(0.05, 0.95, f"Final Train Loss = {final_train_loss:.4f}",
#                      transform=axes[i].transAxes, fontsize=10, color='blue', verticalalignment='top')
#
#         axes[i].text(0.05, 0.88, f"Final Val Loss = {final_val_loss:.4f}",
#                      transform=axes[i].transAxes, fontsize=10, color='orange', verticalalignment='top')
#
#         axes[i].set_title(titles[i])
#         axes[i].set_xlabel('Iteration')
#         axes[i].set_ylabel('Log Loss')
#         axes[i].legend()
#         axes[i].grid(True)
#
# plt.tight_layout()
# plt.show()
