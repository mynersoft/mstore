import { configureStore } from "@reduxjs/toolkit";
import productReducer from "./productSlice";
import dueReducer from "./dueSlice";
import serviceReducer from "./serviceSlice";

export const store = configureStore({
	reducer: {
		products: productReducer,
		service: serviceReducer,
		dues:dueReducer },
});
