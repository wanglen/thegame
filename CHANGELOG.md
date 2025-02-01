# Changelog

## [1.5.0] - 2025-02-01
### Added
- MIT License file
- Phantom Wraith monster type with wall-phasing ability
- Item sprite sheet support with diamond and heart sprites
- Monster spawn statistics display with color-coded counters
- Cache busting system for game assets
- Accessibility features for UI elements

### Changed
- Refactored monster system to use JSON data definitions
- Updated default screen size to 1024x768
- Increased maximum monster quantity to 80
- Improved health bar styling with semi-transparent background
- Modified item spawning probabilities based on monster density
- Enhanced monster eye rendering with directional tracking
- Updated status display with rounded health values

### Fixed
- Cache invalidation issues with game script imports
- Monster collision time reset logic
- Item collision detection accuracy
- Input handling during invulnerability states
- Health bar positioning during character movement

## [1.4.0] - 2025-02-01
### Added
- New item system with sprite sheet support
- Life Crystal and Aegis Shard items with healing/invulnerability effects
- Monster JSON data definitions for Brute, Creeper, Stalker, and Phantom Wraith
- Dynamic health bar display with invulnerability indicators
- Monster spawn statistics logging
- Cache busting for game script imports
- New monster type: Phantom Wraith with wall-phasing ability

### Changed
- Refactored monster system to use JSON data instead of individual classes
- Updated default screen size to 1024x768
- Increased default monster quantity to 20 (max 80)
- Improved health bar styling with background panel and rounded values
- Enhanced monster eye rendering with directional tracking
- Modified item spawning probabilities based on monster count
- Optimized monster validation checks with size parameters
- Updated status display styling with semi-transparent background

### Fixed
- Cache invalidation issues with game assets
- Monster collision time reset logic
- Item collision detection accuracy
- Health bar positioning during character movement
- Monster deletion timing after death
- Input handling during invulnerability states

## [1.3.0] - 2025-01-31
### Added
- Character attack system with sword animations
- Player health system and health bar display
- Monster damage values and attack intervals
- Different attack patterns for each direction
- Motion trail effects for sword attacks
- Restart overlay with button functionality
- Monster type-specific damage values (Brute: 3, Creeper: 2, Stalker: 1.5)
- Continuous damage system during monster collisions
- Victory/defeat condition checks
- Health-based monster defeat system

### Changed
- Refactored code into modular components (game.js, styles.css)
- Improved collision handling with attack interactions
- Enhanced monster spawning validation
- Updated character rendering with attack animations
- Modified monster AI to track collision duration
- Improved game state management
- Restructured project directory for entity components
- Enhanced form element sizing and visibility
- Optimized monster position validation checks

### Fixed
- Monster collision time reset when not touching player
- Health bar display positioning
- Animation frame synchronization
- Viewport calculation during attacks
- Input handling during game over states
- Monster count validation in spawn logic

## [1.2.0] - 2025-01-30
### Added
- Screen size selection option in main menu
- Monster quantity customization before game start
- Modular monster class system with inheritance
- Advanced monster behaviors (charging, speed adjustments)
- Monster-to-monster collision resolution system
- Favicon

### Changed
- Refactored movement system with axis-based prioritization
- Optimized collision detection algorithms
- Improved map rendering performance with viewport caching
- Updated character dimensions and hitbox

### Fixed
- Monster spawning validation to prevent overlaps
- Edge case handling in collision push calculations
- Coordinate clamping in map boundary checks

## [1.1.0] - 2025-01-29
### Added
- Multiple monster types (Brute, Stalker, Creeper)
- Monster collision system
- Character-monster collision handling
- Visual distinctions between monsters

## [1.0.0] - 2025-01-29
### Added
- Initial game release
- Arrow key movement
- Procedural map generation
- Basic monster AI

## [1.0.1] - 2025-01-29
### Fixed
- Fixed horizontal collision detection issue where character edges aligned with tile boundaries caused false positives
- Adjusted collision coordinate calculations for entities larger than tile size