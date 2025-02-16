<template>
  <div class="relative">
    <select
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      :class="[
        'w-full appearance-none rounded-xl border bg-white pl-3 pr-10 py-2 text-base ring-offset-white transition-all duration-300',
        'focus:outline-none focus:ring-2 focus:ring-offset-2',
        variantClasses[variant],
        sizeClasses[size],
        className,
        { 'opacity-50 cursor-not-allowed': disabled }
      ]"
      v-bind="$attrs"
    >
      <slot />
    </select>
    <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
      <svg
        class="h-5 w-5 text-gray-400"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fill-rule="evenodd"
          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
          clip-rule="evenodd"
        />
      </svg>
    </div>
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

select {
  background-image: none;
}
</style> 