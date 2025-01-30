class Monster {
    constructor(x, y, width, height, type) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.type = type;
        this.baseSpeed = 1.5;
        this.speed = this.baseSpeed;
        this.hue = 0; // Default red hue
        this.eyeColor = '#222';
        this.eyeDirection = { x: 0, y: 0 };
        this.isDead = false;
    }

    draw(ctx, viewportX, viewportY) {
        // Change color when dead
        if (this.isDead) {
            ctx.fillStyle = '#808080'; // Gray color
            ctx.strokeStyle = '#333'; // Darker outline
        } else {
            ctx.fillStyle = `hsl(${360 + this.hue}, 100%, 50%)`;
            ctx.strokeStyle = '#600';
        }
        ctx.fillRect(
            this.x - viewportX,
            this.y - viewportY,
            this.width,
            this.height
        );

        // Outline to distinguish overlapping
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
        // Modified eye drawing to support different types
        const eyeSize = this.width * 0.15;
        const pupilSize = eyeSize * 0.6;
        const eyeSpacing = this.width * 0.25;
        
        const leftEyeX = this.x + this.width/2 - eyeSpacing;
        const rightEyeX = this.x + this.width/2 + eyeSpacing;
        const eyeY = this.y + this.height/3;

        // Eye whites
        ctx.fillStyle = this.eyeColor === '#222' ? 'white' : this.eyeColor;
        ctx.beginPath();
        ctx.arc(leftEyeX - viewportX, eyeY - viewportY, eyeSize, 0, Math.PI * 2);
        ctx.arc(rightEyeX - viewportX, eyeY - viewportY, eyeSize, 0, Math.PI * 2);
        ctx.fill();

        // Pupils
        const angle = Math.atan2(this.eyeDirection.y, this.eyeDirection.x);
        const pupilOffsetX = Math.cos(angle) * eyeSize * 0.4;
        const pupilOffsetY = Math.sin(angle) * eyeSize * 0.4;

        ctx.fillStyle = '#222';
        ctx.beginPath();
        ctx.arc(leftEyeX - viewportX + pupilOffsetX, eyeY - viewportY + pupilOffsetY, pupilSize, 0, Math.PI * 2);
        ctx.arc(rightEyeX - viewportX + pupilOffsetX, eyeY - viewportY + pupilOffsetY, pupilSize, 0, Math.PI * 2);
        ctx.fill();
    }

    update(playerX, playerY, gameMap) {
        // Apply speed reduction when dead
        this.speed = this.isDead ? this.baseSpeed * 0.1 : this.baseSpeed;
        
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

// Specific monster types
class Brute extends Monster {
    constructor(x, y) {
        super(x, y, 35, 35, 'brute');
        this.hue = -5; // Darker red
        this.baseSpeed = 1.0;
        this.speed = this.baseSpeed;
        this.health = 3;
    }

    draw(ctx, viewportX, viewportY) {
        if (this.isDead) {
            ctx.fillStyle = '#808080'; // Gray color
            ctx.strokeStyle = '#333';
        } else {
            ctx.fillStyle = `hsl(${360 + this.hue}, 100%, 30%)`;
            ctx.strokeStyle = '#444';
        }
        ctx.fillRect(this.x - viewportX, this.y - viewportY, this.width, this.height);
        
        // Armor plates
        ctx.lineWidth = 3;
        ctx.strokeRect(this.x - viewportX + 2, this.y - viewportY + 2, this.width - 4, this.height - 4);
        
        this.drawEyes(ctx, viewportX, viewportY);
    }
}

class Stalker extends Monster {
    constructor(x, y) {
        super(x, y, 25, 25, 'stalker');
        this.hue = 5; // Brighter red
        this.baseSpeed = 2.5;
        this.speed = this.baseSpeed;
        this.eyeColor = '#FF6B6B'; // Glowing eyes
    }

    update(playerX, playerY, gameMap) {
        // Move faster when player is looking away
        const angleToPlayer = Math.atan2(playerY - this.y, playerX - this.x);
        const playerFacing = Math.atan2(this.eyeDirection.y, this.eyeDirection.x);
        const angleDiff = Math.abs(angleToPlayer - playerFacing);
        
        this.speed = angleDiff > Math.PI/2 ? this.baseSpeed * 1.5 : this.baseSpeed;
        super.update(playerX, playerY, gameMap);
    }
}

class Creeper extends Monster {
    constructor(x, y) {
        super(x, y, 20, 20, 'creeper');
        this.hue = 120; // Green color
        this.baseSpeed = 1.8;
        this.speed = this.baseSpeed;
        this.chargeTime = 0;
    }

    draw(ctx, viewportX, viewportY) {
        // Change flashing effect only when alive
        if (this.isDead) {
            ctx.fillStyle = '#808080'; // Gray color
        } else {
            const flash = Math.sin(Date.now()/200) * 10;
            ctx.fillStyle = `hsl(${120 + flash}, 100%, 50%)`;
        }
        ctx.fillRect(this.x - viewportX, this.y - viewportY, this.width, this.height);
        
        // X-shaped eyes
        const eyeSize = this.width * 0.2;
        const drawX = (x, y) => {
            ctx.strokeStyle = '#000';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(x - eyeSize/2, y - eyeSize/2);
            ctx.lineTo(x + eyeSize/2, y + eyeSize/2);
            ctx.moveTo(x + eyeSize/2, y - eyeSize/2);
            ctx.lineTo(x - eyeSize/2, y + eyeSize/2);
            ctx.stroke();
        };
        
        drawX(this.x + this.width/3 - viewportX, this.y + this.height/3 - viewportY);
        drawX(this.x + this.width*2/3 - viewportX, this.y + this.height/3 - viewportY);
    }

    update(playerX, playerY, gameMap) {
        // Charge attack when close
        const distance = Math.hypot(playerX - this.x, playerY - this.y);
        if (distance < 100) {
            this.chargeTime++;
            if (this.chargeTime > 60) {
                this.speed = this.baseSpeed * 3;
                this.width = this.height = 24; // Expand before explosion
            }
        } else {
            this.chargeTime = 0;
            this.speed = this.baseSpeed;
            this.width = this.height = 20;
        }
        super.update(playerX, playerY, gameMap);
    }
}

class MonsterManager {
    constructor(numMonsters, gameMap) {
        this.monsters = [];
        this.gameMap = gameMap;
        this.createMonsters(numMonsters);
    }

    createMonsters(numMonsters) {
        const types = [Brute, Stalker, Creeper];
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
            
            const MonsterType = types[Math.floor(Math.random() * types.length)];
            this.monsters.push(new MonsterType(x, y));
        }
    }

    draw(ctx, viewportX, viewportY) {
        this.monsters.forEach(monster => monster.draw(ctx, viewportX, viewportY));
    }

    update(playerX, playerY, gameMap, player) {
        // First update all monsters' positions
        this.monsters.forEach(monster => monster.update(playerX, playerY, gameMap));
        
        // Check monster collisions
        this.checkMonsterCollisions(gameMap);
        
        // Check player collisions and let player repel monsters
        this.monsters.forEach(monster => {
            if (player.checkMonsterCollision(monster)) {
                player.handleMonsterCollision(monster, gameMap);
            }
        });
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