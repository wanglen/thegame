class Character {
    constructor(x, y, width = 30, height = 40, speed = 5, color = '#00aa00') {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.speed = speed;
        this.color = color;
        this.collisionCooldown = new Set();
    }

    update(keys, map) {
        const originalX = this.x;
        const originalY = this.y;
        let moved = false;

        // X-axis movement
        if (keys.ArrowLeft || keys.ArrowRight) {
            const newX = keys.ArrowLeft ? this.x - this.speed : this.x + this.speed;
            if (!map.isColliding(newX, this.y, this.width, this.height)) {
                this.x = newX;
                moved = true;
            }
        }

        // Y-axis movement
        if (keys.ArrowUp || keys.ArrowDown) {
            const newY = keys.ArrowUp ? this.y - this.speed : this.y + this.speed;
            if (!map.isColliding(this.x, newY, this.width, this.height)) {
                this.y = newY;
                moved = true;
            }
        }

        // Diagonal movement fallback
        if (!moved && (keys.ArrowLeft || keys.ArrowRight || keys.ArrowUp || keys.ArrowDown)) {
            const newX = keys.ArrowLeft ? this.x - this.speed : keys.ArrowRight ? this.x + this.speed : this.x;
            const newY = keys.ArrowUp ? this.y - this.speed : keys.ArrowDown ? this.y + this.speed : this.y;
            
            if (!map.isColliding(newX, newY, this.width, this.height)) {
                this.x = newX;
                this.y = newY;
            }
        }

        // Final collision check
        if (map.isColliding(this.x, this.y, this.width, this.height)) {
            this.x = originalX;
            this.y = originalY;
        }
    }

    draw(ctx, viewportX, viewportY) {
        // Convert world coordinates to screen coordinates
        const screenX = this.x - viewportX;
        const screenY = this.y - viewportY;

        // Draw body (green clothes)
        ctx.fillStyle = this.color;
        ctx.fillRect(screenX, screenY, this.width, this.height);

        // Draw head
        ctx.fillStyle = '#ffcc99';
        const headHeight = this.height * 0.2;
        ctx.fillRect(
            screenX + this.width/4, 
            screenY - headHeight, 
            this.width/2, 
            headHeight
        );

        // Draw legs (green pants)
        const legWidth = this.width/4;
        const legHeight = this.height * 0.3;
        // Left leg
        ctx.fillRect(
            screenX + legWidth/2,
            screenY + this.height,
            legWidth,
            legHeight
        );
        // Right leg
        ctx.fillRect(
            screenX + this.width - legWidth*1.5,
            screenY + this.height,
            legWidth,
            legHeight
        );

        // Draw arms
        const armWidth = this.width/6;
        const armHeight = this.height * 0.6;
        // Left arm
        ctx.fillStyle = '#ffcc99';
        ctx.fillRect(
            screenX - armWidth,
            screenY + this.height * 0.2,
            armWidth,
            armHeight
        );
        // Right arm
        ctx.fillRect(
            screenX + this.width,
            screenY + this.height * 0.2,
            armWidth,
            armHeight
        );
    }

    checkMonsterCollision(monster) {
        return this.x < monster.x + monster.width &&
               this.x + this.width > monster.x &&
               this.y < monster.y + monster.height &&
               this.y + this.height > monster.y;
    }

    handleMonsterCollision(monster, gameMap) {
        // Add dead check at start of method
        if (this.collisionCooldown.has(monster) || monster.isDead) return;
        
        const dx = monster.x - this.x;
        const dy = monster.y - this.y;
        const direction = Math.atan2(dy, dx);
        const pushDistance = 5; // Fixed push distance

        // Calculate potential new positions
        const pushOptions = [
            { x: Math.cos(direction) * pushDistance, y: Math.sin(direction) * pushDistance }, // Direct push
            { x: Math.cos(direction + Math.PI/4) * pushDistance, y: Math.sin(direction + Math.PI/4) * pushDistance }, // Diagonal 1
            { x: Math.cos(direction - Math.PI/4) * pushDistance, y: Math.sin(direction - Math.PI/4) * pushDistance }, // Diagonal 2
            { x: Math.cos(direction + Math.PI/2) * pushDistance, y: Math.sin(direction + Math.PI/2) * pushDistance }, // Perpendicular 1
            { x: Math.cos(direction - Math.PI/2) * pushDistance, y: Math.sin(direction - Math.PI/2) * pushDistance }  // Perpendicular 2
        ];

        // Find first valid push direction
        for (const push of pushOptions) {
            const newX = monster.x + push.x;
            const newY = monster.y + push.y;
            
            if (!gameMap.isColliding(newX, newY, monster.width, monster.height)) {
                monster.x = newX;
                monster.y = newY;
                this.collisionCooldown.add(monster);
                setTimeout(() => this.collisionCooldown.delete(monster), 100);
                monster.isDead = true;
                return;
            }
        }
    }
} 