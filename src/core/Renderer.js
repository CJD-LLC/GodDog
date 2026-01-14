/**
 * Renderer - Manages Canvas 2D context, camera, and rendering pipeline
 */
export class Renderer {
    constructor(canvasId = 'gameCanvas') {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) {
            throw new Error(`Canvas element with id "${canvasId}" not found`);
        }
        
        this.ctx = this.canvas.getContext('2d');
        
        // Initialize rendering layers first
        this.layers = {
            background: this.createOffscreenCanvas(),
            world: this.createOffscreenCanvas(),
            effects: this.createOffscreenCanvas(),
            ui: this.canvas
        };
        
        // Now set size (which uses this.layers)
        this.setSize(window.innerWidth, window.innerHeight);
        
        // Handle window resize
        window.addEventListener('resize', () => {
            this.setSize(window.innerWidth, window.innerHeight);
        });
    }
    
    createOffscreenCanvas() {
        const canvas = document.createElement('canvas');
        // Use current canvas size or default
        canvas.width = this.canvas ? this.canvas.width : window.innerWidth;
        canvas.height = this.canvas ? this.canvas.height : window.innerHeight;
        return canvas;
    }
    
    setSize(width, height) {
        this.canvas.width = width;
        this.canvas.height = height;
        this.width = width;
        this.height = height;
        
        // Update offscreen canvases (if layers are initialized)
        if (this.layers) {
            Object.keys(this.layers).forEach(key => {
                if (this.layers[key] !== this.canvas) {
                    this.layers[key].width = width;
                    this.layers[key].height = height;
                }
            });
        }
    }
    
    clear() {
        // Clear all layers
        Object.values(this.layers).forEach(layer => {
            const ctx = layer === this.canvas ? this.ctx : layer.getContext('2d');
            ctx.clearRect(0, 0, layer.width, layer.height);
        });
    }
    
    getContext(layer = 'world') {
        if (layer === 'ui') {
            return this.ctx;
        }
        return this.layers[layer].getContext('2d');
    }
    
    render(camera) {
        // Clear main canvas
        this.ctx.clearRect(0, 0, this.width, this.height);
        
        // Draw background layer
        this.ctx.drawImage(this.layers.background, 0, 0);
        
        // Draw world layer with camera transform
        this.ctx.save();
        if (camera) {
            this.ctx.translate(-camera.x + this.width / 2, -camera.y + this.height / 2);
        }
        this.ctx.drawImage(this.layers.world, 0, 0);
        this.ctx.restore();
        
        // Draw effects layer
        this.ctx.drawImage(this.layers.effects, 0, 0);
        
        // UI layer is drawn directly on main canvas (after this method returns)
    }
    
    getCanvas() {
        return this.canvas;
    }
    
    getWidth() {
        return this.width;
    }
    
    getHeight() {
        return this.height;
    }
}

