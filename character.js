export class Character {
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
        let dx = 0, dy = 0;

        // Calculate movement vectors first
        if (keys.ArrowLeft) dx -= this.speed;
        if (keys.ArrowRight) dx += this.speed;
        if (keys.ArrowUp) dy -= this.speed;
        if (keys.ArrowDown) dy += this.speed;

        // Try pure horizontal/vertical movement first
        if (dx !== 0) {
            const newX = this.x + dx;
            if (!map.isColliding(newX, this.y, this.width, this.height)) {
                this.x = newX;
                dx = 0; // Mark axis as handled
            }
        }
        
        if (dy !== 0) {
            const newY = this.y + dy;
            if (!map.isColliding(this.x, newY, this.width, this.height)) {
                this.y = newY;
                dy = 0; // Mark axis as handled
            }
        }

        // Handle remaining movement diagonally
        if (dx !== 0 || dy !== 0) {
            const newX = this.x + dx;
            const newY = this.y + dy;
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
        if (this.collisionCooldown.has(monster) || monster.isDead) return;

        // Precompute static directions array once
        const DIRECTIONS = [0, Math.PI/4, -Math.PI/4, Math.PI/2, -Math.PI/2];
        const angle = Math.atan2(monster.y - this.y, monster.x - this.x);
        const PUSH_DISTANCE = 5;

        // Use for loop instead of find for better performance
        for (let i = 0; i < DIRECTIONS.length; i++) {
            const dir = DIRECTIONS[i];
            const newX = monster.x + Math.cos(angle + dir) * PUSH_DISTANCE;
            const newY = monster.y + Math.sin(angle + dir) * PUSH_DISTANCE;
            
            if (this.isValidPushPosition(newX, newY, monster, gameMap)) {
                monster.x = newX;
                monster.y = newY;
                this.addCollisionCooldown(monster);
                monster.isDead = true;
                break; // Exit early when found
            }
        }
    }

    isValidPushPosition(x, y, monster, gameMap) {
        return x >= 0 && 
               y >= 0 &&
               x + monster.width <= gameMap.width &&
               y + monster.height <= gameMap.height &&
               !gameMap.isColliding(x, y, monster.width, monster.height);
    }

    addCollisionCooldown(monster) {
        this.collisionCooldown.add(monster);
        setTimeout(() => this.collisionCooldown.delete(monster), 100);
    }
} 