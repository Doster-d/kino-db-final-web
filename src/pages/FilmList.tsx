import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { styled } from '@mui/material/styles';
import SearchFilms from '../components/SearchFilms';

const StyledContainer = styled(Container)(({ theme }) => ({
  marginTop: theme.spacing(4),
}));

interface Film {
  id: number;
  filmname: string;
  description: string;
  year: number;
  genres: string[];
}

const FilmList: React.FC = () => {
  return (
    <StyledContainer>
      <Typography variant="h4" gutterBottom>
        Список фильмов
      </Typography>
      <SearchFilms />
    </StyledContainer>
  );
};

export default FilmList;