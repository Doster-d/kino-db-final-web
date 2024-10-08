import React, { useState, useEffect } from 'react';
import { TextField, Button, Typography, Container, styled, Chip, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import axios from 'axios';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const StyledContainer = styled(Container)(({ theme }) => ({
  marginTop: theme.spacing(4),
}));

const StyledForm = styled('form')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
}));

const GenreContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  gap: theme.spacing(1),
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(2),
}));

const AddFilm: React.FC = () => {
  const { user } = useContext(AuthContext);
  const [filmname, setFilmname] = useState('');
  const [description, setDescription] = useState('');
  const [year, setYear] = useState<number | ''>(''); // Добавляем состояние для года
  const [genres, setGenres] = useState<string[]>([]);
  const [availableGenres, setAvailableGenres] = useState<string[]>([]);
  const [newGenre, setNewGenre] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchGenres();
  }, []);

  const fetchGenres = async () => {
    try {
      const response = await axios.get('http://localhost:8000/genres/');
      setAvailableGenres(response.data.map((genre: any) => genre.genrename));
    } catch (error) {
      console.error('Ошибка при получении жанров:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:8000/films/', {
        filmname,
        description,
        year, // Добавляем год в запрос
        genres,
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setMessage('Фильм успешно добавлен');
      setFilmname('');
      setDescription('');
      setYear(''); // Очищаем поле года после успешного добавления
      setGenres([]);
    } catch (error) {
      console.error('Ошибка при добавлении фильма:', error);
      setMessage('Произошла ошибка при добавлении фильма');
    }
  };

  const handleGenreClick = (genre: string) => {
    if (genres.includes(genre)) {
      setGenres(genres.filter(g => g !== genre));
    } else {
      setGenres([...genres, genre]);
    }
  };

  const handleCreateGenre = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:8000/genres/', { genrename: newGenre }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setAvailableGenres([...availableGenres, response.data.genrename]);
      setGenres([...genres, response.data.genrename]);
      setNewGenre('');
      setOpenDialog(false);
    } catch (error) {
      console.error('Ошибка при создании жанра:', error);
    }
  };

  // Add this check at the beginning of the component
  if (!user || user.role !== 'filmadmin') {
    return (
      <Typography variant="h6" color="error">
        Только администраторы могут добавлять новые фильмы.
      </Typography>
    );
  }

  return (
    <StyledContainer maxWidth="sm">
      <Typography variant="h4" component="h1" gutterBottom>
        Добавить новый фильм
      </Typography>
      <StyledForm onSubmit={handleSubmit}>
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="filmname"
          label="Название фильма"
          name="filmname"
          value={filmname}
          onChange={(e) => setFilmname(e.target.value)}
        />
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="year"
          label="Год выпуска"
          name="year"
          type="number"
          value={year}
          onChange={(e) => setYear(e.target.value ? parseInt(e.target.value) : '')}
        />
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="description"
          label="Описание"
          name="description"
          multiline
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <Typography variant="subtitle1" gutterBottom>
          Жанры:
        </Typography>
        <GenreContainer>
          {availableGenres.map((genre) => (
            <Chip
              key={genre}
              label={genre}
              onClick={() => handleGenreClick(genre)}
              color={genres.includes(genre) ? 'primary' : 'default'}
            />
          ))}
          <Chip
            label="+ Создать новый жанр"
            onClick={() => setOpenDialog(true)}
            color="secondary"
          />
        </GenreContainer>
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          style={{ marginTop: '1rem' }}
        >
          Добавить фильм
        </Button>
      </StyledForm>
      {message && (
        <Typography style={{ marginTop: '1rem' }} color={message.includes('успешно') ? 'green' : 'error'}>
          {message}
        </Typography>
      )}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Создать новый жанр</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="newGenre"
            label="Название жанра"
            type="text"
            fullWidth
            variant="outlined"
            value={newGenre}
            onChange={(e) => setNewGenre(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Отмена</Button>
          <Button onClick={handleCreateGenre} color="primary">
            Создать
          </Button>
        </DialogActions>
      </Dialog>
    </StyledContainer>
  );
};

export default AddFilm;