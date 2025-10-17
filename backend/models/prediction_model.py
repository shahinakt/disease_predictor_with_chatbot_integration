from sqlmodel import SQLModel

class Prediction(SQLModel):
    symptoms: list[str]
    disease: str
    confidence: float
    flags: list[str]