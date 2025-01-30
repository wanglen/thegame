class Monster {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.speed = 2;
    }

    draw(ctx, viewportX, viewportY) {
        ctx.fillStyle = '#FF0000';
        ctx.fillRect(
            this.x - viewportX,
            this.y - viewportY,
            this.width,
            this.height
        );
    }

    update(playerX, playerY, gameMap) {
        // Calculate direction to player
        const dx = playerX - this.x;
        const dy = playerY - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance > 0) {
            // Move towards player
            const moveX = (dx / distance) * this.speed;
            const moveY = (dy / distance) * this.speed;
            
            // Check collision before moving
            if (!gameMap.isColliding(this.x + moveX, this.y, this.width, this.height)) {
                this.x += moveX;
            }
            if (!gameMap.isColliding(this.x, this.y + moveY, this.width, this.height)) {
                this.y += moveY;
            }
        }
    }
}

class MonsterManager {
    constructor(numMonsters, mapWidth, mapHeight, tileSize) {
        this.monsters = [];
        this.createMonsters(numMonsters, mapWidth, mapHeight, tileSize);
    }

    createMonsters(numMonsters, mapWidth, mapHeight, tileSize) {
        for (let i = 0; i < numMonsters; i++) {
            let x, y, isValid;
            do {
                x = Math.random() * (mapWidth - tileSize);
                y = Math.random() * (mapHeight - tileSize);
                isValid = !this.isInWall(x, y, tileSize);
            } while (!isValid);
            
            this.monsters.push(new Monster(x, y, 30, 30));
        }
    }

    isInWall(x, y, tileSize) {
        // Convert to tile coordinates and check if it's a wall tile
        const tileX = Math.floor(x / tileSize);
        const tileY = Math.floor(y / tileSize);
        return gameMap.terrain[tileY]?.[tileX] === 1;
    }

    draw(ctx, viewportX, viewportY) {
        this.monsters.forEach(monster => monster.draw(ctx, viewportX, viewportY));
    }

    update(playerX, playerY, gameMap) {
        this.monsters.forEach(monster => monster.update(playerX, playerY, gameMap));
    }
} 