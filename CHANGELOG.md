# Changelog

## [0.2.0] - 2024-12-25

### Added
- Collapsible interim discussions between executor and agents
- Real-time message streaming with proper sequencing
- Proper message labeling (initial response, agent feedback, executor responses)
- Support for custom agents with configurable parameters
- Max turns limit for agent-executor conversations
- Improved conversation threading and organization

### Changed
- Refactored message handling to prevent duplicates
- Updated UI to show clear conversation flow
- Separated final responses from interim discussions
- Improved agent-executor interaction flow
- Fixed NaN errors in agent configuration
- Renamed solution labels to response for clarity

### Fixed
- Duplicate initial responses
- Message ordering in interim discussions
- Final response appearing in interim discussions
- NaN errors in max turns input
- Custom agent name display in feedback messages

## [0.1.0] - 2024-12-24

### Added
- Initial implementation of AI chat collaboration
- Basic chat interface with message history
- Support for multiple AI agents
- Real-time message streaming
- Basic error handling
- API key management
- Chat store for state management 