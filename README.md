# AI Chat Collaboration

A sophisticated AI chat platform featuring multi-agent interactions and real-time streaming. The platform enables natural conversations between a task executor and multiple expert agents to refine and improve solutions.

## Features

- Real-time message streaming with proper sequencing
- Multi-agent collaboration system
- Natural conversation flow between agents and executor
- Collapsible interim discussions
- Custom agent creation and configuration
- OpenAI and Anthropic API integration with seamless key management
- Support for both GPT-4 and Claude models
- Always-enabled chat input with contextual validation

## Getting Started

### Prerequisites
- Node.js >= 18.17.0
- npm >= 9.0.0
- OpenAI API key
- Anthropic API key (optional, for Claude models)

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/ai-chat-collab.git
cd ai-chat-collab
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Usage

1. Enter your OpenAI API key in the settings section (top of the page)
2. Start chatting immediately - the chat input is always enabled
3. Your API key will be validated when you send your first message
4. Error messages will guide you if there are any issues with the API key

## Architecture

- Next.js 13+ with App Router
- React Context for state management
- Cookie-based API key persistence
- Real-time streaming with proper sequencing
- Clean separation of client/server components

## Development

See [CHANGELOG.md](CHANGELOG.md) for recent changes and [PRD.md](Docs/PRD.md) for detailed specifications.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
