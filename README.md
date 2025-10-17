# Early Disease Predictor MVP

This is a minimal viable product (MVP) for an early disease prediction tool. It allows users to register/login, input symptoms for disease prediction, handle follow-up questions, generate PDF reports, extract text from prescription images via OCR, and interact with a chatbot (proxied to Gemini). It includes sensitive handling for mental-health symptoms.

## Safety Notes
- This is a **screening/triage tool only**, not a diagnostic or clinical tool. It should not replace professional medical advice.
- For mental-health concerns (e.g., depression, anxiety, suicidal_ideation), the system escalates with empathetic messages, crisis resources, and disclaimers.
- If escalation is triggered, users are prompted to contact emergency services. The system never provides instructions for self-harm.

## Features
- User authentication (JWT-based).
- Symptom input and disease prediction using a pre-trained ML model.
- Follow-up Q&A to refine predictions.
- PDF report generation.
- OCR for prescription images.
- Chatbot proxy to Gemini (with escalation checks for sensitive keywords).
- Crisis resources configurable per country (e.g., in `backend/constants/crisis_resources.py`).

## Setup Instructions
1. **System Dependencies**:
   - Install Python 3.10+.
   - Install Tesseract OCR: On Ubuntu, run `sudo apt-get install tesseract-ocr`. On macOS, use `brew install tesseract`.
   
2. **Backend Setup**:
   - Create a virtual environment: `python -m venv venv && source venv/bin/activate` (or `venv\Scripts\activate` on Windows).
   - Install dependencies: `pip install -r backend/requirements.txt`.
   - Copy `.env.example` to `.env` and set the values:
     ```
     DATABASE_URL=sqlite:///./db.sqlite3  # For SQLite; change for other DBs
     SECRET_KEY=change_me  # Generate a secure key, e.g., via `openssl rand -hex 32`
     ACCESS_TOKEN_EXPIRE_MINUTES=60
     GEMINI_API_KEY=your_gemini_key_here  # Required for chatbot
     FRONTEND_URL=http://localhost:5173  # For CORS
     CRISIS_DEFAULT_COUNTRY=IN  # Default country code (e.g., IN for India)
     ESCALATION_CONFIDENCE=0.6  # Threshold for mental-health escalation
     ```
   - Place the ML model: Run `ml/train_symptom_model.ipynb` to generate `backend/ml_models/symptom_model.pkl` from sample data in `backend/data/symptoms.csv`.
   - Run the backend: `uvicorn backend.main:app --reload` or use `make run`.
   - Access OpenAPI docs at `http://localhost:8000/docs`.

3. **Frontend Setup**:
   - Navigate to `frontend/`: `cd frontend`.
   - Install dependencies: `npm install`.
   - Run the dev server: `npm run dev`. It will run on `http://localhost:5173`.
   - The frontend communicates with the backend at `http://localhost:8000`.

4. **Docker Setup** (Optional for local dev):
   - Build and run: `docker-compose up --build`.
   - This spins up the backend and frontend containers.

5. **Demo User**:
   - Register a user via the frontend (e.g., email: demo@example.com, password: TestPass123).
   - Do not hardcode credentials; always use the registration flow.

6. **Localizing Crisis Resources**:
   - Edit `backend/constants/crisis_resources.py` to add country-specific hotlines (e.g., for "US": emergency number 911).
   - The system uses the `CRISIS_DEFAULT_COUNTRY` env var or infers from user input (e.g., in symptom locale).

## Running Tests
- Backend: Run unit tests with `pytest backend/tests/test_predictor.py`.

## Limitations
- The ML model is a toy example; train it with real data for accuracy.
- Chatbot history is in-memory and resets on server restart.
- This is not for production; add proper error handling and scaling as needed.