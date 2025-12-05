import React, { useState, useEffect, useMemo } from 'react';

// LIBRERIA DE DRAG & DROP
import { 
  DragDropContext, 
  Droppable, 
  Draggable,
  type DropResult
} from '@hello-pangea/dnd';

// LIBRERIAS PARA PDF
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// MATERIAL UI
import { 
  Typography, Box, Paper, Chip, IconButton, 
  TextField, Menu, MenuItem, Checkbox, FormControlLabel,
  Tooltip
} from '@mui/material';

// ICONOS
import DragIndicatorIcon from '@mui/icons-material/DragIndicator'; 
import FilterListIcon from '@mui/icons-material/FilterList';
import ViewColumnIcon from '@mui/icons-material/ViewColumn';
import DownloadIcon from '@mui/icons-material/Download';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import InventoryIcon from '@mui/icons-material/Inventory';

//TIPOS DE DATOS:
interface itemtype {
  id: string;
  nombre: string;
  marca: string;
  tipo: string;
  precio: number;
  [key: string]: any; 
}

interface ColumnConfig {
  id: string;
  label: string;
  visible: boolean;
  width: string;
  filterable: boolean;
}

interface InformeColeccionProps {
  productos: any[];
}

const InformeColeccion: React.FC<InformeColeccionProps> = ({ productos }) => {

  // ESTADOS:
  const [items, setItems] = useState<itemtype[]>([]);
  
  //Configuracion de Columnas (Orden fijo, pero visibilidad modificable)
  const [columns, setColumns] = useState<ColumnConfig[]>([
    { id: 'handle', label: '::', visible: true, width: '60px', filterable: false },
    { id: 'nombre', label: 'Nombre', visible: true, width: '30%', filterable: false },
    { id: 'marca', label: 'Marca', visible: true, width: '25%', filterable: true },
    { id: 'tipo', label: 'Tipo', visible: true, width: '20%', filterable: true },
    { id: 'precio', label: 'Precio', visible: true, width: '20%', filterable: false },
  ]);

  const [filters, setFilters] = useState({ marca: '', tipo: '' });
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  // CARGA DE DATOS:
  useEffect(() => {
    const data = (productos || []).map((p, index) => ({
      ...p,
      id: p.id ? p.id.toString() : `item-${index}`,
      precio: Number(p.precio) || 0
    }));
    setItems(data);
  }, [productos]);

  // LÓGICA DE FILTRADO:
  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const matchMarca = item.marca.toLowerCase().includes(filters.marca.toLowerCase());
      const matchTipo = item.tipo.toLowerCase().includes(filters.tipo.toLowerCase());
      return matchMarca && matchTipo;
    });
  }, [items, filters]);

  const precioTotal = filteredItems.reduce((acc, item) => acc + item.precio, 0);

  // DRAG & DROP (SOLO FILAS):
  const onDragEnd = (result: DropResult) => {
    //Si soltamos fuera o en el mismo sitio, no hacemos nada
    if (!result.destination) return;
    if (result.destination.index === result.source.index) return;

    //Bloqueamos movimiento si hay filtros (para evitar errores visuales)
    if (filters.marca || filters.tipo) return; 

    //Reordenamos SOLO las filas
    const newItems = Array.from(items);
    const [removed] = newItems.splice(result.source.index, 1);
    newItems.splice(result.destination.index, 0, removed);
    setItems(newItems);
  };

  // EXPORTACIÓN:
  const handleExportCSV = () => {
    const visibleCols = columns.filter(c => c.visible && c.id !== 'handle');
    const headers = visibleCols.map(c => c.label).join(',');
    const rows = filteredItems.map(item => 
      visibleCols.map(col => item[col.id]).join(',')
    ).join('\n');

    const csvContent = `data:text/csv;charset=utf-8,${headers}\n${rows}`;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "informe_coleccion.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Informe de Colección", 14, 22);
    doc.setFontSize(11);
    doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 14, 30);

    const visibleCols = columns.filter(c => c.visible && c.id !== 'handle');
    const tableHeaders = visibleCols.map(c => c.label);
    const tableBody = filteredItems.map(item => 
        visibleCols.map(col => {
            if (col.id === 'precio') return `${item.precio.toFixed(2)} €`;
            return item[col.id];
        })
    );

    autoTable(doc, {
        head: [tableHeaders],
        body: tableBody,
        startY: 35,
        theme: 'grid',
        headStyles: { fillColor: [233, 30, 99] }, 
    });

    const finalY = (doc as any).lastAutoTable.finalY + 10;
    doc.setFontSize(14);
    doc.text(`TOTAL COLECCIÓN: ${precioTotal.toFixed(2)} €`, 14, finalY);
    doc.save("informe_coleccion.pdf");
  };

  // RENDERIZADO:
  return (
    <Box sx={{ 
      height: '650px', 
      width: '100%',
      maxWidth: '1200px', 
      margin: '0 auto',   
      display: 'flex', 
      flexDirection: 'column', 
      bgcolor: '#fff',
      overflow: 'hidden',
      boxShadow: 3,       
      borderRadius: 2,    
      mt: 2               
    }}>

      {/* BARRA SUPERIOR */}
      <Paper elevation={0} sx={{ 
        p: 2, bgcolor: '#e91e63', color: 'white', borderRadius: '8px 8px 0 0', zIndex: 20,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <InventoryIcon />
            <Typography variant="h6" fontWeight="bold">Informe de Colección</Typography>
        </Box>
        <Box>
            <Tooltip title="Descargar CSV">
                <IconButton onClick={handleExportCSV} sx={{ color: 'white' }}><DownloadIcon /></IconButton>
            </Tooltip>
            <Tooltip title="Descargar PDF">
                <IconButton onClick={handleExportPDF} sx={{ color: 'white' }}><PictureAsPdfIcon /></IconButton>
            </Tooltip>
            <Tooltip title="Configurar Columnas">
                <IconButton onClick={(e) => setAnchorEl(e.currentTarget)} sx={{ color: 'white' }}>
                    <ViewColumnIcon />
                </IconButton>
            </Tooltip>
        </Box>
      </Paper>

      {/* MENÚ VISIBILIDAD DE COLUMNAS */}
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
        {columns.map(col => (
           col.id !== 'handle' && (
             <MenuItem key={col.id}>
               <FormControlLabel
                 control={
                   <Checkbox 
                     checked={col.visible} 
                     onChange={(e) => {
                        const newCols = columns.map(c => c.id === col.id ? {...c, visible: e.target.checked} : c);
                        setColumns(newCols);
                     }}
                   />
                 }
                 label={col.label}
               />
             </MenuItem>
           )
        ))}
      </Menu>

      {/* FILTROS */}
      <Box sx={{ p: 2, bgcolor: '#fce4ec', display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
         <FilterListIcon color="action" />
         <Typography variant="body2" fontWeight="bold" color="text.secondary">FILTROS:</Typography>
         <TextField 
            label="Marca" variant="outlined" size="small" sx={{ bgcolor: 'white' }}
            value={filters.marca} onChange={(e) => setFilters({...filters, marca: e.target.value})}
         />
         <TextField 
            label="Tipo" variant="outlined" size="small" sx={{ bgcolor: 'white' }}
            value={filters.tipo} onChange={(e) => setFilters({...filters, tipo: e.target.value})}
         />
         {(filters.marca || filters.tipo) && (
            <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic' }}>
               (Reordenamiento desactivado durante filtrado)
            </Typography>
         )}
      </Box>

      {/* TABLA (SOLO FILAS ARRASTRABLES) */}
      <DragDropContext onDragEnd={onDragEnd}>
        
        {/* CABECERA FIJA */}
        <Box sx={{ bgcolor: '#eee', borderBottom: '1px solid #ddd', overflowX: 'auto', display: 'flex' }}>
            {columns.map((col) => (
                col.visible && (
                    <Box 
                        key={col.id}
                        sx={{
                            width: col.width,
                            minWidth: col.id === 'handle' ? '60px' : '100px',
                            flexShrink: 0,
                            p: 1.5,
                            fontWeight: 'bold',
                            textTransform: 'uppercase',
                            fontSize: '0.85rem',
                            color: '#e91e63',
                            borderRight: '1px solid #ddd',
                            userSelect: 'none'
                        }}
                    >
                        {col.label}
                    </Box>
                )
            ))}
        </Box>

        {/* CUERPO (FILAS ARRASTRABLES) */}
        <Box sx={{ flexGrow: 1, overflowY: 'auto', bgcolor: '#f5f5f5' }}>
            <Droppable droppableId="board-rows" type="ROW">
                {(provided) => (
                    <Box ref={provided.innerRef} {...provided.droppableProps} sx={{ minWidth: '100%' }}>
                        {filteredItems.map((item, index) => (
                            <Draggable 
                                key={item.id} draggableId={item.id} index={index} 
                                isDragDisabled={Boolean(filters.marca || filters.tipo)}
                            >
                                {(provided, snapshot) => (
                                    <Box
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        sx={{
                                            display: 'flex',
                                            bgcolor: snapshot.isDragging ? '#e3f2fd' : 'white',
                                            borderBottom: '1px solid #eee',
                                            '&:hover': { bgcolor: '#fafafa' },
                                            ...provided.draggableProps.style
                                        }}
                                    >
                                        {columns.map(col => {
                                            if (!col.visible) return null;
                                            return (
                                                <Box key={col.id} sx={{ 
                                                    width: col.width, 
                                                    minWidth: col.id === 'handle' ? '60px' : '100px',
                                                    flexShrink: 0, p: 2, display: 'flex', alignItems: 'center'
                                                }}>
                                                    {col.id === 'handle' ? (
                                                        <Box {...provided.dragHandleProps} sx={{ 
                                                            cursor: filters.marca || filters.tipo ? 'not-allowed' : 'grab', 
                                                            opacity: 0.5, '&:hover': { opacity: 1, color: '#e91e63' },
                                                            width: '100%', display: 'flex', justifyContent: 'center'
                                                        }}>
                                                            <DragIndicatorIcon />
                                                        </Box>
                                                    ) : col.id === 'precio' ? (
                                                        <Typography fontWeight="bold">{item.precio.toFixed(2)} €</Typography>
                                                    ) : col.id === 'tipo' ? (
                                                        <Chip label={item.tipo} size="small" variant="outlined" />
                                                    ) : (
                                                        <Typography variant="body2">{item[col.id]}</Typography>
                                                    )}
                                                </Box>
                                            );
                                        })}
                                    </Box>
                                )}
                            </Draggable>
                        ))}
                        {provided.placeholder}
                    </Box>
                )}
            </Droppable>
        </Box>

      </DragDropContext>

      {/* TOTAL (PIE FIJO) */}
      <Paper elevation={0} sx={{ 
          p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          bgcolor: 'white', borderTop: '2px solid #e91e63', borderRadius: '0 0 8px 8px', zIndex: 20
      }}>
          <Typography variant="body2" color="text.secondary">
             {filteredItems.length} productos
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
             <Typography variant="h6" sx={{ color: '#666' }}>TOTAL:</Typography>
             <Typography variant="h4" color="#e91e63" fontWeight="bold">
                 {precioTotal.toFixed(2)} €
             </Typography>
          </Box>
      </Paper>

    </Box>
  );
}

export default InformeColeccion;