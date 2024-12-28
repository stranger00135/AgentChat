# Changelog

## [0.3.1] - 2024-02-14

### Changed
- Improved API key state management using React Context
- Separated client and server components in layout for better Next.js compatibility
- Chat input is now enabled by default, with API key validation on send
- Better error handling for invalid or missing API keys

### Fixed
- Fixed issue where chat input remained disabled after saving API key
- Fixed build error related to metadata export in client components
- Improved state synchronization between components

## [0.3.0] - 2024-02-13

### Added
- Initial release with basic chat functionality
- Multi-agent support
- OpenAI API integration
- Real-time message streaming 