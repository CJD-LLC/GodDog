/**
 * Player - Player dog controller
 */
import { Vec2 } from '../utils/Math.js';
import { Circle } from '../utils/Collision.js';
import { Sprite } from '../utils/Sprite.js';
import { AnimationStateMachine, Animation } from '../utils/Animation.js';

export class Player {
    constructor(x, y, assetLoader = null) {
        this.position = new Vec2(x, y);
        this.velocity = new Vec2(0, 0);
        this.speed = 200; // pixels per second
        this.radius = 16;
        
        // Health
        this.maxHealth = 100;
        this.health = this.maxHealth;
        this.invulnerable = false;
        this.invulnerableTime = 0;
        
        // Combat
        this.attackCooldown = 0;
        this.attackDuration = 0;
        this.attackCombo = 0;
        this.maxCombo = 3;
        this.comboResetTime = 0.5; // seconds
        this.lastAttackTime = 0;
        
        // Dodge
        this.dodgeCooldown = 0;
        this.dodgeDuration = 0;
        this.dodgeSpeed = 400;
        this.dodgeDirection = new Vec2(0, 0);
        this.isDodging = false;
        
        // Sprite and animation
        this.sprite = new Sprite(null, x, y, 64, 64);
        this.animationStateMachine = new AnimationStateMachine();
        this.assetLoader = assetLoader;
        this.lastDirection = new Vec2(0, -1); // Default facing up
        
        // Initialize animations if asset loader is available
        if (assetLoader) {
            this.initAnimations();
        }
        
        // God possession
        this.activeGod = null;
    }
    
    initAnimations() {
        if (!this.assetLoader) return;
        
        // Load player animations from sprite sheets
        const metadata = this.assetLoader.getMetadata('player') || {};
        
        // Idle animation
        const idleSheet = this.assetLoader.getSpriteSheet('player_idle');
        if (idleSheet) {
            const idleAnim = new Animation(idleSheet, metadata.idle?.frameDuration || 150, true);
            this.animationStateMachine.addAnimation('idle', idleAnim);
        }
        
        // Walk animation
        const walkSheet = this.assetLoader.getSpriteSheet('player_walk');
        if (walkSheet) {
            const walkAnim = new Animation(walkSheet, metadata.walk?.frameDuration || 100, true);
            this.animationStateMachine.addAnimation('walk', walkAnim);
        }
        
        // Attack animations
        const attack1Sheet = this.assetLoader.getSpriteSheet('player_attack_1');
        if (attack1Sheet) {
            const attack1Anim = new Animation(attack1Sheet, metadata.attack_1?.frameDuration || [80, 60, 60, 100], false);
            attack1Anim.onComplete = () => {
                if (this.velocity.length() > 0) {
                    this.animationStateMachine.changeState('walk');
                } else {
                    this.animationStateMachine.changeState('idle');
                }
            };
            this.animationStateMachine.addAnimation('attack_1', attack1Anim);
        }
        
        const attack2Sheet = this.assetLoader.getSpriteSheet('player_attack_2');
        if (attack2Sheet) {
            const attack2Anim = new Animation(attack2Sheet, metadata.attack_2?.frameDuration || [80, 60, 60, 100], false);
            attack2Anim.onComplete = () => {
                if (this.velocity.length() > 0) {
                    this.animationStateMachine.changeState('walk');
                } else {
                    this.animationStateMachine.changeState('idle');
                }
            };
            this.animationStateMachine.addAnimation('attack_2', attack2Anim);
        }
        
        const attack3Sheet = this.assetLoader.getSpriteSheet('player_attack_3');
        if (attack3Sheet) {
            const attack3Anim = new Animation(attack3Sheet, metadata.attack_3?.frameDuration || [80, 60, 60, 60, 100], false);
            attack3Anim.onComplete = () => {
                if (this.velocity.length() > 0) {
                    this.animationStateMachine.changeState('walk');
                } else {
                    this.animationStateMachine.changeState('idle');
                }
            };
            this.animationStateMachine.addAnimation('attack_3', attack3Anim);
        }
        
        // Dodge animation
        const dodgeSheet = this.assetLoader.getSpriteSheet('player_dodge');
        if (dodgeSheet) {
            const dodgeAnim = new Animation(dodgeSheet, metadata.dodge?.frameDuration || 50, false);
            dodgeAnim.onComplete = () => {
                if (this.velocity.length() > 0) {
                    this.animationStateMachine.changeState('walk');
                } else {
                    this.animationStateMachine.changeState('idle');
                }
            };
            this.animationStateMachine.addAnimation('dodge', dodgeAnim);
        }
        
        // Hurt animation
        const hurtSheet = this.assetLoader.getSpriteSheet('player_hurt');
        if (hurtSheet) {
            const hurtAnim = new Animation(hurtSheet, metadata.hurt?.frameDuration || 100, false);
            hurtAnim.onComplete = () => {
                if (this.velocity.length() > 0) {
                    this.animationStateMachine.changeState('walk');
                } else {
                    this.animationStateMachine.changeState('idle');
                }
            };
            this.animationStateMachine.addAnimation('hurt', hurtAnim);
        }
        
        // Death animation
        const deathSheet = this.assetLoader.getSpriteSheet('player_death');
        if (deathSheet) {
            const deathAnim = new Animation(deathSheet, metadata.death?.frameDuration || 150, false);
            this.animationStateMachine.addAnimation('death', deathAnim);
        }
        
        // Set initial state
        this.animationStateMachine.changeState('idle');
    }
    
    update(deltaTime, input) {
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
        
        // Update attack duration
        if (this.attackDuration > 0) {
            this.attackDuration -= deltaSeconds;
        }
        
        // Update combo reset timer
        if (this.lastAttackTime > 0) {
            this.lastAttackTime -= deltaSeconds;
            if (this.lastAttackTime <= 0) {
                this.attackCombo = 0;
            }
        }
        
        // Update dodge
        if (this.dodgeCooldown > 0) {
            this.dodgeCooldown -= deltaSeconds;
        }
        
        if (this.isDodging) {
            this.dodgeDuration -= deltaSeconds;
            if (this.dodgeDuration <= 0) {
                this.isDodging = false;
                this.velocity.set(0, 0);
            } else {
                // Continue dodge movement
                this.position = this.position.add(this.dodgeDirection.multiply(this.dodgeSpeed * deltaSeconds));
            }
        } else {
            // Handle input
            const movement = input.getGamepadMovement();
            
            // Normalize movement vector
            if (movement.x !== 0 || movement.y !== 0) {
                const moveVec = new Vec2(movement.x, movement.y).normalize();
                this.velocity = moveVec.multiply(this.speed);
                this.lastDirection = moveVec; // Track last direction for sprite flipping
            } else {
                this.velocity.set(0, 0);
            }
            
            // Update position
            this.position = this.position.add(this.velocity.multiply(deltaSeconds));
            
            // Handle attack
            if (input.isKeyPressed('Space') || input.isMouseButtonPressed(0)) {
                this.attack();
            }
            
            // Handle dodge
            if ((input.isKeyPressed('ShiftLeft') || input.isKeyPressed('ShiftRight')) && this.dodgeCooldown <= 0) {
                this.dodge(movement);
            }
        }
        
        // Update animation state based on player state
        this.updateAnimationState();
        
        // Update animation state machine
        this.animationStateMachine.update(deltaTime);
        
        // Update sprite position
        this.sprite.setPosition(this.position.x, this.position.y);
        
        // Update sprite frame from animation
        const anim = this.animationStateMachine.animations[this.animationStateMachine.currentState];
        if (anim && anim.spriteSheet) {
            this.sprite.setSpriteSheet(anim.spriteSheet, anim.getCurrentFrameIndex());
        }
        
        // Handle sprite flipping based on movement direction
        if (this.lastDirection.x !== 0) {
            this.sprite.setFlip(this.lastDirection.x < 0, false);
        }
        
        // Apply god passive effects
        if (this.activeGod && this.activeGod.passiveEffect) {
            this.activeGod.passiveEffect(this, deltaSeconds);
        }
    }
    
    updateAnimationState() {
        if (!this.isAlive()) {
            if (this.animationStateMachine.currentState !== 'death') {
                this.animationStateMachine.changeState('death');
            }
            return;
        }
        
        const currentState = this.animationStateMachine.currentState;
        
        // Don't interrupt attack or dodge animations
        if (currentState && (currentState.startsWith('attack_') || currentState === 'dodge' || currentState === 'hurt')) {
            const anim = this.animationStateMachine.animations[currentState];
            if (anim && !anim.isFinished()) {
                return; // Let animation finish
            }
        }
        
        // Update state based on current action
        if (this.isDodging) {
            if (currentState !== 'dodge') {
                this.animationStateMachine.changeState('dodge');
            }
        } else if (this.attackDuration > 0) {
            const attackState = `attack_${this.attackCombo}`;
            if (this.animationStateMachine.hasAnimation(attackState) && currentState !== attackState) {
                this.animationStateMachine.changeState(attackState);
            }
        } else if (this.invulnerable && this.invulnerableTime > 0.3) {
            // Show hurt animation briefly after taking damage
            if (currentState !== 'hurt' && this.animationStateMachine.hasAnimation('hurt')) {
                this.animationStateMachine.changeState('hurt');
            }
        } else if (this.velocity.length() > 0) {
            if (currentState !== 'walk') {
                this.animationStateMachine.changeState('walk');
            }
        } else {
            if (currentState !== 'idle') {
                this.animationStateMachine.changeState('idle');
            }
        }
    }
    
    attack() {
        if (this.attackCooldown > 0 || this.isDodging) return;
        
        // Reset combo if too much time passed
        if (this.lastAttackTime <= 0) {
            this.attackCombo = 0;
        }
        
        this.attackCombo++;
        if (this.attackCombo > this.maxCombo) {
            this.attackCombo = 1;
        }
        
        // Attack duration based on combo
        this.attackDuration = 0.2 - (this.attackCombo - 1) * 0.03;
        this.attackCooldown = 0.3;
        this.lastAttackTime = this.comboResetTime;
        
        // Trigger god ability if active
        if (this.activeGod && this.activeGod.onAttack) {
            this.activeGod.onAttack(this);
        }
    }
    
    dodge(movement) {
        if (this.isDodging || this.dodgeCooldown > 0) return;
        
        this.isDodging = true;
        this.dodgeDuration = 0.2; // 200ms dodge
        this.dodgeCooldown = 0.5; // 500ms cooldown
        
        // Dodge direction
        if (movement.x !== 0 || movement.y !== 0) {
            this.dodgeDirection = new Vec2(movement.x, movement.y).normalize();
        } else {
            // Dodge in last movement direction or forward
            if (this.velocity.length() > 0) {
                this.dodgeDirection = this.velocity.normalize();
            } else {
                this.dodgeDirection = new Vec2(0, -1); // Dodge up by default
            }
        }
        
        // Make invulnerable during dodge
        this.setInvulnerable(this.dodgeDuration);
    }
    
    takeDamage(amount) {
        if (this.invulnerable || this.isDodging) return false;
        
        this.health -= amount;
        if (this.health < 0) {
            this.health = 0;
        }
        
        // Brief invulnerability after taking damage
        this.setInvulnerable(0.5);
        
        // Trigger hurt animation
        if (this.animationStateMachine.hasAnimation('hurt')) {
            this.animationStateMachine.changeState('hurt');
        }
        
        return true;
    }
    
    setInvulnerable(duration) {
        this.invulnerable = true;
        this.invulnerableTime = duration;
    }
    
    heal(amount) {
        this.health = Math.min(this.maxHealth, this.health + amount);
    }
    
    getCollisionCircle() {
        return new Circle(this.position.x, this.position.y, this.radius);
    }
    
    getAttackHitbox() {
        if (this.attackDuration <= 0) return null;
        
        // Attack hitbox extends forward from player
        const attackRange = 40;
        const attackWidth = 30;
        const direction = this.velocity.length() > 0 
            ? this.velocity.normalize() 
            : new Vec2(0, -1);
        
        const center = this.position.add(direction.multiply(attackRange / 2));
        return new Circle(center.x, center.y, attackWidth / 2);
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
        
        // Render the sprite (frame already updated in update())
        this.sprite.render(ctx, camera);
        
        // Draw attack indicator (debug/visual feedback)
        if (this.attackDuration > 0) {
            const attackHitbox = this.getAttackHitbox();
            if (attackHitbox) {
                const attackScreenPos = camera.worldToScreen(attackHitbox.x, attackHitbox.y);
                ctx.fillStyle = 'rgba(255, 255, 0, 0.2)';
                ctx.beginPath();
                ctx.arc(attackScreenPos.x, attackScreenPos.y, attackHitbox.radius, 0, Math.PI * 2);
                ctx.fill();
            }
        }
        
        // Draw dodge trail
        if (this.isDodging) {
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(screenPos.x, screenPos.y);
            const trailEnd = this.position.subtract(this.dodgeDirection.multiply(20));
            const trailScreenPos = camera.worldToScreen(trailEnd.x, trailEnd.y);
            ctx.lineTo(trailScreenPos.x, trailScreenPos.y);
            ctx.stroke();
        }
        
        ctx.restore();
    }
    
    getPosition() {
        return this.position;
    }
    
    getHealth() {
        return this.health;
    }
    
    getMaxHealth() {
        return this.maxHealth;
    }
    
    isAlive() {
        return this.health > 0;
    }
}

