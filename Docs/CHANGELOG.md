# Changelog

## [0.3.3] - 2024-12-29

### Fixed
- Anthropic Claude API integration now working correctly
- Fixed message format and response handling for Claude models
- Improved error handling for Anthropic API calls

### Added
- O1 reasoning model support
  - Added O1 and O1-mini models
  - Implemented token limit handling
  - Added automatic retry with shorter input
  - Optimized prompt format for reasoning tasks

## [0.3.2] - 2024-12-29

### Added
- Anthropic API support with Claude 3 Sonnet model
- Optional Anthropic API key configuration
- New OpenAI model options:
  - GPT-4 Turbo (0125-preview)
  - GPT-4 Turbo Previous (1106-preview)

### Changed
- Updated model selection UI to include new models
- Improved API key management to handle multiple providers
- Enhanced agent conversation system to support both OpenAI and Anthropic models

### Technical Improvements
- Added Anthropic SDK integration
- Implemented proper model-specific API calls
- Fixed max turns handling in agent conversations

## [0.3.1] - 2024-12-29 (Reference Version)

### User Experience Improvements
- Chat input is now always enabled, allowing immediate typing
- API key validation happens only when sending messages
- Clearer error messages for API key issues
- No page refresh needed after saving API key

### Technical Improvements
- Improved API key state management using React Context
- Better error handling for invalid or missing API keys
- Fixed issue where chat input remained disabled after saving API key
- Fixed build error related to metadata export in client components
- Improved state synchronization between components
- Separated client and server components for better Next.js compatibility

## [0.3.0] - 2024-12-28

### Added
- Vercel deployment support
- Immediate chat activation after API key entry

### Changed
- Updated project folder structure to have the main app under the root folder
- Renamed project to "AgentChat"
- Improved project organization and file structure
- Updated documentation to reflect new structure
- Fixed API key state management for better user experience
- Simplified state management and removed unnecessary effects

### Fixed
- Chat box now becomes usable immediately after entering API key
- API key persistence between page refreshes
- Message port closed error in browser console
- Chat input placeholder not updating after API key entry

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