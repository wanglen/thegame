import { Brute } from './Brute.js';
import { Stalker } from './Stalker.js';
import { Creeper } from './Creeper.js';

export class MonsterManager {
    constructor(numMonsters, gameMap) {
        this.monsters = [];
        this.gameMap = gameMap;
        this.createMonsters(numMonsters);
    }

    createMonsters(numMonsters) {
        const MAX_ATTEMPTS = 100;
        const types = [Brute, Stalker, Creeper];
        
        for (let i = 0; i < numMonsters; i++) {
            let attempts = 0;
            let isValid = false;
            let x, y;
            do {
                attempts++;
                x = Math.random() * (this.gameMap.width - 30);
                y = Math.random() * (this.gameMap.height - 30);
                const MonsterType = types[Math.floor(Math.random() * types.length)];
                const size = MonsterType.config.width;
                isValid = this.isValidSpawnPosition(x, y, size);
            } while (!isValid && attempts < MAX_ATTEMPTS);
            if (isValid) {
                const MonsterType = types[Math.floor(Math.random() * types.length)];
                const size = MonsterType.config.width;
                isValid = this.isValidSpawnPosition(x, y, size);
                if (isValid) {
                    this.monsters.push(new MonsterType(x, y));
                }
            }
        }
    }

    isValidSpawnPosition(x, y, size) {
        const SPAWN_RADIUS = 200;
        return !this.gameMap.isColliding(x, y, size, size) &&
               Math.hypot(x - this.gameMap.width/2, y - this.gameMap.height/2) > SPAWN_RADIUS &&
               !this.monsters.some(m => Math.hypot(m.x - x, m.y - y) < size + m.width);
    }

    draw(ctx, viewportX, viewportY) {
        for (let i = 0; i < this.monsters.length; i++) {
            this.monsters[i].draw(ctx, viewportX, viewportY);
        }
    }

    update(playerX, playerY, gameMap, player) {
        for (let i = 0; i < this.monsters.length; i++) {
            this.monsters[i].update(playerX, playerY, gameMap);
        }
        this.checkMonsterCollisions(gameMap);
        for (let i = 0; i < this.monsters.length; i++) {
            const monster = this.monsters[i];
            if (player.checkMonsterCollision(monster)) {
                player.handleMonsterCollision(monster, gameMap);
            }
        }
    }

    checkMonsterCollisions(gameMap) {
        if (this.monsters.length < 2) return;
        const len = this.monsters.length;
        for (let i = 0; i < len; i++) {
            const m1 = this.monsters[i];
            for (let j = i + 1; j < len; j++) {
                const m2 = this.monsters[j];
                if (this.areColliding(m1, m2)) {
                    this.resolveCollision(m1, m2, gameMap);
                }
            }
        }
    }

    areColliding(m1, m2) {
        return m1.x < m2.x + m2.width &&
               m1.x + m1.width > m2.x &&
               m1.y < m2.y + m2.height &&
               m1.y + m1.height > m2.y;
    }

    resolveCollision(m1, m2, gameMap) {
        const pushX = Math.min(m1.x + m1.width - m2.x, m2.x + m2.width - m1.x) * 0.5;
        const pushY = Math.min(m1.y + m1.height - m2.y, m2.y + m2.height - m1.y) * 0.5;
        m1.adjustPosition(-pushX, -pushY, gameMap);
        m2.adjustPosition(pushX, pushY, gameMap);
    }
} 