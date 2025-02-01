export class Monster {
    // Add base configuration that all monsters inherit
    static baseConfig = {
        width: 30,
        height: 30,
        type: 'monster',
        hue: 0,
        baseSpeed: 1.5,
        eyeColor: '#222',
        damage: 1,  // Base damage per second
        attackInterval: 60  // 60 frames = 1 second
    };

    constructor(x, y, config) {
        this.x = x;
        this.y = y;
        this.type = config.key;
        this.name = config.name;
        
        // Size properties
        [this.width, this.height] = config.size;
        this.baseSize = [...config.size];
        
        // Color properties
        this.hue = config.color.hue;
        this.color = config.color;
        
        // Stats
        this.baseSpeed = config.stats.speed;
        this.speed = this.baseSpeed;
        this.maxHealth = config.stats.health;
        this.health = this.maxHealth;
        this.damage = config.stats.damage;
        this.attackInterval = config.stats.attackInterval;
        
        // Special behaviors
        this.behavior = config.behavior || {};
        this.eyeColor = config.eyeColor || '#222';
        this.chargeTime = 0;
        
        // State
        this.isDead = false;
        this.collisionTime = 0;
        this.eyeDirection = { x: 0, y: 0 };
        this.deathTime = 0;
        this.deathTimestamp = null;
    }

    draw(ctx, viewportX, viewportY) {
        if (this.isDead && this.deathTime > 60) { // Changed from 120 to 60 frames (1 second at 60fps)
            return;
        }
        if (this.behavior.phaseThroughWalls) {
            ctx.globalAlpha = this.behavior.phaseTransparency || 0.6;
        }
        
        if (this.isDead) {
            ctx.fillStyle = '#808080';
            ctx.strokeStyle = '#333';
        } else {
            ctx.fillStyle = `hsl(${360 + this.hue}, 100%, 50%)`;
            ctx.strokeStyle = '#600';
        }
        
        ctx.fillRect(this.x - viewportX, this.y - viewportY, this.width, this.height);
        ctx.lineWidth = 2;
        ctx.strokeRect(this.x - viewportX, this.y - viewportY, this.width, this.height);
        this.drawEyes(ctx, viewportX, viewportY);
        
        if (this.behavior.phaseThroughWalls) {
            ctx.globalAlpha = 1.0; // Reset transparency
        }
    }

    drawEyes(ctx, viewportX, viewportY) {
        const eyeSize = this.width * 0.15;
        const pupilSize = eyeSize * 0.6;
        const eyeSpacing = this.width * 0.25;
        const leftEyeX = this.x + this.width/2 - eyeSpacing - viewportX;
        const rightEyeX = this.x + this.width/2 + eyeSpacing - viewportX;
        const eyeY = this.y + this.height/3 - viewportY;
        ctx.fillStyle = this.eyeColor === '#222' ? 'white' : this.eyeColor;
        ctx.beginPath();
        ctx.arc(leftEyeX, eyeY, eyeSize, 0, Math.PI * 2);
        ctx.arc(rightEyeX, eyeY, eyeSize, 0, Math.PI * 2);
        ctx.fill();
        const angle = Math.atan2(this.eyeDirection.y, this.eyeDirection.x);
        const pupilOffsetX = Math.cos(angle) * eyeSize * 0.4;
        const pupilOffsetY = Math.sin(angle) * eyeSize * 0.4;
        ctx.fillStyle = '#222';
        ctx.beginPath();
        ctx.arc(leftEyeX + pupilOffsetX, eyeY + pupilOffsetY, pupilSize, 0, Math.PI * 2);
        ctx.arc(rightEyeX + pupilOffsetX, eyeY + pupilOffsetY, pupilSize, 0, Math.PI * 2);
        ctx.fill();
    }

    update(playerX, playerY, gameMap) {
        if (this.isDead) {
            this.deathTime++;
            return;
        }
        this.handleSpecialBehaviors(playerX, playerY);
        
        // Existing movement logic
        this.speed = this.isDead ? this.baseSpeed * 0.1 : this.baseSpeed;
        this.eyeDirection.x = playerX - this.x;
        this.eyeDirection.y = playerY - this.y;
        
        const dx = playerX - this.x;
        const dy = playerY - this.y;
        const distanceSq = dx * dx + dy * dy;
        
        if (distanceSq > 0) {
            const distance = Math.sqrt(distanceSq);
            const moveX = (dx / distance) * this.speed;
            const moveY = (dy / distance) * this.speed;
            
            // Ghost phasing behavior
            if (this.behavior.phaseThroughWalls) {
                this.x += moveX;
                this.y += moveY;
            } else {
                if (!gameMap.isColliding(this.x + moveX, this.y, this.width, this.height)) this.x += moveX;
                if (!gameMap.isColliding(this.x, this.y + moveY, this.width, this.height)) this.y += moveY;
            }
        }
    }

    handleSpecialBehaviors(playerX, playerY) {
        // Creeper charge behavior
        if (this.behavior.chargeDistance) {
            const dx = playerX - this.x;
            const dy = playerY - this.y;
            const distanceSq = dx*dx + dy*dy;
            
            if (distanceSq < this.behavior.chargeDistance ** 2) {
                this.chargeTime++;
                if (this.chargeTime > 60) {
                    this.speed = this.baseSpeed * this.behavior.chargeSpeedMultiplier;
                    this.width = this.baseSize[0] * this.behavior.chargeSizeMultiplier;
                    this.height = this.baseSize[1] * this.behavior.chargeSizeMultiplier;
                }
            } else {
                this.chargeTime = 0;
                this.speed = this.baseSpeed;
                this.width = this.baseSize[0];
                this.height = this.baseSize[1];
            }
        }

        // Stalker speed boost behavior
        if (this.type === 'stalker') {
            const angleToPlayer = Math.atan2(this.eyeDirection.y, this.eyeDirection.x);
            const playerFacing = Math.atan2(this.eyeDirection.y, this.eyeDirection.x);
            const angleDiff = Math.abs(angleToPlayer - playerFacing);
            this.speed = angleDiff > Math.PI/2 ? this.baseSpeed * 1.5 : this.baseSpeed;
        }
    }

    adjustPosition(dx, dy, gameMap) {
        if (!gameMap.isColliding(this.x + dx, this.y, this.width, this.height)) this.x += dx;
        if (!gameMap.isColliding(this.x, this.y + dy, this.width, this.height)) this.y += dy;
    }

    takeDamage(amount) {
        this.health -= amount;
        if (this.health <= 0 && !this.isDead) {
            this.isDead = true;
            this.deathTimestamp = Date.now();
        }
    }
} 