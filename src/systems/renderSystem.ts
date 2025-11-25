import * as LJS from 'littlejsengine';
import { System, ECS } from '../ecs';
import { Grid } from '../grid';
import { getCellColor } from '../types';
import { CellState } from '../types';

/**
 * RenderSystem - Renders cells to screen
 */
export class RenderSystem extends System {
  constructor(
    private grid: Grid,
    private cellSize: number
  ) {
    super();
  }

  render(_ecs: ECS): void {
    const cells = this.grid.getAllCells();

    cells.forEach(entityId => {
      const pos = this.grid.getPosition(entityId);
      const state = this.grid.getState(entityId);
      const cell = this.grid.getCell(entityId);

      if (!pos || !state || !cell) return;
      if (state.current === CellState.Dead) return; // Don't render dead cells

      const x = pos.x * this.cellSize;
      const y = pos.y * this.cellSize;
      const color = getCellColor(state.current, cell.age);

      // Draw filled rectangle
      LJS.drawRect(
        LJS.vec2(x, y),
        LJS.vec2(this.cellSize * 0.9, this.cellSize * 0.9),
        new LJS.Color().setHex(color)
      );
    });
  }
}
