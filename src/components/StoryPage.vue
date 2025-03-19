<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-violet-50 p-6 sm:p-8 md:p-12">
    <!-- Loading Overlay -->
    <LoadingOverlay v-if="isGenerating" :messages="loadingMessages" />
    
    <Card class="max-w-4xl mx-auto" variant="fun">
      <div class="relative">
        <!-- Story Header -->
        <div class="bg-gradient-to-b from-indigo-50 to-transparent p-8">
          <div class="text-center space-y-2">
            <h1 class="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">
              {{ story.title }}
            </h1>
            <Icons name="magic-wand" size="lg" class="text-indigo-500" />
            <p class="text-lg text-indigo-600/75">A magical adventure for {{ story.metadata.childName }}</p>
            
            <!-- Audio Controls -->
            <div v-if="story.metadata.useVoice" class="mt-4 flex justify-center">
              <Button
                @click="playPageAudio"
                variant="fun"
                size="sm"
                :disabled="isLoadingAudio"
                class="rounded-full hover:bg-indigo-100"
              >
                <span class="flex items-center gap-2">
                  <Icons :name="isLoadingAudio ? 'loader' : 'volume-2'" size="sm" />
                  <span>{{ isLoadingAudio ? 'Loading...' : 'Read Aloud' }}</span>
                </span>
              </Button>
            </div>
          </div>
        </div>

        <!-- Current Page Content -->
        <div class="p-8">
          <Card v-if="currentPage" class="mb-8" variant="default">
            <div class="p-8">
              <h2 class="text-3xl font-bold text-indigo-900 mb-6 flex items-center gap-3">
                <Icons :name="getChapterIcon(currentPage.title)" size="lg" class="text-indigo-500" />
                {{ currentPage.title }}
              </h2>
              <div 
                v-html="formattedContent"
                :class="{
                  'text-xl leading-relaxed space-y-6': story.metadata.ageGroup === '3-5',
                  'text-lg leading-relaxed space-y-4': story.metadata.ageGroup === '6-8',
                  'text-base leading-relaxed space-y-4': story.metadata.ageGroup === '9-12'
                }"
                class="prose prose-indigo max-w-none text-gray-700"
              />
            </div>
          </Card>

          <!-- Story Choices -->
          <div v-if="!isGenerating && currentPage && !isStoryComplete" class="space-y-6">
            <h3 class="text-xl font-medium text-indigo-900 flex items-center gap-2">
              <Icons name="question" size="lg" class="text-indigo-500" />
              What happens next, {{ story.metadata.childName }}?
            </h3>
            
            <div class="grid gap-4">
              <Card
                v-for="(choice, index) in currentPage.choices"
                :key="index"
                variant="interactive"
                class="cursor-pointer transition-all duration-300 hover:scale-102 group"
                @click="handleChoiceClick(choice)"
                :class="{ 'opacity-50 pointer-events-none': isGenerating }"
              >
                <div class="p-6">
                  <div class="flex items-center gap-6">
                    <Badge variant="fun" size="lg">{{ index + 1 }}</Badge>
                    <div class="flex-grow">
                      <p :class="{
                        'text-2xl': story.metadata.ageGroup === '3-5',
                        'text-xl': story.metadata.ageGroup === '6-8',
                        'text-lg': story.metadata.ageGroup === '9-12'
                      }" class="font-semibold text-indigo-900">
                        {{ formatChoiceText(choice.text) }}
                      </p>
                      <p :class="{
                        'text-xl mt-2': story.metadata.ageGroup === '3-5',
                        'text-lg mt-2': story.metadata.ageGroup === '6-8',
                        'text-base mt-1': story.metadata.ageGroup === '9-12'
                      }" class="text-indigo-600/75">
                        {{ choice.description }}
                      </p>
                    </div>
                    <Icons name="sparkles" class="text-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              </Card>
            </div>
          </div>

          <!-- Story Complete Message -->
          <div v-else-if="isStoryComplete" class="text-center py-8 space-y-6">
            <div class="inline-flex items-center gap-3 mb-4">
              <Icons name="trophy" size="lg" class="text-indigo-500" />
              <Badge variant="fun" size="lg">Story Complete!</Badge>
              <Icons name="star" size="lg" class="text-indigo-500" />
            </div>
            
            <p class="text-lg text-indigo-600 mb-6">
              What a wonderful adventure that was, {{ story.metadata.childName }}!
            </p>
            
            <div class="flex justify-center gap-4">
              <Button @click="handleSaveStory" variant="fun" size="lg">
                <span class="flex items-center gap-2">
                  <span>Save Your Adventure</span>
                  <Icons name="save" size="sm" class="text-current" />
                </span>
              </Button>
              <Button @click="$emit('restart')" variant="outline" size="lg">
                <span class="flex items-center gap-2">
                  <span>Start New Story</span>
                  <Icons name="rocket" size="sm" class="text-current" />
                </span>
              </Button>
            </div>
          </div>

          <!-- Auth Modal -->
          <AuthModal
            v-if="showAuthModal"
            :is-open="showAuthModal"
            @close="showAuthModal = false"
            @auth-success="handleAuthSuccess"
          />

          <!-- Navigation Controls -->
          <div class="flex justify-center items-center pt-6 border-t border-indigo-100">
            <Button
              @click="$emit('restart')"
              variant="fun"
              size="sm"
              :disabled="isGenerating"
            >
              <span class="flex items-center gap-2">
                Start New Story
                <Icons name="rocket" size="sm" class="text-current" />
              </span>
            </Button>
          </div>
        </div>
      </div>
    </Card>
  </div>
</template>

<script setup>
import { computed, ref, watch, onUnmounted, onMounted } from 'vue';
import { marked } from 'marked';
import { textToSpeech } from '../services/elevenlabs';
import Card from './ui/Card.vue';
import Button from './ui/Button.vue';
import Badge from './ui/Badge.vue';
import Progress from './ui/Progress.vue';
import LoadingOverlay from './LoadingOverlay.vue';
import Icons from './ui/Icons.vue';
import AuthModal from './ui/AuthModal.vue';
import { useSupabase } from '../composables/useSupabase';

const props = defineProps({
  story: {
    type: Object,
    required: true
  },
  currentPageIndex: {
    type: Number,
    required: true
  },
  isGenerating: {
    type: Boolean,
    default: false
  },
  isReading: {
    type: Boolean,
    default: false
  }
});

// Add loading messages specific to story generation
const loadingMessages = [
  'Writing the next chapter...',
  'Consulting with magical creatures...',
  'Exploring new story paths...',
  'Gathering inspiration...',
  'Brewing a magical plot twist...',
  'Polishing the story gems...',
  'Adding character sparkle...',
  'Mixing adventure ingredients...',
  'Crafting the perfect scene...',
  'Sprinkling narrative magic...'
];

const emit = defineEmits(['make-choice', 'previous-page', 'restart', 'save-story']);

const isLoadingAudio = ref(false);
const audioPlayer = ref(null);
const showAuthModal = ref(false);
const { user } = useSupabase();

// Check auth status when component mounts
onMounted(() => {
  if (!user.value) {
    console.log('No user logged in, showing auth modal');
    showAuthModal.value = true;
  }
});

// Computed
const currentPage = computed(() => {
  console.group('Story Page - Current Page Computation');
  console.log('Computing current page:', {
    currentPageIndex: props.currentPageIndex,
    availablePages: props.story.pages.length,
    isReading: props.isReading
  });
  if (!props.story?.pages?.length) {
    console.log('No pages available');
    console.groupEnd();
    return null;
  }
  const pageIndex = props.currentPageIndex - 1;
  const page = props.story.pages[pageIndex];
  console.log('Selected page:', {
    pageNumber: page?.pageNumber,
    title: page?.title,
    choiceMade: page?.choiceMade,
    previousChoice: page?.previous_choice,
    selectedChoice: page?.selected_choice,
    hasChoices: Boolean(page?.choices),
    choices: page?.choices
  });
  console.groupEnd();
  return page || null;
});

const isFirstPage = computed(() => props.currentPageIndex === 1);

const isStoryComplete = computed(() => {
  return props.currentPageIndex >= parseInt(props.story.metadata.totalPages);
});

const formattedContent = computed(() => {
  if (!currentPage.value?.content) return '';
  const formatted = marked(currentPage.value.content);
  return formatParagraphs(formatted);
});

// Methods
const handleChoiceClick = (choice) => {
  console.group('Story Page - Choice Click');
  console.log('Choice clicked:', choice);
  console.log('Current page state:', {
    pageNumber: currentPage.value?.pageNumber,
    choiceMade: currentPage.value?.choiceMade,
    previousChoice: currentPage.value?.previous_choice,
    selectedChoice: currentPage.value?.selected_choice
  });
  if (props.isGenerating) {
    console.log('Ignoring choice click - story is generating');
    console.groupEnd();
    return;
  }
  emit('make-choice', choice);
  console.groupEnd();
};

const formatChoiceText = (text) => {
  return text.replace(/[\[\]]/g, '').trim();
};

const formatParagraphs = (content) => {
  return content
    .replace(/<p>/g, '<p class="mb-4 last:mb-0">')
    .replace(/\*\*(.*?)\*\*/g, '<strong class="text-indigo-900">$1</strong>')
    .replace(/\*(.*?)\*/g, '<em class="text-purple-700">$1</em>');
};

const getChapterIcon = (title) => {
  const titleLower = title.toLowerCase();
  if (titleLower.includes('magic')) return 'magic-wand';
  if (titleLower.includes('adventure')) return 'map';
  if (titleLower.includes('quest')) return 'sword';
  if (titleLower.includes('forest')) return 'tree';
  if (titleLower.includes('star')) return 'star';
  return 'book';
};

const playPageAudio = async () => {
  if (!props.story.metadata.useVoice || !props.story.metadata.selectedVoiceId || !currentPage.value) {
    console.log('Audio playback not enabled or no voice selected');
    return;
  }

  try {
    isLoadingAudio.value = true;
    console.log('Generating audio for page:', currentPage.value.title);
    
    const audioUrl = await textToSpeech(
      currentPage.value.content,
      props.story.metadata.selectedVoiceId
    );

    if (audioUrl) {
      if (!audioPlayer.value) {
        audioPlayer.value = new Audio();
      }
      audioPlayer.value.src = audioUrl;
      await audioPlayer.value.play();
    }
  } catch (error) {
    console.error('Error playing audio:', error);
  } finally {
    isLoadingAudio.value = false;
  }
};

const handleAuthSuccess = async (authenticatedUser) => {
  console.group('Auth Success Handler');
  console.log('Auth success triggered with user:', authenticatedUser);
  showAuthModal.value = false;
  console.groupEnd();
};

const handleSaveStory = async () => {
  console.group('Save Story Flow');
  console.log('Current auth state:', { user: user.value });
  
  try {
    if (!user.value) {
      console.log('No user logged in, showing auth modal');
      showAuthModal.value = true;
      return;
    }

    const storyData = {
      title: props.story.title,
      pages: props.story.pages,
      metadata: {
        ...props.story.metadata,
        saved_at: new Date().toISOString(),
        childName: props.story.metadata.childName,
        ageGroup: props.story.metadata.ageGroup,
        theme: props.story.metadata.theme,
        totalPages: props.story.metadata.totalPages
      }
    };

    console.log('Emitting save-story event with data:', {
      title: storyData.title,
      pagesCount: storyData.pages.length,
      metadata: storyData.metadata
    });
    
    // Save to localStorage as backup
    localStorage.setItem('currentStory', JSON.stringify(storyData));
    
    // Emit save event
    emit('save-story', storyData);
  } catch (e) {
    console.error('Error in handleSaveStory:', e);
    errorMessage.value = e.message || 'Failed to save story';
  } finally {
    console.groupEnd();
  }
};

// Watch for page changes
watch(() => currentPage.value, async (newPage) => {
  if (newPage && props.story.metadata.useVoice) {
    await playPageAudio();
  }
}, { immediate: true });

// Clean up audio on unmount
onUnmounted(() => {
  if (audioPlayer.value) {
    audioPlayer.value.pause();
    audioPlayer.value = null;
  }
});
</script>

<style scoped>
.scale-102 {
  --tw-scale-x: 1.02;
  --tw-scale-y: 1.02;
}

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

/* Animation for choice cards */
.card-enter-active,
.card-leave-active {
  transition: all 0.3s ease-out;
}

.card-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.card-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  @apply bg-indigo-50 rounded-full;
}

::-webkit-scrollbar-thumb {
  @apply bg-indigo-200 rounded-full hover:bg-indigo-300 transition-colors;
}
</style> 