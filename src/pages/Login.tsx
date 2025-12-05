//Página de Login usando nuestro tema pastel Doramas
//FORMULARIO con onSubmit, required y type="password"

import React, { useState } from "react";

import {
  Container,
  TextField,
  Button,
  Typography,
  Card,
  CardContent,
  Stack,
  Box,
  Alert, //Componente MUI para mostrar éxito o error
} from "@mui/material";  //Imports escritos asi para mejor entendimiento y repartición

import LockIcon from "@mui/icons-material/Lock";

import { useNavigate } from "react-router-dom"; //Importamos el hook para navegar
import { useDispatch } from "react-redux"; // CORRECCIÓN: Importar useDispatch
import { authActions } from "../store/authSlice"; // CORRECCIÓN: Importar acciones

export default function Login() {
  //Hook para poder navegar entre páginas
  const navigate = useNavigate();
  
  // CORRECCIÓN CRÍTICA: Agregar dispatch para actualizar Redux
  const dispatch = useDispatch();

  //Contraseña "simulada" para ambos usuarios
  const bdpasswd = "1234";

  //useState para guardar los datos del formulario (usuario y contraseña)
  const [data, setData] = useState({
    usuario: "",
    password: "",
  });

  //Estado para mostrar error si los datos son incorrectos
  const [error, setError] = useState(false);

  //Función que recoge lo que escribimos en los TextField
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({
      ...data,
      [e.target.name]: e.target.value, //actualiza el campo correspondiente
    });
  };

  //Función que se ejecuta cuando hacemos submit (picamos en "Acceder")
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); 

    /* Lógica para admitir dos usuarios y asignar roles distintos
    Usuario 1: yedra (admin)
    Usuario 2: user (user) */
    
    //Verificamos si la contraseña es correcta
    if (data.password === bdpasswd) {
        
        //Caso ADMIN
        if (data.usuario === "yedra") {
             dispatch(authActions.login({
                name: "yedra",
                rol: "admin" //Asignamos rol admin
             }));
             navigate("/home");
             return;
        }

        //Caso USER
        if (data.usuario === "user") {
            dispatch(authActions.login({
                name: "user",
                rol: "user" //Asignamos rol user
             }));
             navigate("/home");
             return;
        }

        //Si la contraseña es correcta pero el usuario no es ninguno de los dos
        setError(true);

    } else {
      //Contraseña incorrecta
      setError(true);
    }
  };

  return (
      <Container
        maxWidth="sm"
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh", //ocupa toda la pantalla
        }}
      >
        <Card sx={{ width: "100%", borderRadius: 3, boxShadow: 4 }}>
          <CardContent>
            <Stack spacing={2} alignItems="center">
              <Typography variant="h6" color="primary">
                Sistema de acceso
              </Typography>
  
              <LockIcon color="secondary" />
  
              {/* FORMULARIO  */}
              <Box
                component="form"
                onSubmit={handleSubmit} 
                sx={{ width: "100%" }}
              >
                <TextField
                  fullWidth
                  label="Usuario"
                  name="usuario" 
                  value={data.usuario}
                  onChange={handleChange}
                  required 
                  sx={{ backgroundColor: "white", borderRadius: 1, mb: 2 }}
                  placeholder="Prueba con 'yedra' o 'user'"
                />
 
                <TextField
                  fullWidth
                  type="password" 
                  label="Contraseña"
                  name="password"
                  value={data.password}
                  onChange={handleChange}
                  required 
                  sx={{ backgroundColor: "white", borderRadius: 1, mb: 2 }}
                />
 
                <Button variant="contained" fullWidth type="submit">
                  ACCEDER
                </Button>
              </Box>
 
              {error && (
                <Alert severity="error" sx={{ width: "100%" }}>
                  Usuario no reconocido o contraseña incorrecta.
                </Alert>
              )}
              </Stack>
          </CardContent>
        </Card>
      </Container>
    );
  }