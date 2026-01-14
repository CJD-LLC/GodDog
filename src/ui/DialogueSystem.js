/**
 * DialogueSystem - NPC dialogue and god conversations
 */
export class DialogueSystem {
    constructor() {
        this.active = false;
        this.currentDialogue = null;
        this.currentLine = 0;
        this.charIndex = 0;
        this.charDelay = 30; // milliseconds per character
        this.lastCharTime = 0;
    }
    
    showDialogue(lines, speaker = '') {
        this.active = true;
        this.currentDialogue = { lines, speaker };
        this.currentLine = 0;
        this.charIndex = 0;
        this.lastCharTime = performance.now();
    }
    
    hideDialogue() {
        this.active = false;
        this.currentDialogue = null;
        this.currentLine = 0;
        this.charIndex = 0;
    }
    
    update(deltaTime) {
        if (!this.active || !this.currentDialogue) return;
        
        const currentTime = performance.now();
        if (currentTime - this.lastCharTime >= this.charDelay) {
            const line = this.currentDialogue.lines[this.currentLine];
            if (this.charIndex < line.length) {
                this.charIndex++;
                this.lastCharTime = currentTime;
            }
        }
    }
    
    advance() {
        if (!this.active || !this.currentDialogue) return;
        
        const line = this.currentDialogue.lines[this.currentLine];
        if (this.charIndex < line.length) {
            // Complete current line
            this.charIndex = line.length;
        } else {
            // Move to next line
            this.currentLine++;
            this.charIndex = 0;
            
            if (this.currentLine >= this.currentDialogue.lines.length) {
                this.hideDialogue();
            }
        }
    }
    
    render(ctx, width, height) {
        if (!this.active || !this.currentDialogue) return;
        
        ctx.save();
        
        // Dialogue box
        const boxWidth = width * 0.7;
        const boxHeight = 150;
        const boxX = (width - boxWidth) / 2;
        const boxY = height - boxHeight - 20;
        
        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        ctx.fillRect(boxX, boxY, boxWidth, boxHeight);
        
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.strokeRect(boxX, boxY, boxWidth, boxHeight);
        
        // Speaker name
        if (this.currentDialogue.speaker) {
            ctx.fillStyle = '#ffff00';
            ctx.font = 'bold 16px Arial';
            ctx.textAlign = 'left';
            ctx.fillText(this.currentDialogue.speaker, boxX + 10, boxY + 25);
        }
        
        // Dialogue text
        const line = this.currentDialogue.lines[this.currentLine];
        const displayedText = line.substring(0, this.charIndex);
        
        ctx.fillStyle = '#ffffff';
        ctx.font = '14px Arial';
        ctx.textAlign = 'left';
        
        // Word wrap
        const maxWidth = boxWidth - 20;
        const words = displayedText.split(' ');
        let lineY = boxY + 50;
        let currentLine = '';
        
        for (const word of words) {
            const testLine = currentLine + (currentLine ? ' ' : '') + word;
            const metrics = ctx.measureText(testLine);
            
            if (metrics.width > maxWidth && currentLine) {
                ctx.fillText(currentLine, boxX + 10, lineY);
                lineY += 20;
                currentLine = word;
            } else {
                currentLine = testLine;
            }
        }
        
        if (currentLine) {
            ctx.fillText(currentLine, boxX + 10, lineY);
        }
        
        // Continue indicator
        if (this.charIndex >= line.length && this.currentLine < this.currentDialogue.lines.length - 1) {
            ctx.fillStyle = '#ffff00';
            ctx.font = '12px Arial';
            ctx.textAlign = 'right';
            ctx.fillText('Press SPACE to continue...', boxX + boxWidth - 10, boxY + boxHeight - 10);
        }
        
        ctx.restore();
    }
    
    isActive() {
        return this.active;
    }
}

