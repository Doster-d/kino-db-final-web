import React, { useState, useEffect } from 'react';
import { Typography, Container as MuiContainer, Paper, styled } from '@mui/material';
import { Theme } from '@mui/material/styles';
import axios from 'axios';

const StyledContainer = styled('div')(({ theme }: { theme: Theme }) => ({
  marginTop: theme.spacing(4),
}));

const StyledPaper = styled(Paper)(({ theme }: { theme: Theme }) => ({
  padding: theme.spacing(3),
}));

interface User {
  id: number;
  name: string;
  email: string;
  gender?: string;
  dateofbirth?: string;
  role: string;
}

const Profile: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:8000/users/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data);
      } catch (error) {
        console.error('Ошибка при загрузке профиля:', error);
      }
    };
    fetchProfile();
  }, []);

  if (!user) {
    return <Typography>Загрузка...</Typography>;
  }

  return (
    <StyledContainer>
      <StyledPaper>
        <Typography variant="h4" gutterBottom>
          Профиль пользователя
        </Typography>
        <Typography variant="body1">Имя: {user.name}</Typography>
        <Typography variant="body1">Email: {user.email}</Typography>
        <Typography variant="body1">Роль: {user.role}</Typography>
        {user.gender && <Typography variant="body1">Пол: {user.gender}</Typography>}
        {user.dateofbirth && <Typography variant="body1">Дата рождения: {new Date(user.dateofbirth).toLocaleDateString('ru-RU')}</Typography>}
      </StyledPaper>
    </StyledContainer>
  );
};

export default Profile;