/**
 * StateManager - Game state machine
 */
export class StateManager {
    constructor() {
        this.states = {};
        this.currentState = null;
        this.previousState = null;
    }
    
    registerState(name, state) {
        this.states[name] = state;
        if (state.init) {
            state.init();
        }
    }
    
    changeState(nameOrState, ...args) {
        let name, stateArgs;
        
        // Handle state object with parameters
        if (typeof nameOrState === 'object' && nameOrState.state) {
            name = nameOrState.state;
            stateArgs = nameOrState.levelIndex !== undefined ? [nameOrState.levelIndex] : args;
        } else {
            name = nameOrState;
            stateArgs = args;
        }
        
        if (!this.states[name]) {
            console.error(`State "${name}" not found`);
            return;
        }
        
        // Exit current state
        if (this.currentState && this.currentState.exit) {
            this.currentState.exit();
        }
        
        this.previousState = this.currentState;
        this.currentState = this.states[name];
        
        // Enter new state
        if (this.currentState && this.currentState.enter) {
            this.currentState.enter(...stateArgs);
        }
    }
    
    update(deltaTime, input) {
        if (this.currentState && this.currentState.update) {
            return this.currentState.update(deltaTime, input);
        }
        return null;
    }
    
    render(renderer, camera) {
        if (this.currentState && this.currentState.render) {
            this.currentState.render(renderer, camera);
        }
    }
    
    getCurrentState() {
        return this.currentState;
    }
    
    getPreviousState() {
        return this.previousState;
    }
}

