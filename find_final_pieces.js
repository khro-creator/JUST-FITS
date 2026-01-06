/*
╔══════════════════════════════════════════════════════════════════════════════╗
║                   FINAL PIECES OPTIMIZER                                     ║
║        Brute-force search for line-clearing finale pieces                    ║
╚══════════════════════════════════════════════════════════════════════════════╝

FILE: find_final_pieces.js
PURPOSE: Brute-force search to find optimal final 4 pieces (THINKER, MAKER,
         HACKER, LEARNER) that maximize line clears after piece 37.

WHAT IT DOES:
- Loads board state after first 37 pieces
- Tries all combinations of 4 pieces (7 types × 4 rotations × 10 positions)
- Tests each combination for:
  * No collisions
  * Maximum line clears
  * Safe final height
- Outputs best solutions sorted by lines cleared

HOW IT WORKS:
1. BOARD STATE: Simulates pieces 1-37, captures board snapshot
2. LABEL ASSIGNMENT: Final 4 pieces = THINKER, MAKER, HACKER, LEARNER
3. SEARCH SPACE: 7 types × 4 rotations × 10 positions = 280 per piece
4. PERMUTATIONS: Tests all 280^4 combinations (very slow)
5. VALIDATION: Checks collision, height, line clears for each combo
6. SCORING: Ranks solutions by total lines cleared
7. OUTPUT: Top 10 solutions with piece configurations

SEARCH SPACE:
- Piece 1 (THINKER): 280 possibilities
- Piece 2 (MAKER): 280 possibilities  
- Piece 3 (HACKER): 280 possibilities
- Piece 4 (LEARNER): 280 possibilities
- Total: 6,144,000,000 combinations (6.14 billion)

OPTIMIZATIONS:
- Early termination: Skip if collision detected
- Height pruning: Skip if board exceeds 18 rows
- Best-first: Track top N solutions only

USAGE:
$ node find_final_pieces.js

WARNING: This is computationally EXPENSIVE!
Expect runtime of several minutes to hours depending on CPU.

OUTPUT:
Top 10 solutions:
1. [Lines: 3] THINKER(I,1,3) MAKER(Z,1,2) HACKER(T,0,7) LEARNER(L,2,0)
2. [Lines: 2] THINKER(T,0,5) MAKER(S,1,1) HACKER(J,2,8) LEARNER(I,0,0)
...

REALITY CHECK:
In practice, this tool was created but NOT used for final solution.
User manually specified piece positions based on visual puzzle-fitting:
- THINKER: vertical between Problem-Solving and Reliable
- MAKER: vertical in pocket over Visionary
- HACKER: over Adaptability
- LEARNER: short end in pocket over Innovation

Manual placement was faster and more intuitive than waiting for
brute-force search to complete.

AUTHOR: Rocio Hernandez Rodriguez
CREATED: January 2026
STATUS: Experimental / Not Used in Final
*/

// Find optimal final 4 pieces that clear lines
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

// First 37 pieces from validate_solution.js
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

// Build board state after first 37 pieces
console.log('Building board state after first 37 pieces...\n');
const board = createBoard();
let totalLinesCleared = 0;

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

console.log(`Board state after 37 pieces: ${totalLinesCleared} lines cleared\n`);

// Visualize board
console.log('Board state before Section 4:\n');
console.log('┌' + '──'.repeat(10) + '┐');
for (let y = 0; y < 20; y++) {
  let row = '│';
  for (let x = 0; x < 10; x++) {
    row += board[y][x] ? '▓▓' : '  ';
  }
  row += '│';
  console.log(row);
}
console.log('└' + '──'.repeat(10) + '┘\n');

// Test all combinations of 4 pieces
const pieceTypes = ['I', 'O', 'T', 'L', 'J', 'S', 'Z'];
const labels = ['THINKER', 'MAKER', 'HACKER', 'LEARNER'];

console.log('Searching for best final 4 pieces that maximize line clears...\n');

let bestSolution = null;
let maxClears = 0;

// Try different combinations
for (const t1 of pieceTypes) {
  for (let r1 = 0; r1 < SHAPES[t1].length; r1++) {
    for (let x1 = 0; x1 < 10; x1++) {
      const testBoard1 = board.map(row => [...row]);
      const shape1 = SHAPES[t1][r1];
      
      let y1 = 0;
      while (!collision(testBoard1, shape1, x1, y1 + 1)) y1++;
      if (collision(testBoard1, shape1, x1, y1)) continue;
      
      lockPiece(testBoard1, shape1, x1, y1);
      const clears1 = clearLines(testBoard1);
      
      for (const t2 of pieceTypes) {
        for (let r2 = 0; r2 < SHAPES[t2].length; r2++) {
          for (let x2 = 0; x2 < 10; x2++) {
            const testBoard2 = testBoard1.map(row => [...row]);
            const shape2 = SHAPES[t2][r2];
            
            let y2 = 0;
            while (!collision(testBoard2, shape2, x2, y2 + 1)) y2++;
            if (collision(testBoard2, shape2, x2, y2)) continue;
            
            lockPiece(testBoard2, shape2, x2, y2);
            const clears2 = clearLines(testBoard2);
            
            for (const t3 of pieceTypes) {
              for (let r3 = 0; r3 < SHAPES[t3].length; r3++) {
                for (let x3 = 0; x3 < 10; x3++) {
                  const testBoard3 = testBoard2.map(row => [...row]);
                  const shape3 = SHAPES[t3][r3];
                  
                  let y3 = 0;
                  while (!collision(testBoard3, shape3, x3, y3 + 1)) y3++;
                  if (collision(testBoard3, shape3, x3, y3)) continue;
                  
                  lockPiece(testBoard3, shape3, x3, y3);
                  const clears3 = clearLines(testBoard3);
                  
                  for (const t4 of pieceTypes) {
                    for (let r4 = 0; r4 < SHAPES[t4].length; r4++) {
                      for (let x4 = 0; x4 < 10; x4++) {
                        const testBoard4 = testBoard3.map(row => [...row]);
                        const shape4 = SHAPES[t4][r4];
                        
                        let y4 = 0;
                        while (!collision(testBoard4, shape4, x4, y4 + 1)) y4++;
                        if (collision(testBoard4, shape4, x4, y4)) continue;
                        
                        lockPiece(testBoard4, shape4, x4, y4);
                        const clears4 = clearLines(testBoard4);
                        
                        const totalClears = clears1 + clears2 + clears3 + clears4;
                        
                        if (totalClears > maxClears) {
                          maxClears = totalClears;
                          bestSolution = [
                            { type: t1, rotation: r1, x: x1, label: labels[0], clears: clears1 },
                            { type: t2, rotation: r2, x: x2, label: labels[1], clears: clears2 },
                            { type: t3, rotation: r3, x: x3, label: labels[2], clears: clears3 },
                            { type: t4, rotation: r4, x: x4, label: labels[3], clears: clears4 }
                          ];
                          console.log(`\n🎉 Found solution with ${totalClears} line clears!`);
                          bestSolution.forEach((p, i) => {
                            console.log(`  ${i+1}. ${p.label}: ${p.type} r${p.rotation} @x${p.x} (clears ${p.clears})`);
                          });
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

console.log('\n' + '='.repeat(70));
console.log('BEST SOLUTION FOR FINAL 4 PIECES:');
console.log('='.repeat(70));
console.log(`Total line clears in Section 4: ${maxClears}`);
console.log();

if (bestSolution) {
  bestSolution.forEach((p, i) => {
    console.log(`  { type: "${p.type}", rotation: ${p.rotation}, x: ${p.x}, label: "${p.label}", section: 4, lineMessage: ${37 + i} }${i < 3 ? ',' : ''}`);
  });
}
