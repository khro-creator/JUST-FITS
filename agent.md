# JUST FITS — Agent Development Instructions

## Project Overview
**JUST FITS** is a deterministic, autoplay Tetris-inspired visual resume designed to showcase creative technologist skills through an interactive 3-act narrative. The project uses the Tetris metaphor to demonstrate strategic thinking, adaptability, and problem-solving in a playful, memorable format.

## Core Metaphor
**"Tetris" = Perfect Fit + Strategic Alignment**
- **Tetra** (Greek: four) + **Tennis** (favorite sport of creator Alexey Pajitnov)
- In professional context: demonstrates how a candidate's skills fit precisely into organizational needs
- Key insight: "When you try to fit in, you disappear" — must fit requirements while remaining memorable

## 3-Act Narrative Structure

### FALL ORDER (Chronological Sequence)
**Pieces fall in this order, stacking from bottom to top:**

#### Act 1: PERSONALITY (Falls FIRST → Bottom of Board)
- **Rows:** 0-6 (bottom section)
- **Piece count:** 20-30 pieces with varied rotations
- **Piece labels:** Personality pool (Curious, Playful, Empathetic, Freaky, Funny, etc.)
- **Strategic gaps:** Leave holes that will be filled when pieces fall from above
- **All 7 piece types:** Use I, O, T, L, J, S, Z with different rotations (0°, 90°, 180°, 270°)
- **Visual:** Chaotic but structured — looks like active gameplay

#### Act 2: MAKER (Falls SECOND → Middle of Board)
- **Rows:** 7-13 (middle section)
- **Piece count:** 15-20 pieces with varied rotations
- **Piece labels:** Maker pool (Creative, Visionary, Thinker, Innovator, etc.)
- **Strategic gaps:** Leave holes that will be filled by falling Work Ethic pieces
- **All 7 piece types:** Mix of shapes and rotations
- **Visual:** Builds upon Personality section, increasing complexity

#### Act 3: WORK ETHIC (Falls LAST → Top of Board)
- **Rows:** 14-19 (top section, danger zone)
- **Piece count:** 10-15 pieces with varied rotations
- **Piece labels:** Work ethic pool (Discipline, Determined, Consistent, Hyperfocus, etc.)
- **Key piece:** "Limitless" (I-piece) falls LAST
- **All 7 piece types:** Including the critical final piece
- **Visual:** Stack reaches near top (16-18 rows) creating suspense

### CASCADE ORDER (After "Limitless" Locks)
**Clears happen top-to-bottom through natural Tetris gravity:**

#### Phase 1: WORK ETHIC Clears (TOP SECTION)
- **"Limitless" triggers:** Completes 2-4 lines in rows 14-19
- **Lines clear:** Work Ethic section disappears
- **Message shown:** "My Work Ethic"
- **Metaphor:** Work ethic is what triggers everything

#### Phase 2: MAKER Clears (MIDDLE SECTION) 
- **Pieces fall:** Work Ethic pieces above are gone, Maker pieces drop down
- **Gravity fills gaps:** Falling pieces complete lines in rows 7-13
- **Lines clear:** Maker section cascades away
- **Message shown:** "I build things"
- **Metaphor:** Work ethic enables creation

#### Phase 3: PERSONALITY Clears (BOTTOM SECTION)
- **More pieces fall:** Maker pieces gone, remaining pieces settle into bottom rows
- **Final cascade:** Lines complete in rows 0-6
- **Board empties:** All pieces cleared
- **Message shown:** "Good vibes only"
- **Metaphor:** Everything rests on personality and culture fit

### The Cascade Physics Algorithm
**This is a reverse Tetris puzzle** — engineer a board state that cascade-clears itself:

1. **Strategic gap placement:** Leave holes in each section that will be filled by pieces falling from above
2. **Limitless triggers:** When it locks, completes first set of lines (Work Ethic at top)
3. **Gravity domino effect:** As each section clears, pieces above fall and fill gaps below
4. **Chain reaction:** Each section's clearing causes the next section to complete
5. **Natural physics:** Uses standard Tetris line-clear and gravity rules
6. **Complete board clear:** Final state must be empty (all rows null)

**Critical:** This requires careful planning of piece positions and rotations to ensure the cascade works deterministically.

## Technical Architecture

### Single-File Constraint
- **One `index.html` only** — all HTML, CSS, JS inline
- No external resources: no CDNs, fonts, images, audio files
- Must run on `file://` protocol (double-click on macOS)
- Must run on GitHub Pages (HTTPS)

### Canvas Rendering System
- **Board:** 10 columns × 20 rows (official Tetris Guideline standard)
- **Cell size:** 36px recommended (large enough for word labels, retina scaling)
- **Modern Tetris aesthetic:** Clean blocks with subtle gradients, not pixelated
- **Block rendering:** Use official Tetris colors with light highlight on top/left, dark shadow on bottom/right
- **Responsive:** Center canvas, preserve aspect ratio, no overflow
- **Guideline compliance:** Follow 2009+ Tetris Guideline specifications

### Deterministic Script Engine
```javascript
// Script format — pieces listed in FALL ORDER (chronological)
const SCRIPT = [
  // ACT 1: PERSONALITY (falls first, lands at bottom rows 0-6)
  { 
    act: 1,                    // Fall order: 1=Personality, 2=Maker, 3=Work Ethic
    type: "L",                 // Tetromino type (I, O, T, L, J, S, Z)
    rotation: 2,               // Rotation state (0-3) — vary for realism
    x: 1,                      // Target x position (0-9)
    label: "Curious",          // Word to display (from Personality pool)
    colorGroup: "personality", // Color palette
    targetRow: 2               // Approximate landing row (for gap planning)
  },
  // ... 20-30 Personality pieces with strategic gaps
  
  // ACT 2: MAKER (falls second, lands at middle rows 7-13)
  { 
    act: 2,
    type: "T",
    rotation: 1,
    x: 5,
    label: "Creative",
    colorGroup: "maker",
    targetRow: 9
  },
  // ... 15-20 Maker pieces with strategic gaps
  
  // ACT 3: WORK ETHIC (falls last, lands at top rows 14-19)
  { 
    act: 3,
    type: "S",
    rotation: 0,
    x: 3,
    label: "Discipline",
    colorGroup: "work",
    targetRow: 15
  },
  // ... 10-15 Work Ethic pieces
  
  // FINAL PIECE: Triggers cascade
  { 
    act: 3,
    type: "I",                 // I-piece (line piece)
    rotation: 0,               // Horizontal
    x: 3,
    label: "Limitless",        // THE KEY PIECE
    colorGroup: "work",
    isKey: true,               // Marks the trigger piece
    targetRow: 16              // Completes 2-4 lines in Work Ethic section
  }
];
// Total: 45-55 pieces with varied types and rotations
```

### Validation System (Critical)
**Must run simulation before rendering:**
1. Fast-forward through script without drawing
2. Verify no premature line clears (pieces build chaos, no clears until "Limitless")
3. Verify "Limitless" piece completes 2-4 lines in Work Ethic section (rows 14-19)
4. Verify cascade effect: Work Ethic clears → pieces fall → Maker clears → pieces fall → Personality clears
5. Verify final state is completely empty board (all rows null)
6. Verify messages appear in correct order: "My Work Ethic" → "I build things" → "Good vibes only"
7. **If validation fails:** auto-switch to hardcoded fallback script

**This ensures first-run success with no debugging needed**

### Cascade Physics Requirements
- **Gravity after clear:** When lines clear, all pieces above must fall down to fill empty space
- **Multi-clear detection:** Check for new completed lines after pieces settle
- **Section tracking:** Monitor which section (work/maker/personality) is clearing
- **Message timing:** Show section message ONLY when ALL lines in that section are cleared
- **Scoreboard trigger:** Only appear when `board.every(row => row.every(cell => cell === null))`

### Cascade Algorithm — Detailed Implementation

**This is the core challenge:** Creating a deterministic piece sequence that builds chaos but cascade-clears perfectly.

#### Step 1: Reverse Engineering the Final State
1. **Start from the END** (empty board) and work backwards
2. Identify which lines must clear in Personality section (rows 0-6)
3. Identify which lines must clear in Maker section (rows 7-13)
4. Identify which lines must clear in Work Ethic section (rows 14-19)

#### Step 2: Strategic Gap Placement
**Work Ethic Section (rows 14-19):**
- Create 2-4 lines that are ONE BLOCK SHORT of complete
- These gaps will be filled by the "Limitless" I-piece
- Example: Row 16 has 9/10 blocks, Row 17 has 9/10 blocks
- When "Limitless" (horizontal I-piece) locks at column 0-3, it completes both lines

**Maker Section (rows 7-13):**
- Create 3-5 lines with strategic gaps (1-2 blocks missing)
- Position gaps where Work Ethic pieces currently occupy space
- When Work Ethic clears, those pieces disappear
- Maker pieces above fall down and fill the gaps
- Example: Row 10 needs blocks at columns [0,1,2], which are currently in row 15

**Personality Section (rows 0-6):**
- Create 4-6 lines with gaps that will be filled by falling Maker pieces
- When Maker section clears, those pieces fall into bottom rows
- Final cascade completes all remaining lines

#### Step 3: Piece Type Distribution
**Must use ALL 7 Tetromino types with realistic rotation variety:**

```javascript
// Distribution strategy across ~50 pieces:
const PIECE_DISTRIBUTION = {
  I: 7,  // Line pieces (critical for filling gaps)
  O: 7,  // Square pieces (stable foundations)
  T: 8,  // T-pieces (most versatile)
  L: 8,  // L-pieces (varied rotations)
  J: 8,  // J-pieces (varied rotations)
  S: 6,  // S-pieces (create interesting patterns)
  Z: 6   // Z-pieces (create interesting patterns)
};

// Rotation distribution (make it look like real gameplay):
// - 40% pieces at rotation 0 (default)
// - 25% at rotation 1 (90° CW)
// - 20% at rotation 2 (180°)
// - 15% at rotation 3 (270° CW / 90° CCW)
```

#### Step 4: Collision-Free Placement
**Each piece in SCRIPT must:**
1. Not cause game-over (doesn't overlap row 20)
2. Not complete lines prematurely (before "Limitless")
3. Land in the correct section (Personality: 0-6, Maker: 7-13, Work Ethic: 14-19)
4. Have valid `x` position (0-9, accounting for piece width and rotation)

#### Step 5: Simulation & Validation Algorithm
```javascript
function validateCascade(script) {
  // 1. Simulate all pieces falling
  const board = createEmptyBoard();
  for (const move of script) {
    placePiece(board, move);
    const cleared = checkLines(board);
    if (cleared.length > 0 && move.label !== "Limitless") {
      return false; // Premature clear detected!
    }
  }
  
  // 2. Trigger cascade with "Limitless"
  const cascade = [];
  let clearedLines = checkAndClearLines(board);
  
  while (clearedLines.length > 0) {
    applyGravity(board);  // Pieces fall
    cascade.push(clearedLines);
    clearedLines = checkAndClearLines(board);  // Check for new clears
  }
  
  // 3. Verify cascade order and complete clear
  const sections = identifySections(cascade);
  if (sections[0] !== 'work') return false;     // Must clear Work Ethic first
  if (sections[1] !== 'maker') return false;    // Then Maker
  if (sections[2] !== 'personality') return false; // Then Personality
  if (!isBoardEmpty(board)) return false;       // Must end completely empty
  
  return true;
}
```

#### Step 6: Manual Tuning Process
1. **Start with ~20 Personality pieces** at bottom (varied types/rotations)
2. **Add ~15 Maker pieces** in middle, leaving 1-2 gaps per row
3. **Add ~12 Work Ethic pieces** at top
4. **Place "Limitless"** as final piece
5. **Run simulation** — does it cascade correctly?
6. **If no:** Adjust gap positions, piece rotations, or x-placement
7. **Iterate** until validation passes

**This is the hardest part of the project** — it requires Tetris expertise and patience.

### Audio System (Web Audio API)
- **Chiptune music:** Korobeiniki-inspired melody using oscillators
- **Dynamic tempo:** Increases when stack approaches top, relaxes after clears
- **User gesture required:** Only start after Space or START click
- **Pause handling:** Clean mute without audio pops
- **No external files:** Generate all tones with `OscillatorNode`

### Visual Design Specs

#### Title Screen (Official Tetris Style)
```
┌─────────────────────────┐
│                         │
│       JUST FITS         │  ← Bold, clean sans-serif
│                         │
│  A PERFECT FIT STORY    │  ← Subtitle (smaller, letterspaced)
│                         │
│    ▶ PRESS START        │  ← Blinking play icon
│                         │
│  AUTOPLAY DEMO          │  ← Footer (gray)
│  SPACE=START • R=RETRY  │
└─────────────────────────┘
```
**Typography:**
- Use system fonts: `font-family: -apple-system, 'Segoe UI', sans-serif`
- Title: Bold, 48px, #FFFFFF
- Subtitle: Normal, 14px, letterspacing 2px, #999999
- Clean, modern, readable — matches 2009+ Tetris branding

#### Game Screen Layout (Official Tetris HUD)
```
┌────────────┬──────────┐
│            │ JUST     │
│            │ FITS     │
│            ├──────────┤
│            │ NEXT:    │
│   BOARD    │ [piece]  │
│  (10x20)   ├──────────┤
│            │ LINES: 0 │
│            │ SCORE: 0 │
│            ├──────────┤
│            │ STATUS:  │
│            │ WORK     │
│            │ ETHIC    │
└────────────┴──────────┘
```

#### Official Tetris Guideline Colors (2009 Standard)
**CRITICAL: Use official Tetris colors for each piece type**

```javascript
// Official Tetris Guideline color assignments (NEVER change these)
const TETRIS_COLORS = {
  I: { base: "#00F0F0", light: "#3FFFFF", dark: "#00A0A0" }, // Cyan
  O: { base: "#F0F000", light: "#FFFF3F", dark: "#A0A000" }, // Yellow
  T: { base: "#A000F0", light: "#C03FFF", dark: "#7000A0" }, // Magenta
  S: { base: "#00F000", light: "#3FFF3F", dark: "#00A000" }, // Green
  Z: { base: "#F00000", light: "#FF3F3F", dark: "#A00000" }, // Red
  J: { base: "#0000F0", light: "#3F3FFF", dark: "#0000A0" }, // Blue
  L: { base: "#F0A000", light: "#FFC03F", dark: "#A07000" }  // Orange
};

// Colors are determined by PIECE TYPE, not by section/act
// This ensures Tetris authenticity and brand recognition
// All I-pieces are cyan, all O-pieces are yellow, etc.
```

**Why this matters:**
- Players instantly recognize Tetris through these colors
- Maintains game authenticity and legitimacy
- Shows attention to detail and respect for source material
- **Labels carry the narrative, colors ensure recognition**
```

### Label Rendering System
- **Auto-fit text:** Shrink font if label too long for piece width
- **Two-line wrap:** For very long words
- **High contrast:** White text with dark shadow/outline
- **Centered:** Both horizontally and vertically in piece bounding box

### Message Callout System
```javascript
// After each act's line clear
showMessage("My Work Ethic", 1200);    // 1.2 seconds
showMessage("I build things", 1200);
showMessage("Good vibes only", 1200);
```
- Center screen, large text, semi-transparent overlay
- Brief timing to maintain flow

### End Scoreboard Overlay
```
╔═══════════════════════════════╗
║  Creative Technologist        ║
║  Score Board                  ║
║                               ║
║  Ro — €55,000–€58,000         ║
║  (Madrid, base, flexible)     ║
║                               ║
║  Result: Ideas made real —    ║
║  fast, clean, reliable.       ║
║                               ║
║         [ RETRY ].            ║
╚═══════════════════════════════╝
```

## Label Word Pools

### PERSONALITY (Act 1 — Falls FIRST, Clears LAST — Blues/Purples)
**Bottom section (rows 0-6) — 20-30 pieces**
```
Curious, Playful, Freaky, Funny, Fast-minded, 
Adventurous, Empathetic, Good-Hearted, Passionate,
Energetic, Optimistic, Authentic, Humble
```
**Message when cleared:** "Good vibes only"

### MAKER (Act 2 — Falls SECOND, Clears SECOND — Greens/Teals)
**Middle section (rows 7-13) — 15-20 pieces**
```
Creative, Visionary, Thinker, Innovator, Techie, 
Investigator, Hacker, Lifelong-Learner, Builder,
Prototyper, Experimenter, Architect, Designer
```
**Message when cleared:** "I build things"

### WORK_ETHIC (Act 3 — Falls LAST, Clears FIRST — Reds/Oranges)
**Top section (rows 14-19) — 10-15 pieces, ends with "Limitless"**
```
Discipline, Determined, Consistent, Hyperfocus, 
Human-centered, Challenge-Driven, Adaptability, 
Problem-Solving, Reliable, Passion, Limitless
```
**Message when cleared:** "My Work Ethic"
**Key piece:** "Limitless" (I-piece) — triggers entire cascade

## Configuration Variables (Top of File)
```javascript
const CONFIG = {
  // Game
  GAME_NAME: "JUST FITS",
  SUBTITLE: "A Perfect Fit Story",
  
  // Board
  COLS: 10,
  ROWS: 20,
  CELL_SIZE: 30,
  
  // Timing
  DROP_SPEED_MS: 500,
  FAST_DROP_MS: 100,
  LOCK_DELAY_MS: 200,
  MESSAGE_DURATION_MS: 1200,
  
  // Messages
  ACT1_MESSAGE: "My Work Ethic",
  ACT2_MESSAGE: "I build things",
  ACT3_MESSAGE: "Good vibes only",
  
  // Scoreboard
  TITLE: "Creative Technologist",
  SALARY: "Ro — €48,000–€58,000 (Madrid, base, flexible)",
  RESULT: "Result: Ideas made real — fast, clean, reliable.",
  
  // Audio
  BASE_TEMPO_BPM: 120,
  DANGER_TEMPO_BPM: 160,
  DANGER_HEIGHT: 16  // Rows from bottom when tempo increases
};
```

## Development Guidelines

### Code Organization
1. **Constants & Config** — Easy-to-edit values at top
2. **Data Models** — Board state, piece definitions, script
3. **Game Logic** — Collision, locking, line clearing
4. **Script Runner** — Deterministic piece sequencing
5. **Validation** — Pre-run simulation with fallback
6. **Renderer** — Canvas drawing (board, pieces, HUD, overlays)
7. **Audio** — Web Audio music generation + tempo control
8. **UI Handlers** — Keyboard (Space, R), button clicks

### Quality Checklist
- [ ] Works on file:// (local double-click)
- [ ] Works on GitHub Pages (HTTPS)
- [ ] No console errors
- [ ] Audio starts only after user gesture
- [ ] Retina/high-DPI displays render sharply
- [ ] Responsive scaling works on different screen sizes
- [ ] Validation catches bad scripts and uses fallback
- [ ] All three acts complete successfully
- [ ] Board fully clears at end
- [ ] Scoreboard appears with correct info
- [ ] Retry button restarts cleanly
- [ ] Pause/Space toggles work correctly
- [ ] Music tempo responds to danger height
- [ ] Text labels are readable inside all pieces

## Interview Talking Points

### Why This Works as a Resume
1. **Shows, doesn't tell:** Actual working code demonstrates technical skills
2. **Creative problem-solving:** Turns abstract concept into tangible artifact
3. **Technical constraints:** Single-file, no libraries = deep JS knowledge
4. **Cross-functional bridge:** Merges design intent with engineering execution
5. **Memorable:** Unique approach stands out in interview process

### The Tetris Metaphor Explained
- **Order within chaos:** Making sense of complexity
- **Strategic thinking:** Planning ahead (NEXT preview)
- **Adaptability:** Pieces arrive fast, must respond in real-time
- **Perfect fit:** Skills align precisely with team needs
- **Pressure handling:** Stack near top (Act 1) = high-stakes performance
- **Clean outcomes:** Full clear = delivering polished, complete results

### Key Message Breakdown
1. **"My Work Ethic"** (Act 1) → Foundation/reliability under pressure
2. **"I build things"** (Act 2) → Execution/maker mentality
3. **"Good vibes only"** (Act 3) → Culture fit/collaboration

**Combined:** "I bring solid work ethic, execute on ideas, and contribute positively to team culture."

## Maintenance & Extension Ideas

### Easy Modifications
- **Salary range:** Update `CONFIG.SALARY` string
- **Messages:** Update `CONFIG.ACT*_MESSAGE` strings
- **Speed:** Adjust `DROP_SPEED_MS` and `FAST_DROP_MS`
- **Colors:** Modify `PALETTES` object
- **Labels:** Add/remove from word pools

### Potential Enhancements
- Add subtle particle effects on line clears
- Include "level up" visual feedback between acts
- Add more music variations (intro, act themes, ending)
- Create multiple script variations (A/B test)
- Add share button to scoreboard (screenshot to clipboard)
- Include analytics tracking (time to retry, pause count)

## Deployment

### GitHub Pages Setup
1. Commit `index.html` to repo
2. Go to Settings → Pages
3. Select branch (main) and root folder
4. Save and wait for deployment
5. Visit `https://username.github.io/repo-name/`

### Local Testing
1. Double-click `index.html` on macOS
2. Or run local server: `python3 -m http.server 8000`
3. Test in Safari and Chrome

## Credits & Inspiration
- **Original Tetris:** Alexey Pajitnov (1985)
- **NES Tetris:** Nintendo (1989)
- **Korobeiniki:** Russian folk song (public domain)
- **Web Audio API:** W3C standard
- **Canvas API:** HTML5 standard

---

**Remember:** This is not just a game demo — it's a narrative about fit, capability, and cultural alignment. Every element (the suspense, the clears, the messages) should reinforce the story: "I am the piece that completes your team."
