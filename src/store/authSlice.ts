import { createSlice } from '@reduxjs/toolkit' // Importamos la función createSlice de la librería redux-toolkit

//Creamos el tipo AuthState. Este tipo será un objeto cuyos elementos son un boolean y dos strings.
export interface AuthState {
    isAutenticated: boolean,
    userName: string,
    userRol: string
}

//Declaramos la variable initialAuthState (que es un objeto) y decimos que es del tipo AuthState.
//Inicializamos los elementos de dicha variable:
//El usuario inicialmente no está autenticado (isAutenticated: false)
//El nombre de usuario y su rol inicialmente son cadenas vacías.
const initialAuthState: AuthState = {
    isAutenticated: false,
    userName: '',
    userRol: ''
}

//Creamos los reducers dentro de la función createSlice y los asignamos a la variable authSlice:
//. Primero le damos un nombre
//. Segundo establecemos el estado inicial
//. Tercero creamos los reducers: login y logout
const authSlice = createSlice({
    name: 'authentication',
    initialState: initialAuthState,
    reducers: {

    //El reducer login: el usuario está autenticado. Ya tenemos el nombre y rol de usuario en action.payload
    login: (state, action) => {
        const userData = action.payload //Obtenemos el nombre y rol de usuario y lo asignamos a la variable userData
        state.isAutenticated = true //Establecemos a true isAutenticated en la store
        state.userName = userData.name //Es lo mismo que: action.payload.name --> Establecemos el nombre de usuario en la store
        state.userRol = userData.rol //Es lo mismo que: action.payload.rol --> Establecemos el rol de usuario en la store
    },

//El reducer logout es cuando el usuario no está autenticado. No hay que hacer ninguna action puesto
//que no recibimos ningún dato del usuario.
    logout: (state) => {
        state.isAutenticated = false;
      state.userName = '';
      state.userRol = '';
    }
  }
});

//Exportamos las acciones del reducer en la variable authActions
export const authActions = authSlice.actions
//Exportamos el reducer en sí
export default authSlice.reducer
