export class GameMap {
    constructor(width, height) {
        this.tileSize = 40;
        
        // Ensure integer number of tiles
        this.width = Math.floor(width / this.tileSize) * this.tileSize;
        this.height = Math.floor(height / this.tileSize) * this.tileSize;
        
        const tilesWide = this.width / this.tileSize;  // Now guaranteed integer
        const tilesHigh = this.height / this.tileSize;  // Now guaranteed integer
        
        this.terrain = [];
        
        // Pre-calculate map dimensions in tiles
        const centerX = tilesWide / 2;
        const centerY = tilesHigh / 2;
        
        // Generate terrain with safe spawn area
        for (let y = 0; y < tilesHigh; y++) {
            this.terrain[y] = new Array(tilesWide);
            for (let x = 0; x < tilesWide; x++) {
                // Create 5x5 safe zone using precomputed center
                const isCenter = x >= centerX - 2 && x <= centerX + 2 &&
                               y >= centerY - 2 && y <= centerY + 2;
                this.terrain[y][x] = isCenter ? 0 : Math.random() > 0.8 ? 1 : 0;
            }
        }
    }

    draw(ctx, viewportX, viewportY) {
        // Cache frequently used values
        const tileSize = this.tileSize;
        const canvasWidth = ctx.canvas.width;
        const canvasHeight = ctx.canvas.height;
        
        // Calculate visible tile range using bitwise operations
        const startX = Math.max(0, (viewportX / tileSize) | 0);
        const endX = Math.min(this.terrain[0].length - 1, ((viewportX + canvasWidth) / tileSize) | 0);
        const startY = Math.max(0, (viewportY / tileSize) | 0);
        const endY = Math.min(this.terrain.length - 1, ((viewportY + canvasHeight) / tileSize) | 0);

        // Draw visible tiles only
        for (let y = startY; y <= endY; y++) {
            const yPos = y * tileSize - viewportY;
            for (let x = startX; x <= endX; x++) {
                ctx.fillStyle = this.terrain[y][x] ? '#654321' : '#90EE90';
                ctx.fillRect(
                    x * tileSize - viewportX,
                    yPos,
                    tileSize - 1,
                    tileSize - 1
                );
            }
        }
    }

    isColliding(x, y, width, height) {
        // Convert to tile coordinates with bounds clamping
        const tileSize = this.tileSize;
        const left = Math.max(0, (x / tileSize) | 0);
        const right = Math.min(this.terrain[0].length - 1, ((x + width - 1) / tileSize) | 0);
        const top = Math.max(0, (y / tileSize) | 0);
        const bottom = Math.min(this.terrain.length - 1, ((y + height - 1) / tileSize) | 0);

        // Early exit for boundary checks
        if (x < 0 || x + width > this.width || y < 0 || y + height > this.height) {
            return true;
        }

        // Check tiles with clamped bounds
        for (let ty = top; ty <= bottom; ty++) {
            const row = this.terrain[ty];
            for (let tx = left; tx <= right; tx++) {
                if (row[tx] === 1) {
                    return true;
                }
            }
        }
        return false;
    }
} 