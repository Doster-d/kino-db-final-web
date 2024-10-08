import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { ruRU } from '@mui/material/locale';
import { AuthProvider } from './context/AuthContext';

import Header from './components/Header';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import FilmList from './pages/FilmList';
import FilmDetails from './pages/FilmDetails';
import AddFilm from './pages/AddFilm';
import Profile from './pages/Profile';
import CreateGenre from './pages/CreateGenre';
import FilmManagement from './pages/FilmManagement';
import GenreManagement from './pages/GenreManagement';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
}, ruRU);

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/films" element={<FilmList />} />
            <Route path="/film/:id" element={<FilmDetails />} />
            <Route path="/add-film" element={<AddFilm />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/create-genre" element={<CreateGenre />} />
            <Route path="/film-management" element={<FilmManagement />} />
            <Route path="/genre-management" element={<GenreManagement />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
