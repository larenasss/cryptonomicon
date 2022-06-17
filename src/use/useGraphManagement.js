import { ref, computed, onBeforeMount, onMounted, nextTick } from 'vue';

export function useGraphManagement(graph, graphContainer) {
  const maxGraphElements = ref(1);

  const calculateMaxGraphElements = () => {
    if (!graphContainer.value) return;
    maxGraphElements.value = graphContainer.value.clientWidth / 38;
  };

  const addGraphElem = elem => {
    graph.value.push(elem);
    while (graph.value.length > maxGraphElements.value) {
      graph.value.shift();
    }
    nextTick().then(calculateMaxGraphElements);
  };

  const normalizedGraph = computed(() => {
    const maxValue = Math.max(...graph.value);
    const minValue = Math.min(...graph.value);

    return graph.value.map(price => {
      return (price - minValue) * 95 / (maxValue - minValue);
    });
  });

  onMounted(() => {
    window.addEventListener(
      'resize', calculateMaxGraphElements
    );
  });

  onBeforeMount(() => {
    window.removeEventListener(
      'resize', calculateMaxGraphElements
    );
  });

  return {
    normalizedGraph,
    graphContainer,
    calculateMaxGraphElements,
    addGraphElem
  };
}