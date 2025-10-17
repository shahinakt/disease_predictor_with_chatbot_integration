import pytesseract
from PIL import Image
import io

class OCRService:
    def process_image(file: bytes):
        image = Image.open(io.BytesIO(file))
        image = image.convert('L')  # Grayscale
        text = pytesseract.image_to_string(image)
        return {"extracted_text": text}