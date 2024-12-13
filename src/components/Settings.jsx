import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
} from '@mui/material';

function Settings() {
  const [openAIKey, setOpenAIKey] = useState('');
  const [claudeKey, setClaudeKey] = useState('');
  const [selectedModel, setSelectedModel] = useState('gpt-4');

  useEffect(() => {
    // Load saved keys from localStorage if they exist
    const savedOpenAIKey = localStorage.getItem('openai_key');
    const savedClaudeKey = localStorage.getItem('claude_key');
    const savedModel = localStorage.getItem('selected_model');

    if (savedOpenAIKey) setOpenAIKey(savedOpenAIKey);
    if (savedClaudeKey) setClaudeKey(savedClaudeKey);
    if (savedModel) setSelectedModel(savedModel);
  }, []);

  const handleSave = () => {
    localStorage.setItem('openai_key', openAIKey);
    localStorage.setItem('claude_key', claudeKey);
    localStorage.setItem('selected_model', selectedModel);
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Settings
      </Typography>
      
      <TextField
        fullWidth
        label="OpenAI API Key"
        type="password"
        value={openAIKey}
        onChange={(e) => setOpenAIKey(e.target.value)}
        margin="normal"
      />
      
      <TextField
        fullWidth
        label="Claude API Key"
        type="password"
        value={claudeKey}
        onChange={(e) => setClaudeKey(e.target.value)}
        margin="normal"
      />
      
      <FormControl fullWidth margin="normal">
        <InputLabel>Default Model</InputLabel>
        <Select
          value={selectedModel}
          onChange={(e) => setSelectedModel(e.target.value)}
        >
          <MenuItem value="gpt-4">GPT-4</MenuItem>
          <MenuItem value="gpt-3.5-turbo">GPT-3.5 Turbo</MenuItem>
          <MenuItem value="claude-3-opus">Claude 3 Opus</MenuItem>
          <MenuItem value="claude-3-sonnet">Claude 3 Sonnet</MenuItem>
        </Select>
      </FormControl>
      
      <Button
        variant="contained"
        color="primary"
        onClick={handleSave}
        sx={{ mt: 2 }}
      >
        Save Settings
      </Button>
    </Box>
  );
}

export default Settings; 