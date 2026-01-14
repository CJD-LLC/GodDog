/**
 * Followers - Follower management
 */
import { Vec2 } from '../utils/Math.js';
import { Circle } from '../utils/Collision.js';
import { Sprite } from '../utils/Sprite.js';
import { AnimationStateMachine, Animation } from '../utils/Animation.js';

export class Follower {
    constructor(x, y, assetLoader = null) {
        this.position = new Vec2(x, y);
        this.radius = 12;
        this.color = '#44ff44';
        this.following = false;
        this.target = null;
        this.speed = 100;
        this.velocity = new Vec2(0, 0);
        this.lastDirection = new Vec2(0, -1);
        
        // Sprite and animation
        this.sprite = new Sprite(null, x, y, 32, 32);
        this.animationStateMachine = new AnimationStateMachine();
        this.assetLoader = assetLoader;
        
        if (assetLoader) {
            this.initAnimations();
        }
    }
    
    initAnimations() {
        if (!this.assetLoader) return;
        
        // Idle animation
        const idleSheet = this.assetLoader.getSpriteSheet('follower_idle');
        if (idleSheet) {
            const idleAnim = new Animation(idleSheet, 200, true);
            this.animationStateMachine.addAnimation('idle', idleAnim);
        }
        
        // Walk animation
        const walkSheet = this.assetLoader.getSpriteSheet('follower_walk');
        if (walkSheet) {
            const walkAnim = new Animation(walkSheet, 120, true);
            this.animationStateMachine.addAnimation('walk', walkAnim);
        }
        
        // Set initial state
        this.animationStateMachine.changeState('idle');
    }
    
    update(deltaTime, player) {
        const deltaSeconds = deltaTime / 1000;
        const wasMoving = this.velocity.length() > 0;
        
        if (this.following && player) {
            const distance = this.position.distance(player.getPosition());
            if (distance > 50) {
                const direction = player.getPosition().subtract(this.position).normalize();
                this.velocity = direction.multiply(this.speed);
                this.position = this.position.add(this.velocity.multiply(deltaSeconds));
                this.lastDirection = direction;
            } else {
                this.velocity.set(0, 0);
            }
        } else {
            this.velocity.set(0, 0);
        }
        
        // Update animation state
        if (this.velocity.length() > 0 && this.animationStateMachine.currentState !== 'walk') {
            this.animationStateMachine.changeState('walk');
        } else if (this.velocity.length() === 0 && this.animationStateMachine.currentState !== 'idle') {
            this.animationStateMachine.changeState('idle');
        }
        
        // Update animation
        this.animationStateMachine.update(deltaTime);
        
        // Update sprite
        this.sprite.setPosition(this.position.x, this.position.y);
        const anim = this.animationStateMachine.animations[this.animationStateMachine.currentState];
        if (anim && anim.spriteSheet) {
            this.sprite.setSpriteSheet(anim.spriteSheet, anim.getCurrentFrameIndex());
        }
        
        // Handle sprite flipping
        if (this.lastDirection.x !== 0) {
            this.sprite.setFlip(this.lastDirection.x < 0, false);
        }
    }
    
    render(ctx, camera) {
        ctx.save();
        
        const screenPos = camera.worldToScreen(this.position.x, this.position.y);
        
        // Draw shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.beginPath();
        ctx.ellipse(screenPos.x, screenPos.y + 2, this.radius * 0.8, this.radius * 0.4, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Render sprite
        this.sprite.render(ctx, camera);
        
        ctx.restore();
    }
    
    startFollowing(target) {
        this.following = true;
        this.target = target;
    }
    
    getPosition() {
        return this.position;
    }
}

export class FollowerManager {
    constructor(assetLoader = null) {
        this.followers = [];
        this.assetLoader = assetLoader;
    }
    
    setAssetLoader(assetLoader) {
        this.assetLoader = assetLoader;
    }
    
    addFollower(x, y) {
        const follower = new Follower(x, y, this.assetLoader);
        this.followers.push(follower);
        return follower;
    }
    
    update(deltaTime, player) {
        this.followers.forEach(follower => {
            follower.update(deltaTime, player);
        });
    }
    
    render(ctx, camera) {
        this.followers.forEach(follower => {
            follower.render(ctx, camera);
        });
    }
    
    getFollowers() {
        return this.followers;
    }
    
    getFollowerCount() {
        return this.followers.length;
    }
}

