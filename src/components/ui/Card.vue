<template>
  <div
    :class="[
      'rounded-2xl shadow-sm transition-all duration-300',
      variantClasses[variant],
      elevationClasses[elevation],
      className
    ]"
  >
    <slot />
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  variant: {
    type: String,
    default: 'default',
    validator(value) {
      return ['default', 'fun', 'highlight', 'interactive'].includes(value);
    }
  },
  elevation: {
    type: String,
    default: 'sm',
    validator(value) {
      return ['sm', 'md', 'lg'].includes(value);
    }
  },
  class: {
    type: String,
    default: ''
  }
});

const className = computed(() => props.class);

const variantClasses = {
  default: 'bg-white border border-gray-100',
  fun: 'bg-white/95 backdrop-blur-sm border border-indigo-100/50 hover:border-indigo-200/50',
  highlight: 'bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100',
  interactive: 'bg-white border border-indigo-100 hover:border-indigo-300 hover:shadow-md cursor-pointer'
};

const elevationClasses = {
  sm: 'shadow-sm',
  md: 'shadow-md',
  lg: 'shadow-lg'
};
</script>

<style scoped>
.backdrop-blur-sm {
  backdrop-filter: blur(8px);
}
</style> 