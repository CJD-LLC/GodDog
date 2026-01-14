/**
 * Resources - Resource types, generation, spending
 */
export class Resources {
    constructor() {
        this.bones = 0;
        this.devotion = 0;
        this.followers = 0;
    }
    
    addBones(amount) {
        this.bones += amount;
    }
    
    addDevotion(amount) {
        this.devotion += amount;
    }
    
    addFollower() {
        this.followers++;
    }
    
    spendBones(amount) {
        if (this.bones >= amount) {
            this.bones -= amount;
            return true;
        }
        return false;
    }
    
    spendDevotion(amount) {
        if (this.devotion >= amount) {
            this.devotion -= amount;
            return true;
        }
        return false;
    }
    
    getBones() {
        return this.bones;
    }
    
    getDevotion() {
        return this.devotion;
    }
    
    getFollowers() {
        return this.followers;
    }
}

