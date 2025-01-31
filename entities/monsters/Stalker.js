import { Monster } from './Monster.js';

export class Stalker extends Monster {
    static config = {
        width: 25,
        height: 25,
        type: 'stalker',
        hue: 5,
        baseSpeed: 2.5,
        eyeColor: '#FF6B6B',
        damage: 1.5,
        attackInterval: 60
    };

    constructor(x, y) {
        super(x, y, Stalker.config);
        this.hue = 5;
        this.baseSpeed = 2.5;
        this.speed = this.baseSpeed;
        this.eyeColor = '#FF6B6B';
    }

    update(playerX, playerY, gameMap) {
        const dx = playerX - this.x;
        const dy = playerY - this.y;
        const angleToPlayer = Math.atan2(dy, dx);
        const playerFacing = Math.atan2(this.eyeDirection.y, this.eyeDirection.x);
        const angleDiff = Math.abs(angleToPlayer - playerFacing);
        this.speed = angleDiff > Math.PI/2 ? this.baseSpeed * 1.5 : this.baseSpeed;
        super.update(playerX, playerY, gameMap);
    }
} 