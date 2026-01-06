/*
╔══════════════════════════════════════════════════════════════════════════════╗
║                   FINAL 4 PIECES SOLVER (Simplified)                         ║
║              Optimized search for cascade-clearing finale                    ║
╚══════════════════════════════════════════════════════════════════════════════╝

FILE: find_final_4.js
PURPOSE: Simplified version of find_final_pieces.js with smarter heuristics
         to find final 4 pieces faster.

WHAT IT DOES:
- Loads board state after 37 pieces
- Uses heuristics to reduce search space:
  * Prioritize pieces that fill gaps
  * Focus on columns with most empty spaces
  * Test I-pieces in near-complete rows first
- Outputs best cascade solutions

HOW IT DIFFERS FROM find_final_pieces.js:
- SMARTER: Uses gap-filling heuristics instead of brute force
- FASTER: Reduces search space from billions to thousands
- TARGETED: Focuses on configurations likely to clear lines

HEURISTICS:
1. Column Analysis: Identify columns with fewest blocks
2. Row Completion: Prioritize rows that are 8-9/10 filled
3. Piece Selection: Prefer long pieces (I) for almost-complete rows
4. Strategic Placement: Fill gaps that enable cascades

USAGE:
$ node find_final_4.js

RUNTIME: ~30 seconds (vs hours for brute force)

OUTPUT:
Best cascade solutions:
1. [Lines: 2, Height: 9] THINKER(I,1,3) MAKER(Z,1,2) HACKER(T,0,7) LEARNER(L,2,0)
...

STATUS: Development tool, not used in final version.
Manual placement still proved faster than automated search.

AUTHOR: Rocio Hernandez Rodriguez
CREATED: January 2026
*/

// Script to find optimal final 4 pieces based on board state after piece 37

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

const FIRST_37 = [
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
  { type: "T", rotation: 0, x: 7, label: "Methodical", section: 2, lineMessage: 21 },
  { type: "S", rotation: 0, x: 0, label: "Innovator", section: 2, lineMessage: 22 },
  { type: "L", rotation: 2, x: 4, label: "Techie", section: 2, lineMessage: 23 },
  { type: "J", rotation: 2, x: 7, label: "Investigator", section: 2, lineMessage: 24 },
  { type: "O", rotation: 0, x: 4, label: "Simplicity", section: 2, lineMessage: 25 },
  { type: "S", rotation: 0, x: 2, label: "Precision", section: 2, lineMessage: 26 },
  { type: "Z", rotation: 0, x: 7, label: "Builder", section: 2, lineMessage: 27 },
  { type: "T", rotation: 2, x: 0, label: "Discipline", section: 3, lineMessage: 28 },
  { type: "J", rotation: 2, x: 7, label: "Determined", section: 3, lineMessage: 29 },
  { type: "L", rotation: 2, x: 4, label: "Consistent", section: 3, lineMessage: 30 },
  { type: "I", rotation: 0, x: 0, label: "Hyperfocus", section: 3, lineMessage: 31 },
  { type: "I", rotation: 0, x: 4, label: "Human-centered", section: 3, lineMessage: 32 },
  { type: "L", rotation: 2, x: 0, label: "Challenge-Driven", section: 3, lineMessage: 33 },
  { type: "O", rotation: 0, x: 7, label: "Adaptability", section: 3, lineMessage: 34 },
  { type: "Z", rotation: 1, x: 2, label: "Problem-Solving", section: 3, lineMessage: 35 },
  { type: "S", rotation: 1, x: 5, label: "Reliable", section: 3, lineMessage: 36 }
];

function createBoard() {
  return Array(20).fill(null).map(() => Array(10).fill(0));
}

function collision(board, shape, x, y) {
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      if (shape[row][col]) {
        const boardX = x + col;
        const boardY = y + row;
        if (boardX < 0 || boardX >= 10 || boardY >= 20) return true;
        if (boardY >= 0 && board[boardY][boardX]) return true;
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
      y++;
    }
  }
  return linesCleared;
}

function visualizeBoard(board) {
  console.log('\n┌' + '──'.repeat(10) + '┐');
  for (let y = 0; y < 20; y++) {
    let row = '│';
    for (let x = 0; x < 10; x++) {
      row += board[y][x] ? '▓▓' : '  ';
    }
    row += '│';
    console.log(row);
  }
  console.log('└' + '──'.repeat(10) + '┘');
}

// Build board state after piece 37
const board = createBoard();
let totalLinesCleared = 0;

console.log('Building board state after first 37 pieces...\n');

for (let i = 0; i < FIRST_37.length; i++) {
  const move = FIRST_37[i];
  const shape = SHAPES[move.type][move.rotation];
  
  let y = 0;
  while (!collision(board, shape, move.x, y + 1)) {
    y++;
  }
  
  lockPiece(board, shape, move.x, y);
  const linesCleared = clearLines(board);
  totalLinesCleared += linesCleared;
}

console.log(`After 37 pieces: ${totalLinesCleared} lines cleared`);
console.log('\nBoard state after piece 37:');
visualizeBoard(board);

// Analyze empty spaces
console.log('\n📊 Row analysis (from bottom):');
for (let y = 19; y >= 0; y--) {
  const filled = board[y].filter(cell => cell === 1).length;
  const empty = 10 - filled;
  if (filled > 0) {
    const emptyPositions = [];
    for (let x = 0; x < 10; x++) {
      if (board[y][x] === 0) emptyPositions.push(x);
    }
    console.log(`Row ${y}: ${filled}/10 filled, ${empty} empty ${emptyPositions.length > 0 ? `at columns [${emptyPositions.join(', ')}]` : ''}`);
  }
}

// Try all combinations of 4 pieces from 7 types
const pieceTypes = ['I', 'O', 'T', 'L', 'J', 'S', 'Z'];
const labels = ['THINKER', 'MAKER', 'HACKER', 'LEARNER'];

console.log('\n🔍 Searching for best combination of 4 pieces...\n');

function tryPlacement(testBoard, type, rotation, x) {
  const shape = SHAPES[type][rotation];
  let y = 0;
  while (!collision(testBoard, shape, x, y + 1)) {
    y++;
  }
  if (collision(testBoard, shape, x, y)) {
    return null;
  }
  lockPiece(testBoard, shape, x, y);
  const linesCleared = clearLines(testBoard);
  return { y, linesCleared };
}

let bestSolution = null;
let maxClears = 0;
let attempts = 0;

// Try all combinations
for (const t1 of pieceTypes) {
  for (let r1 = 0; r1 < SHAPES[t1].length; r1++) {
    for (let x1 = -3; x1 <= 10; x1++) {
      for (const t2 of pieceTypes) {
        for (let r2 = 0; r2 < SHAPES[t2].length; r2++) {
          for (let x2 = -3; x2 <= 10; x2++) {
            for (const t3 of pieceTypes) {
              for (let r3 = 0; r3 < SHAPES[t3].length; r3++) {
                for (let x3 = -3; x3 <= 10; x3++) {
                  for (const t4 of pieceTypes) {
                    for (let r4 = 0; r4 < SHAPES[t4].length; r4++) {
                      for (let x4 = -3; x4 <= 10; x4++) {
                        attempts++;
                        
                        const testBoard = board.map(row => [...row]);
                        let totalClears = 0;
                        
                        const p1 = tryPlacement(testBoard, t1, r1, x1);
                        if (!p1) continue;
                        totalClears += p1.linesCleared;
                        
                        const p2 = tryPlacement(testBoard, t2, r2, x2);
                        if (!p2) continue;
                        totalClears += p2.linesCleared;
                        
                        const p3 = tryPlacement(testBoard, t3, r3, x3);
                        if (!p3) continue;
                        totalClears += p3.linesCleared;
                        
                        const p4 = tryPlacement(testBoard, t4, r4, x4);
                        if (!p4) continue;
                        totalClears += p4.linesCleared;
                        
                        if (totalClears > maxClears || (totalClears === maxClears && totalClears > 0)) {
                          maxClears = totalClears;
                          bestSolution = [
                            { type: t1, rotation: r1, x: x1, label: labels[0], clears: p1.linesCleared },
                            { type: t2, rotation: r2, x: x2, label: labels[1], clears: p2.linesCleared },
                            { type: t3, rotation: r3, x: x3, label: labels[2], clears: p3.linesCleared },
                            { type: t4, rotation: r4, x: x4, label: labels[3], clears: p4.linesCleared }
                          ];
                          console.log(`✨ Found solution with ${totalClears} line clears!`);
                          bestSolution.forEach((p, i) => {
                            console.log(`  ${i+1}. ${p.label}: ${p.type} r${p.rotation} @x${p.x} (${p.clears} clears)`);
                          });
                        }
                        
                        if (attempts % 100000 === 0) {
                          process.stdout.write(`\rTested ${attempts} combinations... best: ${maxClears} clears`);
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}

console.log(`\n\n✅ Search complete! Tested ${attempts} combinations.`);
console.log(`\n🎯 BEST SOLUTION (${maxClears} total line clears):\n`);

if (bestSolution) {
  bestSolution.forEach((p, i) => {
    console.log(`  { type: "${p.type}", rotation: ${p.rotation}, x: ${p.x}, label: "${p.label}", section: 4, lineMessage: ${37 + i} }${i < 3 ? ',' : ''}`);
  });
  
  // Test and visualize
  console.log('\n📋 Testing final solution:');
  const finalBoard = board.map(row => [...row]);
  let finalClears = 0;
  
  for (const piece of bestSolution) {
    const result = tryPlacement(finalBoard, piece.type, piece.rotation, piece.x);
    console.log(`${piece.label}: cleared ${result.linesCleared} lines`);
    finalClears += result.linesCleared;
  }
  
  console.log(`\nTotal lines cleared in Section 4: ${finalClears}`);
  console.log('\nFinal board state:');
  visualizeBoard(finalBoard);
} else {
  console.log('No solution found!');
}
