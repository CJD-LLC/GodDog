/**
 * Animation - Frame-based animation system with sprite sheet support
 */
import { SpriteSheet } from './SpriteSheet.js';

export class Animation {
    constructor(frames, frameDuration = 100, loop = true) {
        // Support both sprite sheet and frame array
        if (frames instanceof SpriteSheet) {
            this.spriteSheet = frames;
            this.frames = frames.getAllFrames();
        } else {
            this.spriteSheet = null;
            this.frames = frames; // Array of frame data or images
        }
        
        // Support single duration or array of durations per frame
        if (Array.isArray(frameDuration)) {
            this.frameDurations = frameDuration;
            this.frameDuration = frameDuration[0] || 100;
        } else {
            this.frameDuration = frameDuration; // Milliseconds per frame
            this.frameDurations = null;
        }
        
        this.loop = loop;
        this.currentFrame = 0;
        this.elapsedTime = 0;
        this.playing = false;
        this.finished = false;
        
        // Event callbacks
        this.onFrameChange = null;
        this.onComplete = null;
        this.lastFrameIndex = -1;
    }
    
    play() {
        this.playing = true;
        this.finished = false;
        this.elapsedTime = 0;
        this.currentFrame = 0;
        this.lastFrameIndex = -1;
    }
    
    stop() {
        this.playing = false;
    }
    
    reset() {
        this.currentFrame = 0;
        this.elapsedTime = 0;
        this.finished = false;
        this.lastFrameIndex = -1;
    }
    
    update(deltaTime) {
        if (!this.playing || this.finished) return;
        
        // Get duration for current frame
        const duration = this.frameDurations 
            ? (this.frameDurations[this.currentFrame] || this.frameDuration)
            : this.frameDuration;
        
        this.elapsedTime += deltaTime;
        
        if (this.elapsedTime >= duration) {
            const previousFrame = this.currentFrame;
            this.currentFrame++;
            this.elapsedTime = 0;
            
            // Trigger frame change callback
            if (this.onFrameChange && previousFrame !== this.currentFrame) {
                this.onFrameChange(this.currentFrame, previousFrame);
            }
            
            if (this.currentFrame >= this.frames.length) {
                if (this.loop) {
                    this.currentFrame = 0;
                } else {
                    this.currentFrame = this.frames.length - 1;
                    this.finished = true;
                    this.playing = false;
                    
                    // Trigger completion callback
                    if (this.onComplete) {
                        this.onComplete();
                    }
                }
            }
        }
        
        // Track frame changes for callback
        if (this.currentFrame !== this.lastFrameIndex) {
            this.lastFrameIndex = this.currentFrame;
        }
    }
    
    getCurrentFrame() {
        if (this.spriteSheet) {
            return this.spriteSheet.getFrame(this.currentFrame);
        }
        return this.frames[this.currentFrame] || this.frames[0];
    }
    
    getCurrentFrameIndex() {
        return this.currentFrame;
    }
    
    getFrameCount() {
        return this.frames.length;
    }
    
    isFinished() {
        return this.finished;
    }
    
    /**
     * Create an animation from a sprite sheet
     * @param {SpriteSheet} spriteSheet - The sprite sheet to use
     * @param {number|Array} frameDuration - Duration per frame or array of durations
     * @param {boolean} loop - Whether to loop the animation
     * @returns {Animation} New animation instance
     */
    static fromSpriteSheet(spriteSheet, frameDuration = 100, loop = true) {
        return new Animation(spriteSheet, frameDuration, loop);
    }
}

export class AnimationStateMachine {
    constructor() {
        this.animations = {};
        this.currentState = null;
        this.onStateChange = null;
    }
    
    addAnimation(name, animation) {
        this.animations[name] = animation;
        if (!this.currentState) {
            this.currentState = name;
            this.animations[name].play();
        }
    }
    
    changeState(name) {
        if (this.currentState === name) return;
        
        const previousState = this.currentState;
        
        if (this.currentState && this.animations[this.currentState]) {
            this.animations[this.currentState].stop();
        }
        
        this.currentState = name;
        
        if (this.animations[this.currentState]) {
            this.animations[this.currentState].play();
        }
        
        // Trigger state change callback
        if (this.onStateChange) {
            this.onStateChange(name, previousState);
        }
    }
    
    update(deltaTime) {
        if (this.currentState && this.animations[this.currentState]) {
            this.animations[this.currentState].update(deltaTime);
        }
    }
    
    getCurrentFrame() {
        if (this.currentState && this.animations[this.currentState]) {
            return this.animations[this.currentState].getCurrentFrame();
        }
        return null;
    }
    
    getCurrentState() {
        return this.currentState;
    }
    
    hasAnimation(name) {
        return name in this.animations;
    }
}

