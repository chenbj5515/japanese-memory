import { configureStore } from "@reduxjs/toolkit";
import cardDataSlice from '@/components/card/card-data-slice';
import localCardsSlice from '@/components/card-list/loacl-cards-slice';
import historyListsSlice from '@/components/card-list/history-lists-slice';


export default configureStore({
  reducer: {
    cardDataSlice,
    localCardsSlice,
    historyListsSlice
  },
});
