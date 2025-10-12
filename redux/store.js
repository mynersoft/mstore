import { configureStore } from "@reduxjs/toolkit";
import productReducer from "./productSlice";
import duesReducer from "./duesSlice"

export const store = configureStore({
	reducer: { products: productReducer,
dues:duesReducer },
});
