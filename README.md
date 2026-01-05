# JUST-FITS
# JUST / FITS — a Tetris metaphor for "why me" 

I was asked to defend *why Propelland should pick me* — without sending 20 pages.

So I built **JUST / FITS**: a deterministic Tetris autoplay that demonstrates **Perfect Clear logic** using Propelland's own principles and values.

**Why Tetris?**  
Tetris is a perfect metaphor for real work in a technology team: pieces arrive fast, constraints change, and pressure increases. Progress comes from someone who can **read the chaos**, make smart placements, and turn uncertainty into a clean, usable outcome — without breaking what's already stacked.

**The Perfect Clear Concept:**  
In Tetris, a "Perfect Clear" means clearing the entire board with zero blocks remaining — the ultimate demonstration of efficiency and precision. This implementation uses **30 pieces × 4 blocks = 120 blocks = 12 complete rows**, making a Perfect Clear mathematically possible.

Each falling piece carries a word that describes what I bring to Propelland:
- **Section 1 (Thinker):** 9 pieces showcasing personality traits
- **Section 2 (Maker):** 9 pieces demonstrating what I build  
- **Section 3 (Principles):** 9 pieces embodying Propelland's 10 core principles
- **Section 4 (Finale):** 3 pieces — **THINKER**, **MAKER**, **HACKER**

As pieces drop, lines clear when complete rows form, demonstrating continuous progress and adaptation. The game ends with the three words that define Propelland's team identity.

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
- **Local (Mac):** download and double-click `index.html`.
- Press **Start** (or **Space**) to begin (music starts after the first gesture due to browser rules).
- **R** = Retry, **Space** = Pause/Resume

## Technical Highlights
- **Single HTML file** — no dependencies, no CDN, works on file:// and HTTPS
- **Larger cells (38px)** — ensures all words fit legibly inside pieces
- **Smart text rendering** — labels centered on entire piece shape, not per-cell
- **Deterministic autoplay** — pre-validated script ensures perfect execution
- **Responsive canvas** — retina-ready with proper pixel scaling
