import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { Typography, Container as MuiContainer, Paper, styled, Theme, Rating } from '@mui/material';
import axios from 'axios';
import ReviewManagement from './ReviewManagement';

const StyledContainer = styled('div')(({ theme }) => ({
  marginTop: theme.spacing(4),
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
}));

interface Film {
  id: number;
  filmname: string;
  description: string;
  year: number;
  genres: string[];
  average_rating: number;
}

const FilmDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [film, setFilm] = useState<Film | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const fetchFilm = useCallback(async () => {
    try {
      const response = await axios.get(`http://localhost:8000/films/${id}`);
      setFilm(response.data);
    } catch (error) {
      console.error('Ошибка при загрузке фильма:', error);
      setError('Не удалось загрузить информацию о фильме');
    }
  }, [id]);

  useEffect(() => {
    fetchFilm();
  }, [fetchFilm, refreshTrigger]);

  if (error) {
    return (
      <StyledContainer>
        <Typography color="error">{error}</Typography>
      </StyledContainer>
    );
  }

  if (!film) {
    return (
      <StyledContainer>
        <Typography>Загрузка...</Typography>
      </StyledContainer>
    );
  }

  return (
    <StyledContainer>
      <MuiContainer>
        <StyledPaper>
          <Typography variant="h4" gutterBottom>
            {film.filmname}
          </Typography>
          <Typography variant="body1" paragraph>
            {film.description}
          </Typography>
          <Typography variant="subtitle1">
            Жанры: {film.genres.join(', ')}
          </Typography>
          <Typography variant="subtitle1">
            Год: {film.year}
          </Typography>
          <Typography variant="subtitle1" style={{ display: 'flex', alignItems: 'center' }}>
            Средний рейтинг: 
            <Rating 
              value={film.average_rating} 
              readOnly 
              max={10} 
              precision={0.1} 
              style={{ marginLeft: '10px' }}
            />
            ({film.average_rating.toFixed(1)})
          </Typography>
        </StyledPaper>
        
        {/* Добавляем компонент ReviewManagement */}
        <ReviewManagement 
          filmId={Number(id)} 
          onReviewChange={() => setRefreshTrigger(prev => prev + 1)}
        />
      </MuiContainer>
    </StyledContainer>
  );
};

export default FilmDetails;