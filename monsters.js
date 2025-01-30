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
    constructor(numMonsters, gameMap) {
        this.monsters = [];
        this.gameMap = gameMap;
        this.createMonsters(numMonsters);
    }

    createMonsters(numMonsters) {
        const tileSize = this.gameMap.tileSize;
        const monsterSize = 30;
        
        for (let i = 0; i < numMonsters; i++) {
            let x, y, isValid;
            do {
                // Ensure monsters spawn within map boundaries considering their size
                x = Math.random() * (this.gameMap.width - monsterSize);
                y = Math.random() * (this.gameMap.height - monsterSize);
                
                // Check collision for the entire monster rectangle
                isValid = !this.gameMap.isColliding(x, y, monsterSize, monsterSize);
                
                // Additional check to avoid spawning too close to player (center)
                const distanceToCenter = Math.hypot(
                    x - this.gameMap.width/2,
                    y - this.gameMap.height/2
                );
                isValid = isValid && distanceToCenter > 200;
                
            } while (!isValid);
            
            this.monsters.push(new Monster(x, y, monsterSize, monsterSize));
        }
    }

    draw(ctx, viewportX, viewportY) {
        this.monsters.forEach(monster => monster.draw(ctx, viewportX, viewportY));
    }

    update(playerX, playerY, gameMap) {
        this.monsters.forEach(monster => monster.update(playerX, playerY, gameMap));
    }
} 