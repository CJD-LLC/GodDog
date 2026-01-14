/**
 * Level - Base level class
 */
import { circleVsCircle } from '../utils/Collision.js';
import { TileMap } from '../utils/TileMap.js';

export class Level {
    constructor(name, width, height) {
        this.name = name;
        this.width = width;
        this.height = height;
        this.enemies = [];
        this.npcs = [];
        this.backgroundTiles = [];
        this.completed = false;
        this.playerStartX = width / 2;
        this.playerStartY = height / 2;
        this.assetLoader = null;
        this.tileMap = new TileMap(64);
        this.tileMap.setDimensions(Math.ceil(width / 64), Math.ceil(height / 64));
    }
    
    setAssetLoader(assetLoader) {
        this.assetLoader = assetLoader;
        this.initTileMap();
    }
    
    initTileMap() {
        // Override in subclasses to set up tile map
        // Default: fill with ground tiles
        if (this.assetLoader) {
            const groundImage = this.assetLoader.getImage('tile_ground');
            if (groundImage) {
                this.tileMap.registerTileSet('ground', groundImage);
                // Fill entire map with tile ID 1 (first tile)
                this.tileMap.fillArea(0, 0, this.tileMap.width - 1, this.tileMap.height - 1, 1);
            }
        }
    }
    
    init() {
        // Override in subclasses
    }
    
    update(deltaTime, player, combatSystem) {
        // Update enemies
        for (let i = this.enemies.length - 1; i >= 0; i--) {
            const enemy = this.enemies[i];
            enemy.update(deltaTime, player, this.enemies);
            
            // Check combat
            if (player.attackDuration > 0) {
                const hit = combatSystem.applyDamage(player, enemy, 15);
                if (hit && enemy.health <= 0) {
                    this.enemies.splice(i, 1);
                }
            }
            
            // Enemy attacks player
            if (enemy.attackCooldown > 0.9) {
                const enemyHitbox = enemy.getAttackHitbox();
                if (enemyHitbox) {
                    const playerHitbox = player.getCollisionCircle();
                    if (circleVsCircle(enemyHitbox, playerHitbox)) {
                        const damage = enemy.damage;
                        player.takeDamage(damage);
                    }
                }
            }
        }
        
        // Update NPCs
        this.npcs.forEach(npc => {
            if (npc.update) {
                npc.update(deltaTime, player);
            }
        });
    }
    
    render(ctx, camera) {
        // Render background tiles
        this.renderBackground(ctx, camera);
        
        // Render enemies
        this.enemies.forEach(enemy => {
            enemy.render(ctx, camera);
        });
        
        // Render NPCs
        this.npcs.forEach(npc => {
            if (npc.render) {
                npc.render(ctx, camera);
            }
        });
    }
    
    renderBackground(ctx, camera) {
        // Fill background with dark color
        ctx.fillStyle = '#2a2a2a';
        ctx.fillRect(0, 0, camera.width, camera.height);
        
        // Render tile map if available
        if (this.tileMap && this.assetLoader) {
            this.tileMap.render(ctx, camera, 'ground');
        } else {
            // Fallback: simple grid pattern
            const tileSize = 64;
            const startX = Math.floor((camera.x - camera.width / 2 / camera.zoom) / tileSize);
            const startY = Math.floor((camera.y - camera.height / 2 / camera.zoom) / tileSize);
            const endX = Math.ceil((camera.x + camera.width / 2 / camera.zoom) / tileSize);
            const endY = Math.ceil((camera.y + camera.height / 2 / camera.zoom) / tileSize);
            
            ctx.fillStyle = '#1a1a1a';
            for (let y = startY; y <= endY; y++) {
                for (let x = startX; x <= endX; x++) {
                    const screenPos = camera.worldToScreen(x * tileSize, y * tileSize);
                    ctx.fillRect(screenPos.x, screenPos.y, tileSize * camera.zoom, tileSize * camera.zoom);
                }
            }
        }
    }
    
    addEnemy(enemy) {
        this.enemies.push(enemy);
    }
    
    addNPC(npc) {
        this.npcs.push(npc);
    }
    
    isCompleted() {
        return this.completed;
    }
    
    setCompleted() {
        this.completed = true;
    }
    
    getPlayerStart() {
        return { x: this.playerStartX, y: this.playerStartY };
    }
}

