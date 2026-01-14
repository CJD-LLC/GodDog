/**
 * LoyaltyGod - Tank/defense abilities
 */
import { God } from './God.js';

export class LoyaltyGod extends God {
    constructor() {
        super('The Loyal One', 'God of Loyalty - Protects and defends');
        this.maxCooldown = 8; // 8 second cooldown
        this.cooldown = 0;
        this.shieldDuration = 3; // 3 seconds of shield
        this.shieldActive = false;
        this.shieldTime = 0;
    }
    
    activate() {
        super.activate();
    }
    
    deactivate() {
        super.deactivate();
        this.shieldActive = false;
        this.shieldTime = 0;
    }
    
    update(deltaTime) {
        super.update(deltaTime);
        
        if (this.shieldActive) {
            this.shieldTime -= deltaTime / 1000;
            if (this.shieldTime <= 0) {
                this.shieldActive = false;
            }
        }
    }
    
    useAbility(player) {
        if (!super.useAbility(player)) return false;
        
        // Activate shield - reduces incoming damage by 50%
        this.shieldActive = true;
        this.shieldTime = this.shieldDuration;
        this.cooldown = this.maxCooldown;
        
        // Create shield aura visual effect
        if (this.effectsManager && player) {
            const pos = player.getPosition();
            this.effectsManager.createShieldAura(pos.x, pos.y, this.shieldDuration);
            this.effectsManager.createMagic(pos.x, pos.y, '#00ffff', 15);
        }
        
        return true;
    }
    
    passiveEffect(player, deltaTime) {
        // Passive: +20% max health
        const healthBoost = 0.2;
        const baseMaxHealth = 100;
        player.maxHealth = baseMaxHealth * (1 + healthBoost);
        
        // Regenerate health slowly
        if (player.health < player.maxHealth) {
            player.heal(5 * deltaTime); // 5 HP per second
        }
    }
    
    modifyDamage(damage) {
        if (this.shieldActive) {
            return damage * 0.5; // 50% damage reduction
        }
        return damage;
    }
    
    isShieldActive() {
        return this.shieldActive;
    }
}

