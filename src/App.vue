<template>
  <div class="container mx-auto flex flex-col items-centent p-4">
  <div style="display: none;" class="fixed w-100 h-100 opacity-80 bg-purple-800 inset-0 z-50 flex items-center justify-center">
    <svg class="animate-spin -ml-1 mr-3 h-12 w-12 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  </div>
  <div class="container">
    <section>
      <app-add-ticker
        @addTicker="addTickerOver"
      >
      </app-add-ticker>
    </section>
    <template v-if="tickers.length">
      <div>
        <button
          @click="page = page - 1"
          v-if="page > 1"
          class="my-4 inline-flex items-center py-2 px-4 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-full text-white
          bg-gray-600 hover:bg-gray-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
          Назад
        </button>
        <button
          @click="page = page + 1"
          v-if="hasNextPage"
          class="my-4 inline-flex items-center py-2 px-4 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-full text-white
          bg-gray-600 hover:bg-gray-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
          Вперед
        </button>
        <div>Фильтр:
          <app-input
            :type="'text'"
            :name="'wallet'"
            :id="'wallet'"
            :placeholder="'Начните вводить'"
            v-model="filter"
            class="pr-10 border-gray-300 text-gray-900 focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm rounded-md"
          >
          </app-input>
        </div>
      </div>
      <hr class="w-full border-t border-gray-600 my-4" />
      <dl class="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
        <app-ticker
          v-for="ticker in paginatedTickers"
          :ticker="ticker"
          :key="ticker.name"
          @selectTicker="selectTicker(ticker)"
          @deleteTicker="deleteTicker(ticker)"
          :class="{'border-4': selectedTicker == ticker}"
          class="bg-white overflow-hidden shadow rounded-lg border-purple-800 border-solid cursor-pointer"
        >
        </app-ticker>
      </dl>
      <hr class="w-full border-t border-gray-600 my-4" />
    </template>
    <section v-if="selectedTicker" class="relative">
      <h3 class="text-lg leading-6 font-medium text-gray-900 my-8">
        {{ selectedTicker.name }} - USD
      </h3>
      <div ref="graphContainer" class="flex items-end border-gray-600 border-b border-l h-64">
        <app-graph
          :graph="graph"
          @closeGraph="selectedTicker = null"
          :graphContainer="graphContainer"
        >
        </app-graph>
      </div>
    </section>
  </div>
</div>
</template>

<script>
import { computed, ref, watch } from 'vue';

import AppInput from '@/components/AppInput.vue';
import AppGraph from './components/AppGraph.vue';
import AppTicker from './components/AppTicker.vue';

import { formatPrice } from '@/helpers/formatPrice';
import AppAddTicker from './components/AppAddTicker.vue';

import { useTickersManagement } from '@/use/useTickersManagement';

export default {
  components: {
    AppInput,
    AppGraph,
    AppTicker,
    AppAddTicker
  },
  setup() {
    const page = ref(1);
    const filter = ref("");

    // created
    const windowData = Object.fromEntries(new URL(window.location).searchParams.entries());
    if (windowData.filter) {
      filter.value = windowData.filter;
    }
    if (windowData.page) {
      page.value = windowData.page;
    }

    const { tickers, selectedTicker, graph, selectTicker, addTicker, deleteTicker, graphContainer } = useTickersManagement();

    // computed
    const startIndex = computed(() => (page.value - 1) * 6);
    const endIndex = computed(() => page.value * 6);
    const hasNextPage = computed(() => filteredTickers.value.length > endIndex.value);

    const filteredTickers = computed(() => {
      return tickers.value.filter(ticker => ticker.name.toLowerCase().includes(filter.value.toLowerCase()));
    });

    const paginatedTickers = computed(() => filteredTickers.value.slice(startIndex.value, endIndex.value));

    const pageStateOptions = computed(() => {
      return {
        filter: filter.value,
        page: page.value
      };
    });

    // watch
    watch(filter, () => {
      page.value = 1;
    });

    watch(paginatedTickers, () => {
      if (paginatedTickers.value.length == 0 && page.value > 1) {
        page.value -= 1;
      }
    });

    watch(pageStateOptions, (value) => {
      window.history.pushState(null, document.title, `${window.location.pathname}?filter=${value.filter}&page=${value.page}`);
    });

    // methods
    const addTickerOver = (newTicker) => {
      addTicker(newTicker);
      filter.value = "";
    };

    return {
      filter,
      page,
      hasNextPage,
      filteredTickers,
      paginatedTickers,
      formatPrice,
      tickers,
      selectedTicker,
      graph,
      selectTicker,
      addTickerOver,
      deleteTicker,
      graphContainer
    };
  }
};
</script>

<style src="./assets/app.css"></style>
