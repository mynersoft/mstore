import { configureStore } from "@reduxjs/toolkit";
import productReducer from "./productSlice";
import dueReducer from "./dueSlice"

export const store = configureStore({
	reducer: { products: productReducer,
dues:dueReducer },
});
