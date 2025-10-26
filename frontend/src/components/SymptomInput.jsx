import React from 'react';
import { usePredictor } from '../services/predictor';  // Custom hook for predictions

function SymptomInput() {
  const { symptoms, handleSymptomChange, handleSubmit } = usePredictor();

  return (
    <form onSubmit={handleSubmit}>
      <h2>Select Symptoms</h2>
      <select multiple onChange={handleSymptomChange} style={{ height: '200px' }}>
        {symptoms.map((symptom, index) => (
          <option key={index} value={symptom}>{symptom}</option>
        ))}
      </select>
      <button type="submit">Predict</button>
    </form>
  );
}

export default SymptomInput;