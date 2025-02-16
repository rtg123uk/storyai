<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-violet-50 p-6 sm:p-8 md:p-12">
    <LoadingOverlay v-if="isLoading" :messages="loadingMessages" />
    
    <Card class="max-w-4xl mx-auto" variant="fun">
      <div class="relative">
        <!-- Story Header -->
        <div class="bg-gradient-to-b from-indigo-50 to-transparent p-8">
          <div class="text-center space-y-2">
            <h1 class="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">
              {{ story?.title }}
            </h1>
            
            <!-- Audio Controls -->
            <div v-if="story?.metadata?.useVoice" class="mt-4 flex justify-center">
              <Button
                @click="playAudio"
                variant="fun"
                size="sm"
                :disabled="isLoadingAudio"
                class="rounded-full hover:bg-indigo-100"
              >
                <span class="flex items-center gap-2">
                  <Icons :name="isLoadingAudio ? 'loader' : isPlaying ? 'pause' : 'volume-2'" size="sm" />
                  <span>{{ isLoadingAudio ? 'Loading...' : isPlaying ? 'Pause' : 'Read Aloud' }}</span>
                </span>
              </Button>
            </div>
          </div>
        </div>

        <!-- Story Content -->
        <div class="p-8">
          <Card class="mb-8" variant="default">
            <div class="p-8">
              <div 
                v-html="formattedContent"
                class="prose prose-indigo max-w-none text-gray-700 text-lg leading-relaxed space-y-4"
              />
            </div>
          </Card>

          <!-- Navigation Controls -->
          <div class="flex justify-between items-center pt-6 border-t border-indigo-100">
            <Button
              @click="router.push('/create')"
              variant="outline"
              size="sm"
            >
              <span class="flex items-center gap-2">
                <Icons name="arrow-left" size="sm" class="text-current" />
                Back to Create
              </span>
            </Button>
            <Button
              @click="saveStory"
              variant="fun"
              size="sm"
              :disabled="isSaving"
            >
              <span class="flex items-center gap-2">
                <span>{{ isSaving ? 'Saving...' : 'Save Story' }}</span>
                <Icons name="save" size="sm" class="text-current" />
              </span>
            </Button>
          </div>
        </div>
      </div>
    </Card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { marked } from 'marked';
import { textToSpeech } from '../services/elevenlabs';
import { useSupabase } from '../composables/useSupabase';
import Card from '../components/ui/Card.vue';
import Button from '../components/ui/Button.vue';
import Icons from '../components/ui/Icons.vue';
import LoadingOverlay from '../components/LoadingOverlay.vue';

const router = useRouter();
const { supabase } = useSupabase();

const story = ref(null);
const isLoading = ref(true);
const isLoadingAudio = ref(false);
const isPlaying = ref(false);
const isSaving = ref(false);
const audioPlayer = ref(null);

const loadingMessages = [
  'Preparing your story...',
  'Setting up narration...',
  'Almost ready...'
];

// Format the story content with markdown
const formattedContent = computed(() => {
  if (!story.value?.pages?.[0]?.content) return '';
  const formatted = marked(story.value.pages[0].content);
  return formatParagraphs(formatted);
});

const formatParagraphs = (content) => {
  return content
    .replace(/<p>/g, '<p class="mb-4 last:mb-0">')
    .replace(/\*\*(.*?)\*\*/g, '<strong class="text-indigo-900">$1</strong>')
    .replace(/\*(.*?)\*/g, '<em class="text-purple-700">$1</em>');
};

const playAudio = async () => {
  if (isPlaying.value && audioPlayer.value) {
    audioPlayer.value.pause();
    isPlaying.value = false;
    return;
  }

  try {
    isLoadingAudio.value = true;
    const content = story.value.pages[0].content;
    const voiceId = story.value.metadata.selectedVoiceId;
    
    const audioUrl = await textToSpeech(content, voiceId);
    
    if (audioUrl) {
      if (!audioPlayer.value) {
        audioPlayer.value = new Audio();
        audioPlayer.value.addEventListener('ended', () => {
          isPlaying.value = false;
        });
      }
      
      audioPlayer.value.src = audioUrl;
      await audioPlayer.value.play();
      isPlaying.value = true;
    }
  } catch (error) {
    console.error('Error playing audio:', error);
    alert('Failed to play audio. Please try again.');
  } finally {
    isLoadingAudio.value = false;
  }
};

const saveStory = async () => {
  if (!story.value || isSaving.value) return;
  
  try {
    isSaving.value = true;
    
    const { data, error } = await supabase
      .from('stories')
      .insert([{
        title: story.value.title,
        metadata: story.value.metadata,
        pages: story.value.pages
      }])
      .select()
      .single();

    if (error) throw error;
    
    alert('Story saved successfully!');
    router.push('/profile');
  } catch (error) {
    console.error('Error saving story:', error);
    alert('Failed to save story. Please try again.');
  } finally {
    isSaving.value = false;
  }
};

// Load story on mount
onMounted(() => {
  const savedStory = localStorage.getItem('currentStory');
  if (savedStory) {
    story.value = JSON.parse(savedStory);
  } else {
    router.push('/create');
  }
  isLoading.value = false;
});

// Clean up on unmount
onUnmounted(() => {
  if (audioPlayer.value) {
    audioPlayer.value.pause();
    audioPlayer.value = null;
  }
});
</script>

<style scoped>
/* Prose Customization */
:deep(.prose) {
  max-width: none;
}

:deep(.prose p) {
  @apply text-indigo-900 leading-relaxed;
}

:deep(.prose strong) {
  @apply text-indigo-900 font-bold;
}

:deep(.prose em) {
  @apply text-purple-700;
}
</style> 