import { blockContent, blocksType } from "./types.js";
const cols = Number(getComputedStyle(document.documentElement).getPropertyValue('--board-cols'));
const rows = Number(getComputedStyle(document.documentElement).getPropertyValue('--board-rows'));
const holdBlockHolderHTML = document.getElementById('hold_block_holder');
const nextBlockHolderHTML = document.getElementById('next_block_holder');
let nextBlock, holdBlock, currentBlock = null;
const boardArray = [];
let gameDelay = 300;
export const getBoardArray = () => boardArray;
export const getGameDelay = () => gameDelay;
export const initBoard = () => {
    for (let x = 0; x < rows; x++) {
        for (let y = 0; y < cols; y++) {
            const field = { x: x, y: y, content: blockContent.EMPTY, isMoving: false };
            boardArray.push(field);
        }
    }
    return boardArray;
};
const getRandomNumber = (min = 0, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const getRandomBlock = (prevBlock) => {
    while (true) {
        const blockValues = Object.values(blocksType);
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
        case blocksType.O_BLOCK:
            const O_POS = [{ x: 0, y: 4 }, { x: 0, y: 5 }, { x: 1, y: 4 }, { x: 1, y: 5 }];
            isPlaceOnBoard = !boardArray.some(e => e.content !== blockContent.EMPTY && O_POS.some(p => p.x === e.x && p.y === e.y));
            if (isPlaceOnBoard) {
                setNewBlock(O_POS, blockContent.O);
            }
            break;
        case blocksType.T_BLOCK:
            const T_POS = [{ x: 0, y: 4 }, { x: 1, y: 3 }, { x: 1, y: 4 }, { x: 1, y: 5 }];
            isPlaceOnBoard = !boardArray.some(e => e.content !== blockContent.EMPTY && T_POS.some(p => p.x === e.x && p.y === e.y));
            if (isPlaceOnBoard) {
                setNewBlock(T_POS, blockContent.T);
            }
            break;
        case blocksType.I_BLOCK:
            const I_POS = [{ x: 0, y: 3 }, { x: 0, y: 4 }, { x: 0, y: 5 }, { x: 0, y: 6 }];
            isPlaceOnBoard = !boardArray.some(e => e.content !== blockContent.EMPTY && I_POS.some(p => p.x === e.x && p.y === e.y));
            if (isPlaceOnBoard) {
                setNewBlock(I_POS, blockContent.I);
            }
            break;
        case blocksType.J_BLOCK:
            const J_POS = [{ x: 0, y: 3 }, { x: 1, y: 3 }, { x: 1, y: 4 }, { x: 1, y: 5 }];
            isPlaceOnBoard = !boardArray.some(e => e.content !== blockContent.EMPTY && J_POS.some(p => p.x === e.x && p.y === e.y));
            if (isPlaceOnBoard) {
                setNewBlock(J_POS, blockContent.J);
            }
            break;
        case blocksType.L_BLOCK:
            const L_POS = [{ x: 0, y: 5 }, { x: 1, y: 3 }, { x: 1, y: 4 }, { x: 1, y: 5 }];
            isPlaceOnBoard = !boardArray.some(e => e.content !== blockContent.EMPTY && L_POS.some(p => p.x === e.x && p.y === e.y));
            if (isPlaceOnBoard) {
                setNewBlock(L_POS, blockContent.L);
            }
            break;
        case blocksType.S_BLOCK:
            const S_POS = [{ x: 1, y: 3 }, { x: 1, y: 4 }, { x: 0, y: 4 }, { x: 0, y: 5 }];
            isPlaceOnBoard = !boardArray.some(e => e.content !== blockContent.EMPTY && S_POS.some(p => p.x === e.x && p.y === e.y));
            if (isPlaceOnBoard) {
                setNewBlock(S_POS, blockContent.S);
            }
            break;
        case blocksType.Z_BLOCK:
            const Z_POS = [{ x: 0, y: 3 }, { x: 0, y: 4 }, { x: 1, y: 4 }, { x: 1, y: 5 }];
            isPlaceOnBoard = !boardArray.some(e => e.content !== blockContent.EMPTY && Z_POS.some(p => p.x === e.x && p.y === e.y));
            if (isPlaceOnBoard) {
                setNewBlock(Z_POS, blockContent.Z);
            }
            break;
        default:
            break;
    }
};
const checkDownCollision = (movingBlock) => checkCollision(movingBlock, 0, 0, 1);
const checkRightCollision = (movingBlock) => checkCollision(movingBlock, 1);
const checkLeftCollision = (movingBlock) => checkCollision(movingBlock, 0, 1);
const checkCollision = (movingBlock, right, left, down, up) => {
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
        const collidingField = boardArray.find(e => e.y === part.y + (right ? right : 0) - (left ? left : 0) &&
            e.x === part.x + (down ? down : 0) - (up ? up : 0) &&
            !e.isMoving);
        if (collidingField && collidingField.content !== blockContent.EMPTY) {
            return true;
        }
    }
    return false;
};
const moveBlockLogic = (movingBlock, right, left, down) => {
    let nextBlockPos = [];
    movingBlock.forEach(e => {
        nextBlockPos.push({
            x: e.x + (down ? down : 0),
            y: e.y + (right ? right : 0) - (left ? left : 0),
            content: e.content, isMoving: true
        });
        e.isMoving = false;
        e.content = blockContent.EMPTY;
    });
    boardArray.forEach(e => {
        const nextBlock = nextBlockPos.find(p => p.x === e.x && p.y === e.y);
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
        moveBlockLogic(boardArray.filter(e => e.isMoving), 0, 0, 1);
    }
};
// --------------------------------- Player's Moves --------------------------------- //
document.addEventListener('keydown', event => {
    const movingBlock = boardArray.filter(e => e.isMoving);
    console.log();
    switch (event.key) {
        case 'ArrowRight':
            !checkRightCollision(movingBlock) && moveBlockRight(movingBlock);
            break;
        case 'ArrowLeft':
            !checkLeftCollision(movingBlock) && moveBlockLeft(movingBlock);
            break;
        default:
            break;
    }
});
const moveBlockRight = (movingBlock) => {
    moveBlockLogic(movingBlock, 1);
};
const moveBlockLeft = (movingBlock) => {
    moveBlockLogic(movingBlock, 0, 1);
};
// --------------------------------- Initial function --------------------------------- //
export const blockLogicInit = () => {
    initBoard();
    currentBlock = getRandomBlock();
    spawnNewBlock(currentBlock);
    nextBlock = getRandomBlock(currentBlock);
    nextBlockHolderHTML.style.backgroundImage = `url('./assets/${nextBlock}.png')`;
};
//# sourceMappingURL=blockLogic.js.map