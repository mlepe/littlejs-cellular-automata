import * as LJS from 'littlejsengine';
import { CellularAutomataGame } from './game';

// Game configuration
const GRID_WIDTH = 120;
const GRID_HEIGHT = 80;
const CELL_SIZE = 0.5;

// Initialize game
const game = new CellularAutomataGame(GRID_WIDTH, GRID_HEIGHT, CELL_SIZE);

// Start LittleJS engine
LJS.engineInit(
  async () => await game.init(),
  () => game.update(),
  () => game.updatePost(),
  () => game.render(),
  () => game.renderPost(),
  [] // No images to preload
);