export class Monster {
    // Add base configuration that all monsters inherit
    static baseConfig = {
        width: 30,
        height: 30,
        type: 'monster',
        hue: 0,
        baseSpeed: 1.5,
        eyeColor: '#222'
    };

    constructor(x, y, config = {}) {
        const fullConfig = { ...this.constructor.baseConfig, ...config };
        this.x = x;
        this.y = y;
        this.width = fullConfig.width;
        this.height = fullConfig.height;
        this.type = fullConfig.type;
        this.baseSpeed = fullConfig.baseSpeed;
        this.speed = this.baseSpeed;
        this.hue = fullConfig.hue;
        this.eyeColor = fullConfig.eyeColor;
        this.eyeDirection = { x: 0, y: 0 };
        this.isDead = false;
    }

    draw(ctx, viewportX, viewportY) {
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
            if (!gameMap.isColliding(this.x + moveX, this.y, this.width, this.height)) this.x += moveX;
            if (!gameMap.isColliding(this.x, this.y + moveY, this.width, this.height)) this.y += moveY;
        }
    }

    adjustPosition(dx, dy, gameMap) {
        if (!gameMap.isColliding(this.x + dx, this.y, this.width, this.height)) this.x += dx;
        if (!gameMap.isColliding(this.x, this.y + dy, this.width, this.height)) this.y += dy;
    }
} 