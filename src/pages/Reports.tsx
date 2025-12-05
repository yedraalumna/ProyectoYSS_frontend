import { Typography, Container, Button, Stack } from "@mui/material";
import { useState } from "react";

//Importamos nuestra nueva clase InformeColeccion:
import InformeColeccion from "../components/InformeColeccion";

interface itemtype {
  id?: number
  nombre: string
  marca: string
  tipo: string
  precio: number
}

export default function Reports() {
  
  // Variable para almacenar los datos (como hicimos en el paso anterior)
  const [datosInforme, setDatosInforme] = useState<itemtype[]>([]);

  //Se inicia en false porque al cargar la página aún no hemos generado nada.
  const [generarInforme, setGenerarInforme] = useState(false);

  const handleGenerarInforme = async () => {
    try {
      const response = await fetch("http://localhost:3030/getItems");
      const data = await response.json();

      if (data.data) {
        setDatosInforme(data.data);
        //Esto indica que ya tiene los datos si quiere generar el informe
        setGenerarInforme(true); 
        
        } else {
        console.warn("No se recibieron datos.");
      }
    } catch (error) {
      console.error("Error al obtener los datos:", error);
    }
  };

  return (
    <Container sx={{ mt: 5 }}>
      <Stack spacing={4} alignItems="center">
        
        <Typography variant="h3" color="secondary" textAlign="center">
          Página Reports de Yedra
        </Typography>

        <Button 
            variant="contained" 
            color="primary" 
            size="large"
            onClick={handleGenerarInforme}
            //Deshabilitar el botón si ya se está generando (si generarInforme es true)
            disabled={generarInforme} 
        >
            INFORME COLECCION
        </Button>

        {/* RENDERIZADO CONDICIONAL + PASO DE props
            Si generarInforme es true, se muestra <InformeColeccion />.
            Le pasamos la variable de estado 'datosInforme' a la prop 'productos'.
        */}
        
        {generarInforme && (
            <InformeColeccion productos={datosInforme} />
        )}

      </Stack>
    </Container>
  );
}
