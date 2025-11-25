import { Component } from '../ecs';
import { CellState } from '../types';

/**
 * StateComponent - Current state of cell
 */
export interface StateComponent extends Component {
  type: 'state';
  current: CellState;
  next: CellState;
}