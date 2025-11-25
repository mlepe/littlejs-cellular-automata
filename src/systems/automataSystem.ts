import { System, ECS } from '../ecs';
import { Grid } from '../grid';
import { AutomataRule } from '../rules/ruleBase';
import { CellState } from '../types';

/**
 * AutomataSystem - Updates cell states based on rules
 */
export class AutomataSystem extends System {
  private updateTimer: number = 0;
  private updateInterval: number = 0.1; // 10 updates per second default
  private isPaused: boolean = false;
  private generation: number = 0;

  constructor(
    private grid: Grid,
    private rule: AutomataRule
  ) {
    super();
  }

  setRule(rule: AutomataRule): void {
    this.rule = rule;
    this.generation = 0;
  }

  setSpeed(speed: number): void {
    this.updateInterval = 1 / (10 * speed); // speed multiplier
  }

  setPaused(paused: boolean): void {
    this.isPaused = paused;
  }

  step(): void {
    this.processGeneration();
  }

  reset(): void {
    this.generation = 0;
  }

  update(_ecs: ECS, deltaTime: number): void {
    if (this.isPaused) return;

    this.updateTimer += deltaTime;
    if (this.updateTimer >= this.updateInterval) {
      this.updateTimer = 0;
      this.processGeneration();
    }
  }

  private processGeneration(): void {
    const cells = this.grid.getAllCells();

    // Calculate next state for all cells
    cells.forEach(entityId => {
      const pos = this.grid.getPosition(entityId);
      const state = this.grid.getState(entityId);
      const cell = this.grid.getCell(entityId);
      
      if (!pos || !state || !cell) return;

      const neighbors = this.grid.getNeighbors(pos.x, pos.y);
      const neighborStates = neighbors
        .map(id => this.grid.getState(id)?.current)
        .filter(s => s !== undefined) as CellState[];

      state.next = this.rule.computeNextState(state.current, neighborStates, cell.age);
    });

    // Apply next state and update ages
    cells.forEach(entityId => {
      const state = this.grid.getState(entityId);
      const cell = this.grid.getCell(entityId);
      
      if (!state || !cell) return;

      const wasAlive = state.current === CellState.Alive;
      state.current = state.next;
      const isAlive = state.current === CellState.Alive;

      if (isAlive) {
        cell.age++;
      } else {
        cell.age = 0;
      }

      if (isAlive && !wasAlive) {
        cell.generation = this.generation;
      }
    });

    this.generation++;
  }

  getGeneration(): number {
    return this.generation;
  }

  getIsPaused(): boolean {
    return this.isPaused;
  }
}
