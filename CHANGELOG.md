# Changelog

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