/**
 * Camera - 2D camera system with smooth follow and bounds
 */
export class Camera {
    constructor(width, height, worldWidth = Infinity, worldHeight = Infinity) {
        this.width = width;
        this.height = height;
        this.worldWidth = worldWidth;
        this.worldHeight = worldHeight;
        
        this.x = 0;
        this.y = 0;
        this.targetX = 0;
        this.targetY = 0;
        
        this.followSpeed = 0.1;
        this.zoom = 1.0;
        this.targetZoom = 1.0;
        this.zoomSpeed = 0.05;
        
        this.bounds = {
            minX: 0,
            minY: 0,
            maxX: worldWidth,
            maxY: worldHeight
        };
    }
    
    setTarget(x, y) {
        this.targetX = x;
        this.targetY = y;
    }
    
    setZoom(zoom) {
        this.targetZoom = Math.max(0.5, Math.min(2.0, zoom));
    }
    
    setBounds(minX, minY, maxX, maxY) {
        this.bounds = { minX, minY, maxX, maxY };
    }
    
    update() {
        // Smooth follow
        const dx = this.targetX - this.x;
        const dy = this.targetY - this.y;
        this.x += dx * this.followSpeed;
        this.y += dy * this.followSpeed;
        
        // Smooth zoom
        const dz = this.targetZoom - this.zoom;
        this.zoom += dz * this.zoomSpeed;
        
        // Apply bounds
        const halfWidth = (this.width / this.zoom) / 2;
        const halfHeight = (this.height / this.zoom) / 2;
        
        this.x = Math.max(this.bounds.minX + halfWidth, Math.min(this.bounds.maxX - halfWidth, this.x));
        this.y = Math.max(this.bounds.minY + halfHeight, Math.min(this.bounds.maxY - halfHeight, this.y));
    }
    
    worldToScreen(worldX, worldY) {
        return {
            x: (worldX - this.x) * this.zoom + this.width / 2,
            y: (worldY - this.y) * this.zoom + this.height / 2
        };
    }
    
    screenToWorld(screenX, screenY) {
        return {
            x: (screenX - this.width / 2) / this.zoom + this.x,
            y: (screenY - this.height / 2) / this.zoom + this.y
        };
    }
    
    isInView(x, y, radius = 0) {
        const halfWidth = (this.width / this.zoom) / 2;
        const halfHeight = (this.height / this.zoom) / 2;
        
        return x + radius >= this.x - halfWidth &&
               x - radius <= this.x + halfWidth &&
               y + radius >= this.y - halfHeight &&
               y - radius <= this.y + halfHeight;
    }
}

