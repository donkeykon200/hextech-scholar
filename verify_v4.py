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
        page.wait_for_selector('h1:has-text("Jaclang Dojo")')

        # Verify initial state (Jaclang)
        print("Verifying initial state (Jaclang)...")
        expect(page.get_by_text("Master Jaclang Your Way")).to_be_visible()

        # Change language to Python
        print("Changing language to Python...")
        # Click the language selector trigger
        # The trigger contains "Jaclang" initially
        page.click('button:has-text("Jaclang")')
        # Click Python in the list
        page.click('role=option[name="Python"]')

        # Verify Hero Section updated
        print("Verifying Hero Section updated to Python...")
        expect(page.get_by_text("Master Python Your Way")).to_be_visible()

        # Click on "Lessons" in Sidebar
        print("Navigating to Lessons...")
        # Sidebar labels might be different, let's try finding the "Lessons" item
        page.click('div[data-sidebar="menu-item"] >> text="Lessons"')

        # Check if Python lessons are visible
        print("Verifying Python lessons...")
        expect(page.get_by_text("Python Learning Path")).to_be_visible()
        expect(page.get_by_text("Hello Python")).to_be_visible()

        # Click a Python lesson
        print("Starting 'Hello Python' lesson...")
        page.click('text="Hello Python"')

        # Should be in Playground now
        print("Verifying Playground for Python...")
        expect(page.get_by_text("Code Playground")).not_to_be_visible() # It should show the lesson title
        expect(page.get_by_text("Hello Python")).to_be_visible()

        # Verify code editor has Python code
        # We can check the textarea content or a hint
        page.click('button:has-text("Get Hint")')
        expect(page.get_by_text("Python uses indentation")).to_be_visible()

        print("All multi-language verifications passed!")

        # Take a screenshot
        page.screenshot(path="verification_multi_lang.png")

        browser.close()

if __name__ == "__main__":
    test_multi_language_flow()
