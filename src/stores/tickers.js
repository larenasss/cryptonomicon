import { defineStore } from 'pinia';

const getTickers = () => {
  const tickersData = localStorage.getItem('criptonomicon-list');
  return JSON.parse(tickersData);
};

export const useTickersStore = defineStore('tickers', {
  state: () => ({
    tickers: getTickers() || [],
  }),
  actions: {
    addTicker(newTicker) {
      this.$patch((state) => {
        state.tickers.unshift(newTicker);
      });
    },
    deleteTicker(tickerToRemove) {
      this.$patch((state) => {
        state.tickers = state.tickers.filter(t => t !== tickerToRemove);
      });
    }
  }
});