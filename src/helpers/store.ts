import { configureStore, Store } from "@reduxjs/toolkit";
import todoSlice from "./todoSlice";


export const store = configureStore({
    reducer: {
        todo: todoSlice
    }
})

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch