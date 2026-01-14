/**
 * GameLoop - Main game loop (update/render)
 */
export class GameLoop {
    constructor(stateManager, renderer, camera) {
        this.stateManager = stateManager;
        this.renderer = renderer;
        this.camera = camera;
        
        this.running = false;
        this.lastTime = 0;
        this.accumulator = 0;
        this.frameTime = 1000 / 60; // Target 60 FPS
        
        this.stats = {
            fps: 0,
            frameCount: 0,
            lastFpsUpdate: 0
        };
    }
    
    start() {
        if (this.running) return;
        
        this.running = true;
        this.lastTime = performance.now();
        this.loop();
    }
    
    stop() {
        this.running = false;
    }
    
    loop(currentTime = performance.now()) {
        if (!this.running) return;
        
        const deltaTime = currentTime - this.lastTime;
        this.lastTime = currentTime;
        
        // Cap deltaTime to prevent large jumps
        const clampedDelta = Math.min(deltaTime, 100);
        
        // Update FPS counter
        this.updateStats(currentTime);
        
        // Update game
        this.update(clampedDelta);
        
        // Render
        this.render();
        
        requestAnimationFrame((time) => this.loop(time));
    }
    
    update(deltaTime, input) {
        // IMPORTANT: Check input BEFORE clearing it
        // States need to check keysPressed before input.update() clears them
        // So we check here, then update input, then update state
        
        // Update camera
        if (this.camera) {
            this.camera.update();
        }
        
        // Update current state (input.update() is called in main.js before this)
        const nextState = this.stateManager.update(deltaTime, input);
        if (nextState) {
            this.stateManager.changeState(nextState);
        }
    }
    
    render() {
        this.renderer.clear();
        
        // Render state to layers (world, effects layers) - NOT UI yet
        // We need to render UI after compositing layers
        const state = this.stateManager.getCurrentState();
        
        // Render world/effects layers
        if (state && state.render) {
            // Temporarily override getContext to skip UI rendering
            const originalGetContext = this.renderer.getContext.bind(this.renderer);
            this.renderer.getContext = function(layer) {
                if (layer === 'ui') {
                    // Skip UI for now, return a dummy context
                    return originalGetContext('world'); // Use world context as placeholder
                }
                return originalGetContext(layer);
            };
            
            state.render(this.renderer, this.camera);
            
            // Restore getContext
            this.renderer.getContext = originalGetContext;
        }
        
        // Composite all layers to main canvas
        this.renderer.render(this.camera);
        
        // Now render UI on top of everything (UI renders directly to main canvas)
        // Re-render state to draw UI - this is safe since world/effects layers are already composited
        if (state && state.render) {
            state.render(this.renderer, this.camera);
        }
    }
    
    updateStats(currentTime) {
        this.stats.frameCount++;
        
        if (currentTime - this.stats.lastFpsUpdate >= 1000) {
            this.stats.fps = this.stats.frameCount;
            this.stats.frameCount = 0;
            this.stats.lastFpsUpdate = currentTime;
        }
    }
    
    getFPS() {
        return this.stats.fps;
    }
}

