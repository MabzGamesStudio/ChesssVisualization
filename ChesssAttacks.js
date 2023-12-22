class ChesssAttacks {
    constructor(board) {
        this.board = board;
        this.possiblePawnMoves = [
            [1, 1],
            [1, -1],
            [-1, 1],
            [-1, -1]
        ];
        this.possibleKingMoves = [
            [-1, -1],
            [-1, 0],
            [-1, 1],
            [0, -1],
            [0, 1],
            [1, -1],
            [1, 0],
            [1, 1]
        ];
        this.possibleBishopMoves = [...Array(15)].map((_, i) => [i - 7, i - 7]).concat([...Array(15)].map((_, i) => [7 - i, i - 7]));
        this.possibleRookMoves = [...Array(15)].map((_, i) => [i - 7, 0]).concat([...Array(15)].map((_, i) => [0, i - 7]));
        this.possibleQueenMoves = [...this.possibleBishopMoves, ...this.possibleRookMoves];
        this.possibleKnightMoves = [
            [1, 2],
            [2, 1],
            [-1, 2],
            [2, -1],
            [-2, 1],
            [1, -2],
            [-1, -2],
            [-2, -1]
        ];

        // Remove the move offset (0, 0) so a move is valid
        this.possibleKingMoves = this.possibleKingMoves.filter(move => move[0] !== 0 || move[1] !== 0);
        this.possibleBishopMoves = this.possibleBishopMoves.filter(move => move[0] !== 0 || move[1] !== 0);
        this.possibleRookMoves = this.possibleRookMoves.filter(move => move[0] !== 0 || move[1] !== 0);
        this.possibleQueenMoves = this.possibleQueenMoves.filter(move => move[0] !== 0 || move[1] !== 0);

        // Cache the player attacking squares
        this.p1AttackingSquares = null;
        this.p2AttackingSquares = null;
    }

    getP1AttackingSquares() {
        if (this.p1AttackingSquares !== null) {
            return this.p1AttackingSquares;
        }

        const attackingSquares = Array.from({ length: 8 }, () => Array(8).fill(0));

        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                if (this.board[i][j] !== '' && this.spotIsP1([i, j])) {
                    const piece = this.board[i][j].toLowerCase();

                    // King moves
                    if (piece === 'k') {
                        const possibleMoves = this.possibleKingMoves.map(([x, y]) => [x + i, y + j]);
                        possibleMoves.forEach(possibleMove => {
                            if (this.spotIsOnBoard(possibleMove)) {
                                const newBoard = this.deepCopyBoard(this.board);
                                newBoard[possibleMove[0]][possibleMove[1]] = 'k';
                                newBoard[i][j] = '';
                                const moveState = new ChesssAttacks(newBoard);
                                if (!moveState.isPlayerInCheck(true)) {
                                    attackingSquares[possibleMove[0]][possibleMove[1]] += 1;
                                }
                            }
                        });
                    }

                    // Pawn moves
                    else if (piece === 'p') {
                        const possibleMoves = this.possiblePawnMoves.map(([x, y]) => [x + i, y + j]);
                        possibleMoves.forEach(possibleMove => {
                            if (this.spotIsOnBoard(possibleMove) && possibleMove[0] < i) {
                                const newBoard = this.deepCopyBoard(this.board);
                                newBoard[possibleMove[0]][possibleMove[1]] = 'p';
                                newBoard[i][j] = '';
                                const moveState = new ChesssAttacks(newBoard);
                                if (!moveState.isPlayerInCheck(true)) {
                                    attackingSquares[possibleMove[0]][possibleMove[1]] += 1;
                                }
                            }
                        });
                    }

                    // Queen moves
                    else if (piece === 'q') {
                        const possibleMoves = this.possibleQueenMoves.map(([x, y]) => [x + i, y + j]);
                        possibleMoves.forEach(possibleMove => {
                            if (this.spotIsOnBoard(possibleMove) && !this.isBlocked([i, j], possibleMove)) {
                                const newBoard = this.deepCopyBoard(this.board);
                                newBoard[possibleMove[0]][possibleMove[1]] = 'q';
                                newBoard[i][j] = '';
                                const moveState = new ChesssAttacks(newBoard);
                                if (!moveState.isPlayerInCheck(true)) {
                                    attackingSquares[possibleMove[0]][possibleMove[1]] += 1;
                                }
                            }
                        });
                    }

                    // Rook moves
                    else if (piece === 'r') {
                        const possibleMoves = this.possibleRookMoves.map(([x, y]) => [x + i, y + j]);
                        possibleMoves.forEach(possibleMove => {
                            if (this.spotIsOnBoard(possibleMove) && !this.isBlocked([i, j], possibleMove)) {
                                const newBoard = this.deepCopyBoard(this.board);
                                newBoard[possibleMove[0]][possibleMove[1]] = 'r';
                                newBoard[i][j] = '';
                                const moveState = new ChesssAttacks(newBoard);
                                if (!moveState.isPlayerInCheck(true)) {
                                    attackingSquares[possibleMove[0]][possibleMove[1]] += 1;
                                }
                            }
                        });
                    }

                    // Bishop moves
                    else if (piece === 'b') {
                        const possibleMoves = this.possibleBishopMoves.map(([x, y]) => [x + i, y + j]);
                        possibleMoves.forEach(possibleMove => {
                            if (this.spotIsOnBoard(possibleMove) && !this.isBlocked([i, j], possibleMove)) {
                                const newBoard = this.deepCopyBoard(this.board);
                                newBoard[possibleMove[0]][possibleMove[1]] = 'b';
                                newBoard[i][j] = '';
                                const moveState = new ChesssAttacks(newBoard);
                                if (!moveState.isPlayerInCheck(true)) {
                                    attackingSquares[possibleMove[0]][possibleMove[1]] += 1;
                                }
                            }
                        });
                    }

                    // Knight moves
                    else if (piece === 'n') {
                        const possibleMoves = this.possibleKnightMoves.map(([x, y]) => [x + i, y + j]);
                        possibleMoves.forEach(possibleMove => {
                            if (this.spotIsOnBoard(possibleMove)) {
                                const newBoard = this.deepCopyBoard(this.board);
                                newBoard[possibleMove[0]][possibleMove[1]] = 'n';
                                newBoard[i][j] = '';
                                const moveState = new ChesssAttacks(newBoard);
                                if (!moveState.isPlayerInCheck(true)) {
                                    attackingSquares[possibleMove[0]][possibleMove[1]] += 1;
                                }
                            }
                        });
                    }
                }
            }
        }

        this.p1AttackingSquares = attackingSquares;
        return attackingSquares;
    }

    getP2AttackingSquares() {
        if (this.p2AttackingSquares !== null) {
            return this.p2AttackingSquares;
        }

        const attackingSquares = Array.from({ length: 8 }, () => Array(8).fill(0));

        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                if (this.board[i][j] !== '' && this.spotIsP2([i, j])) {
                    const piece = this.board[i][j].toUpperCase();

                    // King moves
                    if (piece === 'K') {
                        const possibleMoves = this.possibleKingMoves.map(([x, y]) => [x + i, y + j]);
                        possibleMoves.forEach(possibleMove => {
                            if (this.spotIsOnBoard(possibleMove)) {
                                const newBoard = this.deepCopyBoard(this.board);
                                newBoard[possibleMove[0]][possibleMove[1]] = 'K';
                                newBoard[i][j] = '';
                                const moveState = new ChesssAttacks(newBoard);
                                if (!moveState.isPlayerInCheck(false)) {
                                    attackingSquares[possibleMove[0]][possibleMove[1]] += 1;
                                }
                            }
                        });
                    }

                    // Pawn moves
                    else if (piece === 'P') {
                        const possibleMoves = this.possiblePawnMoves.map(([x, y]) => [x + i, y + j]);
                        possibleMoves.forEach(possibleMove => {
                            if (this.spotIsOnBoard(possibleMove) && possibleMove[0] > i) {
                                const newBoard = this.deepCopyBoard(this.board);
                                newBoard[possibleMove[0]][possibleMove[1]] = 'P';
                                newBoard[i][j] = '';
                                const moveState = new ChesssAttacks(newBoard);
                                if (!moveState.isPlayerInCheck(false)) {
                                    attackingSquares[possibleMove[0]][possibleMove[1]] += 1;
                                }
                            }
                        });
                    }

                    // Queen moves
                    else if (piece === 'Q') {
                        const possibleMoves = this.possibleQueenMoves.map(([x, y]) => [x + i, y + j]);
                        possibleMoves.forEach(possibleMove => {
                            if (this.spotIsOnBoard(possibleMove) && !this.isBlocked([i, j], possibleMove)) {
                                const newBoard = this.deepCopyBoard(this.board);
                                newBoard[possibleMove[0]][possibleMove[1]] = 'Q';
                                newBoard[i][j] = '';
                                const moveState = new ChesssAttacks(newBoard);
                                if (!moveState.isPlayerInCheck(false)) {
                                    attackingSquares[possibleMove[0]][possibleMove[1]] += 1;
                                }
                            }
                        });
                    }

                    // Rook moves
                    else if (piece === 'R') {
                        const possibleMoves = this.possibleRookMoves.map(([x, y]) => [x + i, y + j]);
                        possibleMoves.forEach(possibleMove => {
                            if (this.spotIsOnBoard(possibleMove) && !this.isBlocked([i, j], possibleMove)) {
                                const newBoard = this.deepCopyBoard(this.board);
                                newBoard[possibleMove[0]][possibleMove[1]] = 'R';
                                newBoard[i][j] = '';
                                const moveState = new ChesssAttacks(newBoard);
                                if (!moveState.isPlayerInCheck(false)) {
                                    attackingSquares[possibleMove[0]][possibleMove[1]] += 1;
                                }
                            }
                        });
                    }

                    // Bishop moves
                    else if (piece === 'B') {
                        const possibleMoves = this.possibleBishopMoves.map(([x, y]) => [x + i, y + j]);
                        possibleMoves.forEach(possibleMove => {
                            if (this.spotIsOnBoard(possibleMove) && !this.isBlocked([i, j], possibleMove)) {
                                const newBoard = this.deepCopyBoard(this.board);
                                newBoard[possibleMove[0]][possibleMove[1]] = 'B';
                                newBoard[i][j] = '';
                                const moveState = new ChesssAttacks(newBoard);
                                if (!moveState.isPlayerInCheck(false)) {
                                    attackingSquares[possibleMove[0]][possibleMove[1]] += 1;
                                }
                            }
                        });
                    }

                    // Knight moves
                    else if (piece === 'N') {
                        const possibleMoves = this.possibleKnightMoves.map(([x, y]) => [x + i, y + j]);
                        possibleMoves.forEach(possibleMove => {
                            if (this.spotIsOnBoard(possibleMove)) {
                                const newBoard = this.deepCopyBoard(this.board);
                                newBoard[possibleMove[0]][possibleMove[1]] = 'N';
                                newBoard[i][j] = '';
                                const moveState = new ChesssAttacks(newBoard);
                                if (!moveState.isPlayerInCheck(false)) {
                                    attackingSquares[possibleMove[0]][possibleMove[1]] += 1;
                                }
                            }
                        });
                    }
                }
            }
        }

        this.p2AttackingSquares = attackingSquares;
        return attackingSquares;
    }

    isPlayerInCheck(isPlayer1) {

        const king = isPlayer1 ? 'k' : 'K';
        let kingPosition = null;

        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                if (this.board[i][j] == king) {
                    kingPosition = [i, j];
                    break;
                }
            }
        }

        if (kingPosition === null) {
            return false;
        }

        return this.getAttackingSquares(!isPlayer1).reduce((contains, element) => {
            return contains || (element[0] == kingPosition[0] && element[1] == kingPosition[1])
        }, false);
    }

    getAttackingSquares(isPlayer1) {
        const attackingSquares = [];

        // Check for each square for a potential piece that attacks other squares
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                if (this.board[i][j] !== '' && this.spotMatchesPlayer([i, j], isPlayer1)) {
                    const piece = this.board[i][j].toLowerCase();

                    // King moves
                    if (piece === 'k') {
                        const possibleMoves = this.possibleKingMoves.map(([x, y]) => [x + i, y + j]);
                        possibleMoves.forEach(possibleMove => {
                            if (this.spotIsOnBoard(possibleMove)) {
                                attackingSquares.push(possibleMove);
                            }
                        });
                    }

                    // Pawn moves
                    else if (piece === 'p') {
                        const possibleMoves = this.possiblePawnMoves.map(([x, y]) => [x + i, y + j]);

                        // Make sure pawn attacks are only forward
                        possibleMoves.forEach(possibleMove => {
                            if ((possibleMove[0] < i) === isPlayer1 && this.spotIsOnBoard(possibleMove)) {
                                attackingSquares.push(possibleMove);
                            }
                        });
                    }

                    // Queen moves
                    else if (piece === 'q') {
                        const possibleMoves = this.possibleQueenMoves.map(([x, y]) => [x + i, y + j]);
                        possibleMoves.forEach(possibleMove => {
                            if (this.spotIsOnBoard(possibleMove) && !this.isBlocked([i, j], possibleMove)) {
                                attackingSquares.push(possibleMove);
                            }
                        });
                    }

                    // Rook moves
                    else if (piece === 'r') {
                        const possibleMoves = this.possibleRookMoves.map(([x, y]) => [x + i, y + j]);
                        possibleMoves.forEach(possibleMove => {
                            if (this.spotIsOnBoard(possibleMove) && !this.isBlocked([i, j], possibleMove)) {
                                attackingSquares.push(possibleMove);
                            }
                        });
                    }

                    // Bishop moves
                    else if (piece === 'b') {
                        const possibleMoves = this.possibleBishopMoves.map(([x, y]) => [x + i, y + j]);
                        possibleMoves.forEach(possibleMove => {
                            if (this.spotIsOnBoard(possibleMove) && !this.isBlocked([i, j], possibleMove)) {
                                attackingSquares.push(possibleMove);
                            }
                        });
                    }

                    // Knight moves
                    else if (piece === 'n') {
                        const possibleMoves = this.possibleKnightMoves.map(([x, y]) => [x + i, y + j]);
                        possibleMoves.forEach(possibleMove => {
                            if (this.spotIsOnBoard(possibleMove)) {
                                attackingSquares.push(possibleMove);
                            }
                        });
                    }
                }
            }
        }

        // Do not need to repeat squares being attacked by multiple pieces
        return attackingSquares.filter((value, index, array) => {
            return array.indexOf(value) === index;
        });

    }

    deepCopyBoard(board) {
        return JSON.parse(JSON.stringify(board));
    }

    isBlocked(startPos, endPos) {
        if (startPos[0] === endPos[0]) {
            if (startPos[1] < endPos[1]) {
                for (let i = startPos[1] + 1; i < endPos[1]; i++) {
                    if (this.board[startPos[0]][i] !== '') {
                        return true;
                    }
                }
            } else {
                for (let i = endPos[1] + 1; i < startPos[1]; i++) {
                    if (this.board[startPos[0]][i] !== '') {
                        return true;
                    }
                }
            }
        }

        if (startPos[1] === endPos[1]) {
            if (startPos[0] < endPos[0]) {
                for (let i = startPos[0] + 1; i < endPos[0]; i++) {
                    if (this.board[i][startPos[1]] !== '') {
                        return true;
                    }
                }
            } else {
                for (let i = endPos[0] + 1; i < startPos[0]; i++) {
                    if (this.board[i][startPos[1]] !== '') {
                        return true;
                    }
                }
            }
        }

        if (startPos[0] - endPos[0] === startPos[1] - endPos[1]) {
            if (startPos[0] < endPos[0]) {
                for (let i = 1; i < endPos[0] - startPos[0]; i++) {
                    if (this.board[startPos[0] + i][startPos[1] + i] !== '') {
                        return true;
                    }
                }
            } else {
                for (let i = 1; i < startPos[0] - endPos[0]; i++) {
                    if (this.board[endPos[0] + i][endPos[1] + i] !== '') {
                        return true;
                    }
                }
            }
        }

        if (startPos[0] - endPos[0] === endPos[1] - startPos[1]) {
            if (startPos[0] < endPos[0]) {
                for (let i = 1; i < endPos[0] - startPos[0]; i++) {
                    if (this.board[startPos[0] + i][startPos[1] - i] !== '') {
                        return true;
                    }
                }
            } else {
                for (let i = 1; i < startPos[0] - endPos[0]; i++) {
                    if (this.board[endPos[0] + i][endPos[1] - i] !== '') {
                        return true;
                    }
                }
            }
        }

        return false;
    }

    spotMatchesPlayer(spot, isP1) {
        return (this.spotIsP1(spot) && isP1) || (this.spotIsP2(spot) && !isP1);
    }

    spotIsOnBoard(spot) {
        return 0 <= spot[0] && spot[0] < 8 && 0 <= spot[1] && spot[1] < 8;
    }

    spotIsP1(spot) {
        const spotChar = this.board[spot[0]][spot[1]];
        if (spotChar === '') {
            return false;
        }
        return spotChar.toLowerCase() === spotChar;
    }

    spotIsP2(spot) {
        const spotChar = this.board[spot[0]][spot[1]];
        if (spotChar === '') {
            return false;
        }
        return spotChar.toUpperCase() === spotChar;
    }

    printBoard(givenBoard) {
        let combinedString = "";
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                if (givenBoard[i][j] === '') {
                    combinedString += '0 ';
                } else {
                    combinedString += givenBoard[i][j] + ' ';
                }
            }
            combinedString += '\n';
        }
        console.log(combinedString)
    }
}