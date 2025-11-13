//Página de error personalizada (404)

import { useRouteError } from "react-router-dom"; //Hook para obtener el error
import { Container, Typography, Button, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function ErrorPage() {
  //Hook que nos da información sobre el error
  const error: any = useRouteError();

  //Hook para poder volver al inicio si el usuario quiere
  const navigate = useNavigate();

  return (
    <Container
      sx={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Stack spacing={3} alignItems="center">
        {/* Título principal */}
        <Typography variant="h3" color="primary">
          ¡Vaya! Algo salió mal
        </Typography>

        {/* Mostramos el tipo de error recibido */}
        <Typography variant="body1" color="text.secondary" textAlign="center">
          {error.statusText || error.message || "Página no encontrada."}
        </Typography>

        {/* Botón para volver al Login */}
        <Button
          variant="contained"
          color="secondary"
          onClick={() => navigate("/")}
        >
          Volver al inicio
        </Button>
      </Stack>
    </Container>
  );
}
