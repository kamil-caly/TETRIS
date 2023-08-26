import {blockLogicInit, getBoardArray, getGameDelay, blockFallDownLogic } from "./blockLogic.js"; 
import { blockContent } from "./types.js";

const boardHTML = document.getElementsByClassName('board')[0];
const scoreHTML = document.getElementsByClassName('score')[0];

const cols = Number(getComputedStyle(document.documentElement).getPropertyValue('--board-cols'));
const rows = Number(getComputedStyle(document.documentElement).getPropertyValue('--board-rows'));

const REFRESH_BOARD_DELAY = 10;

const initHTMLBoard = (): void => {
    for(let x = 0; x < rows; x++) {
        for (let y = 0; y < cols; y++) {
            const field = document.createElement('div');
            field.classList.add('field');
            field.id = x + '-' + y;

            boardHTML.appendChild(field);
        }
    }
}

const updateHTMLBoard = (): void => {
    const boardArray = getBoardArray();

    const removeAllClassesButNotField = (div: HTMLElement) => {
        div.classList.forEach(className => {
            if (className !== 'field') {
                div.classList.remove(className);
            }
        });
    }

    const setNewFieldClass = (div: HTMLElement, blockContent: string) => {
        div.classList.length > 1 && removeAllClassesButNotField(div)
        div.classList.add(`field_${blockContent}`)
    }

    boardArray.forEach(e => {
        const field: HTMLElement = document.getElementById(`${e.x}-${e.y}`);
        if(field) {
            switch (e.content) {
                case blockContent.I:
                    setNewFieldClass(field, blockContent.I);
                    break;
    
                case blockContent.J:
                    setNewFieldClass(field, blockContent.J);
                    break;
    
                case blockContent.L:
                    setNewFieldClass(field, blockContent.L);
                    break;
    
                case blockContent.O:
                    setNewFieldClass(field, blockContent.O);
                    break;
    
                case blockContent.S:
                    setNewFieldClass(field, blockContent.S);
                    break;
    
                case blockContent.T:
                    setNewFieldClass(field, blockContent.T);
                    break;
    
                case blockContent.Z:
                    setNewFieldClass(field, blockContent.Z);
                    break;
    
                case blockContent.EMPTY:
                    removeAllClassesButNotField(field);
                    break;
                default:
                    break;
            }
        }
    });
    
}

const mainLoop = () => {
    blockFallDownLogic(getBoardArray().filter(e => e.isMoving));
}

const refreshHTMLBoard = () => {
    updateHTMLBoard();
}

const main = () => {
    initHTMLBoard();
    blockLogicInit();
    updateHTMLBoard();

    setInterval(mainLoop, getGameDelay());
    setInterval(refreshHTMLBoard, REFRESH_BOARD_DELAY)
}

main();
