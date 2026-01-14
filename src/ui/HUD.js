/**
 * HUD - Health, god ability cooldown, resources
 */
export class HUD {
    constructor(assetLoader = null) {
        this.width = 0;
        this.height = 0;
        this.assetLoader = assetLoader;
    }
    
    setSize(width, height) {
        this.width = width;
        this.height = height;
    }
    
    setAssetLoader(assetLoader) {
        this.assetLoader = assetLoader;
    }
    
    render(ctx, player, godManager, resources) {
        ctx.save();
        
        // Health bar
        const barWidth = 200;
        const barHeight = 20;
        const barX = 20;
        const barY = 20;
        
        const healthPercent = player.getHealth() / player.getMaxHealth();
        
        // Try to use sprite-based health bar
        const healthBarBg = this.assetLoader?.getImage('ui_health_bar_bg');
        const healthBarFill = this.assetLoader?.getImage('ui_health_bar_fill');
        
        if (healthBarBg && healthBarFill) {
            // Render sprite-based health bar
            ctx.drawImage(healthBarBg, barX, barY, barWidth, barHeight);
            ctx.save();
            ctx.beginPath();
            ctx.rect(barX, barY, barWidth * healthPercent, barHeight);
            ctx.clip();
            ctx.drawImage(healthBarFill, barX, barY, barWidth, barHeight);
            ctx.restore();
        } else {
            // Fallback: canvas-drawn health bar
            ctx.fillStyle = '#330000';
            ctx.fillRect(barX, barY, barWidth, barHeight);
            ctx.fillStyle = '#ff0000';
            ctx.fillRect(barX, barY, barWidth * healthPercent, barHeight);
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 2;
            ctx.strokeRect(barX, barY, barWidth, barHeight);
        }
        
        // Health text
        ctx.fillStyle = '#ffffff';
        ctx.font = '14px Arial';
        ctx.textAlign = 'left';
        ctx.fillText(
            `HP: ${Math.ceil(player.getHealth())}/${player.getMaxHealth()}`,
            barX + 5,
            barY + 15
        );
        
        // God ability cooldown
        const activeGod = godManager.getActiveGod();
        let cooldownY = barY + barHeight + 10;
        if (activeGod) {
            const cooldownPercent = activeGod.getCooldownPercent();
            
            // Try to use sprite-based cooldown bar
            const cooldownBar = this.assetLoader?.getImage('ui_cooldown_bar');
            
            if (cooldownBar) {
                ctx.drawImage(cooldownBar, barX, cooldownY, barWidth, 15);
                ctx.save();
                ctx.fillStyle = '#00ff00';
                ctx.globalAlpha = 0.7;
                ctx.fillRect(barX, cooldownY, barWidth * cooldownPercent, 15);
                ctx.restore();
            } else {
                // Fallback: canvas-drawn cooldown bar
                ctx.fillStyle = '#333333';
                ctx.fillRect(barX, cooldownY, barWidth, 15);
                ctx.fillStyle = '#00ff00';
                ctx.fillRect(barX, cooldownY, barWidth * cooldownPercent, 15);
                ctx.strokeStyle = '#ffffff';
                ctx.lineWidth = 1;
                ctx.strokeRect(barX, cooldownY, barWidth, 15);
            }
            
            ctx.fillStyle = '#ffffff';
            ctx.font = '12px Arial';
            ctx.fillText(
                `${activeGod.name} Ability`,
                barX + 5,
                cooldownY + 12
            );
        }
        
        // Resources
        if (resources) {
            const resourcesY = cooldownY + 25;
            ctx.fillStyle = '#ffffff';
            ctx.font = '14px Arial';
            ctx.fillText(`Bones: ${resources.bones}`, barX, resourcesY);
            ctx.fillText(`Devotion: ${resources.devotion}`, barX, resourcesY + 20);
            ctx.fillText(`Followers: ${resources.followers}`, barX, resourcesY + 40);
        }
        
        ctx.restore();
    }
}

