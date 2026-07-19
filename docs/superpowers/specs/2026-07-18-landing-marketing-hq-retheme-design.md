# Landing Marketing Sections + HQ Terminal Retheme: Design

Date: 2026-07-18. Approved by delegation ("totally up to you").

## Goal

1. Clearance landing: after the wireframe crate hero, add a LangSmith-observability-style
   scrolling product page, rewritten in the Monitors in Black voice.
2. Internal HQ UI: keep the terminal identity but rice it, macOS terminal window chrome,
   tmux tabs and statusline, pane-style panels.

## Unifying conceit

The terminal window is the brand object. Marketing feature rows on the landing page use
mock terminal windows styled exactly like the real HQ chrome, so entering HQ feels like
stepping into the windows you were just shown.

## Landing (Clearance.jsx)

Becomes a normal scrollable page (drop fixed inset-0, drop click-anywhere navigation).

- Hero: existing crate, header chrome kept. CTA button "Enter HQ" plus scroll hint.
  Enter key still navigates to /command.
- Pipeline rail: ALERT -> Z -> K -> J -> O. Numbered (real sequence). Agent SVG avatars,
  animated beam connector on scroll into view. Headline: "One alert. Four agents. Zero
  humans paged."
- Three alternating feature rows, each text + TerminalMock visual:
  A. Evidence, not vibes (K, SigNoz v5 parallel queries)
  B. A verdict with receipts (Claude classification, confidence)
  C. Neuralyzed. Filed. (J allowlisted remediation, O case files)
- Species marquee band: 6 species chips, CSS marquee, paused on reduced motion.
- Stats band: 6 species on file / 3 signals per investigation / 4 agents on duty /
  0 humans woken.
- Stack strip: SigNoz, OpenTelemetry, FastAPI, Claude, React.
- Final CTA + footer.

New components under src/components/landing/: TerminalMock, PipelineRail, FeatureRow,
SpeciesMarquee. Content constants inline in Clearance or landing/content.

## HQ retheme

- Shell: app inside a rounded window on a void desktop; titlebar (traffic lights,
  route title `agent@mib-hq :: /command`, uplink status) + tmux tab strip + statusline.
  Red traffic light navigates to landing; others decorative.
- NavRail -> titlebar + tabs: `0:command` `1:registry` `2:cases` `3:roster`,
  active gets `*` and alien highlight.
- MetricsTicker -> tmux statusline segments.
- Panel -> pane: `❯ title` header, pane badge kept.
- Pages: replace h-[calc(100vh-6rem)] with h-full (window layout owns height);
  add mono prompt eyebrow above page headlines.
- Fonts: JetBrains Mono first in mono stack.

## Out of scope

Radar, ChatterFeed, cases internals, species/agent SVGs, backend. Palette unchanged.
