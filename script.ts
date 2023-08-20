import { boardContent, blockLogicInit, getBoardArray, contentType, getGameDelay, blockFallDownLogic } from "./blockLogic.js"; 

const boardHTML = document.getElementsByClassName('board')[0];
const scoreHTML = document.getElementsByClassName('score')[0];

const cols = Number(getComputedStyle(document.documentElement).getPropertyValue('--board-cols'));
const rows = Number(getComputedStyle(document.documentElement).getPropertyValue('--board-rows'));

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

    const setNewFieldClass = (div: HTMLElement, contentType: string) => {
        div.classList.length > 1 && removeAllClassesButNotField(div)
        div.classList.add(`field_${contentType}`)
    }

    boardArray.forEach(e => {
        const field: HTMLElement = document.getElementById(`${e.x}-${e.y}`);
        if(field) {
            switch (e.content) {
                case contentType.I:
                    setNewFieldClass(field, contentType.I);
                    break;
    
                case contentType.J:
                    setNewFieldClass(field, contentType.J);
                    break;
    
                case contentType.L:
                    setNewFieldClass(field, contentType.L);
                    break;
    
                case contentType.O:
                    setNewFieldClass(field, contentType.O);
                    break;
    
                case contentType.S:
                    setNewFieldClass(field, contentType.S);
                    break;
    
                case contentType.T:
                    setNewFieldClass(field, contentType.T);
                    break;
    
                case contentType.Z:
                    setNewFieldClass(field, contentType.Z);
                    break;
    
                case contentType.EMPTY:
                    removeAllClassesButNotField(field);
                    break;
                default:
                    break;
            }
        }
    });
    
}

const mainLoop = () => {
    blockFallDownLogic();
    updateHTMLBoard();
}

const main = () => {
    initHTMLBoard();
    blockLogicInit();
    updateHTMLBoard();

    setInterval(mainLoop, getGameDelay());
}

main();
