import pandas as pd
import os

def load_symptoms():
    csv_path = os.path.join("data", "symptoms.csv")
    df = pd.read_csv(csv_path)
    return df['symptoms'].tolist()  # Return as list