import os
import time
from playwright.sync_api import sync_playwright, expect

def test_bug_hunt_flow():
    with sync_playwright() as p:
        # Launch browser
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={'width': 1280, 'height': 720})
        page = context.new_page()

        # Go to the app
        print("Opening Jaclang Dojo...")
        page.goto("http://localhost:3000")

        # Wait for page load
        page.wait_for_selector('h1:has-text("Jaclang Dojo")', timeout=15000)

        # Click on "Fun Bug Games" in Sidebar
        print("Navigating to Bug Hunt Games...")
        page.click('text="Fun Bug Games"')

        # Check if bug challenges are visible
        print("Verifying bug challenges...")
        page.wait_for_selector('text="Bug Hunt Games"', timeout=15000)
        time.sleep(3)

        # Take a screenshot of the bug games list
        page.screenshot(path="bug_hunt_list.png")

        # Click a challenge if any
        try:
            challenge = page.locator('button:has-text("Debug:")').first
            if challenge.is_visible():
                print("Starting a bug challenge...")
                challenge.click()
                time.sleep(2)
                page.screenshot(path="bug_hunt_gameplay.png")
                print("Gameplay screenshot captured.")
        except Exception as e:
            print(f"Could not start challenge: {e}")

        # Navigate to Mistakes
        print("Navigating to Mistakes...")
        page.click('text="Mistake Workouts"')
        time.sleep(2)
        page.screenshot(path="mistakes_view.png")

        print("Verification complete!")
        browser.close()

if __name__ == "__main__":
    test_bug_hunt_flow()
