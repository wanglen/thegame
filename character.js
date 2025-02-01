export class Character {
    constructor(x, y, width = 30, height = 40, speed = 5) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.speed = speed;
        this.collisionCooldown = new Set();
        this.attackCooldown = 0;
        this.isAttacking = false;
        this.attackDuration = 200; // ms
        this.attackRange = 40;
        this.lastDirection = 'right'; // default
        this.attackProgress = 0; // Tracks animation frame
        this.attackPhases = 3; // Number of animation frames
        this.health = 100;  // Add health property
        this._isDead = false;  // Add backing field
        this.isInvulnerable = false;
        this.originalColor = '#00FF00'; // Bright green
        this.color = this.originalColor; // Set initial color
        this.invulnerabilityColor = '#FFD700'; // Golden color
        this._isInvulnerable = false;
    }

    get isDead() {
        return this._isDead || this.health <= 0;
    }
    set isDead(value) {
        this._isDead = value;
    }

    set isInvulnerable(value) {
        this._isInvulnerable = value;
        this.color = value ? this.invulnerabilityColor : this.originalColor;
    }
    
    get isInvulnerable() {
        return this._isInvulnerable;
    }

    update(keys, map) {
        // Track movement direction at the start of update
        this.lastDirection = 'right'; // default
        if (keys.ArrowLeft) this.lastDirection = 'left';
        if (keys.ArrowRight) this.lastDirection = 'right';
        if (keys.ArrowUp) this.lastDirection = 'up';
        if (keys.ArrowDown) this.lastDirection = 'down';

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

        // Handle space bar attack
        if (keys[' '] && this.attackCooldown <= 0 && !this.isAttacking) {
            this.isAttacking = true;
            this.attackProgress = 0;
            this.attackCooldown = 500;
            
            const phaseInterval = this.attackDuration / this.attackPhases;
            const attackTimer = setInterval(() => {
                this.attackProgress++;
                if (this.attackProgress >= this.attackPhases) {
                    clearInterval(attackTimer);
                    this.isAttacking = false;
                }
            }, phaseInterval);
            
            setTimeout(() => {
                this.attackCooldown = 0;
            }, this.attackCooldown);
        }
    }

    draw(ctx, viewportX, viewportY) {
        // Change color when invulnerable
        const originalColor = this.color;
        if (this.isInvulnerable) {
            this.color = this.invulnerabilityColor;
        }
        
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

        // Dynamic sword drawing (MODIFIED)
        if (this.isAttacking) {
            const slashAngle = (Math.PI / 4) * (this.attackProgress + 1);
            const swordLength = this.attackRange;
            
            ctx.save();
            ctx.fillStyle = '#C0C0C0';
            ctx.strokeStyle = '#333';
            ctx.lineWidth = 2;
            
            const centerX = screenX + this.width/2;
            const centerY = screenY + this.height/2;

            switch(this.lastDirection) {
                case 'left':
                    ctx.translate(centerX - swordLength * 0.8, centerY);
                    ctx.rotate(-slashAngle);
                    ctx.fillRect(0, -3, swordLength, 6);
                    ctx.strokeRect(0, -3, swordLength, 6);
                    break;
                case 'right':
                    ctx.translate(centerX + swordLength * 0.2, centerY);
                    ctx.rotate(slashAngle);
                    ctx.fillRect(0, -3, swordLength, 6);
                    ctx.strokeRect(0, -3, swordLength, 6);
                    break;
                case 'up':
                    ctx.translate(centerX, centerY - swordLength * 0.8);
                    ctx.rotate(-slashAngle);
                    ctx.fillRect(-3, 0, 6, swordLength);
                    ctx.strokeRect(-3, 0, 6, swordLength);
                    break;
                default: // down
                    ctx.translate(centerX, centerY + swordLength * 0.2);
                    ctx.rotate(slashAngle);
                    ctx.fillRect(-3, 0, 6, swordLength);
                    ctx.strokeRect(-3, 0, 6, swordLength);
            }
            
            ctx.restore();

            // Add motion trail
            for(let i = 0; i < this.attackProgress; i++) {
                ctx.fillStyle = `rgba(192, 192, 192, ${0.3 - (i * 0.1)})`;
                const offset = i * 3;
                switch(this.lastDirection) {
                    case 'left':
                        ctx.fillRect(centerX - swordLength * 0.8 - offset, centerY - 3, swordLength, 6);
                        break;
                    case 'right':
                        ctx.fillRect(centerX + swordLength * 0.2 + offset, centerY - 3, swordLength, 6);
                        break;
                    case 'up':
                        ctx.fillRect(centerX - 3, centerY - swordLength * 0.8 - offset, 6, swordLength);
                        break;
                    default:
                        ctx.fillRect(centerX - 3, centerY + swordLength * 0.2 + offset, 6, swordLength);
                }
            }
        }

        // Add health bar display (NEW)
        const canvasWidth = ctx.canvas.width;
        ctx.fillStyle = '#ff0000'; // Red background
        ctx.fillRect(canvasWidth - 210, 10, 200, 20);
        ctx.fillStyle = '#00ff00'; // Green health
        ctx.fillRect(canvasWidth - 210, 10, (this.health / 100) * 200, 20);
        ctx.fillStyle = '#ffffff';
        ctx.font = '16px Arial';
        ctx.fillText(`HP: ${this.health}`, canvasWidth - 200, 28);
        
        // Reset color
        this.color = originalColor;
    }

    checkMonsterCollision(monster) {
        return this.x < monster.x + monster.width &&
               this.x + this.width > monster.x &&
               this.y < monster.y + monster.height &&
               this.y + this.height > monster.y;
    }

    handleMonsterCollision(monster, gameMap) {
        // Allow attacking even when invulnerable
        if (this.collisionCooldown.has(monster) || monster.isDead) return;

        if (this.isAttacking) {
            // Instant kill when attacking (regardless of invulnerability)
            monster.isDead = true;
            this.addCollisionCooldown(monster);
            return;
        }

        // Only prevent damage when invulnerable
        if (this.isInvulnerable) return;

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

    applyLifeEffect() {
        let blinkCount = 0;
        const blinkInterval = setInterval(() => {
            this.color = this.color === this.originalColor ? '#FF0000' : this.originalColor;
            if (++blinkCount >= 4) {
                clearInterval(blinkInterval);
                this.color = this.originalColor;
            }
        }, 200);
    }
} 