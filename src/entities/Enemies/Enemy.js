/**
 * Enemy - Base enemy class
 */
import { Vec2 } from '../../utils/Math.js';
import { Circle } from '../../utils/Collision.js';
import { Sprite } from '../../utils/Sprite.js';
import { AnimationStateMachine, Animation } from '../../utils/Animation.js';

export class Enemy {
    constructor(x, y, type = 'basic', assetLoader = null) {
        this.position = new Vec2(x, y);
        this.velocity = new Vec2(0, 0);
        this.type = type;
        
        // Stats based on type
        const stats = this.getStatsForType(type);
        this.maxHealth = stats.health;
        this.health = this.maxHealth;
        this.speed = stats.speed;
        this.damage = stats.damage;
        this.radius = stats.radius;
        this.scoreValue = stats.scoreValue;
        
        // AI state
        this.state = 'idle'; // idle, chase, attack, dead
        this.target = null;
        this.attackCooldown = 0;
        this.attackRange = 50;
        this.detectionRange = 200;
        
        // Visual
        this.color = stats.color;
        this.invulnerable = false;
        this.invulnerableTime = 0;
        
        // Sprite and animation
        this.sprite = new Sprite(null, x, y, 64, 64);
        this.animationStateMachine = new AnimationStateMachine();
        this.assetLoader = assetLoader;
        this.lastDirection = new Vec2(0, -1);
        
        // Initialize animations if asset loader is available
        if (assetLoader) {
            this.initAnimations();
        }
    }
    
    initAnimations() {
        if (!this.assetLoader) return;
        
        const typePrefix = `enemy_${this.type}`;
        const metadata = this.assetLoader.getMetadata(typePrefix) || {};
        
        // Idle animation
        const idleSheet = this.assetLoader.getSpriteSheet(`${typePrefix}_idle`);
        if (idleSheet) {
            const idleAnim = new Animation(idleSheet, metadata.idle?.frameDuration || 150, true);
            this.animationStateMachine.addAnimation('idle', idleAnim);
        }
        
        // Walk animation
        const walkSheet = this.assetLoader.getSpriteSheet(`${typePrefix}_walk`);
        if (walkSheet) {
            const walkAnim = new Animation(walkSheet, metadata.walk?.frameDuration || 120, true);
            this.animationStateMachine.addAnimation('walk', walkAnim);
        }
        
        // Attack animation
        const attackSheet = this.assetLoader.getSpriteSheet(`${typePrefix}_attack`);
        if (attackSheet) {
            const attackAnim = new Animation(attackSheet, metadata.attack?.frameDuration || [100, 80, 80, 80, 100], false);
            attackAnim.onComplete = () => {
                if (this.velocity.length() > 0) {
                    this.animationStateMachine.changeState('walk');
                } else {
                    this.animationStateMachine.changeState('idle');
                }
            };
            this.animationStateMachine.addAnimation('attack', attackAnim);
        }
        
        // Death animation
        const deathSheet = this.assetLoader.getSpriteSheet(`${typePrefix}_death`);
        if (deathSheet) {
            const deathAnim = new Animation(deathSheet, metadata.death?.frameDuration || 150, false);
            this.animationStateMachine.addAnimation('death', deathAnim);
        }
        
        // Set initial state
        this.animationStateMachine.changeState('idle');
    }
    
    getStatsForType(type) {
        const types = {
            basic: {
                health: 30,
                speed: 80,
                damage: 10,
                radius: 14,
                color: '#ff4444',
                scoreValue: 10
            },
            fast: {
                health: 20,
                speed: 150,
                damage: 8,
                radius: 12,
                color: '#ff8844',
                scoreValue: 15
            },
            tank: {
                health: 80,
                speed: 50,
                damage: 15,
                radius: 18,
                color: '#884444',
                scoreValue: 20
            }
        };
        
        return types[type] || types.basic;
    }
    
    update(deltaTime, player, enemies) {
        if (this.health <= 0) {
            this.state = 'dead';
            // Update animation to death if not already
            if (this.animationStateMachine.currentState !== 'death') {
                this.animationStateMachine.changeState('death');
            }
            this.animationStateMachine.update(deltaTime);
            return;
        }
        
        const deltaSeconds = deltaTime / 1000;
        
        // Update invulnerability
        if (this.invulnerable) {
            this.invulnerableTime -= deltaSeconds;
            if (this.invulnerableTime <= 0) {
                this.invulnerable = false;
            }
        }
        
        // Update attack cooldown
        if (this.attackCooldown > 0) {
            this.attackCooldown -= deltaSeconds;
        }
        
        // AI logic
        if (player && player.isAlive()) {
            const distanceToPlayer = this.position.distance(player.getPosition());
            
            if (distanceToPlayer <= this.detectionRange) {
                this.target = player;
                
                if (distanceToPlayer <= this.attackRange && this.attackCooldown <= 0) {
                    this.state = 'attack';
                    this.attack(player);
                } else {
                    this.state = 'chase';
                    this.chase(player, deltaSeconds);
                }
            } else {
                this.state = 'idle';
                this.target = null;
            }
        }
        
        // Update animation state based on AI state
        this.updateAnimationState();
        
        // Update animation state machine
        this.animationStateMachine.update(deltaTime);
        
        // Update sprite position and frame
        this.sprite.setPosition(this.position.x, this.position.y);
        const anim = this.animationStateMachine.animations[this.animationStateMachine.currentState];
        if (anim && anim.spriteSheet) {
            this.sprite.setSpriteSheet(anim.spriteSheet, anim.getCurrentFrameIndex());
        }
        
        // Handle sprite flipping based on movement direction
        if (this.velocity.length() > 0) {
            this.lastDirection = this.velocity.normalize();
            if (this.lastDirection.x !== 0) {
                this.sprite.setFlip(this.lastDirection.x < 0, false);
            }
        }
    }
    
    updateAnimationState() {
        if (this.health <= 0) {
            if (this.animationStateMachine.currentState !== 'death') {
                this.animationStateMachine.changeState('death');
            }
            return;
        }
        
        const currentState = this.animationStateMachine.currentState;
        
        // Don't interrupt attack animation
        if (currentState === 'attack') {
            const anim = this.animationStateMachine.animations['attack'];
            if (anim && !anim.isFinished()) {
                return; // Let animation finish
            }
        }
        
        // Update state based on AI state
        if (this.state === 'attack') {
            if (currentState !== 'attack') {
                this.animationStateMachine.changeState('attack');
            }
        } else if (this.state === 'chase' && this.velocity.length() > 0) {
            if (currentState !== 'walk') {
                this.animationStateMachine.changeState('walk');
            }
        } else {
            if (currentState !== 'idle') {
                this.animationStateMachine.changeState('idle');
            }
        }
    }
    
    chase(target, deltaSeconds) {
        const direction = target.getPosition().subtract(this.position).normalize();
        this.velocity = direction.multiply(this.speed);
        this.position = this.position.add(this.velocity.multiply(deltaSeconds));
    }
    
    attack(target) {
        if (this.attackCooldown > 0) return;
        
        this.attackCooldown = 1.0; // 1 second between attacks
        
        // Damage is applied by combat system checking collision
    }
    
    takeDamage(amount) {
        if (this.invulnerable) return false;
        
        this.health -= amount;
        if (this.health < 0) {
            this.health = 0;
        }
        
        // Brief invulnerability
        this.setInvulnerable(0.2);
        
        return true;
    }
    
    setInvulnerable(duration) {
        this.invulnerable = true;
        this.invulnerableTime = duration;
    }
    
    getCollisionCircle() {
        return new Circle(this.position.x, this.position.y, this.radius);
    }
    
    getAttackHitbox() {
        if (this.attackCooldown > 0.9) { // Only during attack frame
            const direction = this.target 
                ? this.target.getPosition().subtract(this.position).normalize()
                : new Vec2(0, -1);
            
            const attackRange = this.attackRange;
            const center = this.position.add(direction.multiply(attackRange / 2));
            return new Circle(center.x, center.y, this.radius);
        }
        return null;
    }
    
    render(ctx, camera) {
        ctx.save();
        
        const screenPos = camera.worldToScreen(this.position.x, this.position.y);
        
        // Draw shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.beginPath();
        ctx.ellipse(screenPos.x, screenPos.y + 2, this.radius * 0.8, this.radius * 0.4, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Handle invulnerability flashing
        if (this.invulnerable && Math.floor(this.invulnerableTime * 10) % 2 === 0) {
            this.sprite.setAlpha(0.5);
        } else {
            this.sprite.setAlpha(1.0);
        }
        
        // Render sprite (only if alive or death animation not finished)
        if (this.health > 0 || (this.animationStateMachine.currentState === 'death' && 
            !this.animationStateMachine.animations['death']?.isFinished())) {
            this.sprite.render(ctx, camera);
        }
        
        // Draw health bar (only if alive)
        if (this.health > 0) {
            const barWidth = this.radius * 2;
            const barHeight = 4;
            const healthPercent = this.health / this.maxHealth;
            
            ctx.fillStyle = '#ff0000';
            ctx.fillRect(screenPos.x - barWidth / 2, screenPos.y - this.radius - 8, barWidth, barHeight);
            ctx.fillStyle = '#00ff00';
            ctx.fillRect(screenPos.x - barWidth / 2, screenPos.y - this.radius - 8, barWidth * healthPercent, barHeight);
        }
        
        ctx.restore();
    }
    
    getPosition() {
        return this.position;
    }
    
    getHealth() {
        return this.health;
    }
    
    isAlive() {
        return this.health > 0;
    }
    
    getScoreValue() {
        return this.scoreValue;
    }
}

