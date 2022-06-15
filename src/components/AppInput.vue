<template>
  <input
    :type="type"
    :name="name"
    :id="id"
    :placeholder="placeholder"
    :value="modelValue"
    @input="$emit('update:modelValue', $event.target.value)"
  />
</template>

<script>
export default {
  emits: ['update:modelValue'],
  props: {
    type: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    id: {
      type: String,
    },
    placeholder: {
      type: String,
    },
    modelValue: {
      type: String,
    }
  }
};
</script>