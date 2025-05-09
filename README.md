# Queens Puzzle Game

A browser-based implementation of the Queens Puzzle Game using ReactJS.

## Game Rules

1. The grid is N×N (e.g., 7×7 or 9×9).
2. Each cell may belong to a colored region.
3. The goal is to place **exactly one queen** (`♛`):
   * in every **row**
   * in every **column**
   * in every **colored region**
4. **Queens cannot touch** each other — not even diagonally.
5. The player taps to place/remove a queen or right-clicks to mark a blocked spot (like a flag or 'X').
6. Once the grid is solved correctly, the player can see a "🎉 Puzzle Solved!" message.

## Getting Started

### Prerequisites

- Node.js (version 14.0.0 or higher)
- npm (version 6.0.0 or higher)

### Installation

1. Clone the repository:
```
git clone https://github.com/yourusername/queens-puzzle-game.git
cd queens-puzzle-game
```

2. Install dependencies:
```
npm install
```

3. Start the development server:
```
npm start
```

4. Open your browser and navigate to `http://localhost:3000`

## How to Play

1. Select a grid size to start the game (4×4 to 9×9).
2. Left-click on a cell to place or remove a queen.
3. Right-click on a cell to mark it as blocked.
4. The game checks your solution automatically and shows a success message when all conditions are met.

## Project Structure

```
queens-puzzle-game/
├── public/
│   ├── index.html
│   ├── favicon.ico
│   └── manifest.json
├── src/
│   ├── components/
│   │   ├── Game.js         # Main game component
│   │   ├── Board.js        # Game board component
│   │   ├── Cell.js         # Individual cell component
│   │   ├── Controls.js     # Game controls component
│   │   └── Rules.js        # Game rules component
│   ├── utils/
│   │   └── puzzleGenerator.js # Helper functions
│   ├── App.js
│   ├── index.js
│   └── styles.css
├── package.json
└── README.md
```

## Features

- Dynamic grid size selection (4×4 to 9×9)
- Random colored regions generation
- Visual indication of attacking positions
- Cell marking functionality
- Automatic solution validation
- Responsive design

## License

This project is licensed under the MIT License - see the LICENSE file for details.