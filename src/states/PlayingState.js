/**
 * PlayingState - Main gameplay state
 */
import { Player } from '../entities/Player.js';
import { CombatSystem } from '../core/Combat.js';
import { EffectsManager } from '../core/EffectsManager.js';
import { HUD } from '../ui/HUD.js';
import { DialogueSystem } from '../ui/DialogueSystem.js';
import { FollowerManager } from '../base/Followers.js';

export class PlayingState {
    constructor(levelManager, godManager, resources, assetLoader = null) {
        this.levelManager = levelManager;
        this.godManager = godManager;
        this.resources = resources;
        this.assetLoader = assetLoader;
        this.player = null;
        this.effectsManager = new EffectsManager(assetLoader);
        this.combatSystem = new CombatSystem(this.effectsManager);
        this.hud = new HUD(assetLoader);
        this.dialogue = new DialogueSystem();
        this.followerManager = new FollowerManager(assetLoader);
        this.camera = null;
        this.firstGodPossession = false;
        this.currentLevelIndex = 0;
    }
    
    init() {
        // Initialize level
        const level = this.levelManager.loadLevel(this.currentLevelIndex);
        if (!level) {
            console.error('Failed to load level');
            return;
        }
        
        const startPos = level.getPlayerStart();
        this.player = new Player(startPos.x, startPos.y, this.assetLoader);
        
        // Set up camera
        if (this.camera) {
            this.camera.setTarget(this.player.position.x, this.player.position.y);
            this.camera.setBounds(0, 0, level.width, level.height);
        }
        
        // First god possession dialogue (only on level 1)
        if (this.currentLevelIndex === 0 && !this.firstGodPossession) {
            setTimeout(() => {
                this.dialogue.showDialogue(
                    [
                        'You feel a presence...',
                        'A voice speaks: "I am The Loyal One. You are unbound, perfect vessel."',
                        'Power flows through you.'
                    ],
                    'The Loyal One'
                );
                this.godManager.switchGod('loyalty');
                this.player.activeGod = this.godManager.getActiveGod();
                this.firstGodPossession = true;
            }, 1000);
        }
    }
    
    enter(levelIndex = null) {
        if (levelIndex !== null) {
            this.currentLevelIndex = levelIndex;
        }
        this.init();
    }
    
    exit() {
        // Cleanup
    }
    
    update(deltaTime, input) {
        // Update dialogue
        this.dialogue.update(deltaTime);
        
        if (this.dialogue.isActive()) {
            if (input.isKeyPressed('Space')) {
                this.dialogue.advance();
            }
            return;
        }
        
        // Update player
        if (this.player && this.player.isAlive()) {
            this.player.update(deltaTime, input);
            
            // Update camera to follow player
            if (this.camera) {
                this.camera.setTarget(this.player.position.x, this.player.position.y);
                this.camera.update();
            }
            
            // Update god manager
            this.godManager.update(deltaTime);
            
            // Use god ability
            if (input.isKeyPressed('KeyQ')) {
                const god = this.godManager.getActiveGod();
                if (god) {
                    god.setEffectsManager(this.effectsManager);
                }
                this.godManager.useActiveGodAbility(this.player);
            }
            
            // Update god visual effects
            const activeGod = this.godManager.getActiveGod();
            if (activeGod) {
                activeGod.setEffectsManager(this.effectsManager);
            }
            
            // Update followers
            this.followerManager.update(deltaTime, this.player);
            
            // Update level
            const level = this.levelManager.getCurrentLevel();
            if (level) {
                level.update(deltaTime, this.player, this.combatSystem);
                
                // Check level completion
                if (level.isCompleted()) {
                    // Add rewards
                    this.resources.addBones(50);
                    this.resources.addDevotion(10);
                    
                    // Return to base after completing level
                    return 'base';
                }
            }
            
            // Update combat system
            this.combatSystem.update(deltaTime);
            
            // Update effects manager
            this.effectsManager.update(deltaTime);
            
            // Create dust particles when player moves
            if (this.player.velocity.length() > 0 && Math.random() < 0.3) {
                this.effectsManager.createDust(
                    this.player.position.x,
                    this.player.position.y,
                    this.player.velocity.normalize()
                );
            }
            
            // Check player death
            if (!this.player.isAlive()) {
                return 'gameover';
            }
        }
        
        return null;
    }
    
    render(renderer, camera) {
        this.camera = camera;
        
        const ctx = renderer.getContext('world');
        const level = this.levelManager.getCurrentLevel();
        
        if (level) {
            level.render(ctx, camera);
        }
        
        // Render player
        if (this.player) {
            this.player.render(ctx, camera);
        }
        
        // Render followers
        this.followerManager.render(ctx, camera);
        
        // Render effects (particles, etc.)
        const effectsCtx = renderer.getContext('effects');
        this.effectsManager.render(effectsCtx, camera);
        
        // Render combat effects (damage numbers)
        this.combatSystem.render(ctx, camera);
        
        // Render UI
        const uiCtx = renderer.getContext('ui');
        this.hud.setSize(renderer.getWidth(), renderer.getHeight());
        this.hud.render(uiCtx, this.player, this.godManager, this.resources);
        
        // Render dialogue
        this.dialogue.render(uiCtx, renderer.getWidth(), renderer.getHeight());
    }
}

