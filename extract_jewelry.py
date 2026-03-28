import docx
import sys
import codecs

files = [
    r"c:\Users\PC\OneDrive - Dana Experts\DanaExperts\PROJECT\Odoo_Y-nettech_colab\Boosting Jewelry Business ROI with Odoo’s Comprehensive Auto.docx",
    r"c:\Users\PC\OneDrive - Dana Experts\DanaExperts\PROJECT\Odoo_Y-nettech_colab\ERP for Jewelry Business Inventory.docx"
]

with codecs.open('extracted_jewelry.txt', 'w', encoding='utf-8') as out:
    for file in files:
        out.write(f"\n--- Reading {file.split('\\')[-1]} ---\n\n")
        try:
            doc = docx.Document(file)
            for p in doc.paragraphs:
                if p.text.strip():
                    out.write(p.text + "\n")
        except Exception as e:
            out.write(f"Error reading {file}: {e}\n")
