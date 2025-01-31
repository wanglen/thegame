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
        const monsterSize = 30;
        for (let i = 0; i < numMonsters; i++) {
            let attempts = 0;
            let isValid = false;
            let x, y;
            do {
                attempts++;
                x = Math.random() * (this.gameMap.width - monsterSize);
                y = Math.random() * (this.gameMap.height - monsterSize);
                isValid = this.isValidSpawnPosition(x, y, monsterSize);
            } while (!isValid && attempts < MAX_ATTEMPTS);
            if (isValid) {
                const MonsterType = types[Math.floor(Math.random() * types.length)];
                this.monsters.push(new MonsterType(x, y));
            }
        }
    }

    isValidSpawnPosition(x, y, size) {
        const distanceToCenter = Math.hypot(x - this.gameMap.width/2, y - this.gameMap.height/2);
        return !this.gameMap.isColliding(x, y, size, size) &&
               distanceToCenter > 200 &&
               !this.monsters.some(m => Math.abs(m.x - x) < size && Math.abs(m.y - y) < size);
    }

    draw(ctx, viewportX, viewportY) {
        for (let i = 0; i < this.monsters.length; i++) {
            this.monsters[i].draw(ctx, viewportX, viewportY);
        }
    }

    update(playerX, playerY, gameMap, player) {
        for (let i = 0; i < this.monsters.length; i++) {
            const monster = this.monsters[i];
            monster.update(playerX, playerY, gameMap);
            
            if (player.checkMonsterCollision(monster)) {
                player.handleMonsterCollision(monster, gameMap);
                
                // Only apply damage if player is still alive
                if (!monster.isDead && !player.isDead) {
                    monster.collisionTime++;
                    if (monster.collisionTime >= monster.attackInterval) {
                        player.health = Math.max(0, player.health - monster.damage);
                        if (player.health <= 0) {
                            player.isDead = true;
                        }
                        monster.collisionTime = 0;
                    }
                }
            } else {
                monster.collisionTime = 0;
            }
        }
        this.checkMonsterCollisions(gameMap);
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

    get allMonstersDead() {
        return this.monsters.length > 0 && 
               this.monsters.every(m => m.isDead);
    }
} 