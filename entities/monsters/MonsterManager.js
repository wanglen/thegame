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
        const now = Date.now();
        
        for (let i = this.monsters.length - 1; i >= 0; i--) {
            const monster = this.monsters[i];
            if (monster.isDead && monster.deathTimestamp && now - monster.deathTimestamp > 1000) {
                this.monsters.splice(i, 1);
            }
        }
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
        this.spawnCounts = {};
        this.monsters.filter(m => !m.isDead).forEach(monster => {
            this.spawnCounts[monster.type] = (this.spawnCounts[monster.type] || 0) + 1;
        });
        
        return Object.entries(this.spawnCounts)
            .map(([type, count]) => {
                const hsl = this.monsterData[type].color;
                const hex = this.hslToHex(hsl.hue, hsl.saturation, hsl.lightness);
                return `<span class="${type}">
                    <div class="monster-color" style="background: ${hex}"></div>
                    ${type}: ${count}
                </span>`;
            }).join('');
    }

    hslToHex(h, s, l) {
        h = ((h % 360) + 360) % 360; // Normalize hue to 0-359
        s = Math.max(0, Math.min(100, s)) / 100;
        l = Math.max(0, Math.min(100, l)) / 100;

        const c = (1 - Math.abs(2 * l - 1)) * s;
        const x = c * (1 - Math.abs((h / 60) % 2 - 1));
        const m = l - c / 2;
        
        let r, g, b;
        
        if (h >= 0 && h < 60) [r,g,b] = [c,x,0];
        else if (h < 120) [r,g,b] = [x,c,0];
        else if (h < 180) [r,g,b] = [0,c,x];
        else if (h < 240) [r,g,b] = [0,x,c];
        else if (h < 300) [r,g,b] = [x,0,c];
        else [r,g,b] = [c,0,x];

        r = Math.round((r + m) * 255);
        g = Math.round((g + m) * 255);
        b = Math.round((b + m) * 255);

        return '#' + [r,g,b].map(v => v.toString(16).padStart(2, '0')).join('');
    }
} 