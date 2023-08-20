import { blockContent, blocksType, direction, I_BLOCK_ROTATION_MAP } from "./types.js";
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
            return { block: blockValues[randIndex], state: 0 };
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
// --------------------------------- Collision Logic --------------------------------- //
const checkDownCollision = (movingBlock) => checkCollision(movingBlock, direction.DOWN);
const checkRightCollision = (movingBlock) => checkCollision(movingBlock, direction.RIGHT);
const checkLeftCollision = (movingBlock) => checkCollision(movingBlock, direction.LEFT);
const checkCollision = (movingBlock, dir) => {
    for (let part of movingBlock) {
        if (dir === direction.RIGHT && part.y === cols - 1) {
            return true;
        }
        if (dir === direction.LEFT && part.y === 0) {
            return true;
        }
        if (dir === direction.UP && part.x === 0) {
            return true;
        }
        if (dir === direction.DOWN && part.x === rows - 1) {
            return true;
        }
        const collidingField = boardArray.find(e => e.y === part.y + (dir === direction.RIGHT ? 1 : 0) - (dir === direction.LEFT ? 1 : 0) &&
            e.x === part.x + (dir === direction.DOWN ? 1 : 0) - (dir === direction.UP ? 1 : 0) &&
            !e.isMoving);
        if (collidingField && collidingField.content !== blockContent.EMPTY) {
            return true;
        }
    }
    return false;
};
const checkRotateRightCollision = (movingBlock) => checkRotateCollision(movingBlock, currentBlock.state, (currentBlock.state + 1) % 4);
const checkRotateCollision = (movingBlock, currentState, nextState) => {
    const check_I_Collision = () => {
        const getRotationKey = (fromState, toState) => `${fromState}_${toState}`;
        const newBlockPos = movingBlock.map((block, i) => {
            const offset = I_BLOCK_ROTATION_MAP[getRotationKey(currentState, nextState)][i];
            return {
                x: block.x + offset.x,
                y: block.y + offset.y
            };
        });
        if (newBlockPos.some(p => p.x >= rows || p.x <= 0 || p.y >= cols || p.y <= 0))
            return true;
        return boardArray.some(e => newBlockPos.some(p => p.x === e.x && p.y === e.y && e.content !== blockContent.EMPTY)
            && !e.isMoving);
    };
    switch (currentBlock.block) {
        case blocksType.I_BLOCK:
            return check_I_Collision();
        default:
            break;
    }
};
const rotateBlockLogic = (movingBlock, currentState, nextState) => {
    const rotate = (rotationMap) => {
        const getRotationKey = (fromState, toState) => `${fromState}_${toState}`;
        const nextBlockPos = movingBlock.map((block, i) => {
            const offset = rotationMap[getRotationKey(currentState, nextState)][i];
            return {
                x: block.x + offset.x,
                y: block.y + offset.y,
                content: block.content,
                isMoving: true
            };
        });
        movingBlock.forEach(e => {
            e.content = blockContent.EMPTY,
                e.isMoving = false;
        });
        boardArray.forEach(e => {
            const nextBlock = nextBlockPos.find(p => p.x === e.x && p.y === e.y);
            if (nextBlock) {
                e.isMoving = true;
                e.content = nextBlock.content;
            }
        });
        currentBlock.state = (currentBlock.state + 1) % 4;
    };
    switch (currentBlock.block) {
        case blocksType.I_BLOCK:
            rotate(I_BLOCK_ROTATION_MAP);
            break;
        default:
            break;
    }
};
const moveBlockLogic = (movingBlock, dir) => {
    let nextBlockPos = [];
    movingBlock.forEach(e => {
        nextBlockPos.push({
            x: e.x + (dir === direction.DOWN ? 1 : 0),
            y: e.y + (dir === direction.RIGHT ? 1 : 0) - (dir === direction.LEFT ? 1 : 0),
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
export const blockFallDownLogic = (movingBlock) => {
    //console.log("board array: ", boardArray.filter(e => e.isMoving));
    if (checkDownCollision(movingBlock)) {
        boardArray.forEach(e => e.isMoving = false);
        currentBlock = nextBlock;
        spawnNewBlock(currentBlock.block);
        nextBlock = getRandomBlock(currentBlock.block);
        nextBlockHolderHTML.style.backgroundImage = `url('./assets/${nextBlock.block}.png')`;
    }
    else {
        moveBlockLogic(movingBlock, direction.DOWN);
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
        case 'ArrowDown':
            !checkDownCollision(movingBlock) && moveBlockDown(movingBlock);
            break;
        case 'ArrowUp':
            !checkRotateRightCollision(movingBlock) && rotateBlockRight(movingBlock);
            break;
        default:
            break;
    }
});
const moveBlockRight = (movingBlock) => {
    moveBlockLogic(movingBlock, direction.RIGHT);
};
const moveBlockLeft = (movingBlock) => {
    moveBlockLogic(movingBlock, direction.LEFT);
};
const moveBlockDown = (movingBlock) => {
    blockFallDownLogic(movingBlock);
};
const rotateBlockRight = (movingBlock) => {
    rotateBlockLogic(movingBlock, currentBlock.state, (currentBlock.state + 1) % 4);
};
// --------------------------------- Initial function --------------------------------- //
export const blockLogicInit = () => {
    initBoard();
    currentBlock = getRandomBlock();
    spawnNewBlock(currentBlock.block);
    nextBlock = getRandomBlock(currentBlock.block);
    nextBlockHolderHTML.style.backgroundImage = `url('./assets/${nextBlock.block}.png')`;
};
//# sourceMappingURL=blockLogic.js.map