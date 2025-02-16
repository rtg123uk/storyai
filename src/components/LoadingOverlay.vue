<template>
  <div class="fixed inset-0 bg-indigo-900/50 backdrop-blur-sm z-50 flex items-center justify-center">
    <Card variant="fun" class="w-full max-w-lg mx-4 p-8 animate-float">
      <div class="text-center space-y-6">
        <!-- Loading Animation -->
        <div class="relative w-24 h-24 mx-auto">
          <div class="absolute inset-0 rounded-full border-4 border-indigo-200"></div>
          <div class="absolute inset-0 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin"></div>
          <div class="absolute inset-0 flex items-center justify-center">
            <Icons name="magic-wand" size="xl" class="text-indigo-500 animate-float" />
          </div>
        </div>

        <!-- Loading Message -->
        <div class="space-y-3">
          <h3 class="text-2xl font-bold text-indigo-900">
            {{ currentMessage }}
          </h3>
          <p class="text-lg text-indigo-600">
            {{ subMessage }}
          </p>
        </div>

        <!-- Progress Dots -->
        <div class="flex justify-center gap-2">
          <div v-for="n in 3" :key="n" 
            class="w-3 h-3 rounded-full bg-indigo-200"
            :class="{ 'animate-ping': (progressCount % 3) === n - 1 }"
          ></div>
        </div>
      </div>
    </Card>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import Card from './ui/Card.vue';
import Icons from './ui/Icons.vue';

const props = defineProps({
  messages: {
    type: Array,
    default: () => [
      'Creating magic...',
      'Gathering stardust...',
      'Weaving stories...',
      'Drawing from imagination...',
      'Painting with words...',
      'Adding sparkles...',
      'Mixing colors of adventure...',
      'Crafting memories...',
      'Sprinkling fairy dust...',
      'Making dreams come true...'
    ]
  }
});

const subMessages = [
  'Your story is coming to life!',
  'Almost there...',
  'The magic is happening...',
  'Just a moment more...',
  'Your adventure awaits...'
];

const currentMessage = ref(props.messages[0]);
const subMessage = ref(subMessages[0]);
const progressCount = ref(0);
let messageInterval;
let subMessageInterval;
let progressInterval;

onMounted(() => {
  // Rotate main messages
  messageInterval = setInterval(() => {
    const currentIndex = props.messages.indexOf(currentMessage.value);
    const nextIndex = (currentIndex + 1) % props.messages.length;
    currentMessage.value = props.messages[nextIndex];
  }, 2000);

  // Rotate sub messages
  subMessageInterval = setInterval(() => {
    const currentIndex = subMessages.indexOf(subMessage.value);
    const nextIndex = (currentIndex + 1) % subMessages.length;
    subMessage.value = subMessages[nextIndex];
  }, 3000);

  // Update progress dots
  progressInterval = setInterval(() => {
    progressCount.value = (progressCount.value + 1) % 3;
  }, 500);
});

onBeforeUnmount(() => {
  clearInterval(messageInterval);
  clearInterval(subMessageInterval);
  clearInterval(progressInterval);
});
</script>

<style scoped>
.animate-float {
  animation: float 6s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.backdrop-blur-sm {
  backdrop-filter: blur(8px);
}
</style> 