/**
 * GameOverState - Game over screen
 */
export class GameOverState {
    constructor() {
        this.restartTime = 0;
    }
    
    init() {
        // Initialize game over screen
    }
    
    enter() {
        this.restartTime = 0;
    }
    
    exit() {
        // Cleanup
    }
    
    update(deltaTime, input) {
        this.restartTime += deltaTime;
        
        // Return to menu after 3 seconds or on key press
        if (this.restartTime > 3000 || input.isKeyPressed('Enter') || input.isKeyPressed('Space') || input.isKeyPressed('Escape')) {
            return 'menu';
        }
        
        return null;
    }
    
    render(renderer, camera) {
        const ctx = renderer.getContext('ui');
        const width = renderer.getWidth();
        const height = renderer.getHeight();
        
        // Semi-transparent overlay
        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        ctx.fillRect(0, 0, width, height);
        
        // Game Over text
        ctx.fillStyle = '#ff0000';
        ctx.font = 'bold 64px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('GAME OVER', width / 2, height / 2 - 50);
        
        // Instructions
        ctx.fillStyle = '#ffffff';
        ctx.font = '24px Arial';
        ctx.fillText('Press Enter/Space/Escape to return to menu', width / 2, height / 2 + 50);
    }
}

