import * as LJS from 'littlejsengine';
import { System, ECS, EventBus } from '../ecs';
import { Grid } from '../grid';
import { CellState } from '../types';

/**
 * InputSystem - Handles user input
 */
export class InputSystem extends System {
  private readonly keys = {
    pause: 'Space',
    random: 'KeyR',
    clear: 'KeyC',
    step: 'KeyS',
    rule1: 'Digit1',
    rule2: 'Digit2',
    rule3: 'Digit3',
    rule4: 'Digit4',
    rule5: 'Digit5',
    speedUp: 'Equal',
    speedDown: 'Minus',
  };

  constructor(
    private grid: Grid,
    private cellSize: number,
    private eventBus: EventBus
  ) {
    super();
  }

  update(_ecs: ECS, _deltaTime: number): void {
    // Keyboard input
    if (LJS.keyWasPressed(this.keys.pause)) {
      this.eventBus.emit({ type: 'input:pause', data: {} });
    }
    if (LJS.keyWasPressed(this.keys.random)) {
      this.eventBus.emit({ type: 'input:random', data: {} });
    }
    if (LJS.keyWasPressed(this.keys.clear)) {
      this.eventBus.emit({ type: 'input:clear', data: {} });
    }
    if (LJS.keyWasPressed(this.keys.step)) {
      this.eventBus.emit({ type: 'input:step', data: {} });
    }
    if (LJS.keyWasPressed(this.keys.rule1)) {
      this.eventBus.emit({ type: 'input:rule', data: { ruleIndex: 0 } });
    }
    if (LJS.keyWasPressed(this.keys.rule2)) {
      this.eventBus.emit({ type: 'input:rule', data: { ruleIndex: 1 } });
    }
    if (LJS.keyWasPressed(this.keys.rule3)) {
      this.eventBus.emit({ type: 'input:rule', data: { ruleIndex: 2 } });
    }
    if (LJS.keyWasPressed(this.keys.rule4)) {
      this.eventBus.emit({ type: 'input:rule', data: { ruleIndex: 3 } });
    }
    if (LJS.keyWasPressed(this.keys.rule5)) {
      this.eventBus.emit({ type: 'input:rule', data: { ruleIndex: 4 } });
    }
    if (LJS.keyWasPressed(this.keys.speedUp)) {
      this.eventBus.emit({ type: 'input:speedUp', data: {} });
    }
    if (LJS.keyWasPressed(this.keys.speedDown)) {
      this.eventBus.emit({ type: 'input:speedDown', data: {} });
    }

    // Mouse input for drawing
    if (LJS.mouseIsDown(0)) {
      this.handleMouseDraw(true);
    }
    if (LJS.mouseIsDown(2)) {
      this.handleMouseDraw(false);
    }
  }

  private handleMouseDraw(setAlive: boolean): void {
    const mousePos = LJS.mousePos;
    const gridX = Math.floor(mousePos.x / this.cellSize);
    const gridY = Math.floor(mousePos.y / this.cellSize);

    const entityId = this.grid.getCellAt(gridX, gridY);
    if (entityId !== undefined) {
      const state = this.grid.getState(entityId);
      if (state) {
        state.current = setAlive ? CellState.Alive : CellState.Dead;
        state.next = state.current;
      }
    }
  }
}
