import { System, ECS } from '../ecs';
import { Grid } from '../grid';

/**
 * UISystem - Updates UI elements
 */
export class UISystem extends System {
  private generation: number = 0;
  private ruleName: string = '';
  private isPaused: boolean = false;
  private speed: number = 1.0;

  constructor(private grid: Grid) {
    super();
  }

  setGeneration(gen: number): void {
    this.generation = gen;
  }

  setRuleName(name: string): void {
    this.ruleName = name;
  }

  setPaused(paused: boolean): void {
    this.isPaused = paused;
  }

  setSpeed(speed: number): void {
    this.speed = speed;
  }

  update(_ecs: ECS, _deltaTime: number): void {
    const population = this.grid.getAliveCount();
    const density = (population / this.grid.getTotalCells()) * 100;

    this.updateElement('generation', this.generation.toString());
    this.updateElement('population', population.toString());
    this.updateElement('density', density.toFixed(2) + '%');
    this.updateElement('rule', this.ruleName);
    this.updateElement('speed', this.speed.toFixed(1) + 'x');
    this.updateStatusElement(this.isPaused ? 'Paused' : 'Running');
  }

  private updateElement(id: string, value: string): void {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
  }

  private updateStatusElement(value: string): void {
    const el = document.getElementById('status');
    if (el) {
      el.textContent = value;
      el.className = 'value ' + (value === 'Running' ? 'running' : 'paused');
    }
  }
}
