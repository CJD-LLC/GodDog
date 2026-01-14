/**
 * SpeedGod - Mobility/crit abilities
 */
import { God } from './God.js';

export class SpeedGod extends God {
    constructor() {
        super('The Swift One', 'God of Speed - Fast and agile');
        this.maxCooldown = 6; // 6 second cooldown
        this.cooldown = 0;
        this.dashDuration = 0.3; // 300ms dash
        this.dashActive = false;
        this.dashTime = 0;
        this.dashSpeed = 600;
    }
    
    activate() {
        super.activate();
    }
    
    deactivate() {
        super.deactivate();
        this.dashActive = false;
        this.dashTime = 0;
    }
    
    update(deltaTime) {
        super.update(deltaTime);
        
        if (this.dashActive) {
            this.dashTime -= deltaTime / 1000;
            if (this.dashTime <= 0) {
                this.dashActive = false;
            }
        }
    }
    
    useAbility(player) {
        if (!super.useAbility(player)) return false;
        
        // Dash ability - quick burst of movement
        this.dashActive = true;
        this.dashTime = this.dashDuration;
        this.cooldown = this.maxCooldown;
        
        // Boost player speed temporarily
        const originalSpeed = player.speed;
        player.speed = this.dashSpeed;
        
        // Create speed trail visual effect
        if (this.effectsManager && player) {
            const pos = player.getPosition();
            const vel = player.velocity;
            if (vel.length() > 0) {
                this.effectsManager.createSpeedTrail(pos.x, pos.y, vel.normalize());
            }
            this.effectsManager.createMagic(pos.x, pos.y, '#6495ed', 10);
        }
        
        setTimeout(() => {
            if (player.speed === this.dashSpeed) {
                player.speed = originalSpeed;
            }
        }, this.dashDuration * 1000);
        
        return true;
    }
    
    passiveEffect(player, deltaTime) {
        // Passive: +30% movement speed
        const baseSpeed = 200;
        player.speed = baseSpeed * 1.3;
        
        // Faster dodge cooldown
        if (player.dodgeCooldown > 0) {
            player.dodgeCooldown -= deltaTime * 0.5; // 50% faster cooldown
        }
        
        // Create speed trail particles when moving
        if (this.effectsManager && player && player.velocity.length() > 0 && Math.random() < 0.1) {
            const pos = player.getPosition();
            this.effectsManager.createSpeedTrail(pos.x, pos.y, player.velocity.normalize());
        }
    }
    
    onAttack(player) {
        // 30% chance for critical hit (handled by combat system)
        return Math.random() < 0.3;
    }
    
    modifyDamage(damage) {
        // Critical hits do 2x damage
        if (this.onAttack(null)) {
            return damage * 2;
        }
        return damage;
    }
    
    isDashActive() {
        return this.dashActive;
    }
}

