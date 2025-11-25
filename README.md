# LittleJS Cellular Automata

A GridWorld-inspired cellular automata simulation built with LittleJS game engine and strict ECS architecture.

## Features

- Multiple automata rules (Game of Life, Brian's Brain, Wireworld, Seeds, HighLife)
- Interactive cell drawing with mouse
- Pause/play, step-by-step, and speed control
- Multiple cell states with color visualization
- Real-time statistics (population, generation, density)
- Efficient spatial grid for performance

## Controls

- **Space**: Pause/Resume simulation
- **R**: Randomize grid
- **C**: Clear grid
- **S**: Step forward one generation (when paused)
- **1-5**: Switch between automata rules
- **Mouse Left Click**: Draw/toggle cells
- **+/-**: Increase/decrease simulation speed

## Getting Started

```bash
npm install
npm run dev
```

## Architecture

Built with strict ECS (Entity-Component-System) architecture:
- **Components**: Pure data (CellComponent, GridPositionComponent, StateComponent)
- **Systems**: Pure logic (AutomataSystem, RenderSystem, InputSystem)
- **Grid Manager**: Efficient 2D spatial indexing for fast neighbor queries

## Automata Rules Included

1. **Conway's Game of Life**: Classic cellular automaton
2. **Brian's Brain**: Three-state automaton with firing neurons
3. **Wireworld**: Electronic circuit simulation
4. **Seeds**: High-growth pattern generator
5. **HighLife**: Game of Life variant with replication
