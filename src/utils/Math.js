/**
 * Math utilities - Vector math, distance, etc.
 */
export class Vec2 {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }
    
    add(other) {
        return new Vec2(this.x + other.x, this.y + other.y);
    }
    
    subtract(other) {
        return new Vec2(this.x - other.x, this.y - other.y);
    }
    
    multiply(scalar) {
        return new Vec2(this.x * scalar, this.y * scalar);
    }
    
    divide(scalar) {
        return new Vec2(this.x / scalar, this.y / scalar);
    }
    
    length() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }
    
    normalize() {
        const len = this.length();
        if (len === 0) return new Vec2(0, 0);
        return this.divide(len);
    }
    
    distance(other) {
        return this.subtract(other).length();
    }
    
    dot(other) {
        return this.x * other.x + this.y * other.y;
    }
    
    copy() {
        return new Vec2(this.x, this.y);
    }
    
    set(x, y) {
        this.x = x;
        this.y = y;
        return this;
    }
}

export function distance(x1, y1, x2, y2) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    return Math.sqrt(dx * dx + dy * dy);
}

export function lerp(start, end, t) {
    return start + (end - start) * t;
}

export function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

export function angleBetween(x1, y1, x2, y2) {
    return Math.atan2(y2 - y1, x2 - x1);
}

export function degToRad(degrees) {
    return degrees * Math.PI / 180;
}

export function radToDeg(radians) {
    return radians * 180 / Math.PI;
}

