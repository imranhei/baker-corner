import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./auth-slice";
import categorySlice from "./admin/category-slice.js";
import itemSlice from "./admin/item-slice.js";
import receiveSlice from "./admin/receive-slice.js";
import dispatchSlice from "./admin/dispatch-slice.js";
import stockSlice from "./admin/stock-slice.js";
import summaryReducer from "./admin/summary-slice.js";
import recentSalesReducer from "./admin/recent-sales-slice.js";

const store = configureStore({
  reducer: {
    auth: authSlice,
    categories: categorySlice,
    items: itemSlice,
    receives: receiveSlice,
    dispatches: dispatchSlice,
    stocks: stockSlice,
    summary:summaryReducer,
    recentSales:recentSalesReducer
  },
});
export default store;