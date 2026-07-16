import time
import json
import urllib.request
import urllib.error
import os
import sys

def main():
    print("=== STARTING FRONTEND + BACKEND E2E TEST ===")

    # 1. Start browser-use session and load frontend
    new_tab("http://localhost:5173/")
    wait_for_load()
    time.sleep(2)

    # Skip the typewriter intro by clicking the screen overlay
    print("Skipping intro boot screen...")
    js("document.querySelector('.fixed.inset-0').click()")
    time.sleep(3)
    wait_for_load()

    # Verify we are on CommandCenter page
    url = js("window.location.href")
    print("Current URL after skip:", url)
    assert "command" in url, f"Expected URL to contain 'command', got {url}"

    # Capture command center state before alert
    print("Capturing pre-alert screenshot...")
    capture_screenshot("/home/ladliju/Developer/Signoz-hackathon/.scratch/e2e-results/1_command_center_before.png")

    # Verify we see active text
    body_text = js("document.body.innerText")
    print("Page body text snippet:")
    print("---------------------------------")
    print(body_text[:400])
    print("---------------------------------")
    assert "surveillance grid" in body_text.lower(), "Could not find 'Surveillance Grid' in dashboard"
    assert "radio chatter" in body_text.lower(), "Could not find 'Radio Chatter' in dashboard"

    # 2. Trigger alien error_swarm alert via webhook to the backend orchestrator
    print("Triggering alien error_swarm via orchestrator webhook...")
    rule_name = f"error rate breach {int(time.time())}"
    webhook_url = "http://localhost:8100/hooks/signoz"
    token = "change-me"
    
    req = urllib.request.Request(
        webhook_url,
        data=json.dumps({"ruleName": rule_name}).encode(),
        headers={"Content-Type": "application/json", "x-agency-token": token},
        method="POST"
    )
    with urllib.request.urlopen(req, timeout=10) as resp:
        res = json.loads(resp.read())
        print("Webhook response:", res)
        assert res["status"] == "case-opened", f"Expected case-opened, got {res}"
        case_id = res["case_id"]
        print(f"Successfully opened case: {case_id}")

    # 3. Wait for the agents to process the case and verify it on the backend
    print("Waiting 30 seconds for agent pipeline and SigNoz verification loop to finish...")
    time.sleep(30)

    # 4. Navigate client-side to Case Files page
    print("Navigating to Case Files via client-side NavLink...")
    js("Array.from(document.querySelectorAll('a')).find(a => a.textContent.includes('Case Files')).click()")
    time.sleep(3)

    # 5. Select our case in the sidebar by clicking its list item button
    print(f"Selecting case {case_id} in the Archive Index sidebar...")
    js(f"Array.from(document.querySelectorAll('button')).find(btn => btn.innerText.includes('{case_id}')).click()")
    time.sleep(2)

    # Capture detailed case files screenshot
    capture_screenshot("/home/ladliju/Developer/Signoz-hackathon/.scratch/e2e-results/4_case_file_details.png")

    case_body = js("document.body.innerText")
    print("Case detail page snippet:")
    print("---------------------------------")
    print(case_body[:800])
    print("---------------------------------")

    # Assertions to ensure information rendered correctly
    assert case_id in case_body.lower(), f"Case ID {case_id} not found on details page"
    assert "incident" in case_body.lower() or "case" in case_body.lower(), "Case details not loaded"

    print("=== ALL E2E INTEGRATION CHECKS PASSED ===")
    print("Screenshots saved to: /home/ladliju/Developer/Signoz-hackathon/.scratch/e2e-results/")

main()
