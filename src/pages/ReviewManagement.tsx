import React, { useState, useEffect, useContext, useCallback } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useParams } from 'react-router-dom';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Typography, Rating } from '@mui/material';
import axios from 'axios';

interface Review {
  id: number;
  reviewtext: string;
  tengrade: number;
  binarygrade: boolean;
  userid: number;
  username: string;
}

interface Film {
  id: number;
  filmname: string;
  description: string;
  genres: string[];
}

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface ReviewWithFilmAndUser {
  id: number;
  reviewtext: string;
  tengrade: number;
  binarygrade: boolean;
  film: Film;
  user: User;
}

interface ReviewManagementProps {
  filmId: number;
  onReviewChange: () => void;
}

const ReviewManagement: React.FC<ReviewManagementProps> = ({ filmId, onReviewChange }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [film, setFilm] = useState<Film | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [editedReview, setEditedReview] = useState<Review | null>(null);
  const [newReview, setNewReview] = useState({ reviewtext: '', tengrade: 0, binarygrade: true });
  const { user } = useContext(AuthContext);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const fetchReviews = useCallback(async () => {
    try {
      const response = await axios.get<ReviewWithFilmAndUser[]>(`http://localhost:8000/films/${filmId}/reviews`);
      const formattedReviews: Review[] = response.data.map(review => ({
        id: review.id,
        reviewtext: review.reviewtext,
        tengrade: review.tengrade,
        binarygrade: review.binarygrade,
        userid: review.user.id,
        username: review.user.name
      }));
      setReviews(formattedReviews);
    } catch (error) {
      console.error('Ошибка при загрузке отзывов:', error);
    }
  }, [filmId]);

  const fetchFilm = useCallback(async () => {
    try {
      const response = await axios.get(`http://localhost:8000/films/${filmId}`);
      setFilm(response.data);
    } catch (error) {
      console.error('Ошибка при загрузке фильма:', error);
    }
  }, [filmId]);

  useEffect(() => {
    fetchReviews();
    fetchFilm();
  }, [fetchReviews, fetchFilm, refreshTrigger]);

  const handleEdit = (review: Review) => {
    setEditedReview(review);
    setOpenDialog(true);
  };

  const handleDelete = async (reviewId: number) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete<ReviewWithFilmAndUser>(`http://localhost:8000/reviews/${reviewId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setRefreshTrigger(prev => prev + 1);
      onReviewChange();
    } catch (error) {
      console.error('Ошибка при удалении отзыва:', error);
    }
  };

  const handleSave = async () => {
    if (editedReview) {
      try {
        const token = localStorage.getItem('token');
        await axios.post<ReviewWithFilmAndUser>(
          `http://localhost:8000/reviews/${editedReview.id}/update`,
          {
            reviewtext: editedReview.reviewtext,
            tengrade: editedReview.tengrade,
            binarygrade: editedReview.binarygrade
          },
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );
        setOpenDialog(false);
        setRefreshTrigger(prev => prev + 1);
        onReviewChange();
      } catch (error) {
        console.error('Ошибка при обновлении отзыва:', error);
      }
    }
  };

  const handleCreate = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post<ReviewWithFilmAndUser>(`http://localhost:8000/films/${filmId}/reviews`, newReview, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setNewReview({ reviewtext: '', tengrade: 5, binarygrade: true });
      setRefreshTrigger(prev => prev + 1);
      onReviewChange();
    } catch (error) {
      console.error('Ошибка при создании отзыва:', error);
    }
  };

  const canEditDelete = (review: Review) => {
    return user && (user.id === review.userid || user.role === 'filmadmin');
  };

  const userReview = reviews.find(review => review.userid === user?.id);

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Отзывы к фильму: {film?.filmname}
      </Typography>
      {user ? (
        <>
          <Typography variant="h6" gutterBottom>
            {userReview ? 'Обновить отзыв' : 'Добавить новый отзыв'}
          </Typography>
          <TextField
            label="Текст отзыва"
            multiline
            rows={4}
            value={newReview.reviewtext}
            onChange={(e) => setNewReview({ ...newReview, reviewtext: e.target.value })}
            fullWidth
            margin="normal"
          />
          <Rating
            name="tengrade"
            value={newReview.tengrade}
            max={10}
            onChange={(event, newValue) => {
              setNewReview({ ...newReview, tengrade: newValue || 0 });
            }}
          />
          <Button onClick={handleCreate} variant="contained" color="primary" style={{ marginTop: '1rem' }}>
            {userReview ? 'Обновить отзыв' : 'Добавить отзыв'}
          </Button>
        </>
      ) : (
        <Typography variant="body1" style={{ marginBottom: '1rem' }}>
          Войдите в систему, чтобы оставить отзыв.
        </Typography>
      )}
      <TableContainer component={Paper} style={{ marginTop: '2rem' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Пользователь</TableCell>
              <TableCell>Текст отзыва</TableCell>
              <TableCell>Оценка</TableCell>
              <TableCell>Действия</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reviews.map((review) => (
              <TableRow key={review.id}>
                <TableCell>{review.username}</TableCell>
                <TableCell>{review.reviewtext}</TableCell>
                <TableCell>
                  <Rating name={`rating-${review.id}`} value={review.tengrade} max={10} readOnly />
                </TableCell>
                <TableCell>
                  {canEditDelete(review) && (
                    <>
                      <Button onClick={() => handleEdit(review)}>Редактировать</Button>
                      <Button onClick={() => handleDelete(review.id)}>Удалить</Button>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Редактировать отзыв</DialogTitle>
        <DialogContent>
          {editedReview && (
            <>
              <TextField
                autoFocus
                margin="dense"
                label="Текст отзыва"
                fullWidth
                multiline
                rows={4}
                value={editedReview.reviewtext}
                onChange={(e) => setEditedReview({ ...editedReview, reviewtext: e.target.value })}
              />
              <Rating
                name="tengrade"
                value={editedReview.tengrade}
                max={10}
                onChange={(event, newValue) => {
                  setEditedReview({ ...editedReview, tengrade: newValue || 0 });
                }}
              />
            </>
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

export default ReviewManagement;