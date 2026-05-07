"""
take_screenshots.py

Genera screenshots PNG del chatbot HTML para la entrega academica.
Usa Playwright + Chromium headless.
"""

import asyncio
from pathlib import Path
from playwright.async_api import async_playwright

REPO_DIR = Path("C:/Users/nico1/OneDrive/Escritorio/claude-code-master-2026")
SHOTS = REPO_DIR / "screenshots"
URL = "http://localhost:8765/index.html"


async def main():
    SHOTS.mkdir(exist_ok=True)
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        ctx = await browser.new_context(viewport={"width": 1440, "height": 900})
        page = await ctx.new_page()
        await page.goto(URL, wait_until="networkidle")
        await page.wait_for_timeout(800)

        # 01: Hero (top of page) - full landing
        await page.screenshot(path=str(SHOTS / "01-hero.png"), full_page=False)
        print("01-hero.png")

        # 02: Invite section with topic cards
        await page.evaluate("document.querySelector('.invite').scrollIntoView({block: 'start'})")
        await page.wait_for_timeout(400)
        await page.screenshot(path=str(SHOTS / "02-invite-cards.png"), full_page=False)
        print("02-invite-cards.png")

        # 03: Chat section
        await page.evaluate("document.getElementById('chat-section').scrollIntoView({block: 'start'})")
        await page.wait_for_timeout(400)
        await page.screenshot(path=str(SHOTS / "03-chat.png"), full_page=False)
        print("03-chat.png")

        # 04: Resources at bottom
        await page.evaluate("document.querySelector('.resources').scrollIntoView({block: 'start'})")
        await page.wait_for_timeout(400)
        await page.screenshot(path=str(SHOTS / "04-resources.png"), full_page=False)
        print("04-resources.png")

        # 05: API key modal open
        await page.evaluate("showApiKeyModal()")
        await page.wait_for_timeout(400)
        await page.screenshot(path=str(SHOTS / "05-api-key-modal.png"), full_page=False)
        print("05-api-key-modal.png")

        # 06: Full page screenshot (long)
        await page.evaluate("hideApiKeyModal()")
        await page.wait_for_timeout(200)
        await page.evaluate("window.scrollTo(0, 0)")
        await page.wait_for_timeout(200)
        await page.screenshot(path=str(SHOTS / "06-full-page.png"), full_page=True)
        print("06-full-page.png")

        await browser.close()
        print(f"\nAll screenshots saved to {SHOTS}")


if __name__ == "__main__":
    asyncio.run(main())
