const cols = Number(getComputedStyle(document.documentElement).getPropertyValue('--board-cols'));
const rows = Number(getComputedStyle(document.documentElement).getPropertyValue('--board-rows'));

const holdBlockHolderHTML = document.getElementById('hold_block_holder');
const nextBlockHolderHTML = document.getElementById('next_block_holder');
let nextBlock, holdBlock, currentBlock: null | string = null;
const boardArray: boardContent[] = [];

export const getBoardArray = (): boardContent[] => {
    return boardArray;
}

export type boardContent = {
    x: number;
    y: number;
    content: string | null;
}

export const contentType = {
    I: "I",
    J: "J",
    L: "L",
    O: "O",
    S: "S",
    T: "T",
    Z: "Z",
    EMPTY: "EMPTY"
}

export const blocks = {
    I_BLOCK: "Block-I",
    J_BLOCK: "Block-J",
    L_BLOCK: "Block-L", 
    O_BLOCK: "Block-O",
    S_BLOCK: "Block-S",
    T_BLOCK: "Block-T",
    Z_BLOCK: "Block-Z" 
}

export const initBoard = (): boardContent[] => {
    for(let x = 0; x < rows; x++) {
        for (let y = 0; y < cols; y++) {
            const field: boardContent = {x: x, y: y, content: contentType.EMPTY};
            boardArray.push(field);
        }
    }

    return boardArray;
}

const getRandomNumber = (min: number = 0, max: number) => 
    Math.floor(Math.random() * (max - min + 1)) + min;


const getRandomBlock = (prevBlock?: string) => {
    while(true) {
        type BlockValuesType = typeof blocks[keyof typeof blocks];
        const blockValues = Object.values(blocks) as BlockValuesType[];
        const randIndex = getRandomNumber(0, blockValues.length - 1);
        if(blockValues[randIndex] !== prevBlock || !prevBlock)
            return blockValues[randIndex];
    }
}

const spawnNewBlock = (block: string): void => {
    const setNewBlock = (blockPos: {x: number, y: number }[], content: string): void => {
        boardArray.forEach(e => {
            if (blockPos.some(p => p.x === e.x && p.y === e.y)) {
                e.content = content;
            }
        });
    }

    let isPlaceOnBoard: boolean = false;

    switch (block) {

        case blocks.O_BLOCK:
            const O_POS = [{x: 0, y: 4}, {x: 0, y: 5}, {x: 1, y: 4}, {x: 1, y: 5}];
            isPlaceOnBoard = !boardArray.some(e => 
                e.content !== contentType.EMPTY && O_POS.some(p => p.x === e.x && p.y === e.y));
            if(isPlaceOnBoard) {
                setNewBlock(O_POS, contentType.O);
            }
            break;

        case blocks.T_BLOCK:
            const T_POS = [{x: 0, y: 4}, {x: 1, y: 3}, {x: 1, y: 4}, {x: 1, y: 5}];
            isPlaceOnBoard = !boardArray.some(e => 
                e.content !== contentType.EMPTY && O_POS.some(p => p.x === e.x && p.y === e.y));
            if(isPlaceOnBoard) {
                setNewBlock(T_POS, contentType.T);
            }
            break;

        case blocks.I_BLOCK:
            const I_POS = [{x: 0, y: 3}, {x: 0, y: 4}, {x: 0, y: 5}, {x: 0, y: 6}];
            isPlaceOnBoard = !boardArray.some(e => 
                e.content !== contentType.EMPTY && O_POS.some(p => p.x === e.x && p.y === e.y));
            if(isPlaceOnBoard) {
                setNewBlock(I_POS, contentType.I);
            }
            break;

        case blocks.J_BLOCK:
            const J_POS = [{x: 0, y: 3}, {x: 1, y: 3}, {x: 1, y: 4}, {x: 1, y: 5}];
            isPlaceOnBoard = !boardArray.some(e => 
                e.content !== contentType.EMPTY && J_POS.some(p => p.x === e.x && p.y === e.y));
            if(isPlaceOnBoard) {
                setNewBlock(J_POS, contentType.J);
            }
            break;

        case blocks.L_BLOCK:
            const L_POS = [{x: 0, y: 5}, {x: 1, y: 3}, {x: 1, y: 4}, {x: 1, y: 5}];
            isPlaceOnBoard = !boardArray.some(e => 
                e.content !== contentType.EMPTY && L_POS.some(p => p.x === e.x && p.y === e.y));
            if(isPlaceOnBoard) {
                setNewBlock(L_POS, contentType.L);
            }
            break;

        case blocks.S_BLOCK:
            const S_POS = [{x: 1, y: 3}, {x: 1, y: 4}, {x: 0, y: 4}, {x: 0, y: 5}];
            isPlaceOnBoard = !boardArray.some(e => 
                e.content !== contentType.EMPTY && S_POS.some(p => p.x === e.x && p.y === e.y));
            if(isPlaceOnBoard) {
                setNewBlock(S_POS, contentType.S);
            }
            break;

        case blocks.Z_BLOCK:
            const Z_POS = [{x: 0, y: 3}, {x: 0, y: 4}, {x: 1, y: 4}, {x: 1, y: 5}];
            isPlaceOnBoard = !boardArray.some(e => 
                e.content !== contentType.EMPTY && Z_POS.some(p => p.x === e.x && p.y === e.y));
            if(isPlaceOnBoard) {
                setNewBlock(Z_POS, contentType.Z);
            }
            break;
        default:
            break;
    }
}

const mainLoop = () => {

}

export const blockLogicInit = () => {
    initBoard();
    currentBlock = getRandomBlock();
    spawnNewBlock(currentBlock);

    nextBlock = getRandomBlock(currentBlock);
    nextBlockHolderHTML.style.backgroundImage = `url('./assets/${nextBlock}.png')`;

    mainLoop();
}