from app.pdf_utils import pdf_to_images
from app.ocr import extract_text_from_image

pdf_path = "sample_report.pdf"

images = pdf_to_images(pdf_path)

all_text = ""

for image in images:
    all_text += extract_text_from_image(image) + "\n"

print(all_text)