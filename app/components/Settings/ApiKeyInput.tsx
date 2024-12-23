import { FC, useState } from 'react';
import { useApiKey } from '@/app/hooks/useApiKey';

export const ApiKeyInput: FC = () => {
  const { apiKey, updateApiKey } = useApiKey();
  const [input, setInput] = useState(apiKey);
  const [isVisible, setIsVisible] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateApiKey(input);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex gap-2">
        <input
          type={isVisible ? 'text' : 'password'}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-grow p-2 border rounded"
          placeholder="Enter your API key"
        />
        <button
          type="button"
          onClick={() => setIsVisible(!isVisible)}
          className="px-4 py-2 bg-gray-200 rounded"
        >
          {isVisible ? 'Hide' : 'Show'}
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Save
        </button>
      </div>
    </form>
  );
}; 