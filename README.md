# TETRIS

This project is a simple implementation of the classic Tetris game using TypeScript. It includes functions for initializing the game board, moving blocks in different directions, rotating blocks, and checking for collisions.

## Features

- **Board Initialization**: Initialize a Tetris game board with a customizable number of rows and columns.
- **Block Movement**: Blocks can be moved left, right, down, or dropped directly to the bottom of the board.
- **Block Rotation**: Blocks can be rotated both clockwise and counter-clockwise.
- **Collision Detection**: The game checks for collisions when a block is moved or rotated. 
- **Point System**: Points are incremented when rows are completed.
- **Dynamic Game Speed**: The game delay is adjusted as the player scores more points.
- **Game Over Check**: The game ends if a new block cannot be placed at the top of the board.
- **Shadow Block**: Displays the position where the current block will land.
- **Hold Functionality**: The player can hold a block and switch it with the current block.
- **Random Next Block**: The next block is generated randomly and it can not be the same like current.

### Controls

1. **Move Right**: Press the `ArrowRight` key to shift the current block to the right. 
2. **Move Left**: Press the `ArrowLeft` key to shift the current block to the left.
3. **Soft Drop**: Press the `ArrowDown` key to move the current block one step down.
4. **Rotate Clockwise**: Press the `ArrowUp` key to rotate the current block clockwise.
5. **Rotate Counter-Clockwise**: Press the `z` key to rotate the current block counter-clockwise.
6. **Switch Block**: If you want to hold the current block and switch it with the previously held block (if any), press the `c` key.
7. **Hard Drop**: Press the `Space` bar to instantly drop the current block to the lowest available position.

## Setup and Run

To set up and run the game, follow these steps:

1. Clone the repository.
2. Compile the TypeScript files.
3. Open the index.html file in your browser to start the game.
