# AI Chat Collaboration

A sophisticated AI chat platform featuring multi-agent interactions and real-time streaming. The platform enables natural conversations between a task executor and multiple expert agents to refine and improve solutions.

## Features

### Core Features
- Real-time message streaming with proper sequencing
- Multi-agent collaboration system
- Natural conversation flow between agents and executor
- Collapsible interim discussions
- Custom agent creation and configuration
- OpenAI API integration

### Agent System
- Pre-configured expert agents (Technical, UX, Security)
- Custom agent creation with configurable parameters
- Natural dialogue-based interaction
- Configurable conversation turns
- Real-time agent feedback and executor responses

### User Interface
- Clean, modern design
- Collapsible conversation threads
- Clear message labeling and organization
- Real-time updates
- Responsive layout
- Always-enabled chat input with contextual validation

## Getting Started

### Prerequisites
- Node.js >= 18.17.0
- npm >= 9.0.0
- OpenAI API key

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

### Configuration
1. Enter your OpenAI API key in the application
2. Configure agents as needed
3. Start chatting!

## Usage

### Basic Chat
1. Enter your message in the chat input
2. If no API key is provided, you'll be prompted to enter one when trying to send a message
3. Once a valid API key is provided:
   - The executor will provide an initial response
   - Active agents will review and provide feedback
   - The executor will refine the response based on feedback
   - A final response will be provided

### API Key Management
1. Enter your OpenAI API key in the settings section
2. The API key is validated when:
   - Sending your first message
   - Making any subsequent API calls
3. Error messages will guide you if:
   - No API key is provided when sending a message
   - The API key is invalid
   - The API key has expired or has insufficient permissions
4. State Management:
   - API key is stored securely in browser cookies
   - State is managed through React Context for reliable updates
   - No page refresh required after saving API key

### Agent Management
1. Toggle agents using the agent buttons
2. Create custom agents with specific expertise
3. Configure agent parameters:
   - Name and description
   - Conversation prompt
   - Model selection
   - Maximum conversation turns

### Conversation Flow
1. User message
2. Initial executor response
3. Agent feedback and executor refinement (in collapsible section)
4. Final refined response

## Development

### Project Structure
```
ai-chat-collab/
├── app/
│   ├── api/         # API routes
│   ├── components/  # React components
│   ├── store/       # State management
│   ├── types/       # TypeScript types
│   └── hooks/       # Custom hooks
├── public/          # Static files
└── docs/           # Documentation
```

### Key Technologies
- Next.js 13+ (App Router)
- React 19.0.0
- TypeScript 5.x
- Tailwind CSS 3.4.1
- Zustand 5.0.2
- OpenAI API SDK 4.77.0

## Contributing
Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments
- OpenAI for their powerful API
- The Next.js team for the excellent framework
- All contributors and users of this project 