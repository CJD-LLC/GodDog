/**
 * Base - Main hub scene ("The Kennel of Balance")
 */
export class Base {
    constructor() {
        this.width = 1500;
        this.height = 1500;
        this.buildings = [];
    }
    
    init() {
        // Initialize buildings
        this.buildings = [
            { type: 'shrine', x: 400, y: 400, width: 100, height: 100 },
            { type: 'foodBowl', x: 800, y: 400, width: 80, height: 80 },
            { type: 'trainingYard', x: 600, y: 800, width: 120, height: 120 }
        ];
    }
    
    update(deltaTime, player, input) {
        // Check building interactions
        if (input.isKeyPressed('KeyE')) {
            const playerPos = player.getPosition();
            for (const building of this.buildings) {
                const distance = Math.sqrt(
                    Math.pow(playerPos.x - building.x, 2) + 
                    Math.pow(playerPos.y - building.y, 2)
                );
                if (distance < 100) {
                    return building.type; // Return building type for interaction
                }
            }
        }
        return null;
    }
    
    render(ctx, camera) {
        // Render background
        ctx.fillStyle = '#1a2a1a';
        ctx.fillRect(0, 0, camera.width, camera.height);
        
        // Render tiles
        const tileSize = 64;
        const startX = Math.floor((camera.x - camera.width / 2 / camera.zoom) / tileSize);
        const startY = Math.floor((camera.y - camera.height / 2 / camera.zoom) / tileSize);
        const endX = Math.ceil((camera.x + camera.width / 2 / camera.zoom) / tileSize);
        const endY = Math.ceil((camera.y + camera.height / 2 / camera.zoom) / tileSize);
        
        ctx.fillStyle = '#0a1a0a';
        for (let y = startY; y <= endY; y++) {
            for (let x = startX; x <= endX; x++) {
                const screenPos = camera.worldToScreen(x * tileSize, y * tileSize);
                ctx.fillRect(screenPos.x, screenPos.y, tileSize * camera.zoom, tileSize * camera.zoom);
            }
        }
        
        // Render buildings
        for (const building of this.buildings) {
            const screenPos = camera.worldToScreen(building.x, building.y);
            
            ctx.fillStyle = '#4a4a2a';
            ctx.fillRect(
                screenPos.x - building.width / 2 * camera.zoom,
                screenPos.y - building.height / 2 * camera.zoom,
                building.width * camera.zoom,
                building.height * camera.zoom
            );
            
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 2;
            ctx.strokeRect(
                screenPos.x - building.width / 2 * camera.zoom,
                screenPos.y - building.height / 2 * camera.zoom,
                building.width * camera.zoom,
                building.height * camera.zoom
            );
            
            // Building label
            ctx.fillStyle = '#ffffff';
            ctx.font = '12px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(building.type, screenPos.x, screenPos.y + building.height / 2 * camera.zoom + 15);
        }
    }
}

