import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

const API_KEY_COOKIE = 'ai-chat-api-key';

export function useApiKey() {
  const [apiKey, setApiKey] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedApiKey = Cookies.get(API_KEY_COOKIE) || '';
    setApiKey(savedApiKey);
    setIsLoading(false);
  }, []);

  const updateApiKey = (newApiKey: string) => {
    setApiKey(newApiKey);
    if (newApiKey) {
      Cookies.set(API_KEY_COOKIE, newApiKey, { expires: 30 });
    } else {
      Cookies.remove(API_KEY_COOKIE);
    }
  };

  return { apiKey, updateApiKey, isLoading };
} 