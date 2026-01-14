/**
 * GodManager - Manages active god, switching, approval system
 */
export class GodManager {
    constructor() {
        this.gods = {};
        this.activeGod = null;
        this.previousGod = null;
    }
    
    registerGod(name, god) {
        this.gods[name] = god;
    }
    
    switchGod(name) {
        if (!this.gods[name]) {
            console.error(`God "${name}" not found`);
            return false;
        }
        
        // Deactivate current god
        if (this.activeGod) {
            this.activeGod.deactivate();
            this.previousGod = this.activeGod;
            
            // Jealousy: previous god loses approval
            this.activeGod.approval = Math.max(0, this.activeGod.approval - 10);
        }
        
        // Activate new god
        this.activeGod = this.gods[name];
        this.activeGod.activate();
        
        // Approval boost for chosen god
        this.activeGod.approval = Math.min(100, this.activeGod.approval + 5);
        
        return true;
    }
    
    getActiveGod() {
        return this.activeGod;
    }
    
    getAllGods() {
        return Object.values(this.gods);
    }
    
    getGod(name) {
        return this.gods[name];
    }
    
    update(deltaTime) {
        // Update all gods
        Object.values(this.gods).forEach(god => {
            god.update(deltaTime);
        });
    }
    
    useActiveGodAbility(player) {
        if (this.activeGod) {
            return this.activeGod.useAbility(player);
        }
        return false;
    }
}

