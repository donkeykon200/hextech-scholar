
import asyncio
from playwright.async_api import async_playwright

async def run():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()

        print("Opening page...")
        await page.goto("http://localhost:8080")

        # Wait for the app to load
        await page.wait_for_selector("h1:has-text('Master')")

        # 1. Check initial state
        header = await page.locator("h1:has-text('Master')").inner_text()
        print(f"Initial Header: {header}")

        await page.screenshot(path="step1_initial.png")

        # 2. Change language to Python
        print("Changing language to Python...")
        # Target the select trigger specifically
        await page.click("nav >> [role='combobox']")
        await page.screenshot(path="step2_select_open.png")
        await page.click("role=option[name='Python']")

        # Wait for header to update
        await asyncio.sleep(2)
        header = await page.locator("h1:has-text('Master')").inner_text()
        print(f"Updated Header: {header}")

        await page.screenshot(path="step3_after_lang_change.png")

        # 3. Go to Lessons
        print("Navigating to Lessons...")
        await page.click("aside >> button:has-text('Lessons')")

        # Wait for content to load
        await asyncio.sleep(2)
        await page.screenshot(path="step4_lessons.png")

        content = await page.content()
        if "Python Basics" in content:
            print("SUCCESS: Python Basics course found in Lessons")
        else:
            print("FAILED: Python Basics course not found in Lessons")

        # 4. Go to Code Playground
        print("Navigating to Code Playground...")
        await page.click("aside >> button:has-text('Code Playground')")

        await asyncio.sleep(2)
        await page.screenshot(path="step5_playground.png")

        # Check if code editor shows Python template
        # Try to find the editor
        editor = page.locator(".cm-content")
        if await editor.count() > 0:
            editor_content = await editor.inner_text()
            print(f"Editor content starts with: {editor_content[:50]}...")
            if "# Python Template" in editor_content or "print(" in editor_content:
                print("SUCCESS: Code Editor shows Python content")
            else:
                print(f"FAILED: Code Editor content mismatch.")
        else:
            print("FAILED: Could not find editor (.cm-content)")

        await browser.close()

if __name__ == "__main__":
    asyncio.run(run())
