/**
 * God - Base god class
 */
export class God {
    constructor(name, description) {
        this.name = name;
        this.description = description;
        this.active = false;
        this.approval = 50; // 0-100
        this.cooldown = 0;
        this.maxCooldown = 0;
        this.effectsManager = null;
    }
    
    setEffectsManager(effectsManager) {
        this.effectsManager = effectsManager;
    }
    
    activate() {
        this.active = true;
    }
    
    deactivate() {
        this.active = false;
    }
    
    update(deltaTime) {
        if (this.cooldown > 0) {
            this.cooldown -= deltaTime / 1000;
        }
    }
    
    useAbility(player) {
        if (this.cooldown > 0) return false;
        // Override in subclasses
        return false;
    }
    
    passiveEffect(player, deltaTime) {
        // Override in subclasses
    }
    
    onAttack(player) {
        // Override in subclasses
    }
    
    modifyDamage(baseDamage) {
        return baseDamage;
    }
    
    getCooldownPercent() {
        if (this.maxCooldown === 0) return 1;
        return Math.max(0, Math.min(1, this.cooldown / this.maxCooldown));
    }
}

