/**
 * SpriteSheet - Handles sprite sheet loading and frame extraction
 */
export class SpriteSheet {
    constructor(image, frameWidth, frameHeight, frameCount = null, layout = 'horizontal') {
        this.image = image;
        this.frameWidth = frameWidth;
        this.frameHeight = frameHeight;
        this.layout = layout; // 'horizontal', 'vertical', or 'grid'
        this.frameCount = frameCount || this.calculateFrameCount();
        this.frames = [];
        this.cachedFrames = new Map();
        
        this.init();
    }
    
    init() {
        if (!this.image) return;
        
        // Calculate frames based on layout
        if (this.layout === 'horizontal') {
            this.framesPerRow = Math.floor(this.image.width / this.frameWidth);
            this.framesPerCol = 1;
        } else if (this.layout === 'vertical') {
            this.framesPerRow = 1;
            this.framesPerCol = Math.floor(this.image.height / this.frameHeight);
        } else if (this.layout === 'grid') {
            this.framesPerRow = Math.floor(this.image.width / this.frameWidth);
            this.framesPerCol = Math.floor(this.image.height / this.frameHeight);
        }
    }
    
    calculateFrameCount() {
        if (!this.image) return 0;
        
        if (this.layout === 'horizontal') {
            return Math.floor(this.image.width / this.frameWidth);
        } else if (this.layout === 'vertical') {
            return Math.floor(this.image.height / this.frameHeight);
        } else if (this.layout === 'grid') {
            return Math.floor(this.image.width / this.frameWidth) * 
                   Math.floor(this.image.height / this.frameHeight);
        }
        return 0;
    }
    
    /**
     * Get a frame from the sprite sheet
     * @param {number} frameIndex - Index of the frame (0-based)
     * @returns {Object} Object with image, sx, sy, sWidth, sHeight
     */
    getFrame(frameIndex) {
        if (frameIndex < 0 || frameIndex >= this.frameCount) {
            frameIndex = 0; // Default to first frame
        }
        
        // Check cache
        if (this.cachedFrames.has(frameIndex)) {
            return this.cachedFrames.get(frameIndex);
        }
        
        let sx, sy;
        
        if (this.layout === 'horizontal') {
            sx = frameIndex * this.frameWidth;
            sy = 0;
        } else if (this.layout === 'vertical') {
            sx = 0;
            sy = frameIndex * this.frameHeight;
        } else if (this.layout === 'grid') {
            const row = Math.floor(frameIndex / this.framesPerRow);
            const col = frameIndex % this.framesPerRow;
            sx = col * this.frameWidth;
            sy = row * this.frameHeight;
        }
        
        const frameData = {
            image: this.image,
            sx: sx,
            sy: sy,
            sWidth: this.frameWidth,
            sHeight: this.frameHeight,
            frameIndex: frameIndex
        };
        
        // Cache the frame
        this.cachedFrames.set(frameIndex, frameData);
        
        return frameData;
    }
    
    /**
     * Draw a frame to a canvas context
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     * @param {number} frameIndex - Index of the frame to draw
     * @param {number} dx - Destination x
     * @param {number} dy - Destination y
     * @param {number} dWidth - Destination width (optional, defaults to frameWidth)
     * @param {number} dHeight - Destination height (optional, defaults to frameHeight)
     */
    drawFrame(ctx, frameIndex, dx, dy, dWidth = null, dHeight = null) {
        const frame = this.getFrame(frameIndex);
        
        ctx.drawImage(
            frame.image,
            frame.sx,
            frame.sy,
            frame.sWidth,
            frame.sHeight,
            dx,
            dy,
            dWidth || frame.sWidth,
            dHeight || frame.sHeight
        );
    }
    
    /**
     * Get all frames as an array
     * @returns {Array} Array of frame data objects
     */
    getAllFrames() {
        const frames = [];
        for (let i = 0; i < this.frameCount; i++) {
            frames.push(this.getFrame(i));
        }
        return frames;
    }
    
    /**
     * Create a SpriteSheet from an image URL
     * @param {string} src - Image source URL
     * @param {number} frameWidth - Width of each frame
     * @param {number} frameHeight - Height of each frame
     * @param {number} frameCount - Number of frames (optional)
     * @param {string} layout - Layout type ('horizontal', 'vertical', 'grid')
     * @returns {Promise<SpriteSheet>} Promise that resolves to a SpriteSheet
     */
    static async load(src, frameWidth, frameHeight, frameCount = null, layout = 'horizontal') {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                const spriteSheet = new SpriteSheet(img, frameWidth, frameHeight, frameCount, layout);
                resolve(spriteSheet);
            };
            img.onerror = reject;
            img.src = src;
        });
    }
    
    /**
     * Create a SpriteSheet from an already loaded image
     * @param {HTMLImageElement} image - Loaded image element
     * @param {number} frameWidth - Width of each frame
     * @param {number} frameHeight - Height of each frame
     * @param {number} frameCount - Number of frames (optional)
     * @param {string} layout - Layout type ('horizontal', 'vertical', 'grid')
     * @returns {SpriteSheet} SpriteSheet instance
     */
    static fromImage(image, frameWidth, frameHeight, frameCount = null, layout = 'horizontal') {
        return new SpriteSheet(image, frameWidth, frameHeight, frameCount, layout);
    }
}

