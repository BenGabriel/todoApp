import { createSlice } from "@reduxjs/toolkit";
import { openDatabase } from "expo-sqlite";

const db = openDatabase("MainDB");

export type TodoITem = {
    id: number,
    todo: string
}

const addTodB = (todo: string, id: number) => {
    db.transaction(async (tx) => {
        tx.executeSql(
            "INSERT INTO Todos (TodoId, Todo) VALUES(?,?)",
            [id, todo],
            (_, res) => { console.log(res, 'ress') }
        )
    })
}

const deleteFromDb = (id: number) => {
    db.transaction(tx => {
        tx.executeSql(
            "DELETE FROM Todos WHERE TodoId=(?)",
            [id],
        )
    })
}


const todoSlice = createSlice({
    name: "todo",
    initialState: [] as TodoITem[],
    reducers: {
        getTodo: (state, action) => {
            state.push(...action.payload)
        },
        addTodo: (state, action) => {
            const newTodo: TodoITem = {
                id: action.payload.id,
                todo: action.payload.todo
            }
            addTodB(
                action.payload.todo,
                action.payload.id
            )
            state.push(newTodo)
        },
        deleteTodo: (state, action) => {
            deleteFromDb(action.payload)
            const index = state.findIndex((todo) => todo.id === action.payload);
            state.splice(index, 1)
        }

    },

})

export const { addTodo, getTodo, deleteTodo } = todoSlice.actions

export default todoSlice.reducer