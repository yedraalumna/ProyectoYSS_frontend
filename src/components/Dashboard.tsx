import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  Chip,
  Alert,
  Stack,
  TextField,
  Button,
  Grid
} from '@mui/material';

import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

//Imports necesarios para acceder al rol del usuario desde Redux
import { useSelector } from 'react-redux';
import type { RootState } from '../store/index';

//Creamos el tipo itemtype. Este tipo será un objeto con un id opcional de tipo number 
//nombre, marca y tipo de tipo string y el precio de tipo number 
interface itemtype { 
  id?: number 
  nombre: string 
  marca: string 
  tipo: string 
  precio: number 
} 

//Inicializo los valores del item. Aquí no pongo el id porque no lo necesito 
const itemInitialState: itemtype = { 
  nombre: '', 
  marca: '', 
  tipo: '', 
  precio: 0 
}

const Dashboard: React.FC = () => {
  //Estado para almacenar la lista de productos mostrados en la tabla
  const [productos, setProductos] = useState<itemtype[]>([]);
  //Estado para los datos del formulario actual
  const [item, setItem] = useState<itemtype>(itemInitialState);
  //Estado para controlar si el formulario está en proceso de envío
  const [isSubmitting, setIsSubmitting] = useState(false);
  //Estado para mensajes de éxito después de una inserción exitosa
  const [success, setSuccess] = useState<string>('');
  //Estado para mensajes de error durante el proceso de inserción
  const [error, setError] = useState<string>('');

  //Obtenemos el rol del usuario desde el store de Redux
  const userRol = useSelector((state: RootState) => state.authenticator.userRol);

  //Función para cargar productos desde la base de datos SQLite
  const cargarProductos = async () => {
    try {
      const response = await fetch("http://localhost:3030/getItems");
      const data = await response.json();
      
      if (data.data) {
        setProductos(data.data);
      }
    } catch (error) {
      console.error("Error al cargar productos:", error);
      setError('Error al cargar los productos de la base de datos SQLite');
    }
  };

  //Cargar productos cuando el componente se monta
  useEffect(() => {
    cargarProductos();
  }, []);

  //Función que maneja los cambios en los campos del formulario
  //Actualiza el estado del item con los nuevos valores ingresados
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setItem(prev => ({
      ...prev,
      //Convierte el precio a número, mantiene los demás campos como string
      [name]: name === 'precio' ? parseFloat(value) || 0 : value
    }));
    
    //Limpia mensajes anteriores cuando el usuario comienza a escribir
    if (error) setError('');
    if (success) setSuccess('');
  };

  //Función principal que maneja el envío del formulario
  //Realiza la inserción de datos en la base de datos SQLite mediante una petición POST
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); //Previene el comportamiento por defecto del formulario
    
    //VALIDACIÓN DE CAMPOS OBLIGATORIOS
    //Verifica que todos los campos requeridos
    if (!item.nombre.trim() || !item.marca.trim() || !item.tipo.trim()) {
      setError('Los campos no pueden estar vacíos.');
      return;
    }

    //Validación para que el precio no sea 0 ni negativo
    if (item.precio <= 0) {
      setError('El precio debe ser mayor a 0');
      return;
    }

    //Inicia el estado de envío y limpia mensajes anteriores
    setIsSubmitting(true);
    setError('');
    setSuccess('');

    try {
      //PETICIÓN HTTP POST al endpoint /addItem del backend SQLite
      //Envía los datos del formulario en formato JSON
      const response = await fetch("http://localhost:3030/addItem", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json" 
        },
        body: JSON.stringify(item) //Convierte el objeto a JSON
      });

      //Procesa la respuesta del servidor SQLite
      const data = await response.json();

      //ADAPTACIÓN PARA SQLITE: Verificamos affectedRows directamente
      if (data.affectedRows > 0) {
        //AVISAMOS AL USUARIO QUE SE INSERTÓ CORRECTAMENTE
        alert('Datos guardados con éxito en SQLite');
        
        //FEEDBACK AL USUARIO EN LA INTERFAZ
        setSuccess('Producto insertado correctamente en la base de datos SQLite');
        setItem(itemInitialState); //Restablece el formulario a valores iniciales
        
        //RECARGAR LA LISTA DE PRODUCTOS DESDE LA BASE DE DATOS SQLite
        await cargarProductos();
        
      } else {
        throw new Error("Error al insertar el producto en la base de datos SQLite");
      }

    } catch (error) {
      //Captura y muestra errores de conexión o del servidor SQLite
      console.error("Error al insertar producto:", error);
      setError(error instanceof Error ? error.message : "Error en el servidor SQLite. Inténtalo más tarde.");
    } finally {
      //Siempre se ejecuta, haya éxito o error
      setIsSubmitting(false); //Termina el estado de envío
    }
  };

  //Función para eliminar un producto de SQLite
  const handleEliminarProducto = async (id: number) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este producto de la base de datos?')) {
      try {
        const response = await fetch(`http://localhost:3030/deleteItem?id=${id}`);
        
        const data = await response.json();
        
        //ADAPTACIÓN PARA SQLITE: Verificamos affectedRows directamente
        if (data.affectedRows > 0) {
          //Mostrar mensaje de éxito
          setSuccess('Producto eliminado correctamente de SQLite');
          
          //Recargar la lista de productos
          await cargarProductos();
          
          //Limpiar mensaje después de 3 segundos
          setTimeout(() => setSuccess(''), 3000);
        } else {
          throw new Error("Error al eliminar el producto de SQLite");
        }
      } catch (error) {
        console.error("Error al eliminar producto:", error);
        setError('Error al eliminar el producto de la base de datos SQLite');
        
        //Limpiar mensaje de error después de 3 segundos
        setTimeout(() => setError(''), 3000);
      }
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* SECCIÓN DEL FORMULARIO */}
      <Paper elevation={3} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <Typography variant="h5" component="h2" gutterBottom color="primary">
          Registro de Productos - SQLite
        </Typography>
        <Typography variant="body1" sx={{ mb: 2, color: 'text.secondary' }}>
          Complete el formulario para agregar nuevos productos a la base de datos SQLite
        </Typography>
        
        {/* ALERTAS DE FEEDBACK */}
        {/* Muestra mensaje de éxito tras inserción exitosa */}
        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}
        
        {/* Muestra mensaje de error si ocurre algún problema */}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
        {/* FORMULARIO PRINCIPAL */}
        <form onSubmit={handleSubmit}>
          <Stack spacing={3}>
            {/* LAYOUT RESPONSIVE CON GRID */}
        <Grid container spacing={2}>
  
        {/* CAMPO NOMBRE */}
        <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
                label="Nombre del Producto"
                name="nombre"
                value={item.nombre}
                onChange={handleChange}
                fullWidth
                required
                disabled={isSubmitting}
                size="small"
                placeholder="Ingrese el nombre del producto"
            />
        </Grid>
  
        {/* CAMPO MARCA */}
        <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
                label="Marca"
                name="marca"
                value={item.marca}
                onChange={handleChange}
                fullWidth
                required
                disabled={isSubmitting}
                size="small"
                placeholder="Ingrese la marca del producto"
            />
        </Grid>
  
        {/* CAMPO TIPO */}
        <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
                label="Tipo"
                name="tipo"
                value={item.tipo}
                onChange={handleChange}
                fullWidth
                required
                disabled={isSubmitting}
                size="small"
                placeholder="Ingrese el tipo de producto"
            />
        </Grid>
  
        {/* CAMPO PRECIO */}
        <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
                label="Precio"
                name="precio"
                type="number"
                value={item.precio}
                onChange={handleChange}
                fullWidth
                required
                inputProps={{ 
                    min: 0, 
                    step: 0.01 
                }}
            disabled={isSubmitting}
            size="small"
            placeholder="0.00"
            />
        </Grid>
    </Grid>

            {/* BOTÓN DE ENVÍO */}
            <Button
              variant="contained"
              type="submit"
              disabled={isSubmitting}
              sx={{ 
                py: 1.2,
                fontWeight: 'bold',
                borderRadius: 2
              }}
              fullWidth
            >
              {/* Texto dinámico según estado del envío */}
              {isSubmitting ? 'INSERTANDO EN SQLite...' : '+ INSERTAR DATOS EN SQLite'}
            </Button>
          </Stack>
        </form>
      </Paper>

      {/* SECCIÓN DE LA TABLA DE PRODUCTOS SQLite */}
      <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
        <Typography variant="h5" component="h2" gutterBottom color="secondary">
          Inventario de Productos - SQLite
        </Typography>
        
        {/* ALERTAS DE FEEDBACK PARA ELIMINACIÓN */}
        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}
        
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
        {/* ESTADO DE LA TABLA */}
        {productos.length === 0 ? (
          <Typography variant="body1" color="text.secondary" textAlign="center" sx={{ py: 4 }}>
            No hay productos registrados en la base de datos SQLite.
          </Typography>
        ) : (
          /* TABLA CON LOS PRODUCTOS REGISTRADOS EN SQLite */
          <TableContainer>
            <Table sx={{ minWidth: 650 }} aria-label="tabla de productos sqlite">
              <TableHead>
                <TableRow>
                  <TableCell><strong>Acciones</strong></TableCell>
                  <TableCell><strong>ID</strong></TableCell>
                  <TableCell><strong>Nombre</strong></TableCell>
                  <TableCell><strong>Marca</strong></TableCell>
                  <TableCell><strong>Tipo</strong></TableCell>
                  <TableCell align="right"><strong>Precio</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {productos.map((row: itemtype) => (
                  <TableRow key={row.id}>
                    <TableCell>
                      
                      {/* RENDERIZADO CONDICIONAL DEL BOTÓN */}
                      {/* Solo se muestra si userRol es 'admin' */}
                      
                      {userRol === 'admin' && (
                        <Button
                            onClick={() => handleEliminarProducto(row.id!)}
                            color="error"
                            size="small"
                            startIcon={<DeleteForeverIcon />}
                            sx={{
                            '&:hover': {
                                backgroundColor: '#ffebee'
                            }
                            }}
                        >
                            Eliminar
                        </Button>
                      )}

                    </TableCell>
                    <TableCell>{row.id}</TableCell>
                    <TableCell component="th" scope="row">{row.nombre}</TableCell>
                    <TableCell>{row.marca}</TableCell>
                    <TableCell>
                      <Chip label={row.tipo} color="primary" variant="outlined" size="small" />
                    </TableCell>
                    <TableCell align="right">${row.precio.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
    </Box>
  );
};

export default Dashboard;