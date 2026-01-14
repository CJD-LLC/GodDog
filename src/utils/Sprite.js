/**
 * Sprite - Sprite rendering class with sprite sheet support
 */
export class Sprite {
    constructor(image, x = 0, y = 0, width = null, height = null) {
        this.image = image;
        this.spriteSheet = null;
        this.currentFrame = 0;
        this.x = x;
        this.y = y;
        this.width = width || (image ? image.width : 32);
        this.height = height || (image ? image.height : 32);
        this.rotation = 0;
        this.scaleX = 1;
        this.scaleY = 1;
        this.alpha = 1;
        this.visible = true;
        this.flipX = false;
        this.flipY = false;
    }
    
    /**
     * Set sprite sheet and frame
     * @param {SpriteSheet} spriteSheet - The sprite sheet to use
     * @param {number} frameIndex - Frame index to display
     */
    setSpriteSheet(spriteSheet, frameIndex = 0) {
        this.spriteSheet = spriteSheet;
        this.currentFrame = frameIndex;
        if (spriteSheet) {
            this.width = spriteSheet.frameWidth;
            this.height = spriteSheet.frameHeight;
        }
    }
    
    /**
     * Set current frame index
     * @param {number} frameIndex - Frame index to display
     */
    setFrame(frameIndex) {
        this.currentFrame = frameIndex;
    }
    
    render(ctx, camera = null) {
        if (!this.visible || this.alpha <= 0) return;
        
        ctx.save();
        
        // Apply camera transform if provided
        let screenX = this.x;
        let screenY = this.y;
        
        if (camera) {
            const screenPos = camera.worldToScreen(this.x, this.y);
            screenX = screenPos.x;
            screenY = screenPos.y;
        }
        
        ctx.globalAlpha = this.alpha;
        ctx.translate(screenX, screenY);
        ctx.rotate(this.rotation);
        
        // Handle flipping
        if (this.flipX || this.flipY) {
            ctx.scale(this.flipX ? -this.scaleX : this.scaleX, this.flipY ? -this.scaleY : this.scaleY);
        } else {
            ctx.scale(this.scaleX, this.scaleY);
        }
        
        if (this.spriteSheet) {
            // Render from sprite sheet
            const frame = this.spriteSheet.getFrame(this.currentFrame);
            ctx.drawImage(
                frame.image,
                frame.sx,
                frame.sy,
                frame.sWidth,
                frame.sHeight,
                -this.width / 2,
                -this.height / 2,
                this.width,
                this.height
            );
        } else if (this.image) {
            // Render regular image
            ctx.drawImage(
                this.image,
                -this.width / 2,
                -this.height / 2,
                this.width,
                this.height
            );
        } else {
            // Fallback: draw a rectangle
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
        }
        
        ctx.restore();
    }
    
    setPosition(x, y) {
        this.x = x;
        this.y = y;
    }
    
    setRotation(angle) {
        this.rotation = angle;
    }
    
    setScale(x, y) {
        this.scaleX = x;
        this.scaleY = y;
    }
    
    setAlpha(alpha) {
        this.alpha = Math.max(0, Math.min(1, alpha));
    }
    
    setFlip(flipX, flipY = false) {
        this.flipX = flipX;
        this.flipY = flipY;
    }
}

