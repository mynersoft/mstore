import { configureStore } from "@reduxjs/toolkit";
import productReducer from "./productSlice";
import investReducer from "./investSlice";
import dueReducer from "./duesSlice";
import saleReducer from "./saleSlice";
import serviceReducer from "./serviceSlice";
import categoryReducer from "./categorySlice";
import brandReducer from "./brandsSlice";
import saleprofitReducer from "./saleprofitSlice";

export const store = configureStore({
	reducer: {
		products: productReducer,
		categories: categoryReducer,
		brands: brandReducer,
		service: serviceReducer,
		dues: dueReducer,
		sales: saleReducer,
		saleprofit: saleprofitReducer,
invest: investReducer,
	},
});




