import React from 'react';
import { Typography, Container, styled } from '@mui/material';

const StyledContainer = styled(Container)(({ theme }) => ({
  marginTop: theme.spacing(4),
}));

const Home: React.FC = () => {
  return (
    <StyledContainer>
      <Typography variant="h4" gutterBottom>
        Добро пожаловать в Фильмотеку
      </Typography>
      <Typography variant="body1">
        Здесь вы можете найти информацию о фильмах, оставить отзывы и рекомендации.
      </Typography>
    </StyledContainer>
  );
};

export default Home;