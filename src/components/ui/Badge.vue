<template>
  <span
    :class="[
      'inline-flex items-center justify-center rounded-full font-medium',
      variantClasses[variant],
      sizeClasses[size],
      className
    ]"
  >
    <slot />
  </span>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  variant: {
    type: String,
    default: 'default',
    validator(value) {
      return ['default', 'fun', 'outline', 'success', 'warning', 'danger', 'magic'].includes(value);
    }
  },
  size: {
    type: String,
    default: 'default',
    validator(value) {
      return ['sm', 'default', 'lg'].includes(value);
    }
  },
  class: {
    type: String,
    default: ''
  }
});

const className = computed(() => props.class);

const variantClasses = {
  default: 'bg-indigo-100 text-indigo-700',
  fun: 'bg-gradient-to-r from-indigo-500 to-violet-500 text-white shadow-sm',
  outline: 'border border-indigo-200 text-indigo-600',
  success: 'bg-emerald-100 text-emerald-700',
  warning: 'bg-amber-100 text-amber-700',
  danger: 'bg-rose-100 text-rose-700',
  magic: 'bg-gradient-to-r from-indigo-100 to-violet-100 text-indigo-700'
};

const sizeClasses = {
  sm: 'text-xs px-2 py-0.5',
  default: 'text-sm px-2.5 py-0.5',
  lg: 'text-base px-3 py-1'
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