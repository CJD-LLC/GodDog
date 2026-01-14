/**
 * MenuState - Main menu state
 */
export class MenuState {
    constructor(assetLoader = null) {
        this.selectedOption = 0;
        this.options = ['Start Game', 'Options', 'Quit'];
        this.assetLoader = assetLoader;
    }
    
    setAssetLoader(assetLoader) {
        this.assetLoader = assetLoader;
    }
    
    init() {
        // Initialize menu
    }
    
    enter() {
        this.selectedOption = 0;
    }
    
    exit() {
        // Cleanup
    }
    
    update(deltaTime, input) {
        // Handle menu navigation
        // Use isKeyDown for menu (more forgiving than isKeyPressed)
        // isKeyPressed is cleared by input.update() before we check it
        const upPressed = input.isKeyDown('ArrowUp') || input.isKeyDown('KeyW');
        const downPressed = input.isKeyDown('ArrowDown') || input.isKeyDown('KeyS');
        const selectPressed = input.isKeyPressed('Enter') || input.isKeyPressed('Space');
        
        // Prevent rapid selection changes with a simple debounce
        if (!this.lastNavTime) this.lastNavTime = 0;
        const now = performance.now();
        const navCooldown = 150; // ms between nav actions
        
        if ((upPressed || downPressed) && (now - this.lastNavTime > navCooldown)) {
            if (upPressed) {
                this.selectedOption = (this.selectedOption - 1 + this.options.length) % this.options.length;
            }
            if (downPressed) {
                this.selectedOption = (this.selectedOption + 1) % this.options.length;
            }
            this.lastNavTime = now;
        }
        
        if (selectPressed) {
            if (this.selectedOption === 0) {
                return 'playing';
            } else if (this.selectedOption === 1) {
                // Options
            } else if (this.selectedOption === 2) {
                // Quit (close window or navigate away)
            }
        }
        
        return null;
    }
    
    render(renderer, camera) {
        const ctx = renderer.getContext('ui');
        const width = renderer.getWidth();
        const height = renderer.getHeight();
        
        // Background
        const menuBg = this.assetLoader?.getImage('ui_menu_background');
        if (menuBg) {
            ctx.drawImage(menuBg, 0, 0, width, height);
        } else {
            ctx.fillStyle = '#000000';
            ctx.fillRect(0, 0, width, height);
        }
        
        // Title logo
        const titleLogo = this.assetLoader?.getImage('ui_title_logo');
        if (titleLogo) {
            const logoWidth = titleLogo.width;
            const logoHeight = titleLogo.height;
            ctx.drawImage(titleLogo, width / 2 - logoWidth / 2, height / 3 - logoHeight / 2, logoWidth, logoHeight);
        } else {
            // Fallback: text title
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 48px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('GodDog', width / 2, height / 3);
        }
        
        // Menu options
        ctx.font = '24px Arial';
        const startY = height / 2;
        const spacing = 50;
        
        const buttonIdle = this.assetLoader?.getImage('ui_button_idle');
        const buttonHover = this.assetLoader?.getImage('ui_button_hover');
        const buttonPressed = this.assetLoader?.getImage('ui_button_pressed');
        
        for (let i = 0; i < this.options.length; i++) {
            const buttonY = startY + i * spacing - 15;
            const buttonWidth = 200;
            const buttonHeight = 40;
            const buttonX = width / 2 - buttonWidth / 2;
            
            // Render button sprite or fallback
            if (i === this.selectedOption && buttonHover) {
                ctx.drawImage(buttonHover, buttonX, buttonY, buttonWidth, buttonHeight);
            } else if (buttonIdle) {
                ctx.drawImage(buttonIdle, buttonX, buttonY, buttonWidth, buttonHeight);
            }
            
            // Text
            if (i === this.selectedOption) {
                ctx.fillStyle = '#ffff00';
                ctx.fillText('>', width / 2 - 150, startY + i * spacing);
            } else {
                ctx.fillStyle = '#ffffff';
            }
            ctx.fillText(this.options[i], width / 2, startY + i * spacing);
        }
        
        // Instructions
        ctx.fillStyle = '#888888';
        ctx.font = '14px Arial';
        ctx.fillText('Use Arrow Keys to navigate, Enter/Space to select', width / 2, height - 50);
    }
}

