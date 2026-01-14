/**
 * Collision - 2D collision detection helpers (AABB, circle)
 */
export class AABB {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
    
    getLeft() {
        return this.x;
    }
    
    getRight() {
        return this.x + this.width;
    }
    
    getTop() {
        return this.y;
    }
    
    getBottom() {
        return this.y + this.height;
    }
    
    getCenterX() {
        return this.x + this.width / 2;
    }
    
    getCenterY() {
        return this.y + this.height / 2;
    }
}

export class Circle {
    constructor(x, y, radius) {
        this.x = x;
        this.y = y;
        this.radius = radius;
    }
}

export function aabbVsAABB(a, b) {
    return a.getLeft() < b.getRight() &&
           a.getRight() > b.getLeft() &&
           a.getTop() < b.getBottom() &&
           a.getBottom() > b.getTop();
}

export function circleVsCircle(a, b) {
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance < (a.radius + b.radius);
}

export function circleVsAABB(circle, aabb) {
    const closestX = Math.max(aabb.getLeft(), Math.min(circle.x, aabb.getRight()));
    const closestY = Math.max(aabb.getTop(), Math.min(circle.y, aabb.getBottom()));
    
    const dx = circle.x - closestX;
    const dy = circle.y - closestY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    return distance < circle.radius;
}

export function pointInAABB(x, y, aabb) {
    return x >= aabb.getLeft() &&
           x <= aabb.getRight() &&
           y >= aabb.getTop() &&
           y <= aabb.getBottom();
}

export function pointInCircle(x, y, circle) {
    const dx = x - circle.x;
    const dy = y - circle.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance < circle.radius;
}

