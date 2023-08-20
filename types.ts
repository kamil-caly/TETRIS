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