const cols = Number(getComputedStyle(document.documentElement).getPropertyValue('--board-cols'));
const rows = Number(getComputedStyle(document.documentElement).getPropertyValue('--board-rows'));
const holdBlockHolderHTML = document.getElementById('hold_block_holder');
const nextBlockHolderHTML = document.getElementById('next_block_holder');
let nextBlock, holdBlock, currentBlock = null;
const boardArray = [];
let gameDelay = 300;
export const getBoardArray = () => boardArray;
export const getGameDelay = () => gameDelay;
export const contentType = {
    I: "I",
    J: "J",
    L: "L",
    O: "O",
    S: "S",
    T: "T",
    Z: "Z",
    EMPTY: "EMPTY"
};
export const blocks = {
    I_BLOCK: "Block-I",
    J_BLOCK: "Block-J",
    L_BLOCK: "Block-L",
    O_BLOCK: "Block-O",
    S_BLOCK: "Block-S",
    T_BLOCK: "Block-T",
    Z_BLOCK: "Block-Z"
};
export const initBoard = () => {
    for (let x = 0; x < rows; x++) {
        for (let y = 0; y < cols; y++) {
            const field = { x: x, y: y, content: contentType.EMPTY, isMoving: false };
            boardArray.push(field);
        }
    }
    return boardArray;
};
const getRandomNumber = (min = 0, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const getRandomBlock = (prevBlock) => {
    while (true) {
        const blockValues = Object.values(blocks);
        const randIndex = getRandomNumber(0, blockValues.length - 1);
        if (blockValues[randIndex] !== prevBlock || !prevBlock)
            return blockValues[randIndex];
    }
};
const spawnNewBlock = (block) => {
    const setNewBlock = (blockPos, content) => {
        boardArray.forEach(e => {
            if (blockPos.some(p => p.x === e.x && p.y === e.y)) {
                e.content = content;
                e.isMoving = true;
            }
        });
    };
    let isPlaceOnBoard = false;
    switch (block) {
        case blocks.O_BLOCK:
            const O_POS = [{ x: 0, y: 4 }, { x: 0, y: 5 }, { x: 1, y: 4 }, { x: 1, y: 5 }];
            isPlaceOnBoard = !boardArray.some(e => e.content !== contentType.EMPTY && O_POS.some(p => p.x === e.x && p.y === e.y));
            if (isPlaceOnBoard) {
                setNewBlock(O_POS, contentType.O);
            }
            break;
        case blocks.T_BLOCK:
            const T_POS = [{ x: 0, y: 4 }, { x: 1, y: 3 }, { x: 1, y: 4 }, { x: 1, y: 5 }];
            isPlaceOnBoard = !boardArray.some(e => e.content !== contentType.EMPTY && T_POS.some(p => p.x === e.x && p.y === e.y));
            if (isPlaceOnBoard) {
                setNewBlock(T_POS, contentType.T);
            }
            break;
        case blocks.I_BLOCK:
            const I_POS = [{ x: 0, y: 3 }, { x: 0, y: 4 }, { x: 0, y: 5 }, { x: 0, y: 6 }];
            isPlaceOnBoard = !boardArray.some(e => e.content !== contentType.EMPTY && I_POS.some(p => p.x === e.x && p.y === e.y));
            if (isPlaceOnBoard) {
                setNewBlock(I_POS, contentType.I);
            }
            break;
        case blocks.J_BLOCK:
            const J_POS = [{ x: 0, y: 3 }, { x: 1, y: 3 }, { x: 1, y: 4 }, { x: 1, y: 5 }];
            isPlaceOnBoard = !boardArray.some(e => e.content !== contentType.EMPTY && J_POS.some(p => p.x === e.x && p.y === e.y));
            if (isPlaceOnBoard) {
                setNewBlock(J_POS, contentType.J);
            }
            break;
        case blocks.L_BLOCK:
            const L_POS = [{ x: 0, y: 5 }, { x: 1, y: 3 }, { x: 1, y: 4 }, { x: 1, y: 5 }];
            isPlaceOnBoard = !boardArray.some(e => e.content !== contentType.EMPTY && L_POS.some(p => p.x === e.x && p.y === e.y));
            if (isPlaceOnBoard) {
                setNewBlock(L_POS, contentType.L);
            }
            break;
        case blocks.S_BLOCK:
            const S_POS = [{ x: 1, y: 3 }, { x: 1, y: 4 }, { x: 0, y: 4 }, { x: 0, y: 5 }];
            isPlaceOnBoard = !boardArray.some(e => e.content !== contentType.EMPTY && S_POS.some(p => p.x === e.x && p.y === e.y));
            if (isPlaceOnBoard) {
                setNewBlock(S_POS, contentType.S);
            }
            break;
        case blocks.Z_BLOCK:
            const Z_POS = [{ x: 0, y: 3 }, { x: 0, y: 4 }, { x: 1, y: 4 }, { x: 1, y: 5 }];
            isPlaceOnBoard = !boardArray.some(e => e.content !== contentType.EMPTY && Z_POS.some(p => p.x === e.x && p.y === e.y));
            if (isPlaceOnBoard) {
                setNewBlock(Z_POS, contentType.Z);
            }
            break;
        default:
            break;
    }
};
const checkDownCollision = (movingBlock) => checkCollision({ down: 1, movingBlock });
const checkRightCollision = (movingBlock) => checkCollision({ right: 1, movingBlock });
const checkCollision = ({ right = 0, left = 0, up = 0, down = 0, movingBlock }) => {
    for (let part of movingBlock) {
        if (right && part.y === cols - 1) {
            return true;
        }
        if (left && part.y === 0) {
            return true;
        }
        if (up && part.x === 0) {
            return true;
        }
        if (down && part.x === rows - 1) {
            return true;
        }
        const collidingField = boardArray.find(e => e.y === part.y + right - left && e.x === part.x + down - up && !e.isMoving);
        if (collidingField && collidingField.content !== contentType.EMPTY) {
            return true;
        }
    }
    return false;
};
const moveBlockDown = () => {
    let nextBlockPos = [];
    boardArray.filter(e => e.isMoving).forEach(e => {
        nextBlockPos.push({ x: e.x + 1, y: e.y, content: e.content, isMoving: true });
        e.isMoving = false;
        e.content = contentType.EMPTY;
    });
    boardArray.forEach(e => {
        const nextBlock = nextBlockPos.find(b => b.x === e.x && b.y === e.y);
        if (nextBlock) {
            e.isMoving = true;
            e.content = nextBlock.content;
        }
    });
};
export const blockFallDownLogic = () => {
    console.log("board array: ", boardArray.filter(e => e.isMoving));
    if (checkDownCollision(boardArray.filter(e => e.isMoving))) {
        boardArray.forEach(e => e.isMoving = false);
        currentBlock = nextBlock;
        spawnNewBlock(currentBlock);
        nextBlock = getRandomBlock(currentBlock);
        nextBlockHolderHTML.style.backgroundImage = `url('./assets/${nextBlock}.png')`;
    }
    else {
        moveBlockDown();
    }
};
export const blockLogicInit = () => {
    initBoard();
    currentBlock = getRandomBlock();
    spawnNewBlock(currentBlock);
    nextBlock = getRandomBlock(currentBlock);
    nextBlockHolderHTML.style.backgroundImage = `url('./assets/${nextBlock}.png')`;
};
//# sourceMappingURL=blockLogic.js.map