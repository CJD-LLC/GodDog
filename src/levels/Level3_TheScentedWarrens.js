/**
 * Level 3 - The Scented Warrens
 */
import { Level } from './Level.js';
import { Enemy } from '../entities/Enemies/Enemy.js';

export class Level3_TheScentedWarrens extends Level {
    constructor() {
        super('The Scented Warrens', 3000, 3000);
        this.playerStartX = 400;
        this.playerStartY = 400;
    }
    
    init() {
        this.enemies = [];
        
        // More enemies in tunnels
        for (let i = 0; i < 12; i++) {
            const x = 600 + Math.random() * 1800;
            const y = 600 + Math.random() * 1800;
            this.enemies.push(new Enemy(x, y, 'basic', this.assetLoader));
        }
    }
    
    update(deltaTime, player, combatSystem) {
        super.update(deltaTime, player, combatSystem);
        
        if (this.enemies.length === 0 && !this.completed) {
            this.setCompleted();
        }
    }
}

