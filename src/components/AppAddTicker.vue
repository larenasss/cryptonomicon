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
          v-model="tickerName"
          class="block w-full pr-10 border-gray-300 text-gray-900 focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm rounded-md"
        >
        </app-input>
      </div>
      <div class="flex bg-white shadow-md p-1 rounded-md flex-wrap" v-if="coinListModel.length">
        <span
          v-for="coin in coinListModel"
          :key="coin"
          @click="$emit('addTicker', coin)"
          class="inline-flex items-center px-2 m-1 rounded-md text-xs font-medium bg-gray-300 text-gray-800 cursor-pointer">
          {{ coin }}
        </span>
      </div>
      <div class="text-sm text-red-600" v-if="error">{{error}}</div>
    </div>
  </div>
  <button
    type="button"
    class="my-4 inline-flex items-center py-2 px-4 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-full text-white bg-gray-600 hover:bg-gray-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
    @click="$emit('addTicker', tickerName)"
  >
    <!-- Heroicon name: solid/mail -->
    <plus-sing-icon></plus-sing-icon>
    Добавить
  </button>
</template>

<script>
import { ref, toRefs, watch } from 'vue';

import AppInput from '@/components/AppInput.vue';
import PlusSingIcon from '@/components/ui/PlusSingIcon.vue';

export default {
  components: {
    PlusSingIcon,
    AppInput
  },
  emits: { addTicker: null },
  props: {
    coinList: {
      type: Array
    },
    error: {
      type: String
    }
  },
  setup(props, { emit }) {
    const tickerName = ref("");
    const { coinList } = toRefs(props);
    const coinListModel = ref([]);

    watch(tickerName, (nValue) => {
      if (!nValue) {
        coinListModel.value = [];
        return;
      }
      searchCoins(nValue.toLowerCase());
    });

    const selectCoin = coin => {
      tickerName.value = coin;
      emit(selectCoin, tickerName.value);
    };

    function searchCoins(value, maxCoin = 4) {
      coinListModel.value = [];
      coinList.value.forEach((c) => {
        const coinToLover = c.toLowerCase();
        const isExist = coinToLover.match(value);
        if (!isExist || isExist.index !== 0) return;
        if (coinToLover === value.toLowerCase()) {
          coinListModel.value.unshift(c);
          return;
        }
        if ((coinToLover.length - value.length) == 1) {
          coinListModel.value.push(c);
          return;
        }
      });
      coinListModel.value = coinListModel.value.slice(0, maxCoin);
    }

    return {
      tickerName,
      selectCoin,
      coinListModel,
    };
  }
};
</script>