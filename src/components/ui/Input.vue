<template>
  <div class="relative">
    <input
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      :class="[
        'w-full rounded-xl border bg-white px-3 py-2 text-base ring-offset-white transition-all duration-300',
        'focus:outline-none focus:ring-2 focus:ring-offset-2',
        variantClasses[variant],
        sizeClasses[size],
        className,
        { 'opacity-50 cursor-not-allowed': disabled }
      ]"
      v-bind="$attrs"
    />
    <div
      v-if="variant === 'fun'"
      class="absolute inset-0 -z-10 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 opacity-10 blur-lg transition-opacity duration-300 group-hover:opacity-20"
    />
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: ''
  },
  variant: {
    type: String,
    default: 'default',
    validator(value) {
      return ['default', 'fun', 'outline'].includes(value);
    }
  },
  size: {
    type: String,
    default: 'default',
    validator(value) {
      return ['sm', 'default', 'lg'].includes(value);
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
  default: 'border-gray-200 focus:border-indigo-500 focus:ring-indigo-500',
  fun: 'border-indigo-200 focus:border-indigo-500 focus:ring-indigo-500 group',
  outline: 'border-2 border-indigo-200 focus:border-indigo-500 focus:ring-indigo-500'
};

const sizeClasses = {
  sm: 'text-sm',
  default: 'text-base',
  lg: 'text-lg'
};

defineEmits(['update:modelValue']);
</script>

<style scoped>
.group:hover .gradient-blur {
  opacity: 0.2;
}
</style> 