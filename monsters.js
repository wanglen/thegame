class Monster {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.speed = 2;
        // Visual variations
        this.hue = Math.random() * 20 - 10; // -10 to +10 degree hue variation
        this.eyeDirection = { x: 0, y: 0 };
    }

    draw(ctx, viewportX, viewportY) {
        // Main body with color variation
        ctx.fillStyle = `hsl(${360 + this.hue}, 100%, 50%)`;
        ctx.fillRect(
            this.x - viewportX,
            this.y - viewportY,
            this.width,
            this.height
        );

        // Outline to distinguish overlapping
        ctx.strokeStyle = '#600';
        ctx.lineWidth = 2;
        ctx.strokeRect(
            this.x - viewportX,
            this.y - viewportY,
            this.width,
            this.height
        );

        // Eyes that follow player
        this.drawEyes(ctx, viewportX, viewportY);
    }

    drawEyes(ctx, viewportX, viewportY) {
        const eyeSize = this.width * 0.15;
        const pupilSize = eyeSize * 0.6;
        const eyeSpacing = this.width * 0.25;
        
        // Calculate eye positions
        const leftEyeX = this.x + this.width/2 - eyeSpacing;
        const rightEyeX = this.x + this.width/2 + eyeSpacing;
        const eyeY = this.y + this.height/3;

        // Draw eye whites
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(leftEyeX - viewportX, eyeY - viewportY, eyeSize, 0, Math.PI * 2);
        ctx.arc(rightEyeX - viewportX, eyeY - viewportY, eyeSize, 0, Math.PI * 2);
        ctx.fill();

        // Calculate pupil direction
        const angle = Math.atan2(this.eyeDirection.y, this.eyeDirection.x);
        const pupilOffsetX = Math.cos(angle) * eyeSize * 0.4;
        const pupilOffsetY = Math.sin(angle) * eyeSize * 0.4;

        // Draw pupils
        ctx.fillStyle = '#222';
        ctx.beginPath();
        ctx.arc(leftEyeX - viewportX + pupilOffsetX, 
               eyeY - viewportY + pupilOffsetY, 
               pupilSize, 0, Math.PI * 2);
        ctx.arc(rightEyeX - viewportX + pupilOffsetX, 
               eyeY - viewportY + pupilOffsetY, 
               pupilSize, 0, Math.PI * 2);
        ctx.fill();
    }

    update(playerX, playerY, gameMap) {
        // Store eye direction
        this.eyeDirection.x = playerX - this.x;
        this.eyeDirection.y = playerY - this.y;
        
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

    adjustPosition(dx, dy, gameMap) {
        // Try X axis first
        if (!gameMap.isColliding(this.x + dx, this.y, this.width, this.height)) {
            this.x += dx;
        }
        // Then Y axis
        if (!gameMap.isColliding(this.x, this.y + dy, this.width, this.height)) {
            this.y += dy;
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
        // First update all monsters' positions
        this.monsters.forEach(monster => monster.update(playerX, playerY, gameMap));
        
        // Then check and resolve collisions between monsters
        this.checkMonsterCollisions(gameMap);
    }

    checkMonsterCollisions(gameMap) {
        for (let i = 0; i < this.monsters.length; i++) {
            for (let j = i + 1; j < this.monsters.length; j++) {
                const m1 = this.monsters[i];
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
        // Calculate overlap in both axes
        const overlapX = Math.min(
            m1.x + m1.width - m2.x,
            m2.x + m2.width - m1.x
        );
        
        const overlapY = Math.min(
            m1.y + m1.height - m2.y,
            m2.y + m2.height - m1.y
        );

        // Resolve along the smaller overlap axis
        if (overlapX < overlapY) {
            const pushX = overlapX * 0.5;
            m1.adjustPosition(-pushX, 0, gameMap);
            m2.adjustPosition(pushX, 0, gameMap);
        } else {
            const pushY = overlapY * 0.5;
            m1.adjustPosition(0, -pushY, gameMap);
            m2.adjustPosition(0, pushY, gameMap);
        }
    }
} 