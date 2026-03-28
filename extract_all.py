import os
import sys
import subprocess

def install_deps():
    try:
        import docx
    except ImportError:
        subprocess.check_call([sys.executable, "-m", "pip", "install", "python-docx", "--quiet"])
    try:
        import PyPDF2
    except ImportError:
        subprocess.check_call([sys.executable, "-m", "pip", "install", "PyPDF2", "--quiet"])

install_deps()

import docx
import PyPDF2

folder = r"c:\Users\PC\OneDrive - Dana Experts\DanaExperts\PROJECT\Odoo_Y-nettech_colab"

def extract_docx(path):
    try:
        doc = docx.Document(path)
        return "\n".join([p.text for p in doc.paragraphs])
    except Exception as e:
        return str(e)

def extract_pdf(path):
    try:
        reader = PyPDF2.PdfReader(path)
        return "\n".join([page.extract_text() for page in reader.pages if page.extract_text()])
    except Exception as e:
        return str(e)

with open(os.path.join(folder, "extracted_texts.txt"), "w", encoding="utf-8") as out:
    for f in os.listdir(folder):
        path = os.path.join(folder, f)
        if f.endswith(".docx"):
            out.write(f"--- {f} ---\n")
            out.write(extract_docx(path))
            out.write("\n\n")
        elif f.endswith(".pdf"):
            out.write(f"--- {f} ---\n")
            out.write(extract_pdf(path))
            out.write("\n\n")
        elif f.endswith(".ini"):
            out.write(f"--- {f} ---\n")
            try:
                with open(path, "r", encoding="utf-8") as in_f:
                    out.write(in_f.read())
            except:
                pass
            out.write("\n\n")

print("Done")
