import sys
import subprocess
try:
    import markdown
except ImportError:
    subprocess.check_call([sys.executable, "-m", "pip", "install", "markdown", "--quiet"])
    import markdown

import codecs

with codecs.open('proposal_plan_analysis.md', mode='r', encoding='utf-8') as f:
    text = f.read()

html_body = markdown.markdown(text, extensions=['fenced_code', 'tables'])

css = """
<style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 900px; margin: 0 auto; padding: 40px; }
    h1, h2, h3 { color: #005A9C; }
    h1 { border-bottom: 2px solid #005A9C; padding-bottom: 10px; margin-bottom: 30px; }
    h2 { border-bottom: 1px solid #ddd; padding-bottom: 5px; margin-top: 40px; }
    h3 { margin-top: 30px; }
    img { max-width: 100%; height: auto; display: block; margin: 20px auto; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); }
    ul, ol { margin-bottom: 20px; }
    li { margin-bottom: 10px; }
    strong { color: #222; }
    blockquote { border-left: 4px solid #005A9C; padding-left: 15px; margin-left: 0; color: #555; background: #f9f9f9; padding: 15px; font-style: italic; }
    hr { margin: 40px 0; border: 0; border-top: 1px solid #eee; }
    @media print {
        body { padding: 0; max-width: none; background: white; }
        @page { margin: 2cm; }
        img { max-width: 90%; page-break-inside: avoid; }
        h2, h3 { page-break-after: avoid; }
    }
</style>
"""

html = f"""
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <title>Phân Tích & Kế Hoạch Xây Dựng Proposal (Y-NetTech)</title>
    {css}
</head>
<body>
    {html_body}
</body>
</html>
"""

with codecs.open('proposal_plan_analysis.html', mode='w', encoding='utf-8') as f:
    f.write(html)

print("Generated proposal_plan_analysis.html successfully.")
