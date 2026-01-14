/**
 * BaseState - Hub/base state
 */
import { Player } from '../entities/Player.js';
import { Base } from '../base/Base.js';
import { HUD } from '../ui/HUD.js';
import { FollowerManager } from '../base/Followers.js';

export class BaseState {
    constructor(levelManager, godManager, resources) {
        this.levelManager = levelManager;
        this.godManager = godManager;
        this.resources = resources;
        this.base = new Base();
        this.player = null;
        this.hud = new HUD();
        this.followerManager = new FollowerManager();
        this.camera = null;
    }
    
    init() {
        this.base.init();
        
        // Place player at base center
        this.player = new Player(750, 750);
        
        if (this.camera) {
            this.camera.setTarget(this.player.position.x, this.player.position.y);
            this.camera.setBounds(0, 0, this.base.width, this.base.height);
        }
    }
    
    enter() {
        this.init();
    }
    
    exit() {
        // Cleanup
    }
    
    update(deltaTime, input) {
        if (this.player) {
            this.player.update(deltaTime, input);
            
            // Update followers
            this.followerManager.update(deltaTime, this.player);
            
            if (this.camera) {
                this.camera.setTarget(this.player.position.x, this.player.position.y);
                this.camera.update();
            }
            
            // Check building interactions
            const building = this.base.update(deltaTime, this.player, input);
            if (building === 'shrine') {
                // Open god selection (for now, just switch gods)
                // In full implementation, show UI
            } else if (building === 'foodBowl') {
                // Open resource management
            } else if (building === 'trainingYard') {
                // Open upgrades
            }
            
            // Start next level
            if (input.isKeyPressed('KeyE') || input.isKeyPressed('Enter')) {
                const currentIndex = this.levelManager.getCurrentLevelIndex();
                const nextLevelIndex = currentIndex + 1;
                
                // Check if next level exists
                if (nextLevelIndex < this.levelManager.getLevelCount()) {
                    return { state: 'playing', levelIndex: nextLevelIndex };
                } else {
                    // All levels complete
                    console.log('All levels completed!');
                    return { state: 'playing', levelIndex: 0 }; // Restart or show victory
                }
            }
        }
        
        return null;
    }
    
    render(renderer, camera) {
        this.camera = camera;
        
        const ctx = renderer.getContext('world');
        this.base.render(ctx, camera);
        
        if (this.player) {
            this.player.render(ctx, camera);
        }
        
        // Render followers
        this.followerManager.render(ctx, camera);
        
        // Render UI
        const uiCtx = renderer.getContext('ui');
        this.hud.setSize(renderer.getWidth(), renderer.getHeight());
        this.hud.render(uiCtx, this.player, this.godManager, this.resources);
        
        // Instructions
        ctx.save();
        ctx.fillStyle = '#ffffff';
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Press E or Enter to start next level', renderer.getWidth() / 2, renderer.getHeight() - 30);
        ctx.restore();
    }
}

