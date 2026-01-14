/**
 * Level 2 - Village of Bent Tails
 */
import { Level } from './Level.js';
import { Enemy } from '../entities/Enemies/Enemy.js';

export class Level2_VillageOfBentTails extends Level {
    constructor() {
        super('Village of Bent Tails', 2500, 2500);
        this.playerStartX = 300;
        this.playerStartY = 300;
    }
    
    init() {
        this.enemies = [];
        
        // Regular enemies
        for (let i = 0; i < 8; i++) {
            const x = 500 + Math.random() * 1500;
            const y = 500 + Math.random() * 1500;
            this.enemies.push(new Enemy(x, y, Math.random() > 0.5 ? 'basic' : 'fast', this.assetLoader));
        }
        
        // Boss: Pack Leader Zealot
        this.boss = new Enemy(2000, 2000, 'fast', this.assetLoader);
        this.boss.maxHealth = 120;
        this.boss.health = 120;
        this.boss.radius = 20;
        this.boss.color = '#ff8800';
        this.boss.damage = 15;
        this.boss.speed = 120;
        this.enemies.push(this.boss);
    }
    
    update(deltaTime, player, combatSystem) {
        super.update(deltaTime, player, combatSystem);
        
        if (this.boss && this.boss.health <= 0 && !this.completed) {
            this.setCompleted();
        }
        
        if (this.enemies.length === 0 && !this.completed) {
            this.setCompleted();
        }
    }
}

