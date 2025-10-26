from fastapi import APIRouter, UploadFile, File, HTTPException
from ..services.ocr_service import OCRService
import traceback

router = APIRouter(prefix="/ocr", tags=["ocr"])

@router.post("/")
async def ocr(file: UploadFile = File(...)):
    try:
        return await OCRService.process_image(file)
    except Exception as e:
        # Log the full stack trace to console
        print("OCR Error:", str(e))
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

