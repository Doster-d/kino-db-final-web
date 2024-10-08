import React, { useState } from 'react';
import { TextField, Button, Typography, Container, styled, MenuItem, Snackbar, Alert } from '@mui/material';
import { Theme } from '@mui/material/styles';
import axios from 'axios';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3'
import { ru } from 'date-fns/locale/ru';
import { useNavigate } from 'react-router-dom';

const StyledContainer = styled(Container)(({ theme }) => ({
  marginTop: theme.spacing(4),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
}));

const StyledForm = styled('form')(({ theme }) => ({
  width: '100%',
  marginTop: theme.spacing(1),
}));

const StyledButton = styled(Button)(({ theme }) => ({
  margin: theme.spacing(3, 0, 2),
}));

const Register: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [gender, setGender] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Check if the user is at least 13 years old
    if (dateOfBirth) {
      const today = new Date();
      const birthDate = new Date(dateOfBirth);
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }

      if (age < 13) {
        setError('Вы должны быть старше 13 лет, чтобы зарегистрироваться.');
        return;
      }
    }

    try {
      console.log('Отправка запроса на регистрацию...');
      const response = await axios.post('http://localhost:8000/users/', {
        name,
        email,
        password,
        gender,
        dateofbirth: dateOfBirth ? dateOfBirth.toISOString().split('T')[0] : null,
      });
      console.log('Ответ сервера:', response.data);
      setSuccess(true);
      setTimeout(() => {
        console.log('Перенаправление на страницу входа...');
        navigate('/login');
      }, 2000);
    } catch (error) {
      console.error('Ошибка регистрации:', error);
      if (axios.isAxiosError(error) && error.response) {
        setError(error.response.data.detail || 'Произошла ошибка при регистрации');
      } else {
        setError('Произошла неизвестная ошибка');
      }
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ru} localeText={{ start: 'Начало', end: 'Конец' }}>
      <StyledContainer maxWidth="xs">
        <Typography component="h1" variant="h5">
          Регистрация
        </Typography>
        <StyledForm onSubmit={handleSubmit}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="name"
            label="Имя"
            name="name"
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email"
            name="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Пароль"
            type="password"
            id="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <TextField
            select
            variant="outlined"
            margin="normal"
            fullWidth
            id="gender"
            label="Пол"
            name="gender"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
          >
            <MenuItem value="male">Мужской</MenuItem>
            <MenuItem value="female">Женский</MenuItem>
            <MenuItem value="other">Другой</MenuItem>
          </TextField>
          <DatePicker
            label="Дата рождения"
            value={dateOfBirth}
            onChange={(newValue) => setDateOfBirth(newValue)}
            slotProps={{ textField: { fullWidth: true, margin: "normal" } }}
          />
          <StyledButton
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
          >
            Зарегистрироваться
          </StyledButton>
        </StyledForm>
        <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError(null)}>
          <Alert onClose={() => setError(null)} severity="error" sx={{ width: '100%' }}>
            {error}
          </Alert>
        </Snackbar>
        <Snackbar open={success} autoHideDuration={2000} onClose={() => setSuccess(false)}>
          <Alert onClose={() => setSuccess(false)} severity="success" sx={{ width: '100%' }}>
            Регистрация успешна! Перенаправление на страницу входа...
          </Alert>
        </Snackbar>
      </StyledContainer>
    </LocalizationProvider>
  );
};

export default Register;