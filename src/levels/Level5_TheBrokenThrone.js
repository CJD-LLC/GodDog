/**
 * Level 5 - The Broken Throne
 */
import { Level } from './Level.js';
import { Enemy } from '../entities/Enemies/Enemy.js';

export class Level5_TheBrokenThrone extends Level {
    constructor() {
        super('The Broken Throne', 2500, 2500);
        this.playerStartX = 500;
        this.playerStartY = 500;
        this.bossPhase = 1;
    }
    
    init() {
        this.enemies = [];
        
        // Boss: The Leashbearer (multi-phase)
        this.boss = new Enemy(2000, 2000, 'tank', this.assetLoader);
        this.boss.maxHealth = 300;
        this.boss.health = 300;
        this.boss.radius = 32;
        this.boss.color = '#ff0000';
        this.boss.damage = 30;
        this.boss.speed = 70;
        this.enemies.push(this.boss);
    }
    
    update(deltaTime, player, combatSystem) {
        super.update(deltaTime, player, combatSystem);
        
        // Phase transitions
        if (this.boss && this.boss.health <= 200 && this.bossPhase === 1) {
            this.bossPhase = 2;
            this.boss.speed = 100;
            this.boss.damage = 35;
        }
        
        if (this.boss && this.boss.health <= 100 && this.bossPhase === 2) {
            this.bossPhase = 3;
            this.boss.speed = 120;
            this.boss.damage = 40;
        }
        
        if (this.boss && this.boss.health <= 0 && !this.completed) {
            this.setCompleted();
        }
    }
}

