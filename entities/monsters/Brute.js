import { Monster } from './Monster.js';

export class Brute extends Monster {
    static config = {
        width: 35,
        height: 35,
        type: 'brute',
        hue: -5,
        baseSpeed: 1.0,
        health: 3,
        damage: 3,
        attackInterval: 40
    };

    constructor(x, y) {
        super(x, y, Brute.config);
    }

    draw(ctx, viewportX, viewportY) {
        if (this.isDead) {
            ctx.fillStyle = '#808080';
            ctx.strokeStyle = '#333';
        } else {
            ctx.fillStyle = `hsl(${360 + this.hue}, 100%, 30%)`;
            ctx.strokeStyle = '#444';
        }
        ctx.fillRect(this.x - viewportX, this.y - viewportY, this.width, this.height);
        ctx.lineWidth = 3;
        ctx.strokeRect(
            this.x - viewportX + 2, 
            this.y - viewportY + 2, 
            this.width - 4, 
            this.height - 4
        );
        this.drawEyes(ctx, viewportX, viewportY);
    }
} 