import { render, screen } from '@testing-library/react'
import { ChatMessage } from '../ChatMessage'

describe('ChatMessage', () => {
  const mockMessage = {
    id: '1',
    role: 'user' as const,
    content: 'Hello, world!',
    timestamp: Date.now(),
  }

  it('renders message content', () => {
    render(<ChatMessage message={mockMessage} />)
    expect(screen.getByText('Hello, world!')).toBeInTheDocument()
  })

  it('shows correct avatar letter based on role', () => {
    render(<ChatMessage message={mockMessage} />)
    expect(screen.getByText('U')).toBeInTheDocument()

    const assistantMessage = { ...mockMessage, role: 'assistant' as const }
    render(<ChatMessage message={assistantMessage} />)
    expect(screen.getByText('A')).toBeInTheDocument()
  })

  it('applies loading state styles when isLoading is true', () => {
    render(<ChatMessage message={mockMessage} isLoading={true} />)
    expect(screen.getByText('Hello, world!').parentElement).toHaveClass('animate-pulse')
  })

  it('renders markdown content correctly', () => {
    const markdownMessage = {
      ...mockMessage,
      content: '**Bold** and *italic*'
    }
    render(<ChatMessage message={markdownMessage} />)
    expect(screen.getByText('Bold')).toHaveStyle('font-weight: bold')
  })
}) 