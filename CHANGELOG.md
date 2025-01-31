# Changelog

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