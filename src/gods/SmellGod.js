/**
 * SmellGod - Detection/debuff abilities
 */
import { God } from './God.js';

export class SmellGod extends God {
    constructor() {
        super('The All-Nose', 'God of Smell - Detects and reveals');
        this.maxCooldown = 10; // 10 second cooldown
        this.cooldown = 0;
        this.revealDuration = 5; // 5 seconds of reveal
        this.revealActive = false;
        this.revealTime = 0;
        this.revealedEnemies = new Set();
    }
    
    activate() {
        super.activate();
    }
    
    deactivate() {
        super.deactivate();
        this.revealActive = false;
        this.revealTime = 0;
        this.revealedEnemies.clear();
    }
    
    update(deltaTime) {
        super.update(deltaTime);
        
        if (this.revealActive) {
            this.revealTime -= deltaTime / 1000;
            if (this.revealTime <= 0) {
                this.revealActive = false;
                this.revealedEnemies.clear();
            }
        }
    }
    
    useAbility(player) {
        if (!super.useAbility(player)) return false;
        
        // Reveal all enemies and their weak points
        this.revealActive = true;
        this.revealTime = this.revealDuration;
        this.cooldown = this.maxCooldown;
        
        // Create reveal visual effect
        if (this.effectsManager && player) {
            const pos = player.getPosition();
            this.effectsManager.createMagic(pos.x, pos.y, '#ffa500', 20);
        }
        
        return true;
    }
    
    passiveEffect(player, deltaTime) {
        // Passive: Increased detection range
        // Enemies are visible through walls (handled in rendering)
        
        // Scent trails reveal enemy paths
        if (this.effectsManager && player && Math.random() < 0.05) {
            const pos = player.getPosition();
            this.effectsManager.createScentTrail(pos.x, pos.y);
        }
    }
    
    onAttack(player) {
        // Attacks apply debuff to enemies (slower movement)
        return true;
    }
    
    modifyDamage(damage) {
        // Revealed enemies take 25% more damage
        return damage * 1.25;
    }
    
    revealEnemy(enemy) {
        if (this.revealActive) {
            this.revealedEnemies.add(enemy);
        }
    }
    
    isEnemyRevealed(enemy) {
        return this.revealedEnemies.has(enemy);
    }
    
    isRevealActive() {
        return this.revealActive;
    }
}

