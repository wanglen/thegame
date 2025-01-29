class GameMap {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.tileSize = 40;
        this.terrain = [];
        
        // Generate terrain with safe spawn area
        for (let y = 0; y < height/this.tileSize; y++) {
            this.terrain[y] = [];
            for (let x = 0; x < width/this.tileSize; x++) {
                // Create 5x5 safe zone at center
                const isCenter = x >= (width/this.tileSize/2)-2 && x <= (width/this.tileSize/2)+2 &&
                               y >= (height/this.tileSize/2)-2 && y <= (height/this.tileSize/2)+2;
                this.terrain[y][x] = isCenter ? 0 : Math.random() > 0.8 ? 1 : 0;
            }
        }
    }

    draw(ctx, viewportX, viewportY) {
        // Calculate visible tile range
        const startX = Math.max(0, Math.floor(viewportX / this.tileSize));
        const endX = Math.min(this.terrain[0].length-1, 
                            Math.floor((viewportX + ctx.canvas.width) / this.tileSize));
        const startY = Math.max(0, Math.floor(viewportY / this.tileSize));
        const endY = Math.min(this.terrain.length-1, 
                           Math.floor((viewportY + ctx.canvas.height) / this.tileSize));

        // Draw visible tiles only
        for (let y = startY; y <= endY; y++) {
            for (let x = startX; x <= endX; x++) {
                ctx.fillStyle = this.terrain[y][x] ? '#654321' : '#90EE90';
                ctx.fillRect(
                    x * this.tileSize - viewportX,
                    y * this.tileSize - viewportY,
                    this.tileSize - 1,
                    this.tileSize - 1
                );
            }
        }
    }

    isColliding(x, y, width, height) {
        // Convert to tile coordinates
        const left = Math.floor(x / this.tileSize);
        const right = Math.floor((x + width) / this.tileSize);
        const top = Math.floor(y / this.tileSize);
        const bottom = Math.floor((y + height) / this.tileSize);

        // Check map boundaries
        if (x < 0 || x + width > this.width || y < 0 || y + height > this.height) {
            return true;
        }

        // Check all tiles in the area
        for (let ty = top; ty <= bottom; ty++) {
            for (let tx = left; tx <= right; tx++) {
                if (this.terrain[ty]?.[tx] === 1) {
                    return true;
                }
            }
        }
        return false;
    }
} 