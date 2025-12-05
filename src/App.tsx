  //Estructura de navegación con React Router DOM
  //Página inicial: Login
  //Otras páginas: Home, Reports y ErrorPage

  import './App.css';
  import Login from './pages/Login';
  import Home from './pages/Home';
  import Reports from './pages/Reports';
  import ErrorPage from "./pages/ErrorPage";
  import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
  import { useSelector } from 'react-redux';
  import type { RootState } from './store/index';
  import Menu from "./components/Menu"; //IMPORTAMOS EL MENÚ
  import React from "react";

  //Componente para proteger las rutas
  function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const isAuth = useSelector(
      (state: RootState) => state.authenticator.isAutenticated
    );

    return isAuth ? children : <Navigate to="/" replace />;
  }

  //Definimos las rutas del proyecto
  const router = createBrowserRouter([
    {
      path: "/",
      errorElement: <ErrorPage />, //Página de error personalizada
      children: [
        {
          index: true, //Página principal
          element: <Login />, //muestra Login al entrar en "/"
        },
        {
          path: "home",
          element: (
            <ProtectedRoute>
              {/* Envolvemos Home con el menú */}
              <Menu>
                <Home />
              </Menu>
            </ProtectedRoute>
          ),
        },
        {
          path: "reports",
          element: (
            <ProtectedRoute>
              {/* Envolvemos Reports con el menú */}
              <Menu>
                <Reports />
              </Menu>
            </ProtectedRoute>
          ),
        },
      ],
    },
  ]);

  //Componente principal que renderiza el Router
  function App() {
    return (
      //'RouterProvider' activa el sistema de rutas
      <RouterProvider router={router} />
    )
  }

  export default App