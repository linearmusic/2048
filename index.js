var board;
var score = 0;
var rows = 4;
var columns = 4;

window.onload = function () {
    setGame();
};

// Initialize the game board
function setGame() {
    board = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ];

    // Create tiles dynamically
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            let tile = document.createElement("div");
            tile.id = r.toString() + "-" + c.toString();
            tile.classList.add("tile");
            document.getElementById("board").append(tile);
        }
    }
    setTwo();
    setTwo();
}

// Check if empty tiles exist
function hasEmptyTile() {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            if (board[r][c] == 0) return true;
        }
    }
    return false;
}

// Place a "2" in a random empty tile
function setTwo() {
    if (!hasEmptyTile()) return;
    let found = false;
    while (!found) {
        let r = Math.floor(Math.random() * rows);
        let c = Math.floor(Math.random() * columns);
        if (board[r][c] == 0) {
            board[r][c] = 2;
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            tile.innerText = "2";
            tile.classList.add("x2");
            found = true;
        }
    }
}

// Update the tile appearance and value
function updateTile(tile, num) {
    tile.innerText = "";
    tile.className = "tile"; // Reset class

    if (num > 0) {
        tile.innerText = num;
        if (num <= 4096) {
            tile.classList.add("x" + num.toString());
        } else {
            tile.classList.add("x8192");
        }
    }
}

// Listen for keypress events
document.addEventListener("keyup", (e) => {
    let initialScore = score;

    if (e.code === "ArrowLeft") {
        slideLeft();
    } else if (e.code === "ArrowRight") {
        slideRight();
    } else if (e.code === "ArrowUp") {
        slideUp();
    } else if (e.code === "ArrowDown") {
        slideDown();
    }

    if (!hasEmptyTile() && !canMove()) {
        document.getElementById("score").innerText = "Game Over!";
        return;
    }
    setTwo();
    document.getElementById("score").innerText = score;
});

// Check if moves are possible
function canMove() {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            if (board[r][c] === 0) return true;
            if (c < columns - 1 && board[r][c] === board[r][c + 1]) return true;
            if (r < rows - 1 && board[r][c] === board[r + 1][c]) return true;
        }
    }
    return false;
}

// Function to remove zeros from an array
function filterZero(row) {
    return row.filter(num => num !== 0);
}

// Function to handle merging and sliding logic
function slide(row) {
    row = filterZero(row);

    // Merge same numbers
    for (let i = 0; i < row.length - 1; i++) {
        if (row[i] === row[i + 1]) {
            row[i] *= 2;
            row[i + 1] = 0;
            score += row[i]; // Update score
        }
    }

    row = filterZero(row);

    // Add zeros at the end to maintain length
    while (row.length < columns) {
        row.push(0);
    }
    return row;
}

// Move tiles left
function slideLeft() {
    for (let r = 0; r < rows; r++) {
        board[r] = slide(board[r]);

        for (let c = 0; c < columns; c++) {
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            updateTile(tile, board[r][c]);
        }
    }
}

// Move tiles right
function slideRight() {
    for (let r = 0; r < rows; r++) {
        board[r].reverse();
        board[r] = slide(board[r]);
        board[r].reverse();

        for (let c = 0; c < columns; c++) {
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            updateTile(tile, board[r][c]);
        }
    }
}

// Move tiles up
function slideUp() {
    for (let c = 0; c < columns; c++) {
        let row = [board[0][c], board[1][c], board[2][c], board[3][c]];
        row = slide(row);

        for (let r = 0; r < rows; r++) {
            board[r][c] = row[r];
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            updateTile(tile, board[r][c]);
        }
    }
}

// Move tiles down
function slideDown() {
    for (let c = 0; c < columns; c++) {
        let row = [board[0][c], board[1][c], board[2][c], board[3][c]];
        row.reverse();
        row = slide(row);
        row.reverse();

        for (let r = 0; r < rows; r++) {
            board[r][c] = row[r];
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            updateTile(tile, board[r][c]);
        }
    }
}
