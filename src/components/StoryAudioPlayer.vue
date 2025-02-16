<template>
  <div class="space-y-4">
    <!-- Audio Controls -->
    <div class="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm">
      <Button
        @click="togglePlayPause"
        :variant="isPlaying ? 'fun' : 'secondary'"
        size="lg"
        class="w-12 h-12 rounded-full flex items-center justify-center"
      >
        <Icons :name="isPlaying ? 'pause' : 'play'" size="lg" />
      </Button>
      
      <div class="flex-1 mx-4">
        <div class="relative w-full h-2 bg-gray-200 rounded">
          <div
            class="absolute left-0 top-0 h-full bg-indigo-600 rounded"
            :style="{ width: `${progress}%` }"
          ></div>
        </div>
      </div>

      <Button
        @click="restartAudio"
        variant="secondary"
        size="sm"
        class="w-10 h-10 rounded-full flex items-center justify-center"
      >
        <Icons name="refresh" size="sm" />
      </Button>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="text-center py-4">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
      <p class="mt-2 text-sm text-indigo-600">Generating audio narration...</p>
    </div>

    <!-- Error State -->
    <div v-if="error" class="text-red-600 text-sm p-4 rounded bg-red-50">
      {{ error }}
      <Button @click="retryGeneration" variant="secondary" size="sm" class="mt-2">
        Retry
      </Button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
import { textToSpeech } from '../services/elevenlabs';
import Button from './ui/Button.vue';
import Icons from './ui/Icons.vue';

const props = defineProps({
  text: {
    type: String,
    required: true
  },
  voiceId: {
    type: String,
    required: true
  },
  autoplay: {
    type: Boolean,
    default: false
  }
});

const audio = ref(null);
const audioUrl = ref(null);
const isPlaying = ref(false);
const isLoading = ref(false);
const error = ref(null);
const progress = ref(0);

const generateAudio = async () => {
  isLoading.value = true;
  error.value = null;
  
  try {
    const url = await textToSpeech(props.text, props.voiceId);
    audioUrl.value = url;
    
    // Create new audio instance
    audio.value = new Audio(url);
    
    // Set up audio event listeners
    audio.value.addEventListener('timeupdate', updateProgress);
    audio.value.addEventListener('ended', () => {
      isPlaying.value = false;
      progress.value = 0;
    });
    
    if (props.autoplay) {
      await audio.value.play();
      isPlaying.value = true;
    }
  } catch (err) {
    error.value = 'Failed to generate audio narration. Please try again.';
    console.error('Audio generation error:', err);
  } finally {
    isLoading.value = false;
  }
};

const togglePlayPause = async () => {
  if (!audio.value) {
    await generateAudio();
    return;
  }
  
  if (isPlaying.value) {
    audio.value.pause();
    isPlaying.value = false;
  } else {
    await audio.value.play();
    isPlaying.value = true;
  }
};

const updateProgress = () => {
  if (!audio.value) return;
  progress.value = (audio.value.currentTime / audio.value.duration) * 100;
};

const restartAudio = () => {
  if (!audio.value) return;
  audio.value.currentTime = 0;
  if (!isPlaying.value) {
    togglePlayPause();
  }
};

const retryGeneration = () => {
  generateAudio();
};

// Clean up on component unmount
onBeforeUnmount(() => {
  if (audio.value) {
    audio.value.removeEventListener('timeupdate', updateProgress);
    audio.value.pause();
    URL.revokeObjectURL(audioUrl.value);
  }
});

// Watch for text changes to regenerate audio
watch(() => props.text, () => {
  if (audio.value) {
    audio.value.pause();
    URL.revokeObjectURL(audioUrl.value);
    audio.value = null;
    audioUrl.value = null;
    isPlaying.value = false;
    progress.value = 0;
  }
  if (props.autoplay) {
    generateAudio();
  }
});

// Generate audio on mount if autoplay is enabled
onMounted(() => {
  if (props.autoplay) {
    generateAudio();
  }
});
</script> 