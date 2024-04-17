import { configureStore } from "@reduxjs/toolkit"
import { chessReducer } from "./chess/chessReducer"

const store = configureStore({ reducer: { chess: chessReducer } })

export default store
