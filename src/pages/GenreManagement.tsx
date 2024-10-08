import React, { useState, useEffect, useContext } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TextField, Typography, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

interface Genre {
  id: number;
  genrename: string;
}

const GenreManagement: React.FC = () => {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [newGenreName, setNewGenreName] = useState('');
  const [editedGenre, setEditedGenre] = useState<Genre | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchGenres();
  }, []);

  const fetchGenres = async () => {
    try {
      const response = await axios.get('http://localhost:8000/genres/');
      setGenres(response.data);
    } catch (error) {
      console.error('Ошибка при загрузке жанров:', error);
    }
  };

  const handleCreate = async () => {
    if (user?.role !== 'filmadmin') {
      alert('Только администраторы могут создавать жанры.');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:8000/genres/', { genrename: newGenreName }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setNewGenreName('');
      fetchGenres();
    } catch (error) {
      console.error('Ошибка при создании жанра:', error);
    }
  };

  const handleEdit = (genre: Genre) => {
    if (user?.role !== 'filmadmin') {
      alert('Только администраторы могут редактировать жанры.');
      return;
    }
    setEditedGenre(genre);
    setOpenDialog(true);
  };

  const handleSave = async () => {
    if (editedGenre) {
      try {
        const token = localStorage.getItem('token');
        await axios.post(`http://localhost:8000/genres/${editedGenre.id}/update`, editedGenre, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setOpenDialog(false);
        fetchGenres();
      } catch (error) {
        console.error('Ошибка при обновлении жанра:', error);
      }
    }
  };

  const handleDelete = async (id: number) => {
    if (user?.role !== 'filmadmin') {
      alert('Только администраторы могут удалять жанры.');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:8000/genres/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      fetchGenres();
    } catch (error) {
      console.error('Ошибка при удалении жанра:', error);
    }
  };

  if (user?.role !== 'filmadmin') {
    return (
      <Typography variant="h6" color="error">
        Только администраторы имеют доступ к управлению жанрами.
      </Typography>
    );
  }

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Управление жанрами
      </Typography>
      <TextField
        label="Новый жанр"
        value={newGenreName}
        onChange={(e) => setNewGenreName(e.target.value)}
        style={{ marginBottom: '1rem' }}
      />
      <Button onClick={handleCreate} variant="contained" color="primary" style={{ marginLeft: '1rem', marginBottom: '1rem' }}>
        Создать жанр
      </Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Название жанра</TableCell>
              <TableCell>Действия</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {genres.map((genre) => (
              <TableRow key={genre.id}>
                <TableCell>{genre.genrename}</TableCell>
                <TableCell>
                  <Button onClick={() => handleEdit(genre)}>Редактировать</Button>
                  <Button onClick={() => handleDelete(genre.id)}>Удалить</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Редактировать жанр</DialogTitle>
        <DialogContent>
          {editedGenre && (
            <TextField
              autoFocus
              margin="dense"
              label="Название жанра"
              fullWidth
              value={editedGenre.genrename}
              onChange={(e) => setEditedGenre({ ...editedGenre, genrename: e.target.value })}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Отмена</Button>
          <Button onClick={handleSave}>Сохранить</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default GenreManagement;