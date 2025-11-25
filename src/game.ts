import * as LJS from 'littlejsengine';
import { ECS, EventBus } from './ecs';
import { Grid } from './grid';
import { AutomataSystem, RenderSystem, InputSystem, UISystem } from './systems';
import {
  GameOfLife,
  BriansBrain,
  Wireworld,
  Seeds,
  HighLife,
  AutomataRule,
} from './rules';

/**
 * CellularAutomataGame - Main game controller
 */
export class CellularAutomataGame {
  private ecs: ECS;
  private eventBus: EventBus;
  private grid: Grid;
  private automataSystem: AutomataSystem;
  private renderSystem: RenderSystem;
  private inputSystem: InputSystem;
  private uiSystem: UISystem;
  private rules: AutomataRule[];
  private speed: number = 1.0;

  constructor(
    private gridWidth: number,
    private gridHeight: number,
    private cellSize: number
  ) {
    this.ecs = new ECS();
    this.eventBus = new EventBus();
    this.grid = new Grid(this.ecs, gridWidth, gridHeight);

    // Initialize rules
    this.rules = [
      new GameOfLife(),
      new BriansBrain(),
      new Wireworld(),
      new Seeds(),
      new HighLife(),
    ];

    // Initialize systems
    this.automataSystem = new AutomataSystem(this.grid, this.rules[0]);
    this.renderSystem = new RenderSystem(this.grid, cellSize);
    this.inputSystem = new InputSystem(this.grid, cellSize, this.eventBus);
    this.uiSystem = new UISystem(this.grid);

    this.ecs.addSystem(this.automataSystem);
    this.ecs.addSystem(this.inputSystem);
    this.ecs.addSystem(this.uiSystem);

    this.setupEventListeners();
    this.setupCamera();
    this.uiSystem.setRuleName(this.rules[0].name);
  }

  private setupCamera(): void {
    const worldWidth = this.gridWidth * this.cellSize;
    const worldHeight = this.gridHeight * this.cellSize;
    LJS.setCameraPos(LJS.vec2(worldWidth / 2, worldHeight / 2));
    LJS.setCameraScale(30);
  }

  private setupEventListeners(): void {
    this.eventBus.on('input:pause', () => {
      const isPaused = !this.automataSystem.getIsPaused();
      this.automataSystem.setPaused(isPaused);
      this.uiSystem.setPaused(isPaused);
    });

    this.eventBus.on('input:random', () => {
      this.grid.randomize(0.3);
      this.automataSystem.reset();
    });

    this.eventBus.on('input:clear', () => {
      this.grid.clear();
      this.automataSystem.reset();
    });

    this.eventBus.on('input:step', () => {
      if (this.automataSystem.getIsPaused()) {
        this.automataSystem.step();
      }
    });

    this.eventBus.on('input:rule', (event) => {
      const ruleIndex = event.data.ruleIndex;
      if (ruleIndex >= 0 && ruleIndex < this.rules.length) {
        this.automataSystem.setRule(this.rules[ruleIndex]);
        this.uiSystem.setRuleName(this.rules[ruleIndex].name);
        this.grid.clear();
      }
    });

    this.eventBus.on('input:speedUp', () => {
      this.speed = Math.min(this.speed + 0.5, 5.0);
      this.automataSystem.setSpeed(this.speed);
      this.uiSystem.setSpeed(this.speed);
    });

    this.eventBus.on('input:speedDown', () => {
      this.speed = Math.max(this.speed - 0.5, 0.5);
      this.automataSystem.setSpeed(this.speed);
      this.uiSystem.setSpeed(this.speed);
    });
  }

  async init(): Promise<void> {
    // Initialize with random pattern
    this.grid.randomize(0.2);
  }

  update(): void {
    this.ecs.update(LJS.timeDelta);
    this.uiSystem.setGeneration(this.automataSystem.getGeneration());
  }

  updatePost(): void {
    // Post-update logic
  }

  render(): void {
    this.renderSystem.render(this.ecs);
  }

  renderPost(): void {
    // Post-render logic
  }
}
