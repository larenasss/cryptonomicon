<template>
  <div v-if="hintsListModel.length">
    <span
      v-for="hint in hintsListModel"
      :key="hint"
      @click="$emit('selectHint', hint)"
      class="inline-flex items-center px-2 m-1 rounded-md text-xs font-medium bg-gray-300 text-gray-800 cursor-pointer">
      {{ hint }}
    </span>
  </div>
</template>

<script>
import { ref, toRefs, watch } from 'vue';

export default {
  emits: {
    selectHint: null
  },
  props: {
    hints: {
      type: Array,
      default: () => []
    },
    maxCount: {
      type: Number,
      default: 4
    },
    trackValue: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const { trackValue , hints, maxCount } = toRefs(props);
    const hintsListModel = ref([]);

    watch(trackValue, (nValue) => {
      if (!nValue) {
        hintsListModel.value = [];
        return;
      }
      filteredHints(nValue.toLowerCase(), maxCount.value);
    });

    function filteredHints(value, max) {
      hintsListModel.value = [];
      hints.value.forEach((c) => {
        const coinToLover = c.toLowerCase();
        const isExist = coinToLover.match(value);
        if (!isExist || isExist.index !== 0) return;
        if (coinToLover === value.toLowerCase()) {
          hintsListModel.value.unshift(c);
          return;
        }
        if ((coinToLover.length - value.length) == 1) {
          hintsListModel.value.push(c);
          return;
        }
      });

      hintsListModel.value = hintsListModel.value.slice(0, max);
    }

    return {
      hintsListModel
    };
  }
};
</script>