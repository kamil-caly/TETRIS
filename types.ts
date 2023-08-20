export type boardContent = {
    x: number;
    y: number;
    content: string | null; // contentType
    isMoving: boolean;
}

export const blockContent = {
    I: "I",
    J: "J",
    L: "L",
    O: "O",
    S: "S",
    T: "T",
    Z: "Z",
    EMPTY: "EMPTY"
}

export const blocksType = {
    I_BLOCK: "Block-I",
    J_BLOCK: "Block-J",
    L_BLOCK: "Block-L", 
    O_BLOCK: "Block-O",
    S_BLOCK: "Block-S",
    T_BLOCK: "Block-T",
    Z_BLOCK: "Block-Z" 
}

export const direction = {
    RIGHT: "RIGHT",
    LEFT: "LEFGT",
    DOWN: "DOWN",
    UP: "UP"
}

export type currentBlockType = {
    block: string,
    state: number 
}

export enum BlockRotationStates {
    ZERO_ONE = "0_1",
    ONE_TWO = "1_2",
    TWO_THREE = "2_3",
    THREE_ZERO = "3_0",
    ONE_ZERO = "1_0",
    TWO_ONE = "2_1",
    THREE_TWO = "3_2",
    ZERO_THREE = "0_3"
}

export const I_BLOCK_ROTATION_MAP: Record<BlockRotationStates, {x: number, y: number}[]> = {
    [BlockRotationStates.ZERO_ONE]: [{ x: -1, y: 2 }, { x: 0, y: 1 }, { x: 1, y: 0 }, { x: 2, y: -1 }],
    [BlockRotationStates.ONE_TWO]: [{ x: 2, y: -2 }, { x: 1, y: -1 }, { x: 0, y: 0 }, { x: -1, y: 1 }],
    [BlockRotationStates.TWO_THREE]: [{ x: -2, y: 1 }, { x: -1, y: 0 }, { x: 0, y: -1 }, { x: 1, y: -2 }],
    [BlockRotationStates.THREE_ZERO]: [{ x: 1, y: -1 }, { x: 0, y: 0 }, { x: -1, y: 1 }, { x: -2, y: 2 }],
    [BlockRotationStates.ONE_ZERO]: [{ x: 1, y: -2 }, { x: 0, y: -1 }, { x: -1, y: 0 }, { x: -2, y: 1 }],
    [BlockRotationStates.TWO_ONE]: [{ x: -2, y: 2 }, { x: -1, y: 1 }, { x: 0, y: 0 }, { x: 1, y: -1 }],
    [BlockRotationStates.THREE_TWO]: [{ x: 2, y: -1 }, { x: 1, y: 0 }, { x: 0, y: 1 }, { x: -1, y: 2 }],
    [BlockRotationStates.ZERO_THREE]: [{ x: -1, y: 1 }, { x: 0, y: 0 }, { x: 1, y: -1 }, { x: 2, y: -2 }],
};