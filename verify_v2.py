import asyncio
from playwright.async_api import async_playwright

async def run():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()

        # Navigate to the app
        print("Navigating to http://localhost:8080...")
        await page.goto("http://localhost:8080", wait_until="networkidle")
        await page.screenshot(path="v2_initial.png")

        # Click "Lessons" in the sidebar
        # Using role and name, but picking the first one or using a more specific locator
        lessons_btn = page.locator('aside').get_by_role("button", name="Lessons")
        if await lessons_btn.is_visible():
            print("Sidebar Lessons button found. Clicking...")
            await lessons_btn.click()
            await page.wait_for_timeout(1000)
            await page.screenshot(path="v2_lessons.png")

            # Verify we are on Lessons page
            title = page.locator('h2')
            print("Page title:", await title.first.inner_text())
        else:
            print("Sidebar Lessons button NOT found.")

        # Check for language selector
        selector = page.locator('button[role="combobox"]')
        if await selector.count() > 0:
            selector = selector.first
            print("Language selector found. Current value:", await selector.inner_text())
            await selector.click()
            await page.wait_for_timeout(500)
            await page.screenshot(path="v2_lang_open.png")

            # Select Python
            await page.click('role=option[name="Python"]')
            await page.wait_for_timeout(1000)
            print("Selected Python. New value:", await selector.inner_text())
            await page.screenshot(path="v2_lang_python.png")

            # Check if Lessons page updated
            title = page.locator('h2')
            if await title.count() > 0:
                print("Updated Page title:", await title.first.inner_text())
        else:
            print("Language selector NOT found.")

        await browser.close()

if __name__ == "__main__":
    asyncio.run(run())
