from fastapi import APIRouter
from fastapi.responses import FileResponse
from ..utils.pdf_generator import generate_report

router = APIRouter()


@router.get("/download")
def download_report():
    
    sample_user = {
        "user": "Demo User",
        "symptoms": "fever, cough",
        "disease": "Common Cold",
        "confidence": "75%",
        "flags": None,
    }
    pdf_path = generate_report(sample_user)
    return FileResponse(path=pdf_path, filename="report.pdf", media_type="application/pdf")