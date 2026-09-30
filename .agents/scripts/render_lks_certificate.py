from pathlib import Path

import fitz


source = Path(
    "attached_assets/"
    "Baru_SERTIFIKAT_LKS_IT_Software_Solution_For_Business_2025_1790771851918.pdf"
)
output = Path(".agents/outputs/lks-certificate-page-1.png")

document = fitz.open(source)
if document.page_count != 1:
    raise SystemExit(f"Expected the original single-page certificate, got {document.page_count} pages")

page = document[0]
page.get_pixmap(matrix=fitz.Matrix(2, 2), alpha=False).save(output)
print(f"Rendered {document.page_count} page at {page.rect.width:g} x {page.rect.height:g} pt to {output}")