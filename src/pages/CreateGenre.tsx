import React, { useState } from 'react';
import { TextField, Button, Typography, Container, styled } from '@mui/material';
import axios from 'axios';

const StyledContainer = styled(Container)(({ theme }) => ({
  marginTop: theme.spacing(4),
}));

const StyledForm = styled('form')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
}));

const CreateGenre: React.FC = () => {
  const [genreName, setGenreName] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/genres/', { genrename: genreName });
      setMessage(`Жанр "${response.data.genrename}" успешно создан`);
      setGenreName('');
    } catch (error) {
      console.error('Ошибка при создании жанра:', error);
      setMessage('Произошла ошибка при создании жанра');
    }
  };

  return (
    <StyledContainer maxWidth="xs">
      <Typography variant="h4" component="h1" gutterBottom>
        Создать новый жанр
      </Typography>
      <StyledForm onSubmit={handleSubmit}>
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="genreName"
          label="Название жанра"
          name="genreName"
          value={genreName}
          onChange={(e) => setGenreName(e.target.value)}
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          style={{ marginTop: '1rem' }}
        >
          Создать жанр
        </Button>
      </StyledForm>
      {message && (
        <Typography style={{ marginTop: '1rem' }} color={message.includes('успешно') ? 'green' : 'error'}>
          {message}
        </Typography>
      )}
    </StyledContainer>
  );
};

export default CreateGenre;