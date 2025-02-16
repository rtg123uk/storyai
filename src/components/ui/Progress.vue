<template>
  <div class="relative">
    <div
      class="w-full h-2 bg-gray-100 rounded-full overflow-hidden"
      :class="[
        variantClasses[variant],
        { 'animate-pulse': animation === 'pulse' }
      ]"
    >
      <div
        class="h-full transition-all duration-300 ease-in-out"
        :class="[
          progressBarClasses[variant],
          { 'animate-bounce': animation === 'bounce' }
        ]"
        :style="{ width: `${value}%` }"
      />
    </div>
    
    <!-- Fun decorative elements for children -->
    <template v-if="variant === 'fun'">
      <div 
        v-for="n in 3" 
        :key="n"
        class="absolute top-1/2 -translate-y-1/2"
        :style="{ 
          left: `${(n * 25)}%`,
          transform: `translateY(-50%) scale(${value >= n * 25 ? 1 : 0.5})`,
          opacity: value >= n * 25 ? 1 : 0.5,
          transition: 'all 0.5s ease-in-out'
        }"
      >
        <span class="text-lg">✨</span>
      </div>
    </template>
  </div>
</template>

<script setup>
const props = defineProps({
  value: {
    type: Number,
    required: true,
    validator(value) {
      return value >= 0 && value <= 100;
    }
  },
  variant: {
    type: String,
    default: 'default',
    validator(value) {
      return ['default', 'fun', 'success', 'warning', 'danger'].includes(value);
    }
  },
  animation: {
    type: String,
    default: null,
    validator(value) {
      return ['pulse', 'bounce', null].includes(value);
    }
  }
});

const variantClasses = {
  default: 'bg-gray-100',
  fun: 'bg-indigo-100',
  success: 'bg-emerald-100',
  warning: 'bg-amber-100',
  danger: 'bg-rose-100'
};

const progressBarClasses = {
  default: 'bg-indigo-600',
  fun: 'bg-gradient-to-r from-indigo-500 to-violet-500',
  success: 'bg-emerald-500',
  warning: 'bg-amber-500',
  danger: 'bg-rose-500'
};
</script>

<style scoped>
@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-25%); }
}

.animate-bounce {
  animation: bounce 1s ease-in-out infinite;
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: .5; }
}
</style> 