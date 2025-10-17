from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
import os

def generate_report(user_data: dict):
    pdf_file = "report.pdf"
    c = canvas.Canvas(pdf_file, pagesize=letter)
    c.drawString(100, 750, f"Report for {user_data['user']}")
    c.drawString(100, 730, f"Symptoms: {user_data['symptoms']}")
    c.drawString(100, 710, f"Prediction: {user_data['disease']} with confidence {user_data['confidence']}")
    if user_data.get('flags'):
        c.drawString(100, 690, f"Flags: {user_data['flags']}")
    c.save()
    return pdf_file  # In FastAPI, return as FileResponse