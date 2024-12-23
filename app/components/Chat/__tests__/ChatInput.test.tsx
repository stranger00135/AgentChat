import { render, screen, fireEvent } from '@testing-library/react'
import { ChatInput } from '../ChatInput'

describe('ChatInput', () => {
  const mockSubmit = jest.fn()

  beforeEach(() => {
    mockSubmit.mockClear()
  })

  it('renders input field', () => {
    render(<ChatInput onSubmit={mockSubmit} />)
    expect(screen.getByPlaceholderText('Type a message...')).toBeInTheDocument()
  })

  it('handles submit on button click', () => {
    render(<ChatInput onSubmit={mockSubmit} />)
    const input = screen.getByPlaceholderText('Type a message...')
    const button = screen.getByRole('button')

    fireEvent.change(input, { target: { value: 'test message' } })
    fireEvent.click(button)

    expect(mockSubmit).toHaveBeenCalledWith('test message')
    expect(input).toHaveValue('')
  })

  it('handles submit on Enter key', () => {
    render(<ChatInput onSubmit={mockSubmit} />)
    const input = screen.getByPlaceholderText('Type a message...')

    fireEvent.change(input, { target: { value: 'test message' } })
    fireEvent.keyDown(input, { key: 'Enter' })

    expect(mockSubmit).toHaveBeenCalledWith('test message')
    expect(input).toHaveValue('')
  })

  it('does not submit empty messages', () => {
    render(<ChatInput onSubmit={mockSubmit} />)
    const input = screen.getByPlaceholderText('Type a message...')
    const button = screen.getByRole('button')

    fireEvent.change(input, { target: { value: '   ' } })
    fireEvent.click(button)

    expect(mockSubmit).not.toHaveBeenCalled()
  })

  it('disables input when loading', () => {
    render(<ChatInput onSubmit={mockSubmit} isLoading={true} />)
    const input = screen.getByPlaceholderText('Type a message...')
    const button = screen.getByRole('button')

    expect(input).toBeDisabled()
    expect(button).toBeDisabled()
  })
}) 