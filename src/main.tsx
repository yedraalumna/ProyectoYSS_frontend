import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import theme from "./theme/theme"; //Importamos el tema personalizado

//Componentes de MUI necesarios para aplicar el tema
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    {/* Usamos el tema para toda la app */}
    <ThemeProvider theme={theme}>
      <CssBaseline /> {/* Resetea estilos del navegador */}
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
