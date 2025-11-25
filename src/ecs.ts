/**
 * Entity ID type - just a number
 */
export type EntityId = number;

/**
 * Component interface - all components must have a type discriminator
 */
export interface Component {
  type: string;
}

/**
 * Game event for EventBus
 */
export interface GameEvent {
  type: string;
  data: any;
}

/**
 * ECS - Entity Component System core
 */
export class ECS {
  private nextEntityId: EntityId = 0;
  private entities: Set<EntityId> = new Set();
  private components: Map<string, Map<EntityId, Component>> = new Map();
  private systems: System[] = [];

  createEntity(): EntityId {
    const id = this.nextEntityId++;
    this.entities.add(id);
    return id;
  }

  addComponent(entityId: EntityId, component: Component): void {
    if (!this.components.has(component.type)) {
      this.components.set(component.type, new Map());
    }
    this.components.get(component.type)!.set(entityId, component);
  }

  getComponent<T extends Component>(
    entityId: EntityId,
    type: string
  ): T | undefined {
    return this.components.get(type)?.get(entityId) as T | undefined;
  }

  removeComponent(entityId: EntityId, type: string): void {
    this.components.get(type)?.delete(entityId);
  }

  removeEntity(entityId: EntityId): void {
    this.entities.delete(entityId);
    this.components.forEach((componentMap) => componentMap.delete(entityId));
  }

  getEntitiesWith(...componentTypes: string[]): EntityId[] {
    return Array.from(this.entities).filter((entityId) => {
      return componentTypes.every((type) =>
        this.components.get(type)?.has(entityId)
      );
    });
  }

  addSystem(system: System): void {
    this.systems.push(system);
  }

  update(deltaTime: number): void {
    this.systems.forEach((system) => system.update(this, deltaTime));
  }

  getAllEntities(): EntityId[] {
    return Array.from(this.entities);
  }

  clear(): void {
    this.entities.clear();
    this.components.clear();
  }
}

/**
 * System base class
 */
export class System {
  update(_ecs: ECS, _deltaTime: number): void {
    // Override in subclasses
  }
}

/**
 * EventBus for system communication
 */
export class EventBus {
  private listeners: Map<string, ((event: GameEvent) => void)[]> = new Map();

  emit(event: GameEvent): void {
    this.listeners.get(event.type)?.forEach((callback) => callback(event));
  }

  on(eventType: string, callback: (event: GameEvent) => void): void {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, []);
    }
    this.listeners.get(eventType)!.push(callback);
  }

  off(eventType: string, callback: (event: GameEvent) => void): void {
    const listeners = this.listeners.get(eventType);
    if (listeners) {
      const index = listeners.indexOf(callback);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }
}

/**
 * EntityBuilder - fluent API for creating entities
 */
export class EntityBuilder {
  constructor(
    private ecs: ECS,
    private entityId: EntityId
  ) {}

  withComponent<T extends Component>(component: T): this {
    this.ecs.addComponent(this.entityId, component);
    return this;
  }

  build(): EntityId {
    return this.entityId;
  }

  static create(ecs: ECS): EntityBuilder {
    return new EntityBuilder(ecs, ecs.createEntity());
  }
}
