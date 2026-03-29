import os
from docx import Document

try:
    doc = Document('thuy_idea/Góp ý_Thuý.docx')
    text = []
    for para in doc.paragraphs:
        if para.text.strip():
            text.append(para.text.strip())
    print("\n".join(text))
except Exception as e:
    print(f"Error: {e}")
