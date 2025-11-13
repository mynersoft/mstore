import { configureStore } from "@reduxjs/toolkit";
import productReducer from "./productSlice";
import dueReducer from "./duesSlice";
import saleReducer from "./saleSlice";
import serviceReducer from "./serviceSlice";
import categoryReducer from "./categorySlice";
import brandReducer from "./brandsSlice";
import subCategoryReducer from "./subCategoriesSlice";

export const store = configureStore({
	reducer: {
		products: productReducer,
		categories: categoryReducer,
		brands: brandReducer,
		service: serviceReducer,
		dues: dueReducer,
		sales: saleReducer,
		subCategories: subCategoryReducer,
	},
});
