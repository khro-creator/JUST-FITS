// Validation script to test if the generated solution actually works

const SHAPES = {
  I: [
    [[0,0,0,0], [1,1,1,1], [0,0,0,0], [0,0,0,0]],
    [[0,0,1,0], [0,0,1,0], [0,0,1,0], [0,0,1,0]],
    [[0,0,0,0], [0,0,0,0], [1,1,1,1], [0,0,0,0]],
    [[0,1,0,0], [0,1,0,0], [0,1,0,0], [0,1,0,0]]
  ],
  O: [
    [[0,1,1,0], [0,1,1,0], [0,0,0,0], [0,0,0,0]],
    [[0,1,1,0], [0,1,1,0], [0,0,0,0], [0,0,0,0]],
    [[0,1,1,0], [0,1,1,0], [0,0,0,0], [0,0,0,0]],
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
    [[0,1,0,0], [0,1,1,0], [0,0,1,0], [0,0,0,0]],
    [[0,0,0,0], [0,1,1,0], [1,1,0,0], [0,0,0,0]],
    [[1,0,0,0], [1,1,0,0], [0,1,0,0], [0,0,0,0]]
  ],
  Z: [
    [[1,1,0,0], [0,1,1,0], [0,0,0,0], [0,0,0,0]],
    [[0,0,1,0], [0,1,1,0], [0,1,0,0], [0,0,0,0]],
    [[0,0,0,0], [1,1,0,0], [0,1,1,0], [0,0,0,0]],
    [[0,1,0,0], [1,1,0,0], [1,0,0,0], [0,0,0,0]]
  ]
};

const SCRIPT = [
  { type: "I", rotation: 0, x: 4, label: "Be Curious", section: 0, lineMessage: 0 },
  { type: "L", rotation: 2, x: 3, label: "Have Fun", section: 0, lineMessage: 1 },
  { type: "J", rotation: 2, x: 6, label: "Empower Others", section: 0, lineMessage: 2 },
  { type: "O", rotation: 0, x: 0, label: "Make Ideas Real", section: 0, lineMessage: 3 },
  { type: "T", rotation: 0, x: 4, label: "Commit to Excellence", section: 0, lineMessage: 4 },
  { type: "S", rotation: 0, x: 2, label: "Seek Simplicity", section: 0, lineMessage: 5 },
  { type: "Z", rotation: 0, x: 6, label: "Be Accountable", section: 0, lineMessage: 6 },
  { type: "I", rotation: 1, x: 7, label: "Lead by Example", section: 0, lineMessage: 7 },
  { type: "S", rotation: 0, x: 0, label: "Fail to Succeed", section: 0, lineMessage: 8 },
  { type: "J", rotation: 2, x: 6, label: "Thrive in Ambiguity", section: 0, lineMessage: 9 },
  { type: "L", rotation: 2, x: 0, label: "Curious", section: 1, lineMessage: 10 },
  { type: "T", rotation: 2, x: 4, label: "Playful", section: 1, lineMessage: 11 },
  { type: "O", rotation: 0, x: 6, label: "Freaky", section: 1, lineMessage: 12 },
  { type: "Z", rotation: 0, x: 1, label: "Funny", section: 1, lineMessage: 13 },
  { type: "I", rotation: 0, x: 3, label: "Fast-minded", section: 1, lineMessage: 14 },
  { type: "J", rotation: 2, x: 7, label: "Adventurous", section: 1, lineMessage: 15 },
  { type: "L", rotation: 2, x: 0, label: "Empathetic", section: 1, lineMessage: 16 },
  { type: "I", rotation: 0, x: 3, label: "Good-Hearted", section: 1, lineMessage: 17 },
  { type: "T", rotation: 2, x: 0, label: "Passionate", section: 1, lineMessage: 18 },
  { type: "O", rotation: 0, x: 4, label: "Creative", section: 2, lineMessage: 19 },
  { type: "Z", rotation: 0, x: 2, label: "Visionary", section: 2, lineMessage: 20 },
  { type: "T", rotation: 0, x: 7, label: "Thinker", section: 2, lineMessage: 21 },
  { type: "S", rotation: 0, x: 0, label: "Innovator", section: 2, lineMessage: 22 },
  { type: "L", rotation: 2, x: 4, label: "Techie", section: 2, lineMessage: 23 },
  { type: "J", rotation: 2, x: 7, label: "Investigator", section: 2, lineMessage: 24 },
  { type: "O", rotation: 0, x: 4, label: "Hacker", section: 2, lineMessage: 25 },
  { type: "S", rotation: 0, x: 2, label: "Lifelong-Learner", section: 2, lineMessage: 26 },
  { type: "Z", rotation: 0, x: 7, label: "Builder", section: 2, lineMessage: 27 },
  { type: "T", rotation: 2, x: 0, label: "Discipline", section: 3, lineMessage: 28 },
  { type: "J", rotation: 2, x: 7, label: "Determined", section: 3, lineMessage: 29 },
  { type: "L", rotation: 2, x: 4, label: "Consistent", section: 3, lineMessage: 30 },
  { type: "I", rotation: 0, x: 0, label: "Hyperfocus", section: 3, lineMessage: 31 },
  { type: "I", rotation: 0, x: 4, label: "Human-centered", section: 3, lineMessage: 32 },
  { type: "L", rotation: 2, x: 0, label: "Challenge-Driven", section: 3, lineMessage: 33 },
  { type: "O", rotation: 0, x: 7, label: "Adaptability", section: 3, lineMessage: 34 },
  { type: "Z", rotation: 1, x: 2, label: "Problem-Solving", section: 3, lineMessage: 35 },
  { type: "S", rotation: 1, x: 5, label: "Reliable", section: 3, lineMessage: 36 },
  { type: "I", rotation: 1, x: 3, label: "THINKER", section: 4, lineMessage: 37 },
  { type: "Z", rotation: 1, x: 2, label: "MAKER", section: 4, lineMessage: 38 },
  { type: "T", rotation: 0, x: 7, label: "HACKER", section: 4, lineMessage: 39 },
  { type: "L", rotation: 2, x: 0, label: "LEARNER", section: 4, lineMessage: 40 }
];

console.log(`Testing with ${SCRIPT.length} pieces - LEARNER at x=3`);

function createBoard() {
  return Array(20).fill(null).map(() => Array(10).fill(0));
}

function collision(board, shape, x, y) {
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      if (shape[row][col]) {
        const boardX = x + col;
        const boardY = y + row;
        
        // Check bounds
        if (boardX < 0 || boardX >= 10 || boardY >= 20) {
          return true;
        }
        
        // Check existing blocks (only if within bounds)
        if (boardY >= 0 && board[boardY][boardX]) {
          return true;
        }
      }
    }
  }
  return false;
}

function lockPiece(board, shape, x, y) {
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      if (shape[row][col]) {
        const boardY = y + row;
        const boardX = x + col;
        if (boardY >= 0 && boardY < 20 && boardX >= 0 && boardX < 10) {
          board[boardY][boardX] = 1;
        }
      }
    }
  }
}

function clearLines(board) {
  let linesCleared = 0;
  for (let y = 19; y >= 0; y--) {
    if (board[y].every(cell => cell === 1)) {
      board.splice(y, 1);
      board.unshift(Array(10).fill(0));
      linesCleared++;
      y++; // Check same row again
    }
  }
  return linesCleared;
}

function getMaxHeight(board) {
  for (let y = 0; y < 20; y++) {
    if (board[y].some(cell => cell === 1)) {
      return 20 - y;
    }
  }
  return 0;
}

function visualizeBoard(board, highlight = null) {
  console.log('\n┌' + '──'.repeat(10) + '┐');
  for (let y = 0; y < 20; y++) {
    let row = '│';
    for (let x = 0; x < 10; x++) {
      if (highlight && y >= highlight.y && y < highlight.y + 4 && 
          x >= highlight.x && x < highlight.x + 4) {
        const shapeRow = y - highlight.y;
        const shapeCol = x - highlight.x;
        if (highlight.shape[shapeRow][shapeCol]) {
          row += '██';
          continue;
        }
      }
      row += board[y][x] ? '▓▓' : '  ';
    }
    row += '│';
    console.log(row);
  }
  console.log('└' + '──'.repeat(10) + '┘');
}

function validateSolution() {
  console.log('🔍 Validating 40-piece solution...\n');
  
  const board = createBoard();
  let totalLinesCleared = 0;
  let errors = [];
  
  for (let i = 0; i < SCRIPT.length; i++) {
    const move = SCRIPT[i];
    const shape = SHAPES[move.type][move.rotation];
    
    console.log(`\n[${i + 1}/40] ${move.label} (${move.type}, rot=${move.rotation}, x=${move.x})`);
    
    // Find landing position
    let y = 0;
    while (!collision(board, shape, move.x, y + 1)) {
      y++;
    }
    
    // Check if piece can be placed
    if (collision(board, shape, move.x, y)) {
      errors.push({
        piece: i + 1,
        label: move.label,
        type: move.type,
        rotation: move.rotation,
        x: move.x,
        error: 'COLLISION - Piece cannot be placed!'
      });
      console.log(`❌ COLLISION at piece #${i + 1}! Cannot place ${move.type} at x=${move.x}, rotation=${move.rotation}`);
      visualizeBoard(board, { shape, x: move.x, y });
      break;
    }
    
    // Lock the piece
    lockPiece(board, shape, move.x, y);
    
    // Clear lines
    const linesCleared = clearLines(board);
    totalLinesCleared += linesCleared;
    
    const height = getMaxHeight(board);
    console.log(`  Landed at y=${y}, cleared ${linesCleared} lines, height=${height}/20`);
    
    if (linesCleared > 0) {
      console.log(`  ✨ Cleared ${linesCleared} line(s)! Total: ${totalLinesCleared}`);
    }
    
    if (height > 18) {
      errors.push({
        piece: i + 1,
        label: move.label,
        error: `Height too high: ${height}/20 - approaching game over!`
      });
      console.log(`⚠️  WARNING: Height is ${height}/20`);
    }
  }
  
  console.log('\n' + '═'.repeat(60));
  console.log('📊 VALIDATION RESULTS');
  console.log('═'.repeat(60));
  console.log(`Total pieces: ${SCRIPT.length}`);
  console.log(`Total lines cleared: ${totalLinesCleared}`);
  console.log(`Final height: ${getMaxHeight(board)}/20`);
  console.log(`Errors found: ${errors.length}`);
  
  if (errors.length > 0) {
    console.log('\n❌ VALIDATION FAILED\n');
    errors.forEach(err => {
      console.log(`Piece #${err.piece} (${err.label}):`, err.error);
      if (err.type) {
        console.log(`  Type: ${err.type}, Rotation: ${err.rotation}, X: ${err.x}`);
      }
    });
    console.log('\n🔧 Final board state:');
    visualizeBoard(board);
    return false;
  } else {
    console.log('\n✅ VALIDATION PASSED');
    console.log('All pieces placed successfully!');
    console.log('\n📋 Final board state:');
    visualizeBoard(board);
    
    // Check column coverage
    const columnFills = Array(10).fill(0);
    for (let y = 0; y < 20; y++) {
      for (let x = 0; x < 10; x++) {
        if (board[y][x]) columnFills[x]++;
      }
    }
    console.log('\n📊 Column coverage:');
    for (let x = 0; x < 10; x++) {
      const bar = '█'.repeat(Math.ceil(columnFills[x] / 2));
      console.log(`Col ${x}: ${bar} (${columnFills[x]} blocks)`);
    }
    
    return true;
  }
}

validateSolution();
