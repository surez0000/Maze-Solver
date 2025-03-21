const canvas = document.getElementById("mazeCanvas");
const ctx = canvas.getContext("2d");
const rows = 21, cols = 21, cellSize = 25;
canvas.width = cols * cellSize;
canvas.height = rows * cellSize;

let grid = [];
let start = { x: 0, y: 0 };
let end = { x: cols - 1, y: rows - 1 };

function generateMaze() {
    grid = Array.from({ length: rows }, () => Array(cols).fill(1));

    function carve(x, y) {
        const directions = [[0,1], [1,0], [0,-1], [-1,0]].sort(() => Math.random() - 0.5);
        grid[y][x] = 0;

        for (let [dx, dy] of directions) {
            let nx = x + dx * 2, ny = y + dy * 2;
            if (nx >= 0 && ny >= 0 && nx < cols && ny < rows && grid[ny][nx] === 1) {
                grid[y + dy][x + dx] = 0;
                carve(nx, ny);
            }
        }
    }

    carve(0, 0);
    start = { x: 0, y: 0 };
    end = { x: cols - 1, y: rows - 1 };
    drawMaze();
}

function drawMaze() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
            ctx.fillStyle = grid[y][x] === 1 ? "#33334d" : "#f5f5f5";
            ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
        }
    }
    ctx.fillStyle = "#00ff00";  // Start
    ctx.fillRect(start.x * cellSize, start.y * cellSize, cellSize, cellSize);
    ctx.fillStyle = "#ff4444";  // End
    ctx.fillRect(end.x * cellSize, end.y * cellSize, cellSize, cellSize);
}

function solveMaze() {
    const queue = [{ x: start.x, y: start.y, path: [] }];
    const visited = new Set();
    visited.add(`${start.x},${start.y}`);

    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function bfs() {
        while (queue.length > 0) {
            let { x, y, path } = queue.shift();

            if (x === end.x && y === end.y) {
                drawSolution(path);
                return;
            }

            for (let [dx, dy] of [[0,1], [1,0], [0,-1], [-1,0]]) {
                let nx = x + dx, ny = y + dy;
                if (nx >= 0 && ny >= 0 && nx < cols && ny < rows && grid[ny][nx] === 0 && !visited.has(`${nx},${ny}`)) {
                    visited.add(`${nx},${ny}`);
                    queue.push({ x: nx, y: ny, path: [...path, { x: nx, y: ny }] });

                    // Draw exploration step with animation
                    ctx.fillStyle = "lightblue";
                    ctx.fillRect(nx * cellSize, ny * cellSize, cellSize, cellSize);
                    await delay(10);  // Animation speed
                }
            }
        }
    }
    bfs();
}

function drawSolution(path) {
    ctx.fillStyle = "#4caf50";  // Green path
    path.forEach(({ x, y }) => ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize));
}

generateMaze(); // Generate initial maze