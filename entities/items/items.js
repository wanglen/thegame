export class ItemManager {
    constructor(gameMap, player, itemData, monsterCount) {
        this.gameMap = gameMap;
        this.player = player;
        this.items = [];
        this.monsterCount = monsterCount;
        this.maxItems = Math.floor(monsterCount * 0.5); // Reduced from 0.75 to 0.5
        this.spawnInterval = 5000 * (20 / Math.max(monsterCount, 15)); // Increased base interval and divisor
        this.itemData = this.processItemData(itemData);

        this.spriteSheet = new Image();
        this.spriteSheet.src = 'assets/images/items.png';

        // Initial spawn
        this.trySpawnItem();
        setInterval(() => this.trySpawnItem(), this.spawnInterval);
    }

    processItemData(rawData) {
        const effectMap = {
            heal: (player) => {
                player.health = Math.min(100, player.health + 30);
                player.applyLifeEffect();
            },
            invulnerability: (player) => {
                player.isInvulnerable = true;
                console.log('[Item] Invulnerability activated');
                setTimeout(() => {
                    player.isInvulnerable = false;
                    console.log('[Item] Invulnerability ended');
                }, 7000);
            }
        };

        return Object.fromEntries(
            Object.entries(rawData).map(([key, config]) => [
                key,
                {
                    ...config,
                    effect: effectMap[config.effect]
                }
            ])
        );
    }

    trySpawnItem() {
        if (this.items.length >= this.maxItems) return;

        const type = this.chooseRandomType();
        if (!type) return;

        // Check for existing invulnerability items
        if (type.name === 'invulnerability') {
            const existingInvuln = this.items.some(item => item.type.name === 'invulnerability');
            if (existingInvuln) return;
        }

        // Spawn near player's area (same as monster logic)
        const spawnDistance = 300;
        const angle = Math.random() * Math.PI * 2;
        const x = this.player.x + Math.cos(angle) * spawnDistance;
        const y = this.player.y + Math.sin(angle) * spawnDistance;

        const newItem = {
            x: x,
            y: y,
            type: type,
            width: 32,
            height: 32
        };

        // Ensure valid position
        if (!this.gameMap.isColliding(x, y, 32, 32)) {
            this.items.push(newItem);
            console.log('[Item] Spawned', type.name, 'at', x.toFixed(0), y.toFixed(0));
        }
    }

    chooseRandomType() {
        const scaledProbs = Object.entries(this.itemData).map(([key, config]) => ({
            key,
            probability: config.probability * (key === 'life' ? 
                Math.min(0.6, 10/this.monsterCount) :  // Tighter limits
                Math.min(1.2, this.monsterCount/20))  // Reduced scaling
        }));

        const totalProb = scaledProbs.reduce((sum, curr) => sum + curr.probability, 0);
        const rand = Math.random() * totalProb;
        let cumulative = 0;
        
        for (const {key, probability} of scaledProbs) {
            cumulative += probability;
            if (rand <= cumulative) {
                return { ...this.itemData[key], name: key };
            }
        }
        return null;
    }

    update(player) {
        this.items = this.items.filter(item => {
            const colliding = this.checkPlayerCollision(item, player);
            if (colliding) {
                item.type.effect(player);
                console.log('[Item] Collected', item.type.name);
                return false;
            }
            return true;
        });
    }

    checkPlayerCollision(item, player) {
        return player.x < item.x + item.width &&
               player.x + player.width > item.x &&
               player.y < item.y + item.height &&
               player.y + player.height > item.y;
    }

    draw(ctx, viewportX, viewportY) {
        this.items.forEach(item => {
            const screenX = item.x - viewportX;
            const screenY = item.y - viewportY;
            
            if (screenX > -50 && screenX < ctx.canvas.width + 50 &&
                screenY > -50 && screenY < ctx.canvas.height + 50) {
                
                // Draw using sprite sheet coordinates
                if (item.type.sprite) {
                    const [sx, sy, sw, sh] = item.type.sprite.split(',').map(Number);
                    ctx.drawImage(
                        this.spriteSheet,
                        sx, sy, sw, sh,
                        screenX, screenY, 32, 32
                    );
                } else {
                    // Fallback to colored shape
                    ctx.fillStyle = item.type.color;
                    ctx.beginPath();
                    ctx.arc(screenX + 16, screenY + 16, 16, 0, Math.PI * 2);
                    ctx.fill();
                }
            }
        });
    }
} 