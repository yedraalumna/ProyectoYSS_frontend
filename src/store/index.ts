import { configureStore } from '@reduxjs/toolkit'
import authReducer from './authSlice' //Importamos el reducer

export const store = configureStore({
    reducer: { 
        authenticator: authReducer, //Aquí configuramos la store con el reducer creado en el Slice
    },
})

// Infer the `RootState` and `AppDispatch` types from the store itself: tipos para typescript
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}: tipos para typescript
export type AppDispatch = typeof store.dispatch
