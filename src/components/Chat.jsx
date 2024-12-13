import React, { useState, useRef } from 'react';
import {
  Box,
  TextField,
  IconButton,
  Paper,
  Typography,
  CircularProgress,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import ReactMarkdown from 'react-markdown';

function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef();

  const handleSend = async () => {
    if (!input.trim()) return;

    const newMessage = { role: 'user', content: input };
    setMessages([...messages, newMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const model = localStorage.getItem('selected_model') || 'gpt-4';
      const apiKey = model.includes('claude') 
        ? localStorage.getItem('claude_key')
        : localStorage.getItem('openai_key');

      // API call implementation here
      // You'll need to implement the actual API calls to OpenAI/Claude

      setIsLoading(false);
    } catch (error) {
      console.error('Error:', error);
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      const base64Data = e.target.result.split(',')[1];
      // Handle file upload and processing here
    };
    reader.readAsDataURL(file);
  };

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ flexGrow: 1, overflow: 'auto', p: 2 }}>
        {messages.map((message, index) => (
          <Paper
            key={index}
            sx={{
              p: 2,
              my: 1,
              bgcolor: message.role === 'user' ? 'grey.100' : 'white',
            }}
          >
            <Typography>
              <ReactMarkdown>{message.content}</ReactMarkdown>
            </Typography>
          </Paper>
        ))}
        {isLoading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
            <CircularProgress />
          </Box>
        )}
      </Box>
      
      <Box sx={{ p: 2, backgroundColor: 'background.paper' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: 'none' }}
            onChange={handleFileUpload}
            accept="image/*,.pdf,.doc,.docx,.txt"
          />
          <IconButton onClick={() => fileInputRef.current.click()}>
            <AttachFileIcon />
          </IconButton>
          <TextField
            fullWidth
            multiline
            maxRows={4}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            sx={{ mx: 1 }}
          />
          <IconButton onClick={handleSend} color="primary">
            <SendIcon />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
}

export default Chat; 