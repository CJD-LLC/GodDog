/**
 * AudioManager - Basic audio management (placeholder for Howler.js integration)
 */
export class AudioManager {
    constructor() {
        this.sounds = {};
        this.music = null;
        this.musicVolume = 0.5;
        this.soundVolume = 0.7;
        this.enabled = true;
    }
    
    loadSound(name, src) {
        // Placeholder - in production, use Howler.js
        this.sounds[name] = { src, loaded: true };
    }
    
    playSound(name, volume = 1.0) {
        if (!this.enabled) return;
        // Placeholder - in production, use Howler.js
        console.log(`Playing sound: ${name} at volume ${volume}`);
    }
    
    playMusic(src, loop = true) {
        if (!this.enabled) return;
        // Placeholder - in production, use Howler.js
        this.music = { src, loop, playing: true };
        console.log(`Playing music: ${src}`);
    }
    
    stopMusic() {
        if (this.music) {
            this.music.playing = false;
        }
    }
    
    setMusicVolume(volume) {
        this.musicVolume = Math.max(0, Math.min(1, volume));
    }
    
    setSoundVolume(volume) {
        this.soundVolume = Math.max(0, Math.min(1, volume));
    }
    
    setEnabled(enabled) {
        this.enabled = enabled;
        if (!enabled) {
            this.stopMusic();
        }
    }
}

