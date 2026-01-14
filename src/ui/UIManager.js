/**
 * UIManager - Manages all UI overlays
 */
export class UIManager {
    constructor() {
        this.components = [];
    }
    
    addComponent(component) {
        this.components.push(component);
    }
    
    removeComponent(component) {
        const index = this.components.indexOf(component);
        if (index > -1) {
            this.components.splice(index, 1);
        }
    }
    
    update(deltaTime) {
        this.components.forEach(component => {
            if (component.update) {
                component.update(deltaTime);
            }
        });
    }
    
    render(ctx) {
        this.components.forEach(component => {
            if (component.render) {
                component.render(ctx);
            }
        });
    }
}

