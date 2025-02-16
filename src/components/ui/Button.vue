<template>
  <button
    :class="[
      'inline-flex items-center justify-center rounded-xl font-medium transition-all duration-300',
      variantClasses[variant],
      sizeClasses[size],
      className,
      { 'opacity-50 cursor-not-allowed': disabled }
    ]"
    :disabled="disabled"
    v-bind="$attrs"
  >
    <slot />
  </button>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  variant: {
    type: String,
    default: 'default',
    validator(value) {
      return ['default', 'fun', 'secondary', 'outline', 'ghost'].includes(value);
    }
  },
  size: {
    type: String,
    default: 'default',
    validator(value) {
      return ['sm', 'default', 'lg', 'xl'].includes(value);
    }
  },
  disabled: {
    type: Boolean,
    default: false
  },
  class: {
    type: String,
    default: ''
  }
});

const className = computed(() => props.class);

const variantClasses = {
  default: 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm',
  fun: 'bg-gradient-to-r from-indigo-500 to-violet-500 text-white hover:from-indigo-600 hover:to-violet-600 shadow-sm',
  secondary: 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200',
  outline: 'border-2 border-indigo-200 text-indigo-600 hover:bg-indigo-50',
  ghost: 'text-indigo-600 hover:bg-indigo-50'
};

const sizeClasses = {
  sm: 'text-sm px-3 py-1.5',
  default: 'text-base px-4 py-2',
  lg: 'text-lg px-6 py-3',
  xl: 'text-xl px-8 py-4'
};
</script>

<style scoped>
.gradient-animation {
  background-size: 200% 200%;
  animation: gradient 4s ease infinite;
}

@keyframes gradient {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
</style> 