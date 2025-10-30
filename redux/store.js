import { configureStore } from "@reduxjs/toolkit";
import productReducer from "./productSlice";
import dueReducer from "./dueSlice";
import serviceReducer from "./serviceSlice";
import categoryReducer from "./categorySlice";
import brandReducer from "./brandSlice";
import subCategoryReducer from "./subCategorySlice";


export const store = configureStore({
  reducer: {
    products: productReducer,
    categories: categoryReducer,
    brands: brandReducer,
service: serviceReducer,
		dues:dueReducer,
    subCategories: subCategoryReducer,
  },
});
