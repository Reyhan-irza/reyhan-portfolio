from pathlib import Path

import pymupdf

source = Path("attached_assets/Baru_SERTIFIKAT_LKS_IT_Software_Solution_For_Business_2025_1790771851918.pdf")
output_dir = Path(".agents/outputs")
output_dir.mkdir(parents=True, exist_ok=True)

document = pymupdf.open(source)
page = document.load_page(0)
pixmap = page.get_pixmap(matrix=pymupdf.Matrix(2, 2), alpha=False)
output = output_dir / "lks-certificate-page-1.png"
pixmap.save(output)
print(f"Rendered {output} ({pixmap.width}x{pixmap.height}; {document.page_count} pages)")
