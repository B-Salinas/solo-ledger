# Changelog

All notable changes to this project will be documented in this file. 

## Version 0.0.0 
April 26, 2025
- Initalized Github Repo: https://github.com/B-Salinas/solo-ledger
- Initalized [README.md](README.md)
- Initalized Apache v2.0 [LICENSE](LICENSE)
- Initalized [CHANGELOG.md](CHANGELOG.md)

All other entries from this point forward will be written by the Cursor AI, unless specificed otherwise.

## [0.1.0] - Project Scaffolding
- Initialized npm project with ESM and TypeScript
- Added TigerBeetle Node client
- Set up `src/` and `test/` directories
- Updated `README` and `CHANGELOG`
- Ready for CLI and logic-based test development

## [Unreleased]

### Added
- Basic account type system with proper ranges for assets and liabilities
- Double-entry balance calculation following TigerBeetle conventions
- Transfer type codes for different transaction categories
- Utility functions for account creation and balance calculation
- Initial setup for BOFA liability account tracking

### Changed
- N/A

### Fixed
- Fixed TigerBeetle account creation bug: timestamp must be set to zero for new accounts unless Account.flags.imported is set. This resolves error code 2 (timestamp_must_be_zero) when creating new accounts.

