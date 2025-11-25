import { ECS, EntityId, EntityBuilder } from './ecs';
import { CellComponent, GridPositionComponent, StateComponent } from './components';
import { CellState } from './types';

/**
 * Grid - Manages spatial organization of cells
 */
export class Grid {
  private cells: (EntityId | undefined)[][] = [];
  private allCells: Set<EntityId> = new Set();

  constructor(
    private ecs: ECS,
    private width: number,
    private height: number
  ) {
    this.initializeGrid();
  }

  private initializeGrid(): void {
    for (let y = 0; y < this.height; y++) {
      this.cells[y] = [];
      for (let x = 0; x < this.width; x++) {
        const entityId = this.createCell(x, y);
        this.cells[y][x] = entityId;
        this.allCells.add(entityId);
      }
    }
  }

  private createCell(x: number, y: number): EntityId {
    return EntityBuilder.create(this.ecs)
      .withComponent<GridPositionComponent>({
        type: 'gridPosition',
        x,
        y,
      })
      .withComponent<StateComponent>({
        type: 'state',
        current: CellState.Dead,
        next: CellState.Dead,
      })
      .withComponent<CellComponent>({
        type: 'cell',
        age: 0,
        generation: 0,
      })
      .build();
  }

  getCellAt(x: number, y: number): EntityId | undefined {
    if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
      return undefined;
    }
    return this.cells[y][x];
  }

  getNeighbors(x: number, y: number): EntityId[] {
    const neighbors: EntityId[] = [];
    const offsets = [
      [-1, -1], [0, -1], [1, -1],
      [-1,  0],          [1,  0],
      [-1,  1], [0,  1], [1,  1],
    ];

    offsets.forEach(([dx, dy]) => {
      const nx = x + dx;
      const ny = y + dy;
      const neighbor = this.getCellAt(nx, ny);
      if (neighbor !== undefined) {
        neighbors.push(neighbor);
      }
    });

    return neighbors;
  }

  getAllCells(): EntityId[] {
    return Array.from(this.allCells);
  }

  getPosition(entityId: EntityId): GridPositionComponent | undefined {
    return this.ecs.getComponent<GridPositionComponent>(entityId, 'gridPosition');
  }

  getState(entityId: EntityId): StateComponent | undefined {
    return this.ecs.getComponent<StateComponent>(entityId, 'state');
  }

  getCell(entityId: EntityId): CellComponent | undefined {
    return this.ecs.getComponent<CellComponent>(entityId, 'cell');
  }

  getAliveCount(): number {
    return this.getAllCells().filter(id => {
      const state = this.getState(id);
      return state && state.current === CellState.Alive;
    }).length;
  }

  getTotalCells(): number {
    return this.width * this.height;
  }

  clear(): void {
    this.getAllCells().forEach(id => {
      const state = this.getState(id);
      const cell = this.getCell(id);
      if (state) {
        state.current = CellState.Dead;
        state.next = CellState.Dead;
      }
      if (cell) {
        cell.age = 0;
        cell.generation = 0;
      }
    });
  }

  randomize(probability: number = 0.3): void {
    this.getAllCells().forEach(id => {
      const state = this.getState(id);
      if (state) {
        state.current = Math.random() < probability ? CellState.Alive : CellState.Dead;
        state.next = state.current;
      }
    });
  }
}