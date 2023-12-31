import { blockContent, blocksType, direction, I_BLOCK_ROTATION_MAP, J_BLOCK_ROTATION_MAP, L_BLOCK_ROTATION_MAP, S_BLOCK_ROTATION_MAP, Z_BLOCK_ROTATION_MAP, T_BLOCK_ROTATION_MAP, BLOCK_SWITCH_MAP } from "./types.js";
const cols = Number(getComputedStyle(document.documentElement).getPropertyValue('--board-cols'));
const rows = Number(getComputedStyle(document.documentElement).getPropertyValue('--board-rows'));
const holdBlockHolderHTML = document.getElementById('hold_block_holder');
const nextBlockHolderHTML = document.getElementById('next_block_holder');
let nextBlock, holdBlock, currentBlock = null;
const boardArray = [];
let GAME_DELAY = 800;
let GAME_POINTS = 0;
let GAME_OVER = false;
export const getBoardArray = () => boardArray;
export const getGameDelay = () => GAME_DELAY;
export const getGamePoints = () => GAME_POINTS;
export const getGameOver = () => GAME_OVER;
export const initBoard = () => {
    if (boardArray.length > 0)
        boardArray.splice(0, boardArray.length);
    for (let x = 0; x < rows; x++) {
        for (let y = 0; y < cols; y++) {
            const field = { x: x, y: y, content: blockContent.EMPTY, isMoving: false, isShadow: false };
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
const clearShadow = () => {
    boardArray.filter(e => e.isShadow).forEach(ee => {
        ee.isShadow = false;
        ee.content = blockContent.EMPTY;
        ee.isCenterBlockPart = false;
    });
};
const setAndUpdateShadowOnTheFloor = () => {
    clearShadow();
    const shadowBlockFallDownLogic = (movingBlock) => {
        if (checkDownCollision(movingBlock) || movingBlock.length <= 0) {
            boardArray.filter(e => e.isShadow).forEach(ee => ee.isMoving = false);
            return true;
        }
        else {
            moveBlockLogic(movingBlock, direction.DOWN, true);
        }
    };
    let movingBlockTempPosition = [];
    boardArray.filter(e => e.isMoving).forEach(ee => movingBlockTempPosition.push(Object.assign({}, ee)));
    while (true) {
        if (shadowBlockFallDownLogic(boardArray.filter(e => e.isMoving)))
            break;
    }
    for (let e of boardArray) {
        for (let ee of movingBlockTempPosition) {
            if (e.x === ee.x && e.y === ee.y) {
                e.content = ee.content;
                e.isCenterBlockPart = ee.isCenterBlockPart;
                e.isMoving = true;
                e.isShadow = false;
            }
        }
    }
};
const spawnNewBlock = (block) => {
    const setNewBlock = (blockPos, content, centerBlockPart) => {
        checkGameOver(blockPos);
        boardArray.forEach(e => {
            if (blockPos.some(p => p.x === e.x && p.y === e.y)) {
                e.content = content;
                e.isMoving = true;
                e.x === centerBlockPart.x && e.y === centerBlockPart.y && (e.isCenterBlockPart = true);
                e.isShadow = false;
            }
        });
    };
    switch (block) {
        case blocksType.O_BLOCK:
            const O_POS = [{ x: 0, y: 4 }, { x: 0, y: 5 }, { x: 1, y: 4 }, { x: 1, y: 5 }];
            setNewBlock(O_POS, blockContent.O, { x: 0, y: 4 });
            break;
        case blocksType.T_BLOCK:
            const T_POS = [{ x: 0, y: 4 }, { x: 1, y: 3 }, { x: 1, y: 4 }, { x: 1, y: 5 }];
            setNewBlock(T_POS, blockContent.T, { x: 1, y: 4 });
            break;
        case blocksType.I_BLOCK:
            const I_POS = [{ x: 0, y: 3 }, { x: 0, y: 4 }, { x: 0, y: 5 }, { x: 0, y: 6 }];
            setNewBlock(I_POS, blockContent.I, { x: 0, y: 4 });
            break;
        case blocksType.J_BLOCK:
            const J_POS = [{ x: 0, y: 3 }, { x: 1, y: 3 }, { x: 1, y: 4 }, { x: 1, y: 5 }];
            setNewBlock(J_POS, blockContent.J, { x: 1, y: 4 });
            break;
        case blocksType.L_BLOCK:
            const L_POS = [{ x: 0, y: 5 }, { x: 1, y: 3 }, { x: 1, y: 4 }, { x: 1, y: 5 }];
            setNewBlock(L_POS, blockContent.L, { x: 1, y: 4 });
            break;
        case blocksType.S_BLOCK:
            const S_POS = [{ x: 1, y: 3 }, { x: 1, y: 4 }, { x: 0, y: 4 }, { x: 0, y: 5 }];
            setNewBlock(S_POS, blockContent.S, { x: 1, y: 4 });
            break;
        case blocksType.Z_BLOCK:
            const Z_POS = [{ x: 0, y: 3 }, { x: 0, y: 4 }, { x: 1, y: 4 }, { x: 1, y: 5 }];
            setNewBlock(Z_POS, blockContent.Z, { x: 0, y: 4 });
            break;
        default:
            break;
    }
    setAndUpdateShadowOnTheFloor();
};
const checkGameOver = (blockPos) => {
    for (let pos of blockPos) {
        if (boardArray.some(e => e.x === pos.x && e.y === pos.y && e.content !== blockContent.EMPTY)) {
            GAME_OVER = true;
            break;
        }
    }
};
const updatePoints = () => GAME_POINTS++;
const updateGameDelay = () => GAME_DELAY > 500 ? GAME_DELAY -= 7 : GAME_DELAY -= 10;
const getRotationKey = (fromState, toState) => `${fromState}_${toState}`;
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
        if (collidingField && (collidingField.content !== blockContent.EMPTY && !collidingField.isShadow)) {
            return true;
        }
    }
    return false;
};
const checkRotateRightCollision = (movingBlock) => checkRotateCollision(movingBlock, currentBlock.state, (currentBlock.state + 1) % 4);
const checkRotateLeftCollision = (movingBlock) => checkRotateCollision(movingBlock, currentBlock.state, (currentBlock.state - 1 + 4) % 4);
const checkRotateCollision = (movingBlock, currentState, nextState) => {
    const checkCollision = (rotationMap) => {
        const newBlockPos = movingBlock.map((block, i) => {
            const offset = rotationMap[getRotationKey(currentState, nextState)][i];
            return {
                x: block.x + offset.x,
                y: block.y + offset.y
            };
        });
        if (newBlockPos.some(p => p.x >= rows || p.x < 0 || p.y >= cols || p.y < 0))
            return true;
        return newBlockPos.some(p => boardArray.some(e => p.x === e.x && p.y === e.y &&
            (e.content !== blockContent.EMPTY && !e.isShadow) &&
            !e.isMoving));
    };
    switch (currentBlock.block) {
        case blocksType.I_BLOCK:
            return checkCollision(I_BLOCK_ROTATION_MAP);
        case blocksType.J_BLOCK:
            return checkCollision(J_BLOCK_ROTATION_MAP);
        case blocksType.L_BLOCK:
            return checkCollision(L_BLOCK_ROTATION_MAP);
        case blocksType.S_BLOCK:
            return checkCollision(S_BLOCK_ROTATION_MAP);
        case blocksType.Z_BLOCK:
            return checkCollision(Z_BLOCK_ROTATION_MAP);
        case blocksType.T_BLOCK:
            return checkCollision(T_BLOCK_ROTATION_MAP);
        default:
            return true;
    }
};
const checkSwitchBlockCollision = (movingBlock) => {
    if (!holdBlock)
        return false;
    const checkSwitchBlockCollision = (pos) => {
        const centerMovingBlockPart = movingBlock.find(b => b.isCenterBlockPart);
        if (!centerMovingBlockPart)
            return false;
        for (let p of pos) {
            const newX = centerMovingBlockPart.x + p.x;
            const newY = centerMovingBlockPart.y + p.y;
            if (!movingBlock.some(e => e.x === newX && e.y === newY)) {
                const boardNewElem = boardArray.find(e => e.x === newX && e.y === newY && e.content === blockContent.EMPTY);
                if (!boardNewElem) {
                    return true;
                }
            }
        }
        return false;
    };
    switch (holdBlock.block) {
        case blocksType.O_BLOCK:
            return checkSwitchBlockCollision(BLOCK_SWITCH_MAP.O_BLOCK);
        case blocksType.I_BLOCK:
            return checkSwitchBlockCollision(BLOCK_SWITCH_MAP.I_BLOCK);
        case blocksType.J_BLOCK:
            return checkSwitchBlockCollision(BLOCK_SWITCH_MAP.J_BLOCK);
        case blocksType.L_BLOCK:
            return checkSwitchBlockCollision(BLOCK_SWITCH_MAP.L_BLOCK);
        case blocksType.S_BLOCK:
            return checkSwitchBlockCollision(BLOCK_SWITCH_MAP.S_BLOCK);
        case blocksType.T_BLOCK:
            return checkSwitchBlockCollision(BLOCK_SWITCH_MAP.T_BLOCK);
        case blocksType.Z_BLOCK:
            return checkSwitchBlockCollision(BLOCK_SWITCH_MAP.Z_BLOCK);
        default:
            return true;
    }
};
// --------------------------------- Rotate Block Logic --------------------------------- //
const rotateBlockLogic = (movingBlock, currentState, nextState) => {
    const rotate = (rotationMap) => {
        const nextBlockPos = movingBlock.map((block, i) => {
            const offset = rotationMap[getRotationKey(currentState, nextState)][i];
            return {
                x: block.x + offset.x,
                y: block.y + offset.y,
                content: block.content,
                isMoving: true,
                isCenterBlockPart: block.isCenterBlockPart,
                isShadow: false
            };
        });
        movingBlock.forEach(e => {
            e.content = blockContent.EMPTY,
                e.isMoving = false,
                e.isCenterBlockPart = false,
                e.isShadow = false;
        });
        boardArray.forEach(e => {
            const nextBlock = nextBlockPos.find(p => p.x === e.x && p.y === e.y);
            if (nextBlock) {
                e.isMoving = true;
                e.content = nextBlock.content;
                e.isCenterBlockPart = nextBlock.isCenterBlockPart;
                e.isShadow = false;
            }
        });
        currentBlock.state = nextState;
    };
    switch (currentBlock.block) {
        case blocksType.I_BLOCK:
            rotate(I_BLOCK_ROTATION_MAP);
            break;
        case blocksType.J_BLOCK:
            rotate(J_BLOCK_ROTATION_MAP);
            break;
        case blocksType.L_BLOCK:
            rotate(L_BLOCK_ROTATION_MAP);
            break;
        case blocksType.S_BLOCK:
            rotate(S_BLOCK_ROTATION_MAP);
            break;
        case blocksType.Z_BLOCK:
            rotate(Z_BLOCK_ROTATION_MAP);
            break;
        case blocksType.T_BLOCK:
            rotate(T_BLOCK_ROTATION_MAP);
            break;
        default:
            break;
    }
};
// --------------------------------- Moving Block Logic --------------------------------- //
const moveBlockLogic = (movingBlock, dir, isShadow = false) => {
    let nextBlockPos = [];
    movingBlock.forEach(e => {
        let newBlockContent = {
            x: e.x + (dir === direction.DOWN ? 1 : 0),
            y: e.y + (dir === direction.RIGHT ? 1 : 0) - (dir === direction.LEFT ? 1 : 0),
            content: e.content,
            isMoving: true,
            isShadow: isShadow
        };
        if (e.isCenterBlockPart)
            newBlockContent.isCenterBlockPart = true;
        nextBlockPos.push(newBlockContent);
        e.isMoving = false;
        e.content = blockContent.EMPTY;
        e.isShadow = false;
    });
    boardArray.forEach(e => {
        e.isCenterBlockPart && (e.isCenterBlockPart = false);
        const nextBlock = nextBlockPos.find(p => p.x === e.x && p.y === e.y);
        if (nextBlock) {
            e.isMoving = true;
            e.isShadow = isShadow;
            e.content = nextBlock.content;
            nextBlock.isCenterBlockPart && (e.isCenterBlockPart = true);
        }
    });
};
export const blockFallDownLogic = (movingBlock) => {
    if (checkDownCollision(movingBlock)) {
        boardArray.forEach(e => { e.isMoving = false, e.isShadow = false; });
        deleteFullRowsLogic();
        currentBlock = nextBlock;
        spawnNewBlock(currentBlock.block);
        nextBlock = getRandomBlock(currentBlock.block);
        nextBlockHolderHTML.style.backgroundImage = `url('./assets/${nextBlock.block}.png')`;
    }
    else {
        moveBlockLogic(movingBlock, direction.DOWN);
    }
};
// --------------------------------- Deleting Rows Logic --------------------------------- //
const deleteFullRow = (row) => {
    boardArray.forEach(e => {
        if (e.x === row)
            e.content = blockContent.EMPTY;
    });
    updatePoints();
    updateGameDelay();
};
const movesAllBlocksOneStepDown = (startRow) => {
    for (let x = startRow; x >= 0; x--) {
        const currentRow = boardArray.filter(e => e.x === x);
        boardArray.filter(e => e.x === x + 1).forEach((ee, index) => ee.content = currentRow[index].content);
    }
    boardArray.filter(e => e.x === 0).forEach(ee => ee.content = blockContent.EMPTY);
};
const deleteFullRowsLogic = () => {
    for (let x = rows - 1; x >= 0; x--) {
        const row = boardArray.filter(e => e.x === x);
        if (row.some(e => e.content === blockContent.EMPTY))
            continue;
        deleteFullRow(x);
        movesAllBlocksOneStepDown(x - 1);
        x++; //again check the same row because blocks has been moved down
    }
};
// --------------------------------- Switch Block Logic --------------------------------- //
const switchBlock = (movingBlock) => {
    const removeMovingBlock = () => {
        boardArray.forEach(e => {
            if (e.isMoving) {
                e.isMoving = false;
                e.content = blockContent.EMPTY;
                e.isCenterBlockPart = false;
            }
        });
    };
    if (!holdBlock) {
        removeMovingBlock();
        holdBlock = currentBlock;
        holdBlock.state = 0;
        holdBlockHolderHTML.style.backgroundImage = `url('./assets/${holdBlock.block}.png')`;
        currentBlock = nextBlock;
        spawnNewBlock(currentBlock.block);
        nextBlock = getRandomBlock(currentBlock.block);
        nextBlockHolderHTML.style.backgroundImage = `url('./assets/${nextBlock.block}.png')`;
        return;
    }
    const newCurrentBlock = holdBlock;
    holdBlock = currentBlock;
    holdBlock.state = 0;
    holdBlockHolderHTML.style.backgroundImage = `url('./assets/${currentBlock.block}.png')`;
    currentBlock = newCurrentBlock;
    currentBlock.state = 0;
    const centerBlockPart = movingBlock.find(b => b.isCenterBlockPart);
    const switchOBlock = (pos, blockCon) => {
        let newBlock = [];
        for (let p of pos) {
            const newBlockContent = {
                x: centerBlockPart.x + p.x,
                y: centerBlockPart.y + p.y,
                isMoving: true,
                content: blockCon,
                isShadow: false
            };
            p.x === 0 && p.y === 0 && (newBlockContent.isCenterBlockPart = true);
            newBlock.push(newBlockContent);
        }
        boardArray.forEach(e => {
            if (e.isMoving) {
                e.isMoving = false;
                e.content = blockContent.EMPTY;
                e.isCenterBlockPart && (e.isCenterBlockPart = false);
            }
        });
        boardArray.forEach(e => {
            const currentNewBlockPart = newBlock.find(b => b.x === e.x && b.y === e.y);
            if (currentNewBlockPart) {
                e.content = newBlock[0].content;
                e.isMoving = true;
                currentNewBlockPart.isCenterBlockPart && (e.isCenterBlockPart = true);
            }
        });
    };
    switch (currentBlock.block) {
        case blocksType.O_BLOCK:
            switchOBlock(BLOCK_SWITCH_MAP.O_BLOCK, blockContent.O);
            break;
        case blocksType.I_BLOCK:
            switchOBlock(BLOCK_SWITCH_MAP.I_BLOCK, blockContent.I);
            break;
        case blocksType.J_BLOCK:
            switchOBlock(BLOCK_SWITCH_MAP.J_BLOCK, blockContent.J);
            break;
        case blocksType.L_BLOCK:
            switchOBlock(BLOCK_SWITCH_MAP.L_BLOCK, blockContent.L);
            break;
        case blocksType.S_BLOCK:
            switchOBlock(BLOCK_SWITCH_MAP.S_BLOCK, blockContent.S);
            break;
        case blocksType.T_BLOCK:
            switchOBlock(BLOCK_SWITCH_MAP.T_BLOCK, blockContent.T);
            break;
        case blocksType.Z_BLOCK:
            switchOBlock(BLOCK_SWITCH_MAP.Z_BLOCK, blockContent.Z);
            break;
        default:
            break;
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
            moveBlockDown(movingBlock); // checking collision is in blockFallDownLogic
            break;
        case 'ArrowUp':
            !checkRotateRightCollision(movingBlock) && rotateBlockRight(movingBlock);
            break;
        case 'z':
            !checkRotateLeftCollision(movingBlock) && rotateBlockLeft(movingBlock);
            break;
        case 'c':
            !checkSwitchBlockCollision(movingBlock) && switchBlock(movingBlock);
            break;
        case ' ':
            moveBlockOnTheFloor();
            break;
        default:
            break;
    }
    setAndUpdateShadowOnTheFloor();
});
const moveBlockRight = (movingBlock) => moveBlockLogic(movingBlock, direction.RIGHT);
const moveBlockLeft = (movingBlock) => moveBlockLogic(movingBlock, direction.LEFT);
const moveBlockDown = (movingBlock) => blockFallDownLogic(movingBlock);
const rotateBlockRight = (movingBlock) => rotateBlockLogic(movingBlock, currentBlock.state, (currentBlock.state + 1) % 4);
const rotateBlockLeft = (movingBlock) => rotateBlockLogic(movingBlock, currentBlock.state, (currentBlock.state - 1 + 4) % 4);
const moveBlockOnTheFloor = () => {
    let nextBlockTemp = nextBlock;
    while (nextBlock === nextBlockTemp) {
        blockFallDownLogic(boardArray.filter(e => e.isMoving));
    }
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