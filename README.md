# AgentChat

A sophisticated AI chat platform featuring multi-agent interactions and real-time streaming. The platform enables natural conversations between a task executor and multiple expert agents to refine and improve solutions.

## Features

- Real-time message streaming with proper sequencing
- Multi-agent collaboration system
- Natural conversation flow between agents and executor
- Collapsible interim discussions
- Custom agent creation and configuration
- OpenAI API integration

### Pre-configured Agents
- Technical Expert: Ensures technical accuracy and implementation details
- UX Specialist: Focuses on user experience and interface design
- Security Expert: Reviews security implications and best practices

## Project Structure

```
AgentChat/
├── app/                 # Main application code
│   ├── api/            # API routes
│   ├── components/     # React components
│   ├── store/          # State management
│   ├── types/          # TypeScript types
│   ├── utils/          # Utility functions
│   ├── hooks/          # Custom React hooks
│   └── page.tsx        # Main page component
├── public/             # Static files
├── Docs/              # Documentation
└── node_modules/      # Dependencies
```

## Prerequisites

- Node.js >= 18.17.0
- npm >= 9.0.0
- OpenAI API key
- MongoDB (for conversation storage)

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/yourusername/AgentChat.git
cd AgentChat
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file with your configuration:
```
MONGODB_URI=your_mongodb_uri
```

4. Start the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

1. Enter your OpenAI API key in the application
2. Configure agents as needed
3. Start chatting!

The application will:
- Process your message through the executor
- Get feedback from active agents
- Show interim discussions in collapsible sections
- Provide a final refined response

## Development

This project uses:
- Next.js 13+ (App Router)
- React 19.0.0
- TypeScript 5.x
- Tailwind CSS 3.4.1
- Zustand 5.0.2
- OpenAI API SDK 4.77.0

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
