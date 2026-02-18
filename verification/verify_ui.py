from playwright.sync_api import sync_playwright
import time

def run_verification():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Dashboard
        page.goto("http://localhost:3000", wait_until="networkidle")
        time.sleep(2) # Give it extra time for animations
        page.screenshot(path="/home/jules/verification/dashboard.png")

        # Go to Playground
        page.get_by_role("button", name="Open Sandbox").click()
        time.sleep(2)
        page.screenshot(path="/home/jules/verification/playground.png")

        # Go to AI Tutor
        page.get_by_role("button", name="Back to Dashboard").click()
        time.sleep(1)
        # Find the AI Tutor button in Sidebar.
        # Actually I'll just use the button from Dashboard if it exists,
        # but I don't see it in the Quick Action Cards.
        # Let's check Sidebar3D.
        # onItemClick("ai-tutor")

        # I'll try to click the sidebar item.
        page.locator("aside").get_by_text("AI Tutor").click()
        time.sleep(2)
        page.screenshot(path="/home/jules/verification/ai_tutor.png")

        browser.close()

if __name__ == "__main__":
    run_verification()
