/**
 * Cell state enumeration
 */
export const enum CellState {
  Dead = 0,
  Alive = 1,
  Dying = 2,
  Firing = 3,
  Conductor = 4,
  ElectronHead = 5,
  ElectronTail = 6,
}

/**
 * Get color for cell state
 */
export function getCellColor(state: CellState, age: number = 0): string {
  switch (state) {
    case CellState.Alive:
      // Gradient from green to yellow based on age
      const ageRatio = Math.min(age / 20, 1);
      const r = Math.floor(76 + ageRatio * (255 - 76));
      const g = 175;
      const b = Math.floor(80 - ageRatio * 80);
      return `rgb(${r},${g},${b})`;
    
    case CellState.Dead:
      return '#1a1a1a';
    
    case CellState.Dying:
      return '#ff6b6b';
    
    case CellState.Firing:
      return '#ffd700';
    
    case CellState.Conductor:
      return '#4a90e2';
    
    case CellState.ElectronHead:
      return '#00ffff';
    
    case CellState.ElectronTail:
      return '#ff00ff';
    
    default:
      return '#ffffff';
  }
}
