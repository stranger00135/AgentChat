import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Chat, ChatState, Message } from '@/app/types/chat';
import { v4 as uuidv4 } from 'uuid';

interface ChatStore extends ChatState {
  createChat: () => void;
  setCurrentChat: (chatId: string) => void;
  addMessage: (message: Omit<Message, 'id' | 'timestamp'>) => void;
  updateMessage: (messageId: string, content: string) => void;
  deleteChat: (chatId: string) => void;
  clearChats: () => void;
}

export const useChatStore = create<ChatStore>()(
  persist(
    (set, get) => ({
      chats: [],
      currentChatId: null,
      isLoading: false,
      error: null,

      createChat: () => {
        const newChat: Chat = {
          id: uuidv4(),
          title: 'New Chat',
          messages: [],
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };

        set((state) => ({
          chats: [...state.chats, newChat],
          currentChatId: newChat.id,
        }));
      },

      setCurrentChat: (chatId) => {
        set({ currentChatId: chatId });
      },

      addMessage: (message) => {
        const { currentChatId } = get();
        if (!currentChatId) return;

        const newMessage: Message = {
          id: uuidv4(),
          ...message,
          timestamp: Date.now(),
        };

        set((state) => ({
          chats: state.chats.map((chat) =>
            chat.id === currentChatId
              ? {
                  ...chat,
                  messages: [...chat.messages, newMessage],
                  updatedAt: Date.now(),
                }
              : chat
          ),
        }));
      },

      updateMessage: (messageId, content) => {
        const { currentChatId } = get();
        if (!currentChatId) return;

        set((state) => ({
          chats: state.chats.map((chat) =>
            chat.id === currentChatId
              ? {
                  ...chat,
                  messages: chat.messages.map((msg) =>
                    msg.id === messageId ? { ...msg, content } : msg
                  ),
                  updatedAt: Date.now(),
                }
              : chat
          ),
        }));
      },

      deleteChat: (chatId) => {
        set((state) => ({
          chats: state.chats.filter((chat) => chat.id !== chatId),
          currentChatId:
            state.currentChatId === chatId ? null : state.currentChatId,
        }));
      },

      clearChats: () => {
        set({ chats: [], currentChatId: null });
      },
    }),
    {
      name: 'chat-storage',
    }
  )
); 