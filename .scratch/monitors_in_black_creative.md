# MONITORS IN BLACK: Creative Assets Showcase

This document presents the motion graphics, video templates, and images generated for the **Monitors in Black (M.I.B.)** autonomous incident-response project (Agents of SigNoz hackathon, Track 01).

---

## 📽️ Offline-Capable Motion Graphics Deck
A three-page motion graphics presentation deck has been authored using GSAP and HTML/CSS. It has been modified to run fully offline with local dependencies.

### 🌐 Assets and Source
- Interactive Deck File: [deck.html](deck.html)
- Source GSAP: [assets/gsap.min.js](assets/gsap.min.js)
- Self-Hosted Fonts: [assets/fonts/](assets/fonts/)

### 📊 Deck Structure and Logic
- **Slide 1: Title Screen**
  - **Heading:** `MONITORS IN BLACK`
  - **Sub-heading:** `Anomalies exist. We monitor them.`
  - **Aesthetic:** Dark carbon styling with active division metadata division badges.
- **Slide 2: The Observability Shield**
  - **Heading:** `THE OBSERVABILITY SHIELD`
  - **Details:** Details the tagline ("If you can't observe your AI agents, you don't own them.") and links to SigNoz tracing telemetry examples.
- **Slide 3: The Neuralyzer**
  - **Heading:** `THE NEURALYZER`
  - **Details:** Lists the four orchestrator agent roles (Investigate, Identify, Remediate, and Report) alongside active neuralysis sweep frames.

*Note: The deck contains dynamic responsive scaling. When opened standalone, it scales to fit the viewport aspect ratio. Press `1`, `2`, or `3` to jump directly to specific scenes, or press `R` to replay the sequence.*

---

## 🎬 Marketing Poster
The official campaign poster has been split into an image backdrop layer and a clean HTML/CSS text rendering layer to avoid image-generation text distortion:

- Rendered Layout: [poster.html](poster.html)
- Background Asset: [assets/monitors_in_black_bg.jpg](assets/monitors_in_black_bg.jpg)

![Monitors in Black Background](assets/monitors_in_black_bg.jpg)

---

## 📡 Anomaly Telemetry Dashboard
A diagnostic telemetry overlay displaying anomaly waveforms, radar tracking sweep systems, and visual structures of the threat signatures:

- Telemetry Asset: [assets/anomaly_telemetry.jpg](assets/anomaly_telemetry.jpg)

![Anomaly Telemetry Dashboard](assets/anomaly_telemetry.jpg)

---

## 👾 AVAL Interactive Video Element
We integrated a mock state-machine video player into the client command dashboard using the AVAL format specification:

- Player Component: [monitors-in-black/hq-ui/src/components/ui/AvalInteractivePlayer.jsx](monitors-in-black/hq-ui/src/components/ui/AvalInteractivePlayer.jsx)
- Integrated Dossier Panel: [monitors-in-black/hq-ui/src/components/cases/CaseDetail.jsx](monitors-in-black/hq-ui/src/components/cases/CaseDetail.jsx)

### State Configuration Mapping:
- **`alert`** (0.0s to 2.5s, loops): Active when a case is `OPEN` or `INVESTIGATING`. Shows active anomaly signatures.
- **`remediating`** (2.5s to 4.5s, single-play): Active when a case state transitions to `NEURALYZED`. Triggers a screen purge/flash.
- **`clean`** (4.5s to 7.0s, loops): Active after remediation succeeds. Renders clean stable green systems.
- **`escalated`** (7.0s to 9.5s, loops): Active when `status = ESCALATED`. Signals active containment failure.
