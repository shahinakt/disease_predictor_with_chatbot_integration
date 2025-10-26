import pandas as pd
import joblib
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import MultiLabelBinarizer

# 1️⃣ Load sample data
# Make sure you have a file: backend/data/symptoms.csv
# Example columns: symptoms, disease
data = pd.read_csv('backend/data/symptoms.csv')
data['symptoms'] = data['symptoms'].apply(lambda x: x.split(','))

# 2️⃣ Encode symptoms for ML
mlb = MultiLabelBinarizer()
symptoms_encoded = mlb.fit_transform(data['symptoms'])
X = symptoms_encoded
y = data['disease']

# 3️⃣ Train a Random Forest model
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
model = RandomForestClassifier()
model.fit(X_train, y_train)

# 4️⃣ Save the trained model to a .pkl file
joblib.dump(model, 'backend/ml_models/symptom_model.pkl')

print("✅ Model trained and saved as backend/ml_models/symptom_model.pkl")
