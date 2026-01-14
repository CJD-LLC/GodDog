/**
 * AssetLoader - Loads sprites, tiles, audio, and sprite sheets
 */
import { SpriteSheet } from '../utils/SpriteSheet.js';

export class AssetLoader {
    constructor() {
        this.images = {};
        this.spriteSheets = {};
        this.audio = {};
        this.loaded = false;
        this.loadProgress = 0;
        this.totalAssets = 0;
        this.loadedAssets = 0;
        this.metadata = {};
    }
    
    async loadImage(src, name) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                this.images[name] = img;
                this.loadedAssets++;
                this.updateProgress();
                resolve(img);
            };
            img.onerror = () => {
                console.warn(`Failed to load image: ${src}`);
                reject(new Error(`Failed to load image: ${src}`));
            };
            img.src = src;
        });
    }
    
    async loadSpriteSheet(src, name, frameWidth, frameHeight, frameCount = null, layout = 'horizontal') {
        try {
            const img = await this.loadImage(src, `_temp_${name}`);
            const spriteSheet = SpriteSheet.fromImage(img, frameWidth, frameHeight, frameCount, layout);
            this.spriteSheets[name] = spriteSheet;
            // Remove temporary image reference
            delete this.images[`_temp_${name}`];
            return spriteSheet;
        } catch (error) {
            console.error(`Failed to load sprite sheet: ${name}`, error);
            throw error;
        }
    }
    
    async loadAudio(src, name) {
        return new Promise((resolve, reject) => {
            // For MVP, we'll use placeholder audio
            // In production, use Howler.js
            this.audio[name] = { src, loaded: true };
            this.loadedAssets++;
            this.updateProgress();
            resolve(this.audio[name]);
        });
    }
    
    async loadAssets(manifest) {
        this.totalAssets = 0;
        this.loadedAssets = 0;
        this.loaded = false;
        
        // Count total assets
        if (manifest.images) this.totalAssets += Object.keys(manifest.images).length;
        if (manifest.spriteSheets) this.totalAssets += Object.keys(manifest.spriteSheets).length;
        if (manifest.audio) this.totalAssets += Object.keys(manifest.audio).length;
        
        const promises = [];
        
        // Load images
        if (manifest.images) {
            for (const [name, src] of Object.entries(manifest.images)) {
                promises.push(this.loadImage(src, name).catch(err => {
                    console.warn(`Failed to load image ${name}:`, err);
                    return null; // Continue loading other assets
                }));
            }
        }
        
        // Load sprite sheets
        if (manifest.spriteSheets) {
            for (const [name, config] of Object.entries(manifest.spriteSheets)) {
                const { src, frameWidth, frameHeight, frameCount = null, layout = 'horizontal' } = config;
                promises.push(
                    this.loadSpriteSheet(src, name, frameWidth, frameHeight, frameCount, layout)
                        .catch(err => {
                            console.warn(`Failed to load sprite sheet ${name}:`, err);
                            return null; // Continue loading other assets
                        })
                );
            }
        }
        
        // Load audio
        if (manifest.audio) {
            for (const [name, src] of Object.entries(manifest.audio)) {
                promises.push(this.loadAudio(src, name));
            }
        }
        
        await Promise.all(promises);
        
        // Load metadata if provided
        if (manifest.metadata) {
            this.metadata = manifest.metadata;
        }
        
        this.loaded = true;
    }
    
    async loadManifest(manifestPath) {
        try {
            const response = await fetch(manifestPath);
            const manifest = await response.json();
            await this.loadAssets(manifest);
            return manifest;
        } catch (error) {
            console.error(`Failed to load manifest from ${manifestPath}:`, error);
            throw error;
        }
    }
    
    updateProgress() {
        this.loadProgress = this.totalAssets > 0 ? this.loadedAssets / this.totalAssets : 1;
    }
    
    getImage(name) {
        return this.images[name] || null;
    }
    
    getSpriteSheet(name) {
        return this.spriteSheets[name] || null;
    }
    
    getAudio(name) {
        return this.audio[name] || null;
    }
    
    getMetadata(name) {
        return this.metadata[name] || null;
    }
    
    isLoaded() {
        return this.loaded;
    }
    
    getProgress() {
        return this.loadProgress;
    }
}

