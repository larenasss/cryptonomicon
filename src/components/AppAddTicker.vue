<template>
  <div class="flex">
    <div class="max-w-xs">
      <label for="wallet" class="block text-sm font-medium text-gray-700"
        >Тикер</label
      >
      <div class="mt-1 relative rounded-md shadow-md">
        <app-input
          :type="'text'"
          :name="'wallet'"
          :id="'wallet'"
          :placeholder="'Например DOGE'"
          v-model="tickerValue"
          class="block w-full pr-10 border-gray-300 text-gray-900 focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm rounded-md"
        >
        </app-input>
      </div>
      <app-input-hints
        class="flex bg-white shadow-md p-1 rounded-md flex-wrap"
        @selectHint="addTicker"
        :hints="coinList"
        :maxCount="4"
        :trackValue="tickerValue"
      >
      </app-input-hints>
      <div class="text-sm text-red-600" v-if="error">{{error}}</div>
    </div>
  </div>
  <button
    type="button"
    class="my-4 inline-flex items-center py-2 px-4 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-full text-white bg-gray-600 hover:bg-gray-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
    @click="addTicker(tickerValue)"
  >
    <!-- Heroicon name: solid/mail -->
    <plus-sing-icon></plus-sing-icon>
    Добавить
  </button>
</template>

<script>
import { ref, watch } from 'vue';

import AppInput from '@/components/AppInput.vue';
import PlusSingIcon from '@/components/ui/PlusSingIcon.vue';
import AppInputHints from '@/components/AppInputHints.vue';

import { useTickersStore } from '@/stores/tickers';
import { getAllCoins } from '@/api/coins';

export default {
  components: {
    PlusSingIcon,
    AppInput,
    AppInputHints
  },
  emits: { addTicker: null },
  setup(_, { emit }) {
    const tickerValue = ref("");
    const error = ref(null);
    const coinList = ref([]);
    const store = useTickersStore();

    getAllCoins().then(res => coinList.value = res);

    watch(tickerValue, () => error.value = null);

    const selectCoin = coin => {
      tickerValue.value = coin;
      emit(selectCoin, tickerValue.value);
    };

    const addTicker = tickerName => {
      if (!tickerName) {
        error.value = 'Укажите название тикера';
        return;
      }

      const isExist = store.tickers.some(t => t.name.toLowerCase() == tickerName.toLowerCase());
      if (isExist) {
        error.value = 'Такой тикер уже добавлен';
        return;
      }

      const newTicker = {
        name: tickerName,
        price: 0
      };

      emit('addTicker', newTicker);
      tickerValue.value = "";
    };

    return {
      tickerValue,
      selectCoin,
      error,
      addTicker,
      coinList
    };
  }
};
</script>