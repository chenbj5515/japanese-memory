import { configureStore } from "@reduxjs/toolkit";
import cardDataSlice from '@/components/card/card-data-slice';

export default configureStore({
  reducer: {
    cardDataSlice
  },
});
