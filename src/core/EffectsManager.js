/**
 * EffectsManager - Particle system and visual effects manager
 */
import { Vec2 } from '../utils/Math.js';

export class Particle {
    constructor(x, y, vx, vy, life, color, size = 4) {
        this.position = new Vec2(x, y);
        this.velocity = new Vec2(vx, vy);
        this.life = life;
        this.maxLife = life;
        this.color = color;
        this.size = size;
        this.alpha = 1.0;
        this.gravity = 0;
        this.friction = 0.98;
    }
    
    update(deltaTime) {
        const deltaSeconds = deltaTime / 1000;
        
        // Apply gravity
        this.velocity.y += this.gravity * deltaSeconds;
        
        // Apply friction
        this.velocity = this.velocity.multiply(this.friction);
        
        // Update position
        this.position = this.position.add(this.velocity.multiply(deltaSeconds));
        
        // Update life
        this.life -= deltaSeconds;
        this.alpha = Math.max(0, this.life / this.maxLife);
        
        return this.life > 0;
    }
    
    render(ctx, camera) {
        const screenPos = camera.worldToScreen(this.position.x, this.position.y);
        
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(screenPos.x, screenPos.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

export class Effect {
    constructor(x, y, type, duration = 1.0) {
        this.position = new Vec2(x, y);
        this.type = type;
        this.duration = duration;
        this.time = 0;
        this.active = true;
        this.spriteSheet = null;
        this.currentFrame = 0;
        this.frameCount = 0;
    }
    
    update(deltaTime) {
        this.time += deltaTime / 1000;
        
        if (this.spriteSheet) {
            const frameDuration = this.duration / this.frameCount;
            this.currentFrame = Math.floor(this.time / frameDuration);
            if (this.currentFrame >= this.frameCount) {
                this.currentFrame = this.frameCount - 1;
            }
        }
        
        if (this.time >= this.duration) {
            this.active = false;
        }
        
        return this.active;
    }
    
    render(ctx, camera) {
        if (!this.active) return;
        
        const screenPos = camera.worldToScreen(this.position.x, this.position.y);
        
        ctx.save();
        ctx.globalAlpha = 1.0 - (this.time / this.duration);
        
        if (this.spriteSheet) {
            const frame = this.spriteSheet.getFrame(this.currentFrame);
            ctx.drawImage(
                frame.image,
                frame.sx,
                frame.sy,
                frame.sWidth,
                frame.sHeight,
                screenPos.x - frame.sWidth / 2,
                screenPos.y - frame.sHeight / 2,
                frame.sWidth,
                frame.sHeight
            );
        }
        
        ctx.restore();
    }
}

export class EffectsManager {
    constructor(assetLoader = null) {
        this.particles = [];
        this.effects = [];
        this.assetLoader = assetLoader;
        this.maxParticles = 500;
    }
    
    /**
     * Create hit spark particles
     */
    createHitSparks(x, y, count = 8) {
        for (let i = 0; i < count; i++) {
            const angle = (Math.PI * 2 * i) / count + Math.random() * 0.5;
            const speed = 50 + Math.random() * 100;
            const vx = Math.cos(angle) * speed;
            const vy = Math.sin(angle) * speed;
            const life = 0.2 + Math.random() * 0.3;
            const color = `hsl(${Math.random() * 60 + 30}, 100%, 60%)`; // Yellow-orange
            const size = 2 + Math.random() * 3;
            
            this.addParticle(new Particle(x, y, vx, vy, life, color, size));
        }
    }
    
    /**
     * Create blood particles
     */
    createBlood(x, y, count = 6) {
        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 30 + Math.random() * 50;
            const vx = Math.cos(angle) * speed;
            const vy = Math.sin(angle) * speed;
            const life = 0.5 + Math.random() * 0.5;
            const color = '#8B0000'; // Dark red
            const size = 3 + Math.random() * 4;
            const particle = new Particle(x, y, vx, vy, life, color, size);
            particle.gravity = 200;
            particle.friction = 0.95;
            this.addParticle(particle);
        }
    }
    
    /**
     * Create dust particles
     */
    createDust(x, y, direction = null, count = 5) {
        for (let i = 0; i < count; i++) {
            const angle = direction 
                ? Math.atan2(direction.y, direction.x) + (Math.random() - 0.5) * 0.5
                : Math.random() * Math.PI * 2;
            const speed = 20 + Math.random() * 30;
            const vx = Math.cos(angle) * speed;
            const vy = Math.sin(angle) * speed;
            const life = 0.3 + Math.random() * 0.3;
            const color = `rgba(150, 150, 150, ${0.5 + Math.random() * 0.5})`;
            const size = 2 + Math.random() * 3;
            const particle = new Particle(x, y, vx, vy, life, color, size);
            particle.gravity = -50; // Float upward
            this.addParticle(particle);
        }
    }
    
    /**
     * Create magic particles
     */
    createMagic(x, y, color = '#00ffff', count = 10) {
        for (let i = 0; i < count; i++) {
            const angle = (Math.PI * 2 * i) / count;
            const speed = 30 + Math.random() * 40;
            const vx = Math.cos(angle) * speed;
            const vy = Math.sin(angle) * speed;
            const life = 0.4 + Math.random() * 0.4;
            const size = 2 + Math.random() * 3;
            this.addParticle(new Particle(x, y, vx, vy, life, color, size));
        }
    }
    
    /**
     * Create slash effect
     */
    createSlash(x, y, direction, duration = 0.2) {
        const effect = new Effect(x, y, 'slash', duration);
        if (this.assetLoader) {
            const slashSheet = this.assetLoader.getSpriteSheet('effect_slash');
            if (slashSheet) {
                effect.spriteSheet = slashSheet;
                effect.frameCount = slashSheet.frameCount;
            }
        }
        this.effects.push(effect);
        return effect;
    }
    
    /**
     * Create shield aura effect
     */
    createShieldAura(x, y, duration = 3.0) {
        const effect = new Effect(x, y, 'shield', duration);
        if (this.assetLoader) {
            const shieldSheet = this.assetLoader.getSpriteSheet('effect_shield');
            if (shieldSheet) {
                effect.spriteSheet = shieldSheet;
                effect.frameCount = shieldSheet.frameCount;
            }
        }
        this.effects.push(effect);
        return effect;
    }
    
    /**
     * Create speed trail particles
     */
    createSpeedTrail(x, y, direction) {
        const angle = Math.atan2(direction.y, direction.x);
        for (let i = 0; i < 3; i++) {
            const offset = (Math.random() - 0.5) * 20;
            const px = x + Math.cos(angle + Math.PI / 2) * offset;
            const py = y + Math.sin(angle + Math.PI / 2) * offset;
            const vx = -Math.cos(angle) * 100;
            const vy = -Math.sin(angle) * 100;
            const life = 0.2 + Math.random() * 0.2;
            const color = `rgba(100, 200, 255, ${0.6 + Math.random() * 0.4})`;
            const size = 3 + Math.random() * 2;
            this.addParticle(new Particle(px, py, vx, vy, life, color, size));
        }
    }
    
    /**
     * Create scent trail particles
     */
    createScentTrail(x, y) {
        for (let i = 0; i < 2; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 10 + Math.random() * 20;
            const vx = Math.cos(angle) * speed;
            const vy = Math.sin(angle) * speed;
            const life = 0.5 + Math.random() * 0.5;
            const color = `rgba(255, 200, 100, ${0.5 + Math.random() * 0.5})`;
            const size = 2 + Math.random() * 2;
            const particle = new Particle(x, y, vx, vy, life, color, size);
            particle.gravity = -30; // Float upward
            this.addParticle(particle);
        }
    }
    
    addParticle(particle) {
        if (this.particles.length < this.maxParticles) {
            this.particles.push(particle);
        }
    }
    
    update(deltaTime) {
        // Update particles
        for (let i = this.particles.length - 1; i >= 0; i--) {
            if (!this.particles[i].update(deltaTime)) {
                this.particles.splice(i, 1);
            }
        }
        
        // Update effects
        for (let i = this.effects.length - 1; i >= 0; i--) {
            if (!this.effects[i].update(deltaTime)) {
                this.effects.splice(i, 1);
            }
        }
    }
    
    render(ctx, camera) {
        // Render particles
        this.particles.forEach(particle => {
            particle.render(ctx, camera);
        });
        
        // Render effects
        this.effects.forEach(effect => {
            effect.render(ctx, camera);
        });
    }
    
    clear() {
        this.particles = [];
        this.effects = [];
    }
}

