"""
download_articles.py

Lee claude_code_sources.json (10 URLs curadas) y baja el contenido de cada
articulo a markdown limpio, generando claude_code_articles.json - listo
para inyectar en el system prompt del chatbot HTML.

Uso:
    python download_articles.py

Salida:
    claude_code_articles.json (con campo content_markdown lleno por articulo)
"""

import json
import sys
import time
from pathlib import Path

import requests
import trafilatura

ROOT = Path(__file__).parent
SOURCES_PATH = ROOT / "claude_code_sources.json"
ARTICLES_PATH = ROOT / "claude_code_articles.json"

USER_AGENT = (
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
    "(KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
)

REQUEST_TIMEOUT = 30
MIN_CONTENT_CHARS = 1000


def fetch_html(url: str) -> str:
    headers = {"User-Agent": USER_AGENT, "Accept": "text/html,application/xhtml+xml"}
    resp = requests.get(url, headers=headers, timeout=REQUEST_TIMEOUT, allow_redirects=True)
    resp.raise_for_status()
    return resp.text


def html_to_markdown(html: str, url: str) -> str:
    md = trafilatura.extract(
        html,
        url=url,
        output_format="markdown",
        include_links=True,
        include_tables=True,
        include_formatting=True,
        favor_recall=True,
    )
    return md or ""


def process_source(source: dict) -> dict:
    url = source["url"]
    print(f"  [{source['id']:>2}] {source['title'][:60]:<60} ", end="", flush=True)
    try:
        html = fetch_html(url)
        md = html_to_markdown(html, url)
        chars = len(md)
        if chars < MIN_CONTENT_CHARS:
            print(f"WARN: only {chars} chars extracted")
        else:
            print(f"OK ({chars:,} chars)")
        source["content_markdown"] = md
        source["content_chars"] = chars
        source["fetch_status"] = "ok" if chars >= MIN_CONTENT_CHARS else "thin"
    except Exception as e:
        print(f"FAIL: {e}")
        source["content_markdown"] = ""
        source["content_chars"] = 0
        source["fetch_status"] = f"error: {e}"
    return source


def main() -> int:
    if not SOURCES_PATH.exists():
        print(f"ERROR: {SOURCES_PATH} not found")
        return 1

    with SOURCES_PATH.open("r", encoding="utf-8") as f:
        data = json.load(f)

    sources = data.get("sources", [])
    print(f"Downloading {len(sources)} articles...")
    print("-" * 80)

    for i, src in enumerate(sources):
        process_source(src)
        if i < len(sources) - 1:
            time.sleep(1.0)

    total_chars = sum(s.get("content_chars", 0) for s in sources)
    ok_count = sum(1 for s in sources if s.get("fetch_status") == "ok")
    print("-" * 80)
    print(f"Done: {ok_count}/{len(sources)} OK, total {total_chars:,} chars (~{total_chars // 4:,} tokens)")

    output = {
        "metadata": data.get("metadata", {}),
        "generated_at": time.strftime("%Y-%m-%dT%H:%M:%S"),
        "total_chars": total_chars,
        "articles": sources,
    }

    with ARTICLES_PATH.open("w", encoding="utf-8") as f:
        json.dump(output, f, ensure_ascii=False, indent=2)

    print(f"Wrote {ARTICLES_PATH}")
    return 0 if ok_count == len(sources) else 2


if __name__ == "__main__":
    sys.exit(main())
