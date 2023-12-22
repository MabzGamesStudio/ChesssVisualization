let player1Color = "Red";
let player2Color = "Blue";
const startChessboard = [
    [`${player2Color}R`, `${player2Color}N`, `${player2Color}B`, `${player2Color}Q`, `${player2Color}K`, `${player2Color}B`, `${player2Color}N`, `${player2Color}R`],
    [`${player2Color}P`, `${player2Color}P`, `${player2Color}P`, `${player2Color}P`, `${player2Color}P`, `${player2Color}P`, `${player2Color}P`, `${player2Color}P`],
    ["", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", ""],
    [`${player1Color}P`, `${player1Color}P`, `${player1Color}P`, `${player1Color}P`, `${player1Color}P`, `${player1Color}P`, `${player1Color}P`, `${player1Color}P`],
    [`${player1Color}R`, `${player1Color}N`, `${player1Color}B`, `${player1Color}Q`, `${player1Color}K`, `${player1Color}B`, `${player1Color}N`, `${player1Color}R`],
];
let chessboard = deepCopyBoard(startChessboard);

let pieceImages = {};
let trashCan;

let canvasWidth = 100;
let canvasHeight = 100;

let gridSize = canvasHeight / 8;
let halfGrid = gridSize / 2;
let trashXY = [8 * gridSize + 0.5 * gridSize, 0.5 * gridSize];
let extraPiecesXY = [8 * gridSize, 1.5 * gridSize];

const WHITE = [255, 255, 255]
const GRAY = [128, 128, 128]
const BLACK = [0, 0, 0]
const LIGHT_GRAY1 = [200, 200, 200]
const LIGHT_GRAY2 = [220, 220, 220]

const DisplayMoves = {
    BOTH: 0,
    NONE: 1,
    PLAYER1: 2,
    PLAYER2: 3
};

let dragging = false;
let selectedPiece = null;
let offsetX, offsetY = 0;
let dragCoordinates = [0, 0];
let startSpot = null;
let chesssAttacks;

let displayMoveSelection = DisplayMoves.BOTH;
let setBoth, setNone, setPlayer1, setPlayer2, setClear, setReset;

function preload() {
    // Load chess piece images
    for (let color of ["Red", "Blue"]) {
        for (let piece of ["P", "R", "N", "B", "Q", "K"]) {
            let img_path = `Images/${color}${piece}.png`;  // Replace with the path to your chess piece images
            pieceImages[color + piece] = loadImage(img_path);
        }
    }

    trashCan = loadImage("Images/TrashCan.png")
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    updateCanvasSizing(windowWidth, windowHeight)

    chessboard = JSON.parse(JSON.stringify(startChessboard));

    chesssAttacks = new ChesssAttacks(convertToLowerCase(chessboard));
}

function draw() {
    noLoop();

    background(128);

    // Draw side panel
    image(trashCan, (8 * gridSize) + (0.5 * gridSize), 0.5 * gridSize, gridSize, gridSize);

    // Draw Butttons
    drawButttons();

    // Draw chessboard
    drawChessboard();

    // Draw the highlight squares
    let p1AttackSquares = Array.from({ length: 8 }, () => Array(8).fill(0));
    let p2AttackSquares = Array.from({ length: 8 }, () => Array(8).fill(0));
    if (displayMoveSelection === DisplayMoves.BOTH) {
        p1AttackSquares = chesssAttacks.getP1AttackingSquares();
        p2AttackSquares = chesssAttacks.getP2AttackingSquares();
    } else if (displayMoveSelection === DisplayMoves.PLAYER1) {
        p1AttackSquares = chesssAttacks.getP1AttackingSquares();
    } else if (displayMoveSelection === DisplayMoves.PLAYER2) {
        p2AttackSquares = chesssAttacks.getP2AttackingSquares();
    }

    drawSquares(p1AttackSquares, p2AttackSquares);
}

function windowResized() {
    updateCanvasSizing(windowWidth, windowHeight);
    resizeCanvas(windowWidth, windowHeight);
    draw();
}

function updateCanvasSizing(newWidth, newHeight) {
    canvasWidth = newWidth;
    canvasHeight = newHeight;

    gridSize = canvasHeight / 8;
    halfGrid = gridSize / 2;
    trashXY = [8 * gridSize + 0.5 * gridSize, 0.5 * gridSize];
    extraPiecesXY = [8 * gridSize, 1.5 * gridSize];

    setBoth = new Buttton(
        { x: 10 * gridSize, y: 2 * gridSize },
        "B",
        { width: gridSize / 2, height: gridSize / 2 },
        { r: 200, g: 0, b: 200 });
    setNone = new Buttton(
        { x: 10 * gridSize, y: 2.5 * gridSize },
        "N",
        { width: gridSize / 2, height: gridSize / 2 },
        { r: 255, g: 255, b: 255 });
    setPlayer1 = new Buttton(
        { x: 10.5 * gridSize, y: 2 * gridSize },
        "1",
        { width: gridSize / 2, height: gridSize / 2 },
        { r: 200, g: 0, b: 0 });
    setPlayer2 = new Buttton(
        { x: 10.5 * gridSize, y: 2.5 * gridSize },
        "2",
        { width: gridSize / 2, height: gridSize / 2 },
        { r: 0, g: 0, b: 200 });
    setClear = new Buttton(
        { x: 10 * gridSize, y: 5 * gridSize },
        "Clear",
        { width: gridSize, height: gridSize / 2 },
        { r: 255, g: 255, b: 255 });
    setReset = new Buttton(
        { x: 10 * gridSize, y: 6 * gridSize },
        "Reset",
        { width: gridSize, height: gridSize / 2 },
        { r: 255, g: 255, b: 255 });
}

function mousePressed() {

    // Check if any Butttons clicked
    if (setBoth.isMouseOver()) {
        displayMoveSelection = DisplayMoves.BOTH;
    }
    if (setNone.isMouseOver()) {
        displayMoveSelection = DisplayMoves.NONE;
    }
    if (setPlayer1.isMouseOver()) {
        displayMoveSelection = DisplayMoves.PLAYER1;
    }
    if (setPlayer2.isMouseOver()) {
        displayMoveSelection = DisplayMoves.PLAYER2;
    }
    if (setClear.isMouseOver()) {
        chessboard = Array.from({ length: 8 }, () => Array(8).fill(''));
        chesssAttacks = new ChesssAttacks(convertToLowerCase(chessboard));
    }
    if (setReset.isMouseOver()) {
        chessboard = deepCopyBoard(startChessboard);
        chesssAttacks = new ChesssAttacks(convertToLowerCase(chessboard));
    }

    const [x, y] = [mouseX, mouseY];
    const [row, col] = screenToBoard(x, y);
    startSpot = [row, col];
    const extraPiece = pickupPiece(x, y);

    if (0 <= row && row < 8 && 0 <= col && col < 8) {
        selectedPiece = chessboard[row][col];
    } else if (extraPiece !== null) {
        selectedPiece = extraPiece;
    } else {
        selectedPiece = null;
    }

    if (selectedPiece !== '' && selectedPiece !== null) {
        dragging = true;
        dragCoordinates = [x - halfGrid, y - halfGrid];
        if (0 <= row && row < 8 && 0 <= col && col < 8) {
            chessboard[row][col] = '';
        }
        [offsetX, offsetY] = [x - boardToScreen(row, col)[0], y - boardToScreen(row, col)[1]];
    }

    draw();
}

function mouseDragged() {
    const [x, y] = [mouseX, mouseY];
    dragCoordinates = [x - halfGrid, y - halfGrid];

    draw();
}

function mouseReleased() {
    const [x, y] = [mouseX, mouseY];
    if (x <= gridSize * 8) {
        const [row, col] = screenToBoard(x, y);
        chessboard[row][col] = selectedPiece;
    } else if (!trashPiece(x, y) && startSpot[0] < 8 && startSpot[1] < 8) {
        chessboard[startSpot[0]][startSpot[1]] = selectedPiece;
    }
    chesssAttacks = new ChesssAttacks(convertToLowerCase(chessboard));

    dragging = false;
    selectedPiece = null;

    draw();
}

function convertToLowerCase(oldBoard) {
    const newBoard = oldBoard.map(row => row.slice()); // Shallow copy of the array

    for (let row = 0; row < newBoard.length; row++) {
        for (let col = 0; col < newBoard[row].length; col++) {
            const piece = newBoard[row][col];

            if (piece && piece.startsWith(player1Color)) {
                newBoard[row][col] = piece.slice(-1).toLowerCase();
            } else if (piece && piece.startsWith(player2Color)) {
                newBoard[row][col] = piece.slice(-1).toUpperCase();
            }
        }
    }

    return newBoard;
}

function drawChessboard() {
    let pieceChars = ["P", "R", "N", "B", "Q", "K"];
    let pieceColors = [player1Color, player2Color];
    for (let i = 0; i < 6; i++) {
        for (let j = 0; j < 2; j++) {
            const piece = pieceColors[j] + pieceChars[i];
            const pieceXY = [extraPiecesXY[0] + gridSize * j, extraPiecesXY[1] + gridSize * i];
            image(pieceImages[piece], ...pieceXY, gridSize, gridSize);
        }
    }

    // Draw the chessboard
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const x = col * gridSize;
            const y = row * gridSize;

            // Draw chessboard square
            if ((row + col) % 2 === 0) {
                fill(LIGHT_GRAY2);
            } else {
                fill(LIGHT_GRAY1);
            }
            noStroke();
            rect(x, y, gridSize, gridSize);

            // Draw chess piece
            const piece = chessboard[row][col];
            if (piece !== '') {
                image(pieceImages[piece], x, y, gridSize, gridSize);
            }
            if (dragging) {
                image(pieceImages[selectedPiece], dragCoordinates[0], dragCoordinates[1], gridSize, gridSize)
            }
        }
    }
}

function drawSquares(p1AttackingSquares, p2AttackingSquares) {

    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            const gridNumber = p1AttackingSquares[i][j] - p2AttackingSquares[i][j];

            let fillColor = color(0);
            let alpha = 0;

            if (gridNumber === 0 && p1AttackingSquares[i][j] !== 0) {
                fillColor = color(255, 0, 255);
            } else if (gridNumber > 0 && p2AttackingSquares[i][j] !== 0) {
                fillColor = color(255, 0, 128);
            } else if (gridNumber < 0 && p1AttackingSquares[i][j] !== 0) {
                fillColor = color(128, 0, 255);
            } else if (gridNumber > 0) {
                fillColor = color(255, 0, 0);
            } else if (gridNumber < 0) {
                fillColor = color(0, 0, 255);
            }

            alpha = 40 * (p1AttackingSquares[i][j] + p2AttackingSquares[i][j]);

            if (alpha > 0) {
                fill(fillColor.levels[0], fillColor.levels[1], fillColor.levels[2], alpha);

                // Draw the square
                rect(j * gridSize, i * gridSize, gridSize, gridSize);

                // Draw the text
                textSize(14);
                fill(0);
                const textX = j * gridSize + 8;
                const textY = i * gridSize + gridSize - 8;
                text(gridNumber, textX, textY);
            }
        }
    }
}

function drawButttons() {
    stroke(0);
    setBoth.draw();
    setNone.draw();
    setPlayer1.draw();
    setPlayer2.draw();
    setClear.draw();
    setReset.draw();
}

function deepCopyBoard(board) {
    return JSON.parse(JSON.stringify(board));
}

// Additional functions
function boardToScreen(row, col) {
    return [col * gridSize, row * gridSize];
}

function screenToBoard(x, y) {
    return [Math.floor(y / gridSize), Math.floor(x / gridSize)];
}

function pickupPiece(x, y) {

    if (
        extraPiecesXY[0] <= x &&
        x <= extraPiecesXY[0] + gridSize
    ) {
        for (let i = 0; i < 6; i++) {
            const pieceChar = ["P", "R", "N", "B", "Q", "K"][i];
            if (
                extraPiecesXY[1] + gridSize * i <= y &&
                y <= extraPiecesXY[1] + gridSize * (i + 1)
            ) {
                return player1Color + pieceChar;
            }
        }
    }

    if (
        extraPiecesXY[0] + gridSize <= x &&
        x <= extraPiecesXY[0] + 2 * gridSize
    ) {
        for (let i = 0; i < 6; i++) {
            const pieceChar = ["P", "R", "N", "B", "Q", "K"][i];
            if (
                extraPiecesXY[1] + gridSize * i <= y &&
                y <= extraPiecesXY[1] + gridSize * (i + 1)
            ) {
                return player2Color + pieceChar;
            }
        }
    }

    return null;
}

function trashPiece(x, y) {
    [trashX, trashY] = trashXY
    return (trashX <= x && x <= trashX + gridSize) && (trashY <= y && y <= trashY + gridSize)
}
