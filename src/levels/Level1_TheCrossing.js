/**
 * Level 1 - The Crossing
 */
import { Level } from './Level.js';
import { Enemy } from '../entities/Enemies/Enemy.js';

export class Level1_TheCrossing extends Level {
    constructor() {
        super('The Crossing', 2000, 2000);
        this.playerStartX = 200;
        this.playerStartY = 200;
    }
    
    init() {
        // Spawn basic enemies
        this.enemies = [];
        
        // Add some enemies around the map
        for (let i = 0; i < 5; i++) {
            const x = 400 + Math.random() * 1200;
            const y = 400 + Math.random() * 1200;
            this.enemies.push(new Enemy(x, y, 'basic', this.assetLoader));
        }
        
        // Boss: Corrupted Watchdog
        this.boss = new Enemy(1500, 1500, 'tank', this.assetLoader);
        this.boss.maxHealth = 150;
        this.boss.health = 150;
        this.boss.radius = 24;
        this.boss.color = '#660000';
        this.boss.damage = 20;
        this.boss.speed = 40;
        this.enemies.push(this.boss);
    }
    
    update(deltaTime, player, combatSystem) {
        super.update(deltaTime, player, combatSystem);
        
        // Check if boss is defeated
        if (this.boss && this.boss.health <= 0 && !this.completed) {
            this.setCompleted();
        }
        
        // Complete level when all enemies defeated
        if (this.enemies.length === 0 && !this.completed) {
            this.setCompleted();
        }
    }
}

