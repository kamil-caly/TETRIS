
const boardHTML = document.getElementsByClassName('board')[0];
const scoreHTML = document.getElementsByClassName('score')[0];

const cols = Number(getComputedStyle(document.documentElement).getPropertyValue('--board-cols'));
const rows = Number(getComputedStyle(document.documentElement).getPropertyValue('--board-rows'));

const fillBoard = () => {
    for(let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
            const field = document.createElement('div');
            field.classList.add('field');
            field.id = y + '-' + x;

            boardHTML.appendChild(field);
        }
    }
}

const main = () => {
    fillBoard();
}

main();