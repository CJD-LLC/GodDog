/**
 * Combat - Attack hitboxes, damage calculation, hit detection
 */
import { circleVsCircle } from '../utils/Collision.js';

export class CombatSystem {
    constructor(effectsManager = null) {
        this.hitEffects = [];
        this.effectsManager = effectsManager;
    }
    
    setEffectsManager(effectsManager) {
        this.effectsManager = effectsManager;
    }
    
    checkHit(attacker, target) {
        const attackHitbox = attacker.getAttackHitbox();
        if (!attackHitbox) return false;
        
        const targetHitbox = target.getCollisionCircle();
        if (!targetHitbox) return false;
        
        return circleVsCircle(attackHitbox, targetHitbox);
    }
    
    applyDamage(attacker, target, baseDamage) {
        if (!this.checkHit(attacker, target)) return false;
        
        // Calculate final damage (can be modified by god abilities, etc.)
        let damage = baseDamage;
        
        // Apply damage
        const hit = target.takeDamage(damage);
        
        if (hit) {
            const targetPos = target.getPosition();
            
            // Create visual effects
            if (this.effectsManager) {
                this.effectsManager.createHitSparks(targetPos.x, targetPos.y);
                this.effectsManager.createBlood(targetPos.x, targetPos.y);
                
                // Create slash effect at hit location
                const attackHitbox = attacker.getAttackHitbox();
                if (attackHitbox) {
                    const direction = targetPos.subtract(attacker.getPosition()).normalize();
                    this.effectsManager.createSlash(targetPos.x, targetPos.y, direction);
                }
            }
            
            // Create damage number effect
            this.hitEffects.push({
                x: targetPos.x,
                y: targetPos.y,
                time: 0.5,
                damage: damage,
                offsetY: -20 + Math.random() * 10
            });
        }
        
        return hit;
    }
    
    update(deltaTime) {
        // Update hit effects
        for (let i = this.hitEffects.length - 1; i >= 0; i--) {
            this.hitEffects[i].time -= deltaTime / 1000;
            this.hitEffects[i].offsetY -= 30 * (deltaTime / 1000); // Float upward
            if (this.hitEffects[i].time <= 0) {
                this.hitEffects.splice(i, 1);
            }
        }
    }
    
    render(ctx, camera) {
        // Render damage numbers
        ctx.save();
        ctx.font = 'bold 18px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        for (const effect of this.hitEffects) {
            const screenPos = camera.worldToScreen(effect.x, effect.y + effect.offsetY);
            const alpha = Math.min(1, effect.time / 0.2);
            ctx.globalAlpha = alpha;
            ctx.fillStyle = '#ff0000';
            ctx.strokeStyle = '#000000';
            ctx.lineWidth = 2;
            const text = `-${Math.floor(effect.damage)}`;
            ctx.strokeText(text, screenPos.x, screenPos.y);
            ctx.fillText(text, screenPos.x, screenPos.y);
        }
        
        ctx.restore();
    }
}

