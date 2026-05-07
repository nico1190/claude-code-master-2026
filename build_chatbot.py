"""
build_chatbot.py

Lee chatbot_template.html y claude_code_articles.json,
inyecta el JSON en el placeholder __ARTICLES_JSON__,
y escribe index.html (single-file final, entry point para HF Spaces).

Uso:
    python build_chatbot.py
"""

import json
import sys
from pathlib import Path

ROOT = Path(__file__).parent
TEMPLATE = ROOT / "chatbot_template.html"
ARTICLES = ROOT / "claude_code_articles.json"
OUTPUT = ROOT / "index.html"

PLACEHOLDER = "__ARTICLES_JSON__"


def main() -> int:
    if not TEMPLATE.exists():
        print(f"ERROR: {TEMPLATE} not found")
        return 1
    if not ARTICLES.exists():
        print(f"ERROR: {ARTICLES} not found - run download_articles.py first")
        return 1

    template = TEMPLATE.read_text(encoding="utf-8")

    with ARTICLES.open("r", encoding="utf-8") as f:
        articles = json.load(f)

    # Embed as a JS literal (JSON is a strict subset of JS object literal syntax,
    # so json.dumps output is valid JS). We use ensure_ascii=False to keep size
    # reasonable; the file is utf-8.
    js_literal = json.dumps(articles, ensure_ascii=False)

    if PLACEHOLDER not in template:
        print(f"ERROR: placeholder {PLACEHOLDER} not found in template")
        return 1

    output = template.replace(PLACEHOLDER, js_literal)
    OUTPUT.write_text(output, encoding="utf-8")

    size_mb = OUTPUT.stat().st_size / 1024 / 1024
    print(f"Wrote {OUTPUT} ({size_mb:.2f} MB)")
    print(f"  Articles embedded: {len(articles.get('articles', []))}")
    print(f"  Total content: {articles.get('total_chars', 0):,} chars")
    return 0


if __name__ == "__main__":
    sys.exit(main())
