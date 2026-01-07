# TECHNICAL DOCUMENTATION: JUST-FITS Tetris Visual Resume

## Project History & Story

### The Challenge
Built as a creative response to Propelland's application challenge: demonstrate "why me" without submitting 20 pages. The solution? A deterministic Tetris autoplay that communicates personality, skills, and values through gameplay mechanics.

### The Evolution
**Initial Vision (Original Attempt):**
- 3-act cascade structure: Personality → Maker → Work Ethic
- Reverse engineering: pieces fall chronologically but clear in reverse order
- Final piece "Limitless" triggers top-down cascade clearing entire board
- **Challenge:** Impossible to solve — cascade physics required pieces to exist in exact positions that couldn't be reached through normal Tetris gravity

**Pivot to Current Implementation:**
- Changed from cascade-clear to progressive gameplay
- 41 pieces divided into 5 sections showing journey and values
- Section messages (brief popups): "Propelland's Principles", "Good Vibes Only", "I Build Things", "How I Work", "I AM A..."
- HUD labels (persistent sidebar): "PROPELLAND'S PRINCIPLES", "MY PERSONALITY", "MY SKILLS", "MY WORK ETHIC", "I AM A..."
- Final section adds "THINKER, MAKER, HACKER, LEARNER" as puzzle pieces
- Note: Methodical, Simplicity, and Precision are skills in Section 2 (pieces 21, 25, 26)
- Ends with line clear cascade (1 line) and "Let's Keep Propelling!" message
- **Success:** Playable, elegant, demonstrates strategic thinking

### The "Why" Behind Design Decisions

**Why Tetris?**
- Universal recognition — everyone understands the mechanics
- Perfect metaphor for tech work: pieces arrive fast, constraints change, pressure increases
- Demonstrates pattern recognition, spatial reasoning, and strategic placement
- "Fitting in" takes on double meaning: puzzle pieces AND cultural alignment

**Why Autoplay?**
- Ensures consistent experience across all viewers
- Allows pre-validated perfect execution
- Demonstrates programming/algorithmic thinking
- Creates narrative pacing — viewer watches story unfold

**Why Section Messages?**
- Guides viewer through narrative arc
- Reinforces Propelland's values and company culture
- Creates emotional beats in the experience
- "Show don't tell" — gameplay demonstrates claims

## Technical Architecture

### Core Technologies
- **Pure Vanilla JavaScript** — No frameworks, no dependencies
- **HTML5 Canvas** — 2D rendering context for game board
- **Web Audio API** — Procedurally generated Korobeiniki chiptune melody
- **CSS Grid/Flexbox** — Responsive UI layout
- **Single File Architecture** — Entire application in one `index.html` (1,348 lines)

### System Components

#### 1. Game Configuration (`CONFIG` object, lines 287-295)
```javascript
const CONFIG = {
  SECTION0_MESSAGE: "Propelland's Principles",
  SECTION1_MESSAGE: "Good Vibes Only",
  SECTION2_MESSAGE: "I Build Things",
  SECTION3_MESSAGE: "How I Work",
  SECTION4_MESSAGE: "I AM A...",
  FINAL_MESSAGE: "Let's Keep Propelling!",
  MESSAGE_DURATION_MS: 2000
}
```
- Defines section-to-message mapping
- Controls message display timing
- Centralized configuration for easy updates

#### 2. Tetris SRS (Super Rotation System) Implementation
**7 Tetromino Types with 4 Rotations Each (lines 214-349):**
```javascript
const SHAPES = {
  I: [/* 4x4 matrix for each rotation */],
  O: [/* only 1 unique rotation */],
  T: [/* 4 rotations */],
  L: [/* 4 rotations */],
  J: [/* 4 rotations */],
  S: [/* 2 unique rotations */],
  Z: [/* 2 unique rotations */]
}
```
- **Matrix Format:** Each rotation is a 4×4 binary matrix (1=filled, 0=empty)
- **Custom Color Palette:** I=Cyan (#00A8F2), O=Yellow (#FFDA00), T=Magenta (#FC38D2), S=Green (#6DD30B), Z=Red (#EF0028), J=Blue (#00397D), L=Orange (#FF6D00)
- **Guideline Compliance:** Follows official Tetris rotation system with custom vibrant colors

#### 3. Deterministic Script Engine (lines 352-356)
```javascript
const SCRIPT = [
  { type: "L", rotation: 0, x: 3, label: "Curious", section: 0, lineMessage: 0 },
  // ... 41 total pieces
  { type: "L", rotation: 2, x: 0, label: "LEARNER", section: 4, lineMessage: 40 }
]
```
**Key Properties:**
- `type` — Tetromino shape (I/O/T/L/J/S/Z)
- `rotation` — Rotation state (0-3)
- `x` — Spawn column (0-9)
- `label` — Text displayed on piece
- `section` — Narrative section number
- `lineMessage` — Index for tracking

#### 4. Board State Management
**10×20 Tetris Board (lines 358-365):**
```javascript
let board = [];  // 20 rows × 10 columns
// board[0] = top row, board[19] = bottom row
// Each cell: null or {color: "cyan", label: "Curious"}
```
- **Collision Detection:** `isValidPosition(piece, x, y)` checks boundaries and overlaps
- **Piece Locking:** `lockPiece()` writes piece data to board array
- **Line Clearing:** `clearLines()` removes complete rows, shifts board down
- **Gravity:** After line clear, all rows above shift down by count of cleared lines

#### 5. Section Message System (lines 370-371, 490-505)
**Tracking Variables:**
```javascript
let currentSection = 0;  // Current piece's section
let lastSection = -1;    // Previously displayed section
```

**Trigger Logic in `spawnNextPiece()`:**
```javascript
if (currentSection !== lastSection) {
  showSectionMessage(currentSection);
  lastSection = currentSection;
}
```
- **When:** Triggers when section value CHANGES (new section starts)
- **Where:** Before piece begins falling
- **Duration:** 2000ms (CONFIG.MESSAGE_DURATION_MS)
- **Prevents Duplicates:** Only shows once per section transition

#### 6. Animation Loop (lines 411-425)
```javascript
function gameLoop() {
  if (!gameRunning) return;
  
  const now = Date.now();
  if (now - lastMoveTime > FALL_SPEED) {
    currentY++;
    if (!isValidPosition(currentPiece, currentX, currentY)) {
      currentY--;
      lockPiece();
      clearLines();
      spawnNextPiece();
    }
    lastMoveTime = now;
  }
  
  draw();
  requestAnimationFrame(gameLoop);
}
```
- **60 FPS rendering:** `requestAnimationFrame()` syncs to display refresh
- **Gravity timing:** Pieces fall at 300ms intervals (FALL_SPEED constant)
- **Lock delay:** 500ms delay before piece locks (lines 428-442)
- **Cascade check:** After each lock, checks if game should end

#### 7. Line Clearing Algorithm (lines 575-620)
```javascript
function clearLines() {
  const linesToClear = [];
  
  // Find complete lines
  for (let y = 0; y < 20; y++) {
    if (board[y].every(cell => cell !== null)) {
      linesToClear.push(y);
    }
  }
  
  if (linesToClear.length === 0) return;
  
  // Animate clearing
  showClearAnimation(linesToClear);
  
  // Remove lines and shift board down
  setTimeout(() => {
    linesToClear.forEach(y => {
      board.splice(y, 1);        // Remove cleared line
      board.unshift(Array(10).fill(null));  // Add empty line at top
    });
    linesCleared += linesToClear.length;
    checkCascade();
  }, CLEAR_ANIMATION_DURATION);
}
```
- **Detection:** Scans all 20 rows, finds rows where every cell is non-null
- **Animation:** White flash effect for 200ms
- **Gravity:** Removes cleared rows, adds empty rows at top
- **Tracking:** Increments global `linesCleared` counter

#### 8. End Game Sequence (lines 665-682)
```javascript
function checkCascade() {
  if (scriptIndex >= SCRIPT.length) {
    gameRunning = false;
    
    setTimeout(() => {
      showFinalMessage();
      
      setTimeout(() => {
        showScoreboard();
      }, CONFIG.MESSAGE_DURATION_MS);
    }, 300);
  }
}
```
**Flow:**
1. All 41 pieces have dropped (`scriptIndex >= SCRIPT.length`)
2. Wait 300ms for final piece to settle
3. Show "Let's Keep Propelling!" message for 2000ms
4. Display scoreboard with stats

#### 9. Audio System (lines 1044-1155)
**Web Audio API Implementation:**
```javascript
let audioContext = null;
let oscillators = [];
let loopTimeout = null;

function initAudio() {
  audioContext = new (window.AudioContext || window.webkitAudioContext)();
  playKorobeiniki();
}

function playNote(frequency, startTime, duration) {
  const osc = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  
  osc.frequency.value = frequency;
  osc.type = "square";  // Chiptune sound
  
  gainNode.gain.setValueAtTime(0.1, startTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration);
  
  osc.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  osc.start(startTime);
  osc.stop(startTime + duration);
  
  oscillators.push(osc);
}
```
- **Korobeiniki Melody:** Traditional Tetris theme, 66 notes
- **Note Format:** `{ freq: 659.25, duration: 0.2 }` (E5 for 200ms)
- **Looping:** Recursively calls itself after melody completes
- **Pause/Resume:** Suspends/resumes audio context on game state change
- **Cleanup:** `pauseAudio()` stops all oscillators when scoreboard shows

#### 10. Rendering Pipeline (lines 690-881)
**Multi-layer drawing system:**
```javascript
function draw() {
  // Clear canvas
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  
  // 1. Draw locked pieces on board
  drawBoard();
  
  // 2. Draw current falling piece
  drawPiece(currentPiece, currentX, currentY);
  
  // 3. Draw ghost piece (preview of landing position)
  drawGhost();
  
  // 4. Draw next piece preview
  drawNextPiece();
  
  // 5. Draw UI overlays (messages, stats)
  drawStats();
}
```

**Block Rendering with Depth Effect:**
```javascript
function drawCell(x, y, color, label) {
  const px = x * CELL_SIZE;
  const py = y * CELL_SIZE;
  
  // Base color fill
  ctx.fillStyle = color;
  ctx.fillRect(px, py, CELL_SIZE, CELL_SIZE);
  
  // Top-left highlight (lighter)
  ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
  ctx.fillRect(px, py, CELL_SIZE, 3);
  ctx.fillRect(px, py, 3, CELL_SIZE);
  
  // Bottom-right shadow (darker)
  ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
  ctx.fillRect(px, py + CELL_SIZE - 3, CELL_SIZE, 3);
  ctx.fillRect(px + CELL_SIZE - 3, py, 3, CELL_SIZE);
  
  // Grid border
  ctx.strokeStyle = "rgba(0, 0, 0, 0.2)";
  ctx.strokeRect(px, py, CELL_SIZE, CELL_SIZE);
}
```
- **3D Effect:** Highlight + shadow creates raised block appearance
- **Retina Support:** Canvas width/height set to 2× for crisp rendering
- **Label Rendering:** Text centered on piece's center of mass (4-block average position)

## Algorithms & Core Game Logic

### 1. Collision Detection Algorithm
```javascript
function isValidPosition(piece, x, y) {
  const shape = SHAPES[piece.type][piece.rotation];
  
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      if (shape[row][col]) {
        const boardX = x + col;
        const boardY = y + row;
        
        // Check boundaries
        if (boardX < 0 || boardX >= 10) return false;
        if (boardY >= 20) return false;
        
        // Check board collision (skip negative Y for spawn zone)
        if (boardY >= 0 && board[boardY][boardX] !== null) {
          return false;
        }
      }
    }
  }
  return true;
}
```
- **4×4 iteration:** Checks each cell in piece's shape matrix
- **Boundary checks:** Left/right walls (0-9), bottom (row 19)
- **Collision checks:** Tests against locked pieces on board
- **Spawn zone handling:** Allows negative Y for piece entry

### 2. Gravity & Line Clear Mechanics
**Line Detection:**
```javascript
const linesToClear = [];
for (let y = 0; y < 20; y++) {
  if (board[y].every(cell => cell !== null)) {
    linesToClear.push(y);
  }
}
```

**Board Shifting:**
```javascript
linesToClear.forEach(y => {
  board.splice(y, 1);  // Remove cleared line
  board.unshift(Array(10).fill(null));  // Add empty top line
});
```
- **Every cell filled:** Line is complete when no null cells
- **Top-down processing:** Clears multiple lines in single pass
- **Natural gravity:** Removing row automatically shifts everything down

## Project Statistics

### Code Metrics
- **Total lines:** 1,348 (index.html)
- **Components:**
  - Configuration: 5 lines
  - Tetromino shapes: 135 lines (7 types × 4 rotations)
  - Script array: 41 pieces
  - Game logic: ~400 lines
  - Rendering: ~190 lines
  - Audio: ~110 lines
  - UI/Controls: ~150 lines
  - Message system: ~50 lines

### Game Statistics (Final Solution)
- **Total pieces:** 41
- **Sections:** 5 (sections 0-4)
  - Section messages: "Propelland's Principles", "Good Vibes Only", "I Build Things", "How I Work", "I AM A..."
  - HUD labels: "PROPELLAND'S PRINCIPLES", "MY PERSONALITY", "MY SKILLS", "MY WORK ETHIC", "I AM A..."
- **Lines cleared:** 10 total
  - Piece 37 (Reliable): 1 line
  - Piece 41 (LEARNER): 1 line
  - Scattered clears: 8 lines
- **Final board height:** 9/20 rows (safe margin)
- **Board coverage:** Balanced column distribution
- **Max piece types per game:** 41 (custom script, not random)

### Piece Distribution
- **I-pieces:** 7 (vertical lines, THINKER finale)
- **O-pieces:** 6 (2×2 squares)
- **T-pieces:** 6 (including HACKER finale, plus Methodical in Section 2)
- **L-pieces:** 6 (including LEARNER finale)
- **J-pieces:** 5
- **S-pieces:** 5 (including Precision in Section 2)
- **Z-pieces:** 6 (including MAKER finale)

## Key Technical Challenges & Solutions

### Challenge 1: Section Message Timing
**Problem:** Messages showing after lines cleared (wrong timing)
**Root Cause:** Message trigger in `checkLineClears()` after gravity applied
**Solution:** Moved trigger to `spawnNextPiece()`, check `currentSection !== lastSection`
**Result:** Messages display when section STARTS, not when lines clear

### Challenge 2: LEARNER Piece Positioning
**Problem:** Multiple collision/offset issues with I-piece and S-piece attempts
**Attempts:**
1. I-piece at x=9 → Collision on right wall
2. I-piece at x=-2 → Out of bounds
3. I-piece at x=-1, rotation=3 → Worked but visually offset
4. S-piece from generator → User wanted specific positioning
**Solution:** L-piece with rotation=2 at x=0 (short end bottom-left pocket)
**Result:** Perfect fit over "Innovation" column

### Challenge 3: Final Section Line Clears
**Problem:** MAKER (Z-piece) not clearing lines as expected
**Testing:** 6+ configurations (positions x=1, x=2, x=5; rotations 0, 1; order swap)
**Finding:** Board state after piece 37 doesn't allow MAKER to clear with any position
**Solution:** Accepted LEARNER as sole line-clearing finale piece (1 line cascade)
**Result:** Clean ending with cascade finish, MAKER positioned decoratively

### Challenge 4: Music Stopping at Game End
**Problem:** Music continued playing after game completed
**Solution:** Added `pauseAudio()` call in `showScoreboard()` function
**Implementation:** Suspends audio context, stops all oscillators, clears loop timeout
**Result:** Music stops cleanly when scoreboard displays

### Challenge 5: Single-File Architecture
**Constraint:** Everything in one HTML file, no external dependencies
**Challenges:**
- Audio without audio files → Web Audio API synthesis
- Graphics without images → Canvas 2D rendering
- Tetris logic without library → Custom SRS implementation
- Validation without framework → Plain Node.js script
**Benefits:**
- Works on file:// protocol (double-click to run)
- No build process, no npm, no deployment complexity
- Complete ownership of all code
- Portable and archival

## Future Enhancement Opportunities

### 1. Advanced Cascade System
**Current:** 1-line clear at end (LEARNER)
**Enhancement:** Multi-line cascade finale
**Approach:** 
- Regenerate entire solution optimizing for final cascade
- Use genetic algorithm to evolve piece sequences
- Goal: Clear 2-4 lines with final pieces creating chain reaction
**Benefit:** More dramatic ending, better Tetris metaphor

### 2. Perfect Clear Solution
**Current:** 9/20 row final height (55% clear)
**Enhancement:** Complete board clear (0/20 height)
**Requirements:**
- 12 complete lines × 10 blocks = 120 blocks
- 41 pieces × 4 blocks = 164 blocks (overshoots by 44)
- Reduce to 30 pieces × 4 blocks = 120 blocks (exact)
**Challenge:** Fewer pieces = less narrative space for labels
**Benefit:** Ultimate demonstration of precision and optimization

### 3. Interactive Mode Toggle
**Current:** Autoplay only
**Enhancement:** Add player control mode
**Features:**
- Arrow keys for manual control
- Use same SCRIPT as guide/optimal solution
- Compare player performance vs autoplay
- Scoring system (time, efficiency)
**Benefit:** Engagement and replayability

### 4. Responsive Board Sizing
**Current:** Fixed 38px cells, centered canvas
**Enhancement:** Dynamic cell size based on viewport
**Implementation:**
```javascript
const vh = window.innerHeight * 0.8;
const cellSize = Math.floor(vh / 20);  // Fit to 80% of viewport height
```
**Benefit:** Better mobile experience, full-screen option

### 5. Visual Polish & Effects
**Enhancements:**
- Particle effects when lines clear
- Screen shake on multi-line clear
- Piece rotation animation (currently instant)
- Lock delay visual feedback (flashing before lock)
- Ghost piece transparency animation
**Benefit:** More polished, modern feel

### 6. Analytics Integration
**Tracking:**
- How many viewers complete the full sequence
- Average viewing time
- Drop-off points
- Interaction events (pause, restart)
**Implementation:** Use `navigator.sendBeacon()` to avoid external scripts
**Benefit:** Understand engagement and optimize experience

### 7. A11y Improvements
**Current:** Visual-only experience
**Enhancements:**
- Keyboard shortcuts documentation (overlay)
- Screen reader announcements for section messages
- High contrast mode option
- Reduced motion mode (disable animations)
- Captions/subtitles for audio (visual melody representation)
**Benefit:** Accessible to wider audience

### 8. Multi-Language Support
**Current:** English only
**Enhancement:** Detect browser language, translate labels
**Challenge:** Different word lengths affect piece text rendering
**Solution:** Pre-validate solutions for each language
**Benefit:** International audience reach

### 9. Validation Test Suite
**Current:** Single validation script
**Enhancement:** Comprehensive test coverage
**Tests:**
- Piece collision at all rotations
- Line clear logic with edge cases
- Section message timing
- Audio lifecycle
- UI state transitions
- Board boundary conditions
**Framework:** Plain JavaScript (no dependencies)
**Benefit:** Confidence in changes, prevent regressions

### 10. Build Pipeline (Optional)
**Current:** Single HTML file, no build
**Enhancement:** Optional build step for optimization
**Features:**
- Minification (reduce file size 30-50%)
- CSS extraction and optimization
- JS compression
- Asset inlining validation
**Tool:** Simple Node.js script (no webpack/vite needed)
**Benefit:** Faster load times, smaller file size

## Development Workflow

### Making Changes
1. **Edit `index.html`** — Change SCRIPT, CONFIG, or game logic
2. **Test locally:** Open `index.html` in browser
3. **Verify all sections:** Watch complete playthrough
4. **Check console:** No errors or warnings
5. **Test controls:** Space (pause), R (retry)
6. **Commit:** Git add, commit with descriptive message
7. **Push:** Deploy to GitHub Pages

### Testing Checklist
- [ ] All 41 pieces drop without collision
- [ ] Section messages appear at correct times (pieces 1, 11, 20, 29)
- [ ] Lines clear when complete (10 total expected)
- [ ] Final message "Let's Keep Propelling!" displays
- [ ] Scoreboard shows with correct stats
- [ ] Music plays on start (after user interaction)
- [ ] Music stops when scoreboard appears
- [ ] Pause/Resume works (Space key on desktop, tap on mobile)
- [ ] Retry works (R key on desktop, button on mobile)
- [ ] No console errors
- [ ] **Mobile: Touch controls work (tap to start/pause/resume)**
- [ ] **Mobile: Canvas fully visible on small screens (iPhone, Android)**
- [ ] **Mobile: Wake Lock keeps screen on during gameplay**
- [ ] **Mobile: No music layering when pausing/resuming**
- [ ] **Mobile: Retry button starts game immediately**
- [ ] **Mobile: Works in portrait and landscape**

### Git Workflow
```bash
# Test locally
open index.html

# Stage changes
git add index.html

# Commit with message
git commit -m "Description of changes"

# Push to GitHub Pages
git push origin main
```

## Technologies Used

### Core Stack
- **HTML5 Canvas** — 2D graphics rendering with devicePixelRatio scaling
- **Vanilla JavaScript (ES6)** — Game logic, no frameworks
- **Web Audio API** — Procedural music synthesis with oscillators
- **Wake Lock API** — Screen sleep prevention during gameplay
- **Touch Events API** — Mobile tap/touch gesture handling
- **CSS Grid/Flexbox** — Responsive layout with media queries
- **Git/GitHub Pages** — Version control and hosting

### Development Tools
- **Node.js** — Validation script runner
- **VS Code** — Code editor
- **GitHub Copilot** — AI pair programming assistant
- **Chrome DevTools** — Debugging and testing

### Standards & Guidelines
- **Tetris Guideline (2009)** — Official game specifications
- **SRS (Super Rotation System)** — Standardized piece rotations
- **Korobeiniki** — Traditional Tetris music (public domain)

## Mobile & Responsive Features

### Touch Controls
- **Tap to Start:** Single tap on overlay starts the game
- **Tap to Pause/Resume:** Tap anywhere on canvas during gameplay
- **Touch Feedback:** Visual opacity flash on tap for user confirmation
- **Retry Button:** Touch-optimized with both click and touchend handlers
- **Event Handling:** Uses touchend for better mobile responsiveness, prevents double-firing

### Responsive Canvas Sizing
```javascript
const isMobile = window.innerWidth <= 768;
if (isMobile) {
  const padding = 80; // 40px each side for full visibility
  const viewportWidth = window.innerWidth - padding;
  const viewportHeight = window.innerHeight - padding;
  const scaleFactor = Math.min(
    viewportWidth / baseWidth,
    viewportHeight / baseHeight,
    1
  );
  width = Math.floor(baseWidth * scaleFactor);
  height = Math.floor(baseHeight * scaleFactor);
}
```
- **Adaptive Scaling:** Canvas scales to fit viewport while maintaining aspect ratio
- **Padding Management:** 80px total padding prevents border cutoff on small screens
- **Device Support:** Tested on iPhone 13 mini, iPad, Android devices
- **Orientation:** Supports portrait and landscape modes

### Audio Management for Mobile
```javascript
// Create AudioContext on user gesture (iOS requirement)
overlay.addEventListener("touchend", () => {
  if (!audioContext) {
    audioContext = new AudioContext();
  }
  startGame();
});

// Prevent music layering on pause/resume
function pauseAudio() {
  if (audioContext.state === "running") {
    audioContext.suspend(); // Pauses all scheduled audio
  }
}

function resumeAudio() {
  if (audioContext.state === "suspended") {
    audioContext.resume(); // Continues from pause point
  }
}
```
- **iOS Compatibility:** AudioContext created in user gesture handler
- **No Layering:** Proper suspend/resume prevents multiple music loops
- **State Management:** Checks context state before operations
- **Retry Handling:** Stops all oscillators and clears timeouts before restart

### Wake Lock API Integration
```javascript
let wakeLock = null;

async function requestWakeLock() {
  if ('wakeLock' in navigator) {
    wakeLock = await navigator.wakeLock.request('screen');
    console.log('Screen will stay on during gameplay');
  }
}

// Auto-release when page hidden, re-acquire when visible
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'hidden' && wakeLock) {
    releaseWakeLock();
  } else if (document.visibilityState === 'visible' && gameState === 'playing') {
    requestWakeLock();
  }
});
```
- **Screen Prevention:** Keeps screen active during autoplay viewing
- **Battery Conscious:** Releases lock when page hidden or game paused
- **Browser Support:** Safari 16.4+, Chrome, Edge (graceful degradation)
- **User Experience:** Critical for uninterrupted mobile viewing

### Timing & Animation Fixes
```javascript
function gameLoop(time = 0) {
  const deltaTime = time - lastTime;
  
  // Handle large time jumps (retry, tab switching, first frame)
  if (deltaTime > 1000 || lastTime === 0) {
    lastTime = time;
    render();
    requestAnimationFrame(gameLoop);
    return;
  }
  // ... continue with normal update
}
```
- **Retry Fix:** Resets lastTime to 0, gameLoop handles timing restart
- **Tab Switching:** Prevents huge deltaTime causing pieces to fall instantly
- **First Frame:** Properly initializes timing on game start
- **requestAnimationFrame:** Uses high-resolution timestamp for accurate timing

### Text Rendering Optimization
```javascript
const hudCenterX = Math.round(boardWidth + (CONFIG.HUD_WIDTH / 2));
ctx.imageSmoothingEnabled = true;
```
- **Integer Coordinates:** Math.round() ensures crisp text rendering on desktop
- **Sub-pixel Fix:** Prevents blurry or clipped text (especially "A" and "T")
- **Image Smoothing:** Enabled for better text quality
- **Cross-platform:** Works consistently on all devices and browsers

### Mobile-Specific CSS
```css
@media (max-width: 768px) {
  body {
    position: fixed;
    width: 100vw;
    height: 100svh; /* Small viewport height for iOS */
    overflow: hidden;
    -webkit-tap-highlight-color: transparent;
    -webkit-touch-callout: none;
    user-select: none;
  }
  
  canvas {
    max-width: 100vw;
    max-height: 100svh;
    width: auto;
    height: auto;
    object-fit: contain;
    touch-action: none;
    border: none;
  }
}
```
- **Fixed Positioning:** Prevents scroll issues on mobile browsers
- **100svh:** Uses small viewport height to account for browser UI
- **Touch Optimizations:** Prevents text selection, callouts, tap highlights
- **Object-fit Contain:** Maintains aspect ratio while filling available space

## Performance Considerations

### Rendering Optimization
- **RequestAnimationFrame:** Syncs to 60 FPS display refresh
- **Dirty Region Drawing:** Only redraw changed areas (future enhancement)
- **Canvas Backing Store:** 2× resolution for retina displays
- **Layer Separation:** Board, piece, ghost, UI drawn in sequence

### Memory Management
- **Board Array:** Fixed 20×10 = 200 cells, reused
- **Oscillators:** Cleaned up after note completion
- **Event Listeners:** Attached once, never removed (single-page app)
- **No Memory Leaks:** No circular references, proper cleanup

### Load Time
- **Single Request:** One HTML file, no external resources
- **Inline Assets:** All CSS/JS embedded
- **No Dependencies:** No CDN latency
- **File Size:** ~60KB uncompressed (could minify to ~40KB)

## Conclusion

This project demonstrates the intersection of creative thinking, technical execution, and strategic communication. By using Tetris as a metaphor, it transforms a traditional resume into an interactive experience that showcases:

1. **Problem-solving:** Engineered deterministic autoplay system
2. **Attention to detail:** Guideline-compliant Tetris implementation
3. **Communication:** Multi-layered narrative through gameplay
4. **Technical skill:** Single-file architecture with no dependencies
5. **User experience:** Thoughtful pacing, music, and visual design

The entire codebase is transparent, well-documented, and extensible — a living example of the "show don't tell" philosophy that drives effective prototyping and cross-functional collaboration.
