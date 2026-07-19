# Agent profiles, graphs, radar, front page: Apple-depth redesign

Date: 2026-07-19
Status: approved, implementing

## Goal

1. Agent profile cards (Roster page) become clickable, expand to show each
   agent's real active + past case work (sourced from case timeline data,
   not mock).
2. Mini-charts get real data where available and a smoother, deeper visual
   treatment.
3. Radar (Command Center) and the front page (Clearance) get an Apple-style
   motion/depth pass: spring physics, glass materials, refined reveals.

Theme stays dark MIB terminal (alien green / amber / mono type, no color
overhaul). Apple influence is physics and material, not palette.

## Data model

`cases[].timeline[]` already carries `{ts, agent, case_id, message}` per
agent action (confirmed against `case-0020.json`: Z opens → K investigates →
J neuralyzes → O files). `case.status` is one of `open | investigating |
neuralyzed | escalated`.

New `src/lib/agentActivity.js`:

```
buildAgentActivity(cases) -> {
  [agentKey]: {
    active: [{ caseId, species, status, message, ts }],   // status open/investigating
    recent: [{ caseId, species, status, message, ts }],   // status neuralyzed/escalated
  }
}
```

Built by scanning each case's timeline once, taking each agent's latest
message on that case, bucketing by case status, sorting both lists newest
first, capping `recent` at 6 entries.

## Component changes

- **`lib/agentActivity.js`** (new) — pure function above.
- **`components/agents/AgentCard.jsx`** — click/keyboard toggles expanded
  state; `framer-motion` `layout` + `AnimatePresence` spring-expands a body
  listing `active` (pulsing dot rows) and `recent` (status-stamp rows), each
  row navigates to its case on click via `onSelectCase(caseId)` prop.
  "Active Ops" stat = `activity.active.length` (real). Mini-chart data =
  recent cases' `confidence`/threat values (real), falls back to a flat
  placeholder only when an agent has no case history yet.
- **`pages/Roster.jsx`** — pulls `cases` from `useHQ()`, memoizes
  `buildAgentActivity(cases)`, passes `activity`/`onSelectCase` (via
  `useNavigate`) to each `AgentCard`.
- **`components/ui/Panel.jsx`** — glass pass: `rounded-2xl`,
  `backdrop-blur-xl`, softer sheen border. Used by every panel including
  Radar's wrapper, so this one change lifts depth app-wide.
- **`components/charts/MiniCharts.jsx`** — replace ad-hoc
  tween/stagger timing with `SPRING`/`SPRING_SOFT` from `lib/motion.js`,
  add a subtle top-highlight per bar for glass depth, native `title` tooltip
  per bar/tick. Palette unchanged (amber bars, danger accent).
- **`components/command/Radar.jsx`** — glass container (backdrop-blur,
  layered soft-gradient rings, inner shadow), spring scale-in on mount,
  nicer empty state (icon + text).
- **`components/command/RadarBlip.jsx`** — spring hover scale, tooltip
  upgraded to a small glass card (species icon, codename, `ThreatBar`
  reuse) instead of a plain text label.
- **`pages/Clearance.jsx`** + light touch on `FeatureRow.jsx`,
  `TerminalMock.jsx`, `PipelineRail.jsx`, `SpeciesMarquee.jsx` — swap flat
  fade/slide `whileInView` reveals for spring reveals; `EnterButton`
  becomes a pill with spring `whileHover`/`whileTap` press feedback and a
  glass hover glow; stats band + stack strip get glass-card treatment with
  spring hover lift (same visual language as `StatCard`). Copy and section
  structure unchanged.
- **`lib/motion.js`** — add `SPRING_SNAPPY` (button press) and a shared
  `revealSpring` viewport-reveal variant, reused across the landing files
  above instead of each repeating its own duration/ease literal.

## Not touched

Colors, fonts, backend, `CaseFiles.jsx`, `Registry.jsx`, `CommandCenter.jsx`
layout (only its children Radar/Panel change).

## Verification

- `npm run build` clean.
- Dev server: Roster — click a card, confirm it expands and lists real
  cases (e.g. agent K should show `case-0020` in recent); click a case row,
  confirm navigation to Case Files with that case selected.
- Command Center — radar glass depth renders, blip hover shows glass
  tooltip, click still navigates to case.
- Clearance — scroll through, confirm spring reveals fire once and don't
  jank, buttons give press feedback.
- No console errors in any of the three pages.
