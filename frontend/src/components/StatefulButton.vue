<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  text: string,
  isLoading: boolean
}>();

const emit = defineEmits<{
  (e: 'click'): void
}>();

const buttonText = computed(() => props.isLoading ? 'Loading...' : props.text);
const buttonClass = computed(() => {
  let base = 'px-4 py-2 rounded transition-colors font-semibold ';
  return props.isLoading
    ? base + 'bg-blue-400 text-white cursor-not-allowed'
    : base + 'bg-blue-600 hover:bg-blue-700 text-white';
});

function handleClick() {
  if (!props.isLoading) emit('click');
}
</script>

<template>
  <button
    :class="buttonClass"
    :disabled="props.isLoading"
    @click="handleClick"
  >
    {{ buttonText }}
  </button>
</template>

<style scoped>

</style>