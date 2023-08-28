import {blockLogicInit, getBoardArray, getGameDelay, blockFallDownLogic, getGamePoints } from "./blockLogic.js"; 
import { blockContent } from "./types.js";

const boardHTML = document.getElementsByClassName('board')[0];
const scoreHTML = document.getElementsByClassName('score')[0];

const cols = Number(getComputedStyle(document.documentElement).getPropertyValue('--board-cols'));
const rows = Number(getComputedStyle(document.documentElement).getPropertyValue('--board-rows'));

const REFRESH_BOARD_DELAY = 10;
let GAME_INTERVAL: number;

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
                div.style.opacity = '1';
            }
        });
    }

    const setNewFieldClass = (div: HTMLElement, blockContent: string, isShadow: boolean) => {
        div.classList.length > 1 && removeAllClassesButNotField(div);
        div.classList.add(`field_${blockContent}`);
        isShadow && (div.style.opacity = '0.25');
    }

    boardArray.forEach(e => {
        const field: HTMLElement = document.getElementById(`${e.x}-${e.y}`);
        if(field) {
            switch (e.content) {
                case blockContent.I:
                    setNewFieldClass(field, blockContent.I, e.isShadow);
                    break;
    
                case blockContent.J:
                    setNewFieldClass(field, blockContent.J, e.isShadow);
                    break;
    
                case blockContent.L:
                    setNewFieldClass(field, blockContent.L, e.isShadow);
                    break;
    
                case blockContent.O:
                    setNewFieldClass(field, blockContent.O, e.isShadow);
                    break;
    
                case blockContent.S:
                    setNewFieldClass(field, blockContent.S, e.isShadow);
                    break;
    
                case blockContent.T:
                    setNewFieldClass(field, blockContent.T, e.isShadow);
                    break;
    
                case blockContent.Z:
                    setNewFieldClass(field, blockContent.Z, e.isShadow);
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

const updateHTMLScore = (): void => {
    scoreHTML.innerHTML = getGamePoints().toString();
}

const mainLoop = () => {
    if(GAME_INTERVAL !== getGameDelay()) {
        clearInterval(GAME_INTERVAL);
        GAME_INTERVAL = setInterval(mainLoop, getGameDelay());
    }
    blockFallDownLogic(getBoardArray().filter(e => e.isMoving));
}

const refreshHTMLBoard = () => {
    updateHTMLBoard();
    updateHTMLScore();
}

const main = () => {
    initHTMLBoard();
    blockLogicInit();
    updateHTMLBoard();

    GAME_INTERVAL = setInterval(mainLoop, getGameDelay());
    setInterval(refreshHTMLBoard, REFRESH_BOARD_DELAY)
}

main();
