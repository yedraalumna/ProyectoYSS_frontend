//Página de Login usando mi tema pastel (basado en Doramas)
import { Container, Typography, Button, Stack, TextField } from "@mui/material";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { authActions } from "../store/authSlice";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const dispatch = useDispatch();
    const navigate = useNavigate();

  //Estados locales para almacenar usuario y contraseña ingresados
  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');

  //Función que se ejecuta al pulsar "Entrar"
  const handleLogin = () => {
  if (user === 'admin' && password === '1234') {
    dispatch(authActions.login({
      name: user,
      rol: 'administrador'
    }));

    alert('Login correcto');
    navigate('/home');
  } else {
    alert('Usuario y/o contraseña incorrectos');
  }
};

  return (
    //Container centra el contenido y da margen superior
    <Container maxWidth="sm" sx={{ mt: 6 }}>
      
      {/* Stack organiza en columna y deja espacio entre elementos */}
      <Stack spacing={3} alignItems="center">

        {/* Variantes de Typography con colores del tema */}
        <Typography variant="h1" color="primary">
          Login
        </Typography>

        <Typography variant="h2" color="secondary">
          Bienvenido/a
        </Typography>

        <Typography variant="subtitle1" color="text.primary">
          Accede para continuar
        </Typography>

        {/* body1 → texto normal */}
        <Typography variant="body1" align="center" sx={{ maxWidth: 350 }}>
          Esta aplicación está diseñada con React + Typescript y un tema pastel inspirado en Doramas.
        </Typography>

        {/* caption → texto pequeño */}
        <Typography variant="caption" color="primary">
          *Diseño suave y minimalista*
        </Typography>

        {/* Inputs usuario y contraseña separados para no entorpecer con el resto de botones... */}
        <Stack spacing={2} sx={{ width: '100%' }}>
          <TextField
            label="Usuario"
            value={user}
            onChange={(e) => setUser(e.target.value)}
            fullWidth
          />
          <TextField
            label="Contraseña"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
          />
        </Stack>

        {/* Botones usando MI paleta personalizada */}
        <Stack direction="row" spacing={2}>
          {/* Aquí conectamos el botón con handleLogin */}
          <Button variant="contained" color="primary" onClick={handleLogin}>Entrar</Button>
          <Button variant="outlined" color="secondary">Registrarse</Button>
          <Button variant="text" color="primary">Cancelar</Button>
          <Button variant="contained" color="error">Error</Button>
          <Button variant="contained" color="success">Success</Button>
          <Button variant="contained" color="warning">Alert</Button>  {/* Se llama Warning porque en MUI no hay alert */}
        </Stack>

      </Stack>
    </Container>
  );
}
