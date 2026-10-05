from pathlib import Path
import fitz

source = Path("artifacts/portfolio/public/sertifikat-lks-it-software-solution-2025.pdf")
output = Path(".agents/outputs/lks-certificate-page-1.png")
output.parent.mkdir(parents=True, exist_ok=True)

document = fitz.open(source)
if document.page_count == 0:
    raise SystemExit("The certificate PDF contains no pages.")

page = document.load_page(0)
page.get_pixmap(matrix=fitz.Matrix(2, 2), alpha=False).save(output)
print(f"Rendered page 1 of {document.page_count} to {output}")
