const CACHE_BUSTER = `?v=${Date.now()}`;

// Use standard import syntax
import { GameMap } from './map.js';
import { Character } from './character.js';
import { MonsterManager } from './entities/monsters/MonsterManager.js';
import { ItemManager } from './entities/items/index.js';

// Game State
let gameRunning = false;
let player;
let monsterManager;
let gameMap;
let itemManager;
let monsterData;
let itemData;

// DOM Elements
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const splashScreen = document.getElementById('splashScreen');
const startButton = document.getElementById('startButton');
const restartOverlay = document.getElementById('restartOverlay');
const restartButton = document.getElementById('restartButton');

// Key State Tracking
const keys = {
    ArrowLeft: false,
    ArrowRight: false,
    ArrowUp: false,
    ArrowDown: false,
    ' ': false
};

// Event Listeners
function setupEventListeners() {
    // Keyboard Input
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    // Game Controls
    startButton.addEventListener('click', startGame);
    restartButton.addEventListener('click', returnToMenu);
}

function handleKeyDown(e) {
    if (keys.hasOwnProperty(e.key)) {
        keys[e.key] = true;
    }
    if (e.key === ' ') {
        e.preventDefault();
    }
}

function handleKeyUp(e) {
    if (keys.hasOwnProperty(e.key)) {
        keys[e.key] = false;
    }
}

// Game Initialization
async function initializeGame() {
    const size = document.getElementById('screenSize').value.split('x');
    const monsterCount = parseInt(document.getElementById('monsterCount').value) || 10;

    // Load monster data if not already loaded
    if (!monsterData) {
        monsterData = await loadMonsterData();
    }

    // Load item data
    if (!itemData) {
        const response = await fetch('assets/data/items.json');
        itemData = await response.json();
    }

    canvas.width = parseInt(size[0]);
    canvas.height = parseInt(size[1]);
    
    gameMap = new GameMap(canvas.width * 4, canvas.height * 4);
    player = new Character(
        gameMap.width / 2,
        gameMap.height / 2,
        25,
        29
    );
    monsterManager = new MonsterManager(monsterCount, gameMap, monsterData);
    itemManager = new ItemManager(gameMap, player, itemData, monsterCount);
}

async function loadMonsterData() {
    const response = await fetch('assets/data/monsters.json');
    return await response.json();
}

// Game Loop
function gameLoop() {
    if (!gameRunning) return;
    
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

function update() {
    if (player.isDead || monsterManager.allMonstersDead) return;
    
    player.update(keys, gameMap);
    monsterManager.update(player.x, player.y, gameMap, player);
    itemManager.update(player);
    
    // Force update spawn counts after monster removal
    monsterManager.logSpawnStats();
}

function draw() {
    // Clear canvas
    ctx.fillStyle = '#87CEEB';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Calculate viewport
    const viewportX = player.x + player.width/2 - canvas.width/2;
    const viewportY = player.y + player.height/2 - canvas.height/2;

    // Draw game elements
    gameMap.draw(ctx, viewportX, viewportY);
    monsterManager.draw(ctx, viewportX, viewportY);
    player.draw(ctx, viewportX, viewportY);
    itemManager.draw(ctx, viewportX, viewportY);

    // Draw UI
    drawGameStatus();
    drawEndgameScreens();
    drawSpawnStats();
}

// UI Rendering
function drawGameStatus() {
    const aliveCount = monsterManager.monsters.filter(m => !m.isDead).length;
    
    // Background panel
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(10, 10, 200, 30);
    
    // Text styling
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(`Monsters Remaining: ${aliveCount}`, 20, 35);
}

function drawEndgameScreens() {
    if (player.isDead || monsterManager.allMonstersDead) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        const message = player.isDead ? 'GAME OVER' : 'VICTORY!';
        const color = player.isDead ? 'red' : 'green';
        const subText = player.isDead ? 'Click to restart' : 'All monsters defeated!';

        ctx.fillStyle = color;
        ctx.font = '60px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(message, canvas.width/2, canvas.height/2);
        
        ctx.font = '30px Arial';
        ctx.fillText(subText, canvas.width/2, canvas.height/2 + 50);
        
        restartOverlay.classList.remove('hidden');
    }
}

// New function to draw spawn stats
function drawSpawnStats() {
    const spawnList = document.getElementById('spawnList');
    const spawnStats = document.getElementById('spawnStats');
    
    if (monsterManager?.spawnCounts) {
        spawnList.innerHTML = monsterManager.logSpawnStats();
        spawnStats.classList.remove('hidden');
    } else {
        spawnStats.classList.add('hidden');
    }
}

// Game Control Functions
async function startGame() {
    await initializeGame();
    splashScreen.classList.add('hidden');
    canvas.classList.remove('hidden');
    gameRunning = true;
    gameLoop();
    restartOverlay.classList.add('hidden');
    document.getElementById('spawnStats').classList.remove('hidden');
}

function returnToMenu() {
    splashScreen.classList.remove('hidden');
    canvas.classList.add('hidden');
    restartOverlay.classList.add('hidden');
    gameRunning = false;
    document.getElementById('spawnStats').classList.add('hidden');
}

// Initial Setup
setupEventListeners();
canvas.classList.add('hidden'); 