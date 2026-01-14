/**
 * LevelManager - Loads and manages level progression
 */
export class LevelManager {
    constructor(assetLoader = null) {
        this.levels = [];
        this.currentLevelIndex = -1;
        this.currentLevel = null;
        this.assetLoader = assetLoader;
    }
    
    registerLevel(level) {
        // Pass assetLoader to level
        if (this.assetLoader && level.setAssetLoader) {
            level.setAssetLoader(this.assetLoader);
        }
        this.levels.push(level);
    }
    
    loadLevel(index) {
        if (index < 0 || index >= this.levels.length) {
            console.error(`Level index ${index} out of range`);
            return null;
        }
        
        this.currentLevelIndex = index;
        this.currentLevel = this.levels[index];
        // Ensure assetLoader is set before init
        if (this.assetLoader && this.currentLevel.setAssetLoader) {
            this.currentLevel.setAssetLoader(this.assetLoader);
        }
        this.currentLevel.init();
        
        return this.currentLevel;
    }
    
    nextLevel() {
        if (this.currentLevelIndex < this.levels.length - 1) {
            return this.loadLevel(this.currentLevelIndex + 1);
        }
        return null; // Game complete
    }
    
    getCurrentLevel() {
        return this.currentLevel;
    }
    
    getCurrentLevelIndex() {
        return this.currentLevelIndex;
    }
    
    hasNextLevel() {
        return this.currentLevelIndex < this.levels.length - 1;
    }
    
    getLevelCount() {
        return this.levels.length;
    }
}

