# SnapStats: Future Vision and Feature Considerations

This document captures ideas, observations, and potential features for future versions of SnapStats. These are **deferred for now** to preserve focus on delivering a solid and usable V1.0.

---

## 📊 Spatial Tagging for Non-Shot Events

**Applies to:**

* Blocks
* Fouls (committed and drawn)
* Steals
* Rebounds (Off/Def)

**Vision:**
These events occur in identifiable zones on the court and could be optionally tagged with a location, just like shots. This would enable:

* Defensive heatmaps
* Rebound zones
* Foul clustering

**Implementation:**

* Reuse the court tap UI after selecting one of these stats.
* Optional interaction: if user skips the zone, log proceeds normally.
* Allow upgrading a stat from a simple count to a court-based event.

**Terminology Notes:**

* Consider distinguishing stats as:

  * **Count Stats**: Simple, no court interaction (e.g., AST, FT, TO)
  * **Court Stats**: Involve zone placement (e.g., 2PT, 3PT, BLK, REB, PF)
* These terms can guide both UI flow and code structure.

**Status:** Deferred until post-V1.0.

---

## 🧳 Turnover (TO) Position Ambiguity

**Challenge:** TOs are harder to spatially assign due to varied context:

* Was it a bad pass? Deflection? Out-of-bounds?
* Should location reflect pass origin, interception, or ball loss?

**Basic Future Plan:**

* Allow zone tagging for TOs as a best-effort approximation.
* Defer complex handling like dual-zone origin/destination mapping.

**Status:** Deferred.

---

## 📈 Advanced Stats and Derived Metrics

**Ideas for Derived Reports:**

* Assisted points (passer-to-scorer link)
* Assist-to-Turnover ratio (AST/TO)
* PIR (Performance Index Rating) — a European-favored metric:

  * +1 per point, assist, rebound, block, steal, foul drawn
  * −1 per missed shot, turnover, foul committed

**Considerations:**

* PIR is often criticized for treating all fouls as negative, despite some being strategic or defensively beneficial (e.g., stopping transition, breaking mismatches). Future versions may offer alternate efficiency metrics that reflect situational decision quality.
* Requires accurate stat logging + player linking
* Report generator module will be built on top of the event log

**Status:** Deferred for post-V1.0 reports module.

---

## ⚡️ Fouls Drawn (vs Committed)

**Observation:**
We currently log Personal Fouls (PF) as committed events. But fouls drawn are just as important for:

* Bonus situation tracking
* Identifying aggressive playmakers
* Enabling FT logic (who got fouled)

**Implementation Consideration:**

* Dual-player logging: `{ committedBy, drawnBy }`
* Optionally integrated when logging FT events or fouls

**Status:** Deferred for multi-actor event model in V2+.

---

## 🌐 Event Log Navigation UI

**Idea:** A right or left drawer that can be tapped open to display:

* Full log of recorded events
* Ability to undo, edit, or delete individual entries

**Goal:** Give the user more control over review and correction in-game.

**Status:** Deferred (after V1.0 flow is stable).

---

## 🏀 Game Ribbon HUD

**Proposed Features:**

* Toggleable top or bottom ribbon
* Center: live score (color-coded by team)
* Left/right: team fouls (count or red dots)
* Far ends: current quarter + hide/unhide toggle

**Status:** ✅ Implemented in V1.0 layout.

---

## 📊 Post-Game & Multi-Game Analytics

**Future Capabilities:**

* Shot maps or stat heatmaps per player, per team, or game aggregate
* Filters by position (G/F/C), opponent, location
* Time filters (e.g., last 5 games, league play only)

**Status:** Part of long-term analytics module.

---

## 🔧 Team & League Configuration

**Future Features for Setup/Customization:**

* Team colors
* Player editor:

  * Jersey number
  * Name
  * Position (G/F/C at first; expandable to PG/SG/etc later)
* Team info:

  * Name
  * Icon/badge
  * Home court
* League structure:

  * Create and manage leagues
  * Add/edit opposing teams

**Status:** Planned for configuration and league management phase.

---

## 🎙 Voice Dictation (Experimental)

**Concept:**

* Allow logging events using browser voice recognition APIs
* Example command: "#7 rebound" or "#12 three point made"

**Use Case:**

* Truly hands-free logging during live games

**Challenges:**

* Noise during games
* Training the model to understand stat phrases reliably

**Status:** Deferred — worth prototyping post-V1.0 as an accessibility + power-user feature

---

## 🔁 Mistake Tolerance Improvements

**Idea:** Allow shot modal cancellation by tapping outside the modal, instead of forcing a user to choose Made/Miss.

**Status:** ✅ Implemented in modal UX in V1.0.

---

## 🧭 Event Log Enhancements

**Planned Improvements:**

* Reverse the display order to show most recent events first
* Distinguish team visually:

  * Option A: Prefix each entry with \[Home] or \[Away]
  * Option B: Color-code the jersey number by team color

**Status:** Planned for near-term UX update.

---

## 📦 Transitioning to PWA & Repurposing GH Pages

**Plan:**

* Continue refining the GH Pages version until feature-complete and layout-stable
* When ready, wrap the app into a PWA for installation and native experience
* Retain `gh-pages` as:

  * A frictionless live demo
  * A fallback environment
  * A landing page and/or help/docs site

**Benefits:**

* Easy public sharing without installs
* Real-world field testing under zero setup
* Ability to redirect or guide users into the PWA from a central, static homepage

**Status:** Planned post-stabilization of GH Pages build

---

## 🔄 General Plan

> **SnapStats will ship V1.0 with single-actor, single-action stat logging.**

This allows:

* A clear, quick interaction loop
* A solid UX foundation
* Confidence in core functionality

The above features will be revisited as SnapStats matures, and as real-world usage and feedback validate the value of deeper tracking.

---

*Created as part of the SnapStats MVP development cycle.*
