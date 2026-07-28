import fitz
import io
from PIL import Image


def extract_text_from_pdf(pdf_path):
    """
    Extract selectable text from a digital PDF.
    """

    document = fitz.open(pdf_path)

    text = ""

    for page in document:
        text += page.get_text()

    document.close()

    return text


def pdf_to_images(pdf_path):
    """
    Convert every PDF page to a PIL Image.
    """

    document = fitz.open(pdf_path)

    images = []

    for page in document:

        pix = page.get_pixmap(dpi=200)

        image_bytes = pix.tobytes("png")

        image = Image.open(io.BytesIO(image_bytes))

        images.append(image)

    document.close()

    return images