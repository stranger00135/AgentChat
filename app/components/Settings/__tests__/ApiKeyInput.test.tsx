import { render, screen, fireEvent } from '@testing-library/react'
import { ApiKeyInput } from '../ApiKeyInput'
import { useApiKey } from '@/app/hooks/useApiKey'

// Mock the useApiKey hook
jest.mock('@/app/hooks/useApiKey', () => ({
  useApiKey: jest.fn(),
}))

describe('ApiKeyInput', () => {
  const mockUpdateApiKey = jest.fn()

  beforeEach(() => {
    ;(useApiKey as jest.Mock).mockReturnValue({
      apiKey: 'test-key',
      updateApiKey: mockUpdateApiKey,
    })
  })

  it('renders with initial api key', () => {
    render(<ApiKeyInput />)
    expect(screen.getByDisplayValue('test-key')).toBeInTheDocument()
  })

  it('toggles password visibility', () => {
    render(<ApiKeyInput />)
    const input = screen.getByPlaceholderText('Enter your API key')
    const toggleButton = screen.getByText('Show')

    expect(input).toHaveAttribute('type', 'password')
    fireEvent.click(toggleButton)
    expect(input).toHaveAttribute('type', 'text')
  })

  it('updates api key on form submission', () => {
    render(<ApiKeyInput />)
    const input = screen.getByPlaceholderText('Enter your API key')
    const form = screen.getByRole('form')

    fireEvent.change(input, { target: { value: 'new-key' } })
    fireEvent.submit(form)

    expect(mockUpdateApiKey).toHaveBeenCalledWith('new-key')
  })
}) 