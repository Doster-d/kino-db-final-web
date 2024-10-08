import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Typography, Chip } from '@mui/material';
import axios from 'axios';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

interface Film {
  id: number;
  filmname: string;
  description: string;
  year: number;
  genres: string[];
}

const FilmManagement: React.FC = () => {
  const { user } = useContext(AuthContext);
  const [films, setFilms] = useState<Film[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editedFilm, setEditedFilm] = useState<Film | null>(null);
  const [availableGenres, setAvailableGenres] = useState<string[]>([]);
  const [newGenre, setNewGenre] = useState('');
  const [openGenreDialog, setOpenGenreDialog] = useState(false);

  useEffect(() => {
    fetchFilms();
    fetchGenres();
  }, []);

  const fetchFilms = async () => {
    try {
      const response = await axios.get('http://localhost:8000/films');
      setFilms(response.data);
    } catch (error) {
      console.error('Ошибка при загрузке фильмов:', error);
    }
  };

  const fetchGenres = async () => {
    try {
      const response = await axios.get('http://localhost:8000/genres/');
      setAvailableGenres(response.data.map((genre: any) => genre.genrename));
    } catch (error) {
      console.error('Ошибка при получении жанров:', error);
    }
  };

  const handleEdit = (film: Film) => {
    if (user && user.role === 'filmadmin') {
      setEditedFilm({ ...film });
      setOpenDialog(true);
    } else {
      alert('Только администраторы могут редактировать фильмы.');
    }
  };

  const handleDelete = async (id: number) => {
    if (user && user.role === 'filmadmin') {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:8000/films/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        fetchFilms();
      } catch (error) {
        console.error('Ошибка при удалении фильма:', error);
      }
    } else {
      alert('Только администраторы могут удалять фильмы.');
    }
  };

  const handleSave = async () => {
    if (editedFilm) {
      try {
        const token = localStorage.getItem('token');
        await axios.post(`http://localhost:8000/films/${editedFilm.id}/update`, editedFilm, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setOpenDialog(false);
        fetchFilms();
      } catch (error) {
        console.error('Ошибка при обновлении фильма:', error);
      }
    }
  };

  const handleGenreClick = (genre: string) => {
    if (editedFilm) {
      const updatedGenres = editedFilm.genres.includes(genre)
        ? editedFilm.genres.filter(g => g !== genre)
        : [...editedFilm.genres, genre];
      setEditedFilm({ ...editedFilm, genres: updatedGenres });
    }
  };

  const handleCreateGenre = async () => {
    if (user && user.role === 'filmadmin') {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.post('http://localhost:8000/genres/', { genrename: newGenre }, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setAvailableGenres([...availableGenres, response.data.genrename]);
        if (editedFilm) {
          setEditedFilm({ ...editedFilm, genres: [...editedFilm.genres, response.data.genrename] });
        }
        setNewGenre('');
        setOpenGenreDialog(false);
      } catch (error) {
        console.error('Ошибка при создании жанра:', error);
      }
    } else {
      alert('Только администраторы могут создавать новые жанры.');
    }
  };

  if (user && user.role !== 'filmadmin') {
    return (
      <div>
        <Typography variant="h4" gutterBottom>
          Управление фильмами
        </Typography>
        <Typography variant="h6" color="error">
          Только администраторы имеют доступ к управлению фильмами.
        </Typography>
      </div>
    );
  }

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Управление фильмами
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Название</TableCell>
              <TableCell>Год</TableCell>
              <TableCell>Описание</TableCell>
              <TableCell>Жанры</TableCell>
              <TableCell>Действия</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {films.map((film) => (
              <TableRow key={film.id}>
                <TableCell>{film.filmname}</TableCell>
                <TableCell>{film.year}</TableCell>
                <TableCell>{film.description}</TableCell>
                <TableCell>{film.genres.join(', ')}</TableCell>
                <TableCell>
                  <Button onClick={() => handleEdit(film)}>Редактировать</Button>
                  <Button onClick={() => handleDelete(film.id)}>Удалить</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Редактировать фильм</DialogTitle>
        <DialogContent>
          {editedFilm && (
            <>
              <TextField
                autoFocus
                margin="dense"
                label="Название фильма"
                fullWidth
                value={editedFilm.filmname}
                onChange={(e) => setEditedFilm({ ...editedFilm, filmname: e.target.value })}
              />
              <TextField
                margin="dense"
                label="Год выпуска"
                fullWidth
                type="number"
                value={editedFilm.year}
                onChange={(e) => setEditedFilm({ ...editedFilm, year: parseInt(e.target.value) || 0 })}
              />
              <TextField
                margin="dense"
                label="Описание"
                fullWidth
                multiline
                rows={4}
                value={editedFilm.description}
                onChange={(e) => setEditedFilm({ ...editedFilm, description: e.target.value })}
              />
              <Typography variant="subtitle1" gutterBottom>
                Жанры:
              </Typography>
              {availableGenres.map((genre) => (
                <Chip
                  key={genre}
                  label={genre}
                  onClick={() => handleGenreClick(genre)}
                  color={editedFilm.genres.includes(genre) ? 'primary' : 'default'}
                  style={{ margin: '0.25rem' }}
                />
              ))}
              <Chip
                label="+ Создать новый жанр"
                onClick={() => setOpenGenreDialog(true)}
                color="secondary"
                style={{ margin: '0.25rem' }}
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Отмена</Button>
          <Button onClick={handleSave}>Сохранить</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openGenreDialog} onClose={() => setOpenGenreDialog(false)}>
        <DialogTitle>Создать новый жанр</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Название жанра"
            fullWidth
            value={newGenre}
            onChange={(e) => setNewGenre(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenGenreDialog(false)}>Отмена</Button>
          <Button onClick={handleCreateGenre}>Создать</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default FilmManagement;