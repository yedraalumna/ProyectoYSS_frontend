//Página de Login usando mi tema pastel (basado en Doramas)
import { Container, Typography, Button, Stack } from "@mui/material";

export default function Login() {
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

        {/* Botones usando MI paleta personalizada */}
        <Stack direction="row" spacing={2}>
          <Button variant="contained" color="primary">Entrar</Button>
          <Button variant="outlined" color="secondary">Registrarse</Button>
          <Button variant="text" color="primary">Cancelar</Button>
          <Button variant="contained" color="error">Error</Button>
          <Button variant="contained" color="success">Success</Button>
          <Button variant="contained" color="warning">Alert</Button>  {/* Se llama Warning porque en MUI no hay alert"*/}
        </Stack>

      </Stack>
    </Container>
  );
}