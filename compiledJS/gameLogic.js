const holdBlockHolderHTML = document.getElementById('hold_block_holder');
const nextBlockHolderHTML = document.getElementById('next_block_holder');
let nextBlock, holdBlock, currentBlock = null;
export const blocks = {
    I_BLOCK: "Block-I",
    J_BLOCK: "Block-J",
    L_BLOCK: "Block-L",
    O_BLOCK: "Block-O",
    S_BLOCK: "Block-S",
    T_BLOCK: "Block-T",
    Z_BLOCK: "Block-Z"
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
export const gameInit = () => {
    // holdBlock = getRandomBlock();
    // holdBlockHolderHTML.style.backgroundImage = `url('./assets/${holdBlock}.png')`;
    currentBlock = getRandomBlock();
    nextBlock = getRandomBlock(currentBlock);
    nextBlockHolderHTML.style.backgroundImage = `url('./assets/${nextBlock}.png')`;
};
//# sourceMappingURL=gameLogic.js.map