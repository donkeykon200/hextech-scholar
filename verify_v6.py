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
        page.wait_for_selector('h1:has-text("Jaclang Dojo")', timeout=15000)

        # Verify initial state (Jaclang)
        print("Verifying initial state (Jaclang)...")
        # Check for Master in Hero
        expect(page.locator('h1').filter(has_text="Master").first).to_be_visible()

        # Change language to Python
        print("Changing language to Python...")
        # Find the language selector.
        page.click('[role="combobox"]:has-text("Jaclang")')

        # Click Python in the list
        page.click('role=option[name="Python"]')

        # Give it a moment to update
        time.sleep(1)

        # Verify Hero Section updated to Python
        print("Verifying Hero Section updated to Python...")
        python_text = page.locator('h1 span.bg-gradient-to-r').first
        expect(python_text).to_have_text("Python")

        # Click on "Lessons" in Sidebar
        print("Navigating to Lessons...")
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
        # In Playground, the lesson title should be visible as a heading
        expect(page.locator('h2').filter(has_text="Hello Python")).to_be_visible()

        # Verify code editor has Python code hint
        page.click('button:has-text("Get Hint")')
        expect(page.get_by_text("Python uses indentation")).to_be_visible()

        print("All multi-language verifications passed!")

        # Take a screenshot
        page.screenshot(path="verification_multi_lang_v6.png")

        browser.close()

if __name__ == "__main__":
    test_multi_language_flow()
