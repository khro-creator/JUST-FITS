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
- **Section 2 (Pieces 20-28) — "I Build Things":** Skills and maker capabilities
- **Section 3 (Pieces 29-37) — "How I Work":** Work ethic and professional approach
- **Section 4 (Pieces 38-41) — "I AM A...":** THINKER, MAKER, HACKER, LEARNER — the four pillars

As pieces drop, lines clear when complete rows form, demonstrating continuous progress and strategic placement. The game ends with a line-clearing cascade and the message **"Let's Keep Propelling!"** — closing with Propelland's own words.

**And it reflects how I work cross-functionally:** I build the bridge between strategy/design intent and technical execution by turning abstract ideas into concrete prototypes people can react to.

## Tetris Guideline Compliance
This implementation follows the official **Tetris Guideline** (standardized by The Tetris Company since 2001):

✅ **Custom Color Palette**: I=Cyan (#00A8F2), O=Yellow (#FFDA00), T=Magenta (#FC38D2), S=Green (#6DD30B), Z=Red (#EF0028), J=Blue (#00397D), L=Orange (#FF6D00)  
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

**Desktop Controls:**
- Press **Start** (or **Space**) to begin (music starts after the first gesture due to browser rules)
- **Space** = Pause/Resume
- **Retry** via scoreboard button only (R key disabled to prevent bugs)

**Mobile/Tablet Controls:**
- **Tap anywhere** to start the game
- **Tap during gameplay** to pause/resume
- **Tap retry button** on scoreboard to restart
- Works on all touch devices (iPhone, iPad, Android)
- Screen stays awake during gameplay (Wake Lock API)

## Project Statistics
- **Total pieces:** 41 (across 5 sections: 0-4)
- **Lines cleared:** 10 throughout gameplay
- **Final cascade:** LEARNER piece clears 1 line to finish
- **Total lines of code:** 1,737 (single HTML file)
- **Dependencies:** Zero — pure vanilla JavaScript
- **File size:** ~60KB uncompressed

## Technical Highlights
- **Single HTML file** — no dependencies, no CDN, works on file:// and HTTPS
- **Deterministic autoplay** — pre-validated 41-piece script ensures perfect execution every time
- **Web Audio API** — Procedurally generated Korobeiniki (Tetris theme) chiptune melody
- **Smart text rendering** — labels centered on entire piece shape, not per-cell
- **Custom color palette** — vibrant, distinct colors for optimal visual clarity
- **Section messaging** — Narrative guides viewer through 5-section structure
- **Responsive canvas** — Retina-ready with proper pixel scaling, adapts to mobile/tablet/desktop
- **Touch controls** — Full touch support for mobile devices with visual feedback
- **Wake Lock API** — Prevents screen from sleeping during gameplay on mobile
- **Smart audio handling** — No music layering, proper pause/resume on all devices
- **Cross-platform** — Works seamlessly on iPhone, iPad, Android, desktop browsers

## Files
- **index.html** — Complete game implementation
- **TECHNICAL_DOCUMENTATION.md** — Comprehensive technical breakdown, algorithms, story, and future enhancements
- **README.md** — This file
