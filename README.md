# AI Chat Collaboration Platform

A sophisticated AI chat platform that enables collaborative interactions with multiple AI agents, featuring real-time streaming responses and a unique agent-based feedback system.

## 🌟 Features

### Implemented Features

#### Chat System
- ✅ Standard chat interface with real-time streaming responses
- ✅ OpenAI API integration with user-provided API key
- ✅ Local storage for chat history persistence
- ✅ Real-time streaming responses with typing indicators
- ✅ Clean and intuitive user interface

#### Agent System
- ✅ Multi-agent conversation pipeline
- ✅ Agent feedback and response refinement
- ✅ Real-time agent interaction visibility
- ✅ Local storage for agent configurations
- ✅ Agent activation/deactivation toggles

### Planned Features

#### Chat Sharing & Collaboration
- 🚧 Shareable chat histories with unique IDs
- 🚧 Chat forking capabilities
- 🚧 MongoDB integration for shared content
- 🚧 Real-time collaborative features

#### Agent System Enhancements
- 🚧 Drag-and-drop agent reordering
- 🚧 Agent sharing functionality
- 🚧 Enhanced agent configuration UI
- 🚧 Agent template library

#### Backend Integration
- 🚧 FastAPI backend implementation
- 🚧 Claude AI integration
- 🚧 Enhanced data persistence

## 🛠 Tech Stack

### Current Implementation
- **Frontend**: Next.js 13+ (App Router)
- **State Management**: Zustand
- **Styling**: Tailwind CSS
- **API Integration**: OpenAI API

### Planned Stack Additions
- **Backend**: FastAPI (Python)
- **Database**: MongoDB with Motor
- **Additional AI**: Claude API integration
- **Deployment**: Vercel

## 🏗 Project Structure

```
ai-chat-collab/
├── app/
│   ├── api/              # API route handlers
│   ├── components/       # React components
│   │   ├── Chat/        # Chat-related components
│   │   └── Settings/    # Settings components
│   ├── hooks/           # Custom React hooks
│   ├── store/           # Zustand store configurations
│   ├── types/           # TypeScript type definitions
│   └── utils/           # Utility functions
├── public/              # Static assets
└── [Configuration files]
```

## 🚀 Getting Started

1. Clone the repository
```bash
git clone [repository-url]
```

2. Install dependencies
```bash
cd ai-chat-collab
npm install
```

3. Create a `.env.local` file with your environment variables:
```env
NEXT_PUBLIC_DEFAULT_MODEL=gpt-3.5-turbo
```

4. Start the development server
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## 💻 Usage

1. Enter your OpenAI API key in the settings
2. Start chatting with the AI
3. Configure and activate agents to enhance responses
4. Agents will provide feedback and help refine the AI's responses

## 🔒 Security

- API keys are stored securely in browser cookies
- No sensitive data is transmitted to our servers
- All chat history is stored locally by default

## 🤝 Contributing

We welcome contributions! Please see our contributing guidelines for more details.

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🔮 Future Plans

1. **Phase 1**: Chat Sharing System
   - Implement MongoDB integration
   - Add share code generation
   - Enable chat forking

2. **Phase 2**: Enhanced Agent System
   - Add drag-and-drop reordering
   - Implement agent sharing
   - Create agent template library

3. **Phase 3**: Backend Integration
   - Set up FastAPI backend
   - Integrate Claude AI
   - Implement advanced data persistence

## ⚠️ Known Issues

- Large chat histories may impact local storage limits
- Some browser variations in streaming response display
- API key needs to be re-entered after browser cache clear

## 📞 Support

For support, please open an issue in the GitHub repository. 