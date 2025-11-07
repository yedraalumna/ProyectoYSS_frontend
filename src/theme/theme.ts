//Tema personalizado para mi aplicación (Doramas)

import { createTheme } from "@mui/material/styles";

//Creamos el tema personalizado usando la paleta elegida
const theme = createTheme({
  palette: {
    mode: "light",           //Tema claro (más acorde con la estética "doramas")
    primary: {
      main: "#e91e63",       //Rosa pastel (color protagonista)
    },
    secondary: {
      main: "#90caf9",       //Azul soft (equilibrio visual)
    },
    background: {
      default: "#fff6fb",    //Fondo muy claro (rosa/crema)
      paper: "#ffffff",      //Fondo de componentes (cards, formularios…)
    },
    text: {
      primary: "#333333",     //Texto oscuro para buen contraste
    },
  },

  typography: {
    fontFamily: "'Poppins', sans-serif", //Fuente elegante estilo Doramas
    h1: {
      fontWeight: 600,
    }
  },

  shape: {
    borderRadius: 12, //Bordes más redonditos (estética Doramas / soft UI)
  },
});

export default theme;