import os
import time
from playwright.sync_api import sync_playwright, expect

def test_multi_language_flow():
    with sync_playwright() as p:
        # Launch browser
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={'width': 1280, 'height': 720})
        page = context.new_page()

        # Go to the app
        print("Opening Jaclang Dojo...")
        page.goto("http://localhost:8080")

        # Wait for page load
        try:
            page.wait_for_selector('h1:has-text("Jaclang Dojo")', timeout=10000)
        except:
            print("H1 not found, current content:")
            print(page.content())
            page.screenshot(path="failure_initial_load.png")
            browser.close()
            return

        # Verify initial state (Jaclang)
        print("Verifying initial state (Jaclang)...")
        # Check for Master and Your Way
        expect(page.get_by_text("Master")).to_be_visible()
        expect(page.get_by_text("Your Way")).to_be_visible()

        # Change language to Python
        print("Changing language to Python...")
        # Find the language selector. It has the word "Jaclang" in it.
        page.click('button:has-text("Jaclang")')

        # Wait for the dropdown and click Python
        page.wait_for_selector('role=option[name="Python"]')
        page.click('role=option[name="Python"]')

        # Give it a moment to update
        time.sleep(1)

        # Verify Hero Section updated to Python
        print("Verifying Hero Section updated to Python...")
        # The languageName span should now contain "Python"
        # We can check the text inside the gradient span
        python_text = page.locator('h1 span.bg-gradient-to-r').first
        expect(python_text).to_have_text("Python")

        # Click on "Lessons" in Sidebar
        print("Navigating to Lessons...")
        # Try a more robust selector for Sidebar items
        page.click('text="Lessons"')

        # Check if Python lessons are visible
        print("Verifying Python lessons...")
        expect(page.get_by_text("Python Learning Path")).to_be_visible()
        expect(page.get_by_text("Hello Python")).to_be_visible()

        # Click a Python lesson
        print("Starting 'Hello Python' lesson...")
        page.click('text="Hello Python"')

        # Should be in Playground now
        print("Verifying Playground for Python...")
        expect(page.get_by_text("Hello Python")).to_be_visible()

        # Verify code editor has Python code
        page.click('button:has-text("Get Hint")')
        expect(page.get_by_text("Python uses indentation")).to_be_visible()

        print("All multi-language verifications passed!")

        # Take a screenshot
        page.screenshot(path="verification_multi_lang_final.png")

        browser.close()

if __name__ == "__main__":
    test_multi_language_flow()
