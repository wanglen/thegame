export class ItemManager {
    constructor(gameMap, player, itemData) {
        this.gameMap = gameMap;
        this.player = player;
        this.items = [];
        this.maxItems = 10;
        this.spawnInterval = 3000;
        this.itemData = this.processItemData(itemData);

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

        // Spawn near player's area (same as monster logic)
        const spawnDistance = 300;
        const angle = Math.random() * Math.PI * 2;
        const x = this.player.x + Math.cos(angle) * spawnDistance;
        const y = this.player.y + Math.sin(angle) * spawnDistance;

        const newItem = {
            x: x,
            y: y,
            type: type,
            width: 20,
            height: 20
        };

        // Ensure valid position
        if (!this.gameMap.isColliding(x, y, 20, 20)) {
            this.items.push(newItem);
            console.log('[Item] Spawned', type.name, 'at', x.toFixed(0), y.toFixed(0));
        }
    }

    chooseRandomType() {
        const rand = Math.random();
        let cumulative = 0;
        
        for (const [key, config] of Object.entries(this.itemData)) {
            cumulative += config.probability;
            if (rand <= cumulative) {
                return { ...config, name: key };
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
            
            // Only draw if visible in viewport
            if (screenX > -50 && screenX < ctx.canvas.width + 50 &&
                screenY > -50 && screenY < ctx.canvas.height + 50) {
                
                ctx.fillStyle = item.type.color;
                ctx.beginPath();
                ctx.arc(screenX + 10, screenY + 10, 10, 0, Math.PI * 2);
                ctx.fill();
            }
        });
    }
} 