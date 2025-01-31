import { Monster } from './Monster.js';

export class Creeper extends Monster {
    static config = {
        width: 20,
        height: 20,
        type: 'creeper',
        hue: 120,
        baseSpeed: 1.8
    };

    constructor(x, y) {
        super(x, y, Creeper.config);
        this.chargeTime = 0;
    }

    draw(ctx, viewportX, viewportY) {
        if (this.isDead) {
            ctx.fillStyle = '#808080';
        } else {
            const flash = Math.sin(Date.now()/200) * 10;
            ctx.fillStyle = `hsl(${120 + flash}, 100%, 50%)`;
        }
        ctx.fillRect(this.x - viewportX, this.y - viewportY, this.width, this.height);
        const eyeSize = this.width * 0.2;
        const drawX = (x, y) => {
            ctx.strokeStyle = '#000';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(x - eyeSize/2, y - eyeSize/2);
            ctx.lineTo(x + eyeSize/2, y + eyeSize/2);
            ctx.moveTo(x + eyeSize/2, y - eyeSize/2);
            ctx.lineTo(x - eyeSize/2, y + eyeSize/2);
            ctx.stroke();
        };
        drawX(this.x + this.width/3 - viewportX, this.y + this.height/3 - viewportY);
        drawX(this.x + this.width*2/3 - viewportX, this.y + this.height/3 - viewportY);
    }

    update(playerX, playerY, gameMap) {
        const dx = playerX - this.x;
        const dy = playerY - this.y;
        const distanceSq = dx*dx + dy*dy;
        if (distanceSq < 10000) {
            this.chargeTime++;
            if (this.chargeTime > 60) {
                this.speed = this.baseSpeed * 3;
                this.width = this.height = 24;
            }
        } else {
            this.chargeTime = 0;
            this.speed = this.baseSpeed;
            this.width = this.height = 20;
        }
        super.update(playerX, playerY, gameMap);
    }
} 