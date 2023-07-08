// import { localCardsSlice } from './../components/card-list/loacl-cards-slice';
import { configureStore } from "@reduxjs/toolkit";
import cardDataSlice from '@/components/card/card-data-slice';
import localCardsSlice from '@/components/card-list/loacl-cards-slice';

export default configureStore({
  reducer: {
    cardDataSlice,
    localCardsSlice
  },
});
