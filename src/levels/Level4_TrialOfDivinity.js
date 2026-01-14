/**
 * Level 4 - Trial of Divinity
 */
import { Level } from './Level.js';
import { Enemy } from '../entities/Enemies/Enemy.js';

export class Level4_TrialOfDivinity extends Level {
    constructor() {
        super('Trial of Divinity', 2000, 2000);
        this.playerStartX = 1000;
        this.playerStartY = 1000;
    }
    
    init() {
        this.enemies = [];
        
        // Boss: Avatar of False Obedience
        this.boss = new Enemy(1000, 1000, 'tank', this.assetLoader);
        this.boss.maxHealth = 200;
        this.boss.health = 200;
        this.boss.radius = 28;
        this.boss.color = '#8800ff';
        this.boss.damage = 25;
        this.boss.speed = 60;
        this.enemies.push(this.boss);
    }
    
    update(deltaTime, player, combatSystem) {
        super.update(deltaTime, player, combatSystem);
        
        if (this.boss && this.boss.health <= 0 && !this.completed) {
            this.setCompleted();
        }
    }
}

