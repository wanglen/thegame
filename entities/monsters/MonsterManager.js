import { Monster } from './Monster.js';

export class MonsterManager {
    constructor(numMonsters, gameMap, monsterData) {
        this.monsters = [];
        this.gameMap = gameMap;
        this.monsterData = monsterData;
        this.createMonsters(numMonsters);
        this.logSpawnStats();
    }

    createMonsters(numMonsters) {
        const MAX_ATTEMPTS = 100;
        const monsterTypes = Object.keys(this.monsterData);
        
        for (let i = 0; i < numMonsters; i++) {
            const MonsterType = monsterTypes[Math.floor(Math.random() * monsterTypes.length)];
            const config = this.monsterData[MonsterType];
            
            let attempts = 0;
            let isValid = false;
            let x, y;
            
            do {
                attempts++;
                x = Math.random() * (this.gameMap.width - config.size[0]);
                y = Math.random() * (this.gameMap.height - config.size[1]);
                isValid = this.isValidSpawnPosition(x, y, config.size[0], config.size[1]);
            } while (!isValid && attempts < MAX_ATTEMPTS);
            
            if (isValid) {
                this.monsters.push(new Monster(x, y, {
                    key: MonsterType,
                    ...config
                }));
            }
        }
    }

    isValidSpawnPosition(x, y, width, height) {
        const distanceToCenter = Math.hypot(x - this.gameMap.width/2, y - this.gameMap.height/2);
        return !this.gameMap.isColliding(x, y, width, height) &&
               distanceToCenter > 200 &&
               !this.monsters.some(m => 
                   Math.abs(m.x - x) < width && 
                   Math.abs(m.y - y) < height
               );
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
                
                if (!monster.isDead && !player.isDead && !player.isInvulnerable) {
                    if (monster.collisionTime === 0) {
                        monster.collisionTime = monster.attackInterval - 1;
                    }
                    
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

    logSpawnStats() {
        const spawnCounts = {};
        this.monsters.forEach(monster => {
            spawnCounts[monster.type] = (spawnCounts[monster.type] || 0) + 1;
        });
        
        console.log('Monster Spawn Stats:');
        Object.entries(spawnCounts).forEach(([type, count]) => {
            console.log(`- ${type}: ${count}`);
        });
    }
} 