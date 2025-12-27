# Changelog

All notable changes to AgileFlow will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [2.59.0] - 2025-12-27

### Changed
- Automated CHANGELOG.md updates in release script

## [2.58.0] - 2025-12-27

### Added
- Auto-update configuration via `/agileflow:configure --enable=autoupdate`

### Fixed
- Metadata merge for nested `updates` object in configure script

## [2.57.0] - 2025-12-27

### Added
- Auto-update system with configurable check frequency
- Update notifications in welcome message and status line
- Changelog display after updates showing what's new
- `/agileflow:whats-new` command for viewing full changelog

## [2.56.0] - 2025-12-27

### Added
- Dynamic IDE discovery with auto-detection from handlers
- OpenAI Codex CLI now appears in setup IDE selection

### Changed
- Replaced hardcoded IDE list with dynamic loading from IdeManager

## [2.55.0] - 2025-12-26

### Changed
- Consolidated code improvements and debugging enhancements

## [2.54.0] - 2025-12-26

### Added
- Test suites for generators, npm-utils, and version-checker

## [2.53.0] - 2025-12-25

### Added
- Session manager for parallel session detection
- Warning when multiple Claude sessions active

## [2.52.0] - 2025-12-24

### Added
- PreCompact hook for context preservation during compacts

## [2.51.0] - 2025-12-23

### Added
- OpenAI Codex CLI integration

## [2.50.0] - 2025-12-22

### Added
- Windsurf and Cursor IDE support

## [2.45.0] - 2025-12-20

### Added
- Auto-archival system for completed stories

## [2.40.0] - 2025-12-18

### Added
- Hooks system for event-driven automation
- Status line integration for Claude Code

[Unreleased]: https://github.com/projectquestorg/AgileFlow/compare/v2.59.0...HEAD
[2.59.0]: https://github.com/projectquestorg/AgileFlow/compare/v2.58.0...v2.59.0
[2.58.0]: https://github.com/projectquestorg/AgileFlow/compare/v2.57.0...v2.58.0
[2.57.0]: https://github.com/projectquestorg/AgileFlow/compare/v2.56.0...v2.57.0
[2.56.0]: https://github.com/projectquestorg/AgileFlow/compare/v2.55.0...v2.56.0
[2.55.0]: https://github.com/projectquestorg/AgileFlow/compare/v2.54.0...v2.55.0
[2.54.0]: https://github.com/projectquestorg/AgileFlow/compare/v2.53.0...v2.54.0
[2.53.0]: https://github.com/projectquestorg/AgileFlow/compare/v2.52.0...v2.53.0
[2.52.0]: https://github.com/projectquestorg/AgileFlow/compare/v2.51.0...v2.52.0
[2.51.0]: https://github.com/projectquestorg/AgileFlow/compare/v2.50.0...v2.51.0
[2.50.0]: https://github.com/projectquestorg/AgileFlow/compare/v2.45.0...v2.50.0
[2.45.0]: https://github.com/projectquestorg/AgileFlow/compare/v2.40.0...v2.45.0
[2.40.0]: https://github.com/projectquestorg/AgileFlow/releases/tag/v2.40.0
