import { configureStore } from "@reduxjs/toolkit";
import productReducer from "./productSlice";
import investReducer from "./investSlice";
import dueReducer from "./duesSlice";
import saleReducer from "./saleSlice";
import serviceReducer from "./serviceSlice";
import categoryReducer from "./categorySlice";
import brandReducer from "./brandsSlice";
import saleprofitReducer from "./saleprofitSlice";
import transactionReducer from "./transactionSlice";
import aybayReducer from "./slices/aybaySlice";

import billReducer from "./billSlice";

export const store = configureStore({
	reducer: {
		products: productReducer,
		categories: categoryReducer,
		brands: brandReducer,
		service: serviceReducer,
		dues: dueReducer,
		sales: saleReducer,
bills: billReducer,
aybay: aybayReducer,
		saleprofit: saleprofitReducer,
invest: investReducer,
transactions: transactionReducer
	},
});




