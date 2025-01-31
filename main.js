let gameActive = true;

function gameLoop() {
    if (!gameActive) return;
    
    // Update game state
    update();
    render();
    
    requestAnimationFrame(gameLoop);
}

function update() {
    if (player.isDead || monsterManager.allMonstersDead) {
        gameActive = false;
        return;
    }
    
    // ... rest of your update logic ...
}

function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw game over screen if needed
    if (player.isDead) {
        drawGameOver();
        return;
    }
    if (monsterManager.allMonstersDead) {
        drawVictory();
        return;
    }
    
    // ... rest of your normal rendering code ...
}

function drawGameOver() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'red';
    ctx.font = '60px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('GAME OVER', canvas.width/2, canvas.height/2);
    ctx.font = '30px Arial';
    ctx.fillText('Refresh to play again', canvas.width/2, canvas.height/2 + 50);
}

function drawVictory() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'green';
    ctx.font = '60px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('VICTORY!', canvas.width/2, canvas.height/2);
    ctx.font = '30px Arial';
    ctx.fillText('All monsters defeated!', canvas.width/2, canvas.height/2 + 50);
}

// Start the game
gameLoop(); 