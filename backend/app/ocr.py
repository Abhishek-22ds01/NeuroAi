import easyocr
import numpy as np

# Load the OCR model once
reader = easyocr.Reader(['en'], gpu=False)

def extract_text_from_image(image):
    """
    Extract text from a PIL Image using EasyOCR.
    """

    image_np = np.array(image)

    results = reader.readtext(
        image_np,
        detail=0,
        paragraph=True
    )

    return "\n".join(results)