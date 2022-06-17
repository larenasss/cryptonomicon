import { useTickersStore } from "@/stores/tickers";
import { storeToRefs } from 'pinia';
import { subscribeToTicker, unSubscribeFromTicker } from '@/api';
import { ref, watch } from 'vue';
import { useGraphManagement } from '@/use/useGraphManagement';

export function useTickersManagement() {
  const storeTickers = useTickersStore();
  const { tickers } = storeToRefs(storeTickers);
  const selectedTicker = ref(null);
  const graph = ref([]);
  const graphContainer = ref(null);
  const { addGraphElem } = useGraphManagement(graph, graphContainer);

  watch(selectedTicker, () => {
    graph.value = [];
  });

  watch(() => tickers.value.length, () => {
    localStorage.setItem('criptonomicon-list', JSON.stringify(tickers.value));
  });

  tickers.value.forEach(ticker => {
    subscribeToTicker(ticker.name, (newPrice) => updateTicker(ticker.name, newPrice));
  });

  const selectTicker = ticker => {
    selectedTicker.value = ticker;
  };

  const addTicker = newTicker => {
    storeTickers.addTicker(newTicker);
    subscribeToTicker(newTicker.name, (newPrice) => updateTicker(newTicker.name, newPrice));
  };

  const deleteTicker = tickerToRemove => {
    storeTickers.deleteTicker(tickerToRemove);
    if (selectedTicker.value === tickerToRemove) {
      selectedTicker.value = null;
    }
    unSubscribeFromTicker(tickerToRemove.name);
  };

  function updateTicker(tickerName, price) {
    tickers.value
      .filter(t => t.name === tickerName)
      .forEach(t => {
        if (t === selectedTicker.value) {
          addGraphElem(price);
        }
        t.price = price;
      }
    );
  }

  return {
    tickers,
    selectedTicker,
    graph,
    selectTicker,
    addTicker,
    deleteTicker,
    graphContainer
  };
}