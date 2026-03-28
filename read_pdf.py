import sys
import subprocess

def install_pypdf2():
    subprocess.check_call([sys.executable, "-m", "pip", "install", "PyPDF2", "--quiet"])

try:
    import PyPDF2
except ImportError:
    install_pypdf2()
    import PyPDF2

def read_pdf():
    reader = PyPDF2.PdfReader("Script Ynettech_Anh Ý.pdf")
    text = "\n".join(page.extract_text() for page in reader.pages if page.extract_text())
    print(text.encode('utf-8', 'replace').decode('utf-8'))

read_pdf()
