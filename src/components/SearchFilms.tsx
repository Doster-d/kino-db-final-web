import React, { useState, useEffect } from 'react';
import { TextField, Button, Select, MenuItem, FormControl, InputLabel, Grid, Typography, Link } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import axios from 'axios';

interface Film {
  id: number;
  filmname: string;
  description: string;
  year: number;
  genres: string[];
}

const SearchFilms: React.FC = () => {
  const [name, setName] = useState('');
  const [genre, setGenre] = useState('');
  const [year, setYear] = useState<number | ''>('');
  const [genres, setGenres] = useState<string[]>([]);
  const [searchResults, setSearchResults] = useState<Film[]>([]);

  useEffect(() => {
    fetchGenres();
    handleSearch();
  }, []);

  const fetchGenres = async () => {
    try {
      const response = await axios.get('http://localhost:8000/genres/');
      setGenres(response.data.map((g: any) => g.genrename));
    } catch (error) {
      console.error('Error fetching genres:', error);
    }
  };

  const handleSearch = async () => {
    try {
      const response = await axios.get('http://localhost:8000/films/search/', {
        params: {
          name: name || undefined,
          genre: genre || undefined,
          year: year || undefined
        },
      });
      setSearchResults(response.data);
    } catch (error) {
      console.error('Error searching films:', error);
    }
  };

  return (
    <div>
      <Typography variant="h5" gutterBottom>
        Поиск фильмов
      </Typography>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} sm={3}>
          <TextField
            fullWidth
            label="Название фильма"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <FormControl fullWidth>
            <InputLabel>Жанр</InputLabel>
            <Select value={genre} onChange={(e) => setGenre(e.target.value as string)}>
              <MenuItem value="">Все жанры</MenuItem>
              {genres.map((g) => (
                <MenuItem key={g} value={g}>
                  {g}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={3}>
          <TextField
            fullWidth
            type="number"
            label="Год"
            value={year}
            onChange={(e) => setYear(e.target.value ? parseInt(e.target.value) : '')}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <Button variant="contained" color="primary" onClick={handleSearch} fullWidth>
            Поиск
          </Button>
        </Grid>
      </Grid>
      <Typography variant="h6" style={{ marginTop: '20px' }}>
        Результаты поиска:
      </Typography>
      {searchResults.map((film) => (
        <div key={film.id}>
          <Typography variant="subtitle1">
            <Link component={RouterLink} to={`/film/${film.id}`}>
              {film.filmname} ({film.year})
            </Link>
          </Typography>
          <Typography variant="body2">{film.description}</Typography>
          <Typography variant="body2">Жанры: {film.genres.join(', ')}</Typography>
        </div>
      ))}
    </div>
  );
};

export default SearchFilms;