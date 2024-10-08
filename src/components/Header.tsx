import React, { useContext, useEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import { AuthContext } from '../context/AuthContext';

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
}));

const Header: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, setIsAuthenticated, user, setUser } = useContext(AuthContext);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setUser(null);
    navigate('/');
  };

  return (
    <AppBar position="static">
      <StyledToolbar>
        <Typography variant="h6" component="div">
          Фильмотека
        </Typography>
        <div>
          <Button color="inherit" component={RouterLink} to="/">
            Главная
          </Button>
          <Button color="inherit" component={RouterLink} to="/films">
            Фильмы
          </Button>
          {isAuthenticated ? (
            <>
              {user?.role === 'filmadmin' && (
              <Button color="inherit" component={RouterLink} to="/add-film">
                Добавить фильм
              </Button>
              )}
              <Button color="inherit" component={RouterLink} to="/profile">
                Профиль
              </Button>
              {user?.role === 'filmadmin' && (
              <Button color="inherit" component={RouterLink} to="/create-genre">
                Создать жанр
              </Button>
              )}
              {user?.role === 'filmadmin' && (
                <Button color="inherit" component={RouterLink} to="/film-management">
                  Управление фильмами
                </Button>
              )}
              {user?.role === 'filmadmin' && (
                <Button color="inherit" component={RouterLink} to="/genre-management">
                  Управление жанрами
                </Button>
              )}
              <Button color="inherit" onClick={handleLogout}>
                Выйти
              </Button>
            </>
          ) : (
            <>
              <Button color="inherit" component={RouterLink} to="/login">
                Войти
              </Button>
              <Button color="inherit" component={RouterLink} to="/register">
                Регистрация
              </Button>
            </>
          )}
        </div>
      </StyledToolbar>
    </AppBar>
  );
};

export default Header;