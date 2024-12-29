# Technical Specifications

## Architecture Overview

The application follows a modern React-based architecture using Next.js 13+ with the following key technologies:
- Next.js 13+ (App Router)
- React 19.0.0
- TypeScript 5.x
- Zustand 5.0.2 (State Management)
- OpenAI API SDK 4.77.0
- Tailwind CSS 3.4.1

## Data Flow: Chat Message Lifecycle

### 1. User Input Phase
```typescript
// ChatInput.tsx
const ChatInput: React.FC = () => {
  const sendMessage = useChatStore(state => state.sendMessage);
  
  const handleSubmit = async (message: string) => {
    await sendMessage(message);
  };
  // ... render input field
}
```

### 2. State Management (Zustand Store)
```typescript
// chatStore.ts
interface ChatState {
  messages: Message[];
  sendMessage: (content: string) => Promise<void>;
  // ... other state properties
}

const useChatStore = create<ChatState>((set) => ({
  messages: [],
  sendMessage: async (content) => {
    // Update messages state
    // Trigger API call
  },
}));
```

### 3. API Route Handler
```typescript
// api/chat/route.ts
export async function POST(req: Request) {
  // Handle OpenAI/Anthropic API communication
  // Model-specific handling:
  // - O1 models: Combine system/user messages, remove unsupported params
  // - Claude models: Format messages according to Anthropic SDK specs
  // - Standard models: Use full parameter set
  // Stream responses back to client
}
```

### Complete Message Flow:
1. User enters message in ChatInput component
2. Message is sent to Zustand store via sendMessage action
3. Store updates UI state and triggers API call
4. API route processes request and calls OpenAI
5. Responses stream back through SSE (Server-Sent Events)
6. MessageList component updates in real-time
7. InterimDiscussion shows agent interactions
8. Final response appears in chat

## Component Architecture

### Core Components Hierarchy
```
ChatInterface (Container)
├── AgentList
│   └── Agent (multiple)
├── ChatInput
├── MessageList
│   └── ChatMessage (multiple)
└── InterimDiscussion
    └── AgentMessage (multiple)
```

### Component Interactions:
1. **ChatInterface**: Main container managing overall chat state
2. **AgentList**: Controls active agents and their configurations
3. **ChatInput**: Handles user input and message submission
4. **MessageList**: Displays chat history and streaming messages
5. **InterimDiscussion**: Shows agent-executor conversations

### State Management
- Zustand store manages global state
- React Context handles API key state
- Local component state for UI-specific features

## API Integration

### OpenAI API Integration
- Uses OpenAI API for chat completions
- Streams responses for real-time updates
- Handles multiple agent personalities
- Manages conversation context
- Supports O1 models with optimized parameters

### O1 Model Integration
- Specialized handling for O1 and O1-mini reasoning models
- Limitations and workarounds:
  - No support for temperature, top_p, presence_penalty, frequency_penalty
  - No streaming support
  - Token limit handling with automatic retry
  - Combined system and user messages into single message
  - Simplified prompt format for better reasoning
- Implementation details:
  ```typescript
  // O1 model specific configuration
  {
    model: 'o1' | 'o1-mini',
    messages: [{
      role: 'user',
      content: `${simplifiedPrompt}\n\n${focusedContent}`
    }],
    max_completion_tokens: 4096
  }
  ```
- Truncation handling:
  - Detects 'length' finish reason
  - Retries with shortened input (1000 chars)
  - Maintains essential context in retry

### Anthropic API Integration
- Uses Anthropic SDK for Claude models
- Proper message format handling
- Specialized response processing
- Efficient content extraction
- Error handling with detailed feedback

### API Key Management
- Secure storage in browser cookies
- Runtime validation
- Error handling for invalid/expired keys

## Real-time Features

### Message Streaming
- Server-Sent Events (SSE) for real-time updates
- Proper message sequencing
- Progress indicators during streaming

### Agent Interactions
- Parallel agent processing
- Real-time feedback display
- Dynamic conversation threading

## Security Considerations

- API keys stored securely
- Input sanitization
- Rate limiting
- Error handling

## Performance Optimizations

- Component lazy loading
- Efficient state updates
- Optimized re-renders
- Proper error boundaries

## Development Guidelines

### Component Creation
- Use TypeScript for type safety
- Follow React best practices
- Implement proper error handling
- Add JSDoc documentation

### State Management
- Use Zustand for global state
- Keep component state minimal
- Implement proper loading states
- Handle edge cases

## Layout Specifications

### Container Widths
- Main container: max-w-6xl (72rem/1152px)
- Occupies approximately 3/4 of the viewport width
- Centered with mx-auto

### Component Layouts
- API Key inputs: Horizontal grid layout (2 columns)
- Message list: Full width of container
- Chat input: Full width of container
- Agent list: Full width with horizontal scrolling for many agents
