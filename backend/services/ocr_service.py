from PIL import Image
import io
import pytesseract
from fastapi import UploadFile

class OCRService:
    @staticmethod
    async def process_image(file: UploadFile):
        contents = await file.read()  
        image = Image.open(io.BytesIO(contents))
        image = image.convert('L')  # grayscale
        text = pytesseract.image_to_string(image)
        return {"extracted_text": text}
