/**
 * InputManager - Keyboard and controller input handling
 */
export class InputManager {
    constructor() {
        this.keys = {};
        this.keysPressed = {};
        this.keysReleased = {};
        this.mouse = {
            x: 0,
            y: 0,
            buttons: {},
            buttonsPressed: {},
            buttonsReleased: {}
        };
        
        this.gamepad = null;
        this.gamepadButtons = {};
        this.gamepadAxes = [0, 0];
        
        this.setupKeyboardListeners();
        this.setupMouseListeners();
        this.setupGamepadListeners();
    }
    
    setupKeyboardListeners() {
        window.addEventListener('keydown', (e) => {
            if (!this.keys[e.code]) {
                this.keysPressed[e.code] = true;
            }
            this.keys[e.code] = true;
        });
        
        window.addEventListener('keyup', (e) => {
            this.keysReleased[e.code] = true;
            this.keys[e.code] = false;
        });
    }
    
    setupMouseListeners() {
        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });
        
        window.addEventListener('mousedown', (e) => {
            const button = e.button;
            if (!this.mouse.buttons[button]) {
                this.mouse.buttonsPressed[button] = true;
            }
            this.mouse.buttons[button] = true;
        });
        
        window.addEventListener('mouseup', (e) => {
            const button = e.button;
            this.mouse.buttonsReleased[button] = true;
            this.mouse.buttons[button] = false;
        });
    }
    
    setupGamepadListeners() {
        window.addEventListener('gamepadconnected', (e) => {
            console.log('Gamepad connected:', e.gamepad.id);
            this.gamepad = navigator.getGamepads()[e.gamepad.index];
        });
        
        window.addEventListener('gamepaddisconnected', (e) => {
            console.log('Gamepad disconnected');
            this.gamepad = null;
        });
    }
    
    update() {
        // Clear one-frame states
        this.keysPressed = {};
        this.keysReleased = {};
        this.mouse.buttonsPressed = {};
        this.mouse.buttonsReleased = {};
        
        // Update gamepad
        if (navigator.getGamepads) {
            const gamepads = navigator.getGamepads();
            if (gamepads[0]) {
                this.gamepad = gamepads[0];
                this.updateGamepadState();
            } else {
                this.gamepad = null;
            }
        }
    }
    
    updateGamepadState() {
        if (!this.gamepad) return;
        
        // Update buttons
        for (let i = 0; i < this.gamepad.buttons.length; i++) {
            const pressed = this.gamepad.buttons[i].pressed;
            if (pressed && !this.gamepadButtons[i]) {
                // Button just pressed
            }
            this.gamepadButtons[i] = pressed;
        }
        
        // Update axes (left stick)
        this.gamepadAxes[0] = this.gamepad.axes[0];
        this.gamepadAxes[1] = this.gamepad.axes[1];
    }
    
    // Keyboard methods
    isKeyDown(code) {
        return this.keys[code] === true;
    }
    
    isKeyPressed(code) {
        return this.keysPressed[code] === true;
    }
    
    isKeyReleased(code) {
        return this.keysReleased[code] === true;
    }
    
    // Mouse methods
    isMouseButtonDown(button) {
        return this.mouse.buttons[button] === true;
    }
    
    isMouseButtonPressed(button) {
        return this.mouse.buttonsPressed[button] === true;
    }
    
    isMouseButtonReleased(button) {
        return this.mouse.buttonsReleased[button] === true;
    }
    
    getMousePosition() {
        return { x: this.mouse.x, y: this.mouse.y };
    }
    
    // Gamepad methods
    getGamepadMovement() {
        if (!this.gamepad) {
            // Fallback to keyboard
            let x = 0;
            let y = 0;
            
            if (this.isKeyDown('KeyW') || this.isKeyDown('ArrowUp')) y -= 1;
            if (this.isKeyDown('KeyS') || this.isKeyDown('ArrowDown')) y += 1;
            if (this.isKeyDown('KeyA') || this.isKeyDown('ArrowLeft')) x -= 1;
            if (this.isKeyDown('KeyD') || this.isKeyDown('ArrowRight')) x += 1;
            
            return { x, y };
        }
        
        // Use gamepad stick, fallback to keyboard
        let x = this.gamepadAxes[0];
        let y = this.gamepadAxes[1];
        
        // Dead zone
        const deadZone = 0.2;
        if (Math.abs(x) < deadZone) x = 0;
        if (Math.abs(y) < deadZone) y = 0;
        
        // If no gamepad input, use keyboard
        if (x === 0 && y === 0) {
            if (this.isKeyDown('KeyW') || this.isKeyDown('ArrowUp')) y = -1;
            if (this.isKeyDown('KeyS') || this.isKeyDown('ArrowDown')) y = 1;
            if (this.isKeyDown('KeyA') || this.isKeyDown('ArrowLeft')) x = -1;
            if (this.isKeyDown('KeyD') || this.isKeyDown('ArrowRight')) x = 1;
        }
        
        return { x, y };
    }
    
    isGamepadButtonDown(buttonIndex) {
        return this.gamepadButtons[buttonIndex] === true;
    }
}

