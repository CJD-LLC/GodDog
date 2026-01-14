/**
 * Main entry point
 */
import { Renderer } from './core/Renderer.js';
import { Camera } from './core/Camera.js';
import { InputManager } from './core/InputManager.js';
import { StateManager } from './core/StateManager.js';
import { GameLoop } from './core/GameLoop.js';
import { LevelManager } from './levels/LevelManager.js';
import { GodManager } from './gods/GodManager.js';
import { Resources } from './core/Resources.js';
import { AssetLoader } from './core/AssetLoader.js';
import { LoyaltyGod } from './gods/LoyaltyGod.js';
import { SpeedGod } from './gods/SpeedGod.js';
import { SmellGod } from './gods/SmellGod.js';
import { Level1_TheCrossing } from './levels/Level1_TheCrossing.js';
import { Level2_VillageOfBentTails } from './levels/Level2_VillageOfBentTails.js';
import { Level3_TheScentedWarrens } from './levels/Level3_TheScentedWarrens.js';
import { Level4_TrialOfDivinity } from './levels/Level4_TrialOfDivinity.js';
import { Level5_TheBrokenThrone } from './levels/Level5_TheBrokenThrone.js';
import { MenuState } from './states/MenuState.js';
import { PlayingState } from './states/PlayingState.js';
import { BaseState } from './states/BaseState.js';
import { GameOverState } from './states/GameOverState.js';

// Wait for DOM to be ready
console.log('Script loaded, waiting for DOM...');

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing game...');
    try {
        // Hide loading screen
        const loadingEl = document.getElementById('loading');
        console.log('Loading element:', loadingEl);
        if (loadingEl) {
            loadingEl.style.display = 'none';
        }

        // Initialize game
        console.log('Creating renderer...');
        const renderer = new Renderer('gameCanvas');
        console.log('Renderer created:', renderer);
        
        console.log('Creating camera...');
        const camera = new Camera(renderer.getWidth(), renderer.getHeight());
        console.log('Camera created:', camera);
        const input = new InputManager();
        const stateManager = new StateManager();
        const assetLoader = new AssetLoader();
        const levelManager = new LevelManager(assetLoader);
        const godManager = new GodManager();
        const resources = new Resources();

        // Load assets (async, but don't block game start)
        assetLoader.loadManifest('/assets/data/manifest.json').catch(err => {
            console.warn('Failed to load asset manifest, using placeholder graphics:', err);
        });

        // Register gods
        godManager.registerGod('loyalty', new LoyaltyGod());
        godManager.registerGod('speed', new SpeedGod());
        godManager.registerGod('smell', new SmellGod());

        // Register levels
        levelManager.registerLevel(new Level1_TheCrossing());
        levelManager.registerLevel(new Level2_VillageOfBentTails());
        levelManager.registerLevel(new Level3_TheScentedWarrens());
        levelManager.registerLevel(new Level4_TrialOfDivinity());
        levelManager.registerLevel(new Level5_TheBrokenThrone());

        // Register states
        stateManager.registerState('menu', new MenuState(assetLoader));
        stateManager.registerState('playing', new PlayingState(levelManager, godManager, resources, assetLoader));
        stateManager.registerState('base', new BaseState(levelManager, godManager, resources));
        stateManager.registerState('gameover', new GameOverState());

        // Create game loop
        const gameLoop = new GameLoop(stateManager, renderer, camera);

        // Start with menu
        stateManager.changeState('menu');

        // Update input each frame
        // IMPORTANT: Update input AFTER states check keys, not before
        // States need to check keysPressed before it's cleared
        const originalGameLoopUpdate = gameLoop.update.bind(gameLoop);
        gameLoop.update = function(deltaTime) {
            // States check input first (keysPressed still has values from last frame)
            originalGameLoopUpdate(deltaTime, input);
            // Then clear input for next frame
            input.update();
        };

        // Start game loop
        gameLoop.start();

        // Handle window resize
        window.addEventListener('resize', () => {
            renderer.setSize(window.innerWidth, window.innerHeight);
            camera.width = renderer.getWidth();
            camera.height = renderer.getHeight();
        });

        console.log('GodDog initialized successfully');
    } catch (error) {
        console.error('Error initializing game:', error);
        console.error('Error stack:', error.stack);
        const loadingEl = document.getElementById('loading');
        if (loadingEl) {
            loadingEl.textContent = `Error: ${error.message}. Check console for details.`;
            loadingEl.style.color = '#ff0000';
        }
        throw error; // Re-throw to see in console
    }
});

// Check if DOM is already loaded (but don't trigger twice)
if (document.readyState !== 'loading') {
    console.log('DOM already loaded, will initialize on DOMContentLoaded');
}

