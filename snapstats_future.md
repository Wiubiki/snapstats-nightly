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

  * +1 per point, assist, rebound, block, foul drawn
  * −1 per missed shot, turnover, foul committed

**Considerations:**

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

## 🔄 General Plan

> **SnapStats will ship V1.0 with single-actor, single-action stat logging.**

This allows:

* A clear, quick interaction loop
* A solid UX foundation
* Confidence in core functionality

The above features will be revisited as SnapStats matures, and as real-world usage and feedback validate the value of deeper tracking.

---

*Created as part of the SnapStats MVP development cycle.*
