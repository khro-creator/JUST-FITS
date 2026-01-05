// 40-Piece Solution Generator
// Structure:
// - Section 0: 10 Propelland Principles
// - Section 1: 9 Personality traits  
// - Section 2: 9 Maker skills
// - Section 3: 9 Work Ethic attributes
// - Section 4: 3 Final words (THINKER, MAKER, HACKER)

const PROPELLAND_PRINCIPLES = [
  "Be Curious", "Have Fun", "Empower Others", "Make Ideas Real",
  "Commit to Excellence", "Seek Simplicity", "Be Accountable",
  "Lead by Example", "Fail to Succeed", "Thrive in Ambiguity"
];

const PERSONALITY_POOL = [
  "Curious", "Playful", "Freaky", "Funny", "Fast-minded",
  "Adventurous", "Empathetic", "Good-Hearted", "Passionate"
];

const MAKER_POOL = [
  "Creative", "Visionary", "Thinker", "Innovator", "Techie",
  "Investigator", "Hacker", "Lifelong-Learner", "Builder"
];

const WORK_ETHIC_POOL = [
  "Discipline", "Determined", "Consistent", "Hyperfocus",
  "Human-centered", "Challenge-Driven", "Adaptability", "Problem-Solving", "Reliable"
];

const FINALE = ["THINKER", "MAKER", "HACKER"];

const ROTATIONS = {
  I: [
    [[0,0,0,0], [1,1,1,1], [0,0,0,0], [0,0,0,0]],
    [[0,0,1,0], [0,0,1,0], [0,0,1,0], [0,0,1,0]]
  ],
  O: [
    [[0,1,1,0], [0,1,1,0], [0,0,0,0], [0,0,0,0]]
  ],
  T: [
    [[0,1,0,0], [1,1,1,0], [0,0,0,0], [0,0,0,0]],
    [[0,1,0,0], [0,1,1,0], [0,1,0,0], [0,0,0,0]],
    [[0,0,0,0], [1,1,1,0], [0,1,0,0], [0,0,0,0]],
    [[0,1,0,0], [1,1,0,0], [0,1,0,0], [0,0,0,0]]
  ],
  L: [
    [[0,0,1,0], [1,1,1,0], [0,0,0,0], [0,0,0,0]],
    [[0,1,0,0], [0,1,0,0], [0,1,1,0], [0,0,0,0]],
    [[0,0,0,0], [1,1,1,0], [1,0,0,0], [0,0,0,0]],
    [[1,1,0,0], [0,1,0,0], [0,1,0,0], [0,0,0,0]]
  ],
  J: [
    [[1,0,0,0], [1,1,1,0], [0,0,0,0], [0,0,0,0]],
    [[0,1,1,0], [0,1,0,0], [0,1,0,0], [0,0,0,0]],
    [[0,0,0,0], [1,1,1,0], [0,0,1,0], [0,0,0,0]],
    [[0,1,0,0], [0,1,0,0], [1,1,0,0], [0,0,0,0]]
  ],
  S: [
    [[0,1,1,0], [1,1,0,0], [0,0,0,0], [0,0,0,0]],
    [[0,1,0,0], [0,1,1,0], [0,0,1,0], [0,0,0,0]]
  ],
  Z: [
    [[1,1,0,0], [0,1,1,0], [0,0,0,0], [0,0,0,0]],
    [[0,0,1,0], [0,1,1,0], [0,1,0,0], [0,0,0,0]]
  ]
};

function createEmptyBoard() {
  return Array.from({ length: 20 }, () => Array(10).fill(null));
}

function getShape(type, rotation) {
  return ROTATIONS[type][rotation % ROTATIONS[type].length];
}

function canPlace(board, type, rotation, x, y) {
  const shape = getShape(type, rotation);
  for (let r = 0; r < shape.length; r++) {
    for (let c = 0; c < shape[r].length; c++) {
      if (shape[r][c]) {
        const boardY = y + r;
        const boardX = x + c;
        if (boardY < 0 || boardY >= 20 || boardX < 0 || boardX >= 10) return false;
        if (board[boardY] && board[boardY][boardX] !== null) return false;
      }
    }
  }
  return true;
}

function placePiece(board, type, rotation, x) {
  const shape = getShape(type, rotation);
  let y = 0;
  while (canPlace(board, type, rotation, x, y + 1)) {
    y++;
  }
  for (let r = 0; r < shape.length; r++) {
    for (let c = 0; c < shape[r].length; c++) {
      if (shape[r][c]) {
        board[y + r][x + c] = type;
      }
    }
  }
  return y;
}

function checkLines(board) {
  const cleared = [];
  for (let r = 0; r < 20; r++) {
    if (board[r] && board[r].every(cell => cell !== null)) {
      cleared.push(r);
    }
  }
  return cleared;
}

function clearLines(board, lines) {
  for (const line of lines.sort((a,b) => a - b)) {
    board.splice(line, 1);
    board.unshift(Array(10).fill(null));
  }
}

function getBoardHeight(board) {
  for (let r = 0; r < 20; r++) {
    if (board[r] && board[r].some(cell => cell !== null)) {
      return 20 - r;
    }
  }
  return 0;
}

function countBlocks(board) {
  let count = 0;
  for (let r = 0; r < 20; r++) {
    for (let c = 0; c < 10; c++) {
      if (board[r][c] !== null) count++;
    }
  }
  return count;
}

function scorePlacement(board, type, rotation, x) {
  const testBoard = board.map(row => [...row]);
  placePiece(testBoard, type, rotation, x);
  
  const lines = checkLines(testBoard);
  const height = getBoardHeight(testBoard);
  const blocks = countBlocks(testBoard);
  
  let score = 0;
  
  if (height > 12) {
    score -= height * 1000000;
  } else if (height > 8) {
    score -= height * 50000;
  } else {
    score += (8 - height) * 1000;
  }
  
  if (lines.length > 0) {
    score += lines.length * 5000000;
  }
  
  score -= blocks * 100;
  score -= Math.abs(x - 4) * 10;
  
  return { score, lines: lines.length, height, blocks };
}

function findBestMove(board, type, usageCount) {
  let best = null;
  const rotations = ROTATIONS[type].length;
  
  for (let r = 0; r < rotations; r++) {
    // Check valid x range for this specific rotation
    for (let x = 0; x <= 10; x++) {
      if (canPlace(board, type, r, x, 0)) {
        const result = scorePlacement(board, type, r, x);
        const diversityPenalty = usageCount[type] * 100000;
        result.score -= diversityPenalty;
        
        if (!best || result.score > best.score) {
          best = { rotation: r, x, ...result };
        }
      }
    }
  }
  
  return best;
}

// Generate solution
const board = createEmptyBoard();
const script = [];
const allLabels = [
  ...PROPELLAND_PRINCIPLES.map(l => ({ label: l, section: 0 })),
  ...PERSONALITY_POOL.map(l => ({ label: l, section: 1 })),
  ...MAKER_POOL.map(l => ({ label: l, section: 2 })),
  ...WORK_ETHIC_POOL.map(l => ({ label: l, section: 3 })),
  ...FINALE.map(l => ({ label: l, section: 4 }))
];

console.log(`\n${'='.repeat(70)}`);
console.log(`Generating 40-piece solution:`);
console.log(`  Section 0: 10 Propelland Principles`);
console.log(`  Section 1: 9 Personality traits`);
console.log(`  Section 2: 9 Maker skills`);
console.log(`  Section 3: 9 Work Ethic attributes`);
console.log(`  Section 4: 3 Final words (THINKER, MAKER, HACKER)`);
console.log(`${'='.repeat(70)}\n`);

const pieceTypes = ['I', 'O', 'T', 'L', 'J', 'S', 'Z'];
const usageCount = { I:0, O:0, T:0, L:0, J:0, S:0, Z:0 };
let totalLinesCleared = 0;
let maxHeight = 0;

for (let i = 0; i < 40; i++) {
  const { label, section } = allLabels[i];
  
  let bestType = null;
  let bestMove = null;
  
  for (const type of pieceTypes) {
    const move = findBestMove(board, type, usageCount);
    if (move && (!bestMove || move.score > bestMove.score)) {
      bestType = type;
      bestMove = move;
    }
  }
  
  if (!bestMove) {
    console.log(`❌ Failed at piece ${i + 1}/40`);
    process.exit(1);
  }
  
  placePiece(board, bestType, bestMove.rotation, bestMove.x);
  usageCount[bestType]++;
  
  script.push({
    type: bestType,
    rotation: bestMove.rotation,
    x: bestMove.x,
    label,
    section,
    lineMessage: i
  });
  
  const lines = checkLines(board);
  if (lines.length > 0) {
    clearLines(board, lines);
    totalLinesCleared += lines.length;
    console.log(`📦 ${i+1}/40 - "${label}" [Sec ${section}] [${bestType} r${bestMove.rotation} @x${bestMove.x}] ✅ ${lines.length} lines`);
  } else {
    console.log(`📦 ${i+1}/40 - "${label}" [Sec ${section}] [${bestType} r${bestMove.rotation} @x${bestMove.x}]`);
  }
  
  const height = getBoardHeight(board);
  const blocks = countBlocks(board);
  maxHeight = Math.max(maxHeight, height);
  console.log(`   H:${height} B:${blocks} Total cleared:${totalLinesCleared}\n`);
}

console.log(`\n${'='.repeat(70)}`);
console.log(`✅ Complete! 40 pieces placed`);
console.log(`Total lines cleared: ${totalLinesCleared}`);
console.log(`Max height: ${maxHeight}/20`);
console.log(`Final blocks: ${countBlocks(board)}`);
console.log(`Piece usage:`, usageCount);
console.log(`${'='.repeat(70)}\n`);

console.log(`📋 SCRIPT for index.html:\n`);
console.log(`const SCRIPT = [`);
script.forEach((move, i) => {
  const comma = i < script.length - 1 ? ',' : '';
  console.log(`  { type: "${move.type}", rotation: ${move.rotation}, x: ${move.x}, label: "${move.label}", section: ${move.section}, lineMessage: ${move.lineMessage} }${comma}`);
});
console.log(`];`);
