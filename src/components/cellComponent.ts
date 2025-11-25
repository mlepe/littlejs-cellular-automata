import { Component } from '../ecs';

/**
 * CellComponent - Marks an entity as a cell
 */
export interface CellComponent extends Component {
  type: 'cell';
  age: number;
  generation: number;
}