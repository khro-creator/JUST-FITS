# JUST / FITS — a Tetris metaphor for "why me" 

I was asked to defend *why Propelland should pick me* — without sending 20 pages.

So I built **JUST / FITS**: a deterministic Tetris autoplay that communicates personality, skills, and values through gameplay mechanics.

## The Metaphor

**Why Tetris?**  
Tetris is a perfect metaphor for real work in a technology team: pieces arrive fast, constraints change, and pressure increases. Progress comes from someone who can **read the chaos**, make smart placements, and turn uncertainty into a clean, usable outcome — without breaking what's already stacked.

**The Narrative Structure:**  
Each falling piece carries a word that describes what I bring to Propelland:
- **Section 0 (Pieces 1-10) — "Propelland's Principles":** Alignment with company's 10 core values
- **Section 1 (Pieces 11-19) — "Good Vibes Only":** Personality traits and cultural fit
- **Section 2 (Pieces 20-28) — "I Build Things":** Skills and maker capabilities (includes Methodical, Simplicity, Precision)
- **Section 3 (Pieces 29-37) — "How I Work":** Work ethic and professional approach
- **Section 4 (Pieces 38-41) — "I AM A...":** THINKER, MAKER, HACKER, LEARNER — the four pillars

As pieces drop, lines clear when complete rows form, demonstrating continuous progress and strategic placement. The game ends with a line-clearing cascade and the message **"Keep Propelling"** — closing with Propelland's own words.

**And it reflects how I work cross-functionally:** I build the bridge between strategy/design intent and technical execution by turning abstract ideas into concrete prototypes people can react to.

## Tetris Guideline Compliance
This implementation follows the official **Tetris Guideline** (standardized by The Tetris Company since 2001):

✅ **Standard Colors**: I=Cyan, O=Yellow, T=Magenta, S=Green, Z=Red, J=Blue, L=Orange  
✅ **Playfield**: 10 columns × 20 visible rows (with 2-row buffer zone)  
✅ **SRS Rotation**: Super Rotation System with proper tetromino shapes  
✅ **Lock Delay**: 0.5-second delay before pieces lock (Guideline standard)  
✅ **Spawn Position**: Pieces spawn rows 21-22, centered, flat side down  
✅ **Next Preview**: Shows upcoming piece in standard orientation  
✅ **NES-Style Graphics**: Chunky blocks with highlight/shadow edges  
✅ **Korobeiniki Music**: Web Audio chiptune inspired by classic Tetris

## Run
- **GitHub Pages:** [https://khro-creator.github.io/JUST-FITS/](https://khro-creator.github.io/JUST-FITS/)
- **Local (Mac):** download and double-click `index.html`
- Press **Start** (or **Space**) to begin (music starts after the first gesture due to browser rules)
- **R** = Retry, **Space** = Pause/Resume

## Project Statistics
- **Total pieces:** 41 (across 4 sections + finale)
- **Lines cleared:** 10 throughout gameplay
- **Final cascade:** LEARNER piece clears 1 line to finish
- **Total lines of code:** 1,217 (single HTML file)
- **Dependencies:** Zero — pure vanilla JavaScript
- **File size:** ~60KB uncompressed

## Technical Highlights
- **Single HTML file** — no dependencies, no CDN, works on file:// and HTTPS
- **Deterministic autoplay** — pre-validated script ensures perfect execution every time
- **Web Audio API** — Procedurally generated Korobeiniki (Tetris theme) chiptune melody
- **Smart text rendering** — labels centered on entire piece shape, not per-cell
- **Validation system** — 279-line Node.js script pre-validates all 41 pieces before commit
- **Section messaging** — Narrative guides viewer through 4-act structure
- **Responsive canvas** — Retina-ready with proper pixel scaling (38px cells)

## Files
- **index.html** (1,217 lines) — Complete game implementation
- **validate_solution.js** (279 lines) — Automated validation with board visualization
- **TECHNICAL_DOCUMENTATION.md** — Comprehensive technical breakdown, algorithms, story, and future enhancements
- **agent.md** — Original development instructions (3-act cascade concept)
- **README.md** — This file
