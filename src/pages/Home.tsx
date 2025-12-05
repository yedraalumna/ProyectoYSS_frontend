import { Container, Typography, Stack, Button } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../store/index";  //Este import se declara como 'import type' porque si no da error
import { authActions } from "../store/authSlice";

//Importamos el hook useNavigate de react-router-dom para poder navegar entre páginas
import { useNavigate } from "react-router-dom";

//Importamos el Dashboard
import Dashboard from '../components/Dashboard';


export default function Home() {
  //Usamos useSelector para acceder al estado global
  //state.authenticator es el slice de autenticación
  const userData = useSelector((state: RootState) => state.authenticator);

  //Creamos el dispatch para poder ejecutar acciones sobre el store
  const dispatch = useDispatch();

  //Creamos el hook navigate para poder redirigir a otra ruta dentro de la aplicación
  const navigate = useNavigate();

  //Mostramos en la consola lo que tenemos en el store
  console.log("Datos del usuario desde el store:", userData);

  //Función que se ejecuta al pulsar el botón "Salir"
  const handleLogout = () => {
    //Hacemos un dispatch al store para cambiar el estado a logout
    dispatch(authActions.logout());

    //2Navegamos a la página principal ("/") tras cerrar la sesión
    navigate("/");
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 6 }}>
      <Stack spacing={3} alignItems="center">

        <Typography variant="h1" color="primary">
          Bienvenido/a
        </Typography>        

        <Typography variant="body1" align="center" sx={{ maxWidth: 350 }}>
          Home de Yedra Sánchez: Soy el usuario <strong>"{userData.userName}"</strong> y tengo el rol de <strong>"{userData.userRol}"</strong>.
        </Typography>

        {/* Botón "Salir" con el mismo estilo pastel que en Login */}
        <Button
          variant="contained"
          color="primary"
          onClick={handleLogout} //Ejecuta la función handleLogout al hacer clic
        >
          Salir
        </Button>

        <Dashboard/>

      </Stack>
    </Container>
  );
}