from fastapi import APIRouter, UploadFile
from services.ocr_service import OCRService

router = APIRouter()

@router.post("/")
async def ocr(file: UploadFile):
    return OCRService.process_image(file)