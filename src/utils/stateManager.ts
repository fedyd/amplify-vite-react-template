// src/utils/stateManager.ts

type StateListenerType<T> = (state: T, eventMeta?: any) => void;

export class StateManager<T = any> {
    private state: T;
    
    constructor(initState: T) {
       this.state = initState;
    }
 
    getState() {
       return this.state;
    }

    private listeners: Array<StateListenerType<T>> = [];
    
    subscribe(listener: StateListenerType<T>) {
       this.listeners = [...this.listeners, listener];
    }

    unsubscribe(listener: StateListenerType<T>) {
      this.listeners = this.listeners.filter((l) => l !== listener);
    }

    updateState(newState: Partial<T>, eventMeta?: any) {
        this.state = { ...this.state, ...newState };
        // notify all listenres that state is changed
        this.listeners.forEach((l) => l(this.state, eventMeta));
    }
 }