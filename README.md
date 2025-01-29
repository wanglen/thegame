# 2D Tile-Based Game

A simple 2D game with tile-based map and character movement.

## Features
- WASD/Arrow key movement
- Collision detection with terrain
- Smooth camera following
- Random map generation
- Character with animations

## Installation
1. Clone repository: 
```bash
git clone https://github.com/yourusername/2d-tile-game.git
```

2. Open `game.html` in web browser

## Controls
- Arrow Keys: Move character
- R: Reset game

## File Structure
- `game.html` - Main game file
- `map.js` - Map generation and rendering
- `character.js` - Character logic
- `README.md` - This documentation

## Recent Changes
**Collision System Improvements**  
Fixed an issue where horizontal movement could be blocked when approaching single-tile gaps. The collision system now more accurately calculates entity bounds against tile grid.