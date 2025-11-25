import { Component } from '../ecs';

/**
 * GridPositionComponent - Position in grid
 */
export interface GridPositionComponent extends Component {
  type: 'gridPosition';
  x: number;
  y: number;
}