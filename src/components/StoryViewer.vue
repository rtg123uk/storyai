<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-violet-50">
    <StoryPage
      v-if="story"
      :story="story"
      :current-page-index="currentPageIndex"
      :is-generating="isGenerating"
      :is-reading="isReading"
      @make-choice="handleChoice"
      @previous-page="handlePreviousPage"
      @restart="$emit('restart')"
      @save-story="$emit('save-story')"
    />

    <!-- Loading Overlay -->
    <LoadingOverlay 
      v-if="isGenerating" 
      :messages="[
        'Writing the next chapter...',
        'Weaving your choice into the story...',
        'Creating magical moments...',
        'Adding a sprinkle of adventure...',
        'The story continues...'
      ]"
    />

    <!-- Story Navigation -->
    <div class="fixed bottom-0 left-0 right-0 bg-white bg-opacity-90 backdrop-blur-sm border-t border-indigo-100 p-4">
      <div class="max-w-4xl mx-auto flex items-center justify-between gap-4">
        <!-- Navigation Buttons -->
        <Button 
          @click="handlePreviousPage" 
          :disabled="currentPageIndex === 1"
          variant="secondary"
          size="lg"
        >
          <span class="flex items-center gap-2">
            <Icons name="book" class="rotate-180" />
            Previous Page
          </span>
        </Button>

        <!-- Page Counter -->
        <span class="text-lg font-medium text-indigo-800">
          Page {{ currentPageIndex }} of {{ parsedMaxPages }}
        </span>

        <!-- Next/Finish Button -->
        <Button 
          @click="handleChoice" 
          :variant="currentPageIndex === parsedMaxPages ? 'fun' : 'secondary'"
          size="lg"
        >
          <span class="flex items-center gap-2">
            <template v-if="currentPageIndex === parsedMaxPages">
              <span>Finish Story</span>
              <Icons name="magic-wand" />
            </template>
            <template v-else>
              <span>Next Page</span>
              <Icons name="book" />
            </template>
          </span>
        </Button>
      </div>
    </div>

    <!-- Save Story Button -->
    <Button
      @click="handleSaveStory"
      variant="fun"
      class="mt-4"
    >
      <Icons name="save" class="mr-2" />
      Save Story
    </Button>

    <!-- Auth Modal -->
    <AuthModal
      :is-open="showAuthModal"
      @close="showAuthModal = false"
      @auth-success="handleAuthSuccess"
    />

    <!-- Error Message -->
    <div v-if="saveError" class="fixed top-4 right-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded shadow-lg">
      <p class="font-bold">Error</p>
      <p>{{ typeof saveError === 'string' ? saveError : saveError.message }}</p>
    </div>

    <!-- Success Message -->
    <div v-if="saveSuccess" class="fixed top-4 right-4 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded shadow-lg">
      <p class="font-bold">Success</p>
      <p>Story saved successfully!</p>
    </div>

    <!-- Loading Indicator -->
    <div v-if="isSaving" class="fixed top-4 right-4 bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 rounded shadow-lg">
      <p class="font-bold">Saving...</p>
      <p>Please wait while your story is being saved.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useSupabase } from '../composables/useSupabase';
import StoryPage from './StoryPage.vue';
import LoadingOverlay from './LoadingOverlay.vue';
import { generateStoryPage } from '../services/ai';
import Button from './ui/Button.vue';
import Card from './ui/Card.vue';
import Icons from './ui/Icons.vue';
import AuthModal from './ui/AuthModal.vue';

const props = defineProps({
  story: {
    type: Object,
    required: true
  },
  isReading: {
    type: Boolean,
    default: false
  }
});

const router = useRouter();
const route = useRoute();
const { supabase, user, saveStory } = useSupabase();

const emit = defineEmits(['restart', 'save-story', 'make-choice']);

const isGenerating = ref(false);
const currentPageIndex = ref(1);
const errorMessage = ref('');
const showAuthModal = ref(false);
const isLoading = ref(false);
const saveError = ref(null);
const saveSuccess = ref(false);
const isSaving = ref(false);

// Initialize currentPageIndex from story metadata
watch(() => props.story, (newStory) => {
  if (newStory?.metadata?.currentPage) {
    currentPageIndex.value = newStory.metadata.currentPage;
  } else {
    currentPageIndex.value = 1;
  }
}, { immediate: true });

// Watch for changes in story pages
watch(() => props.story?.pages?.length, (newLength, oldLength) => {
  console.log('Pages length changed:', { newLength, oldLength, currentIndex: currentPageIndex.value });
  if (newLength > oldLength) {
    currentPageIndex.value = newLength;
  }
});

// Computed
const currentPage = computed(() => {
  if (!props.story?.pages?.length) return null;
  const pageIndex = currentPageIndex.value - 1;
  return props.story.pages[pageIndex] || null;
});

const currentPageContent = computed(() => {
  return currentPage.value?.content || '';
});

// Add parsedMaxPages computed property
const parsedMaxPages = computed(() => {
  return parseInt(props.story.metadata?.totalPages || '5');
});

// Add getThemeIcon method
const getThemeIcon = computed(() => {
  const themeIcons = {
    'fantasy': 'magic-wand',
    'adventure': 'map',
    'mystery': 'search',
    'science': 'rocket',
    'nature': 'tree',
    'friendship': 'users',
    'magic': 'sparkles'
  };
  
  const theme = props.story.metadata?.theme?.toLowerCase() || '';
  return themeIcons[theme] || 'book';
});

// Methods
const handleChoice = async (choice) => {
  console.group('Choice Handler');
  console.log('Selected choice:', choice);
  console.log('Current page index:', currentPageIndex.value);
  
  try {
    isGenerating.value = true;
    emit('make-choice', choice);
  } catch (error) {
    console.error('Error in choice handler:', error);
    errorMessage.value = 'Failed to process your choice. Please try again.';
  } finally {
    isGenerating.value = false;
    console.groupEnd();
  }
};

const handlePreviousPage = () => {
  if (currentPageIndex.value > 1) {
    currentPageIndex.value--;
    // Update the story's current page in parent
    if (props.story) {
      props.story.metadata.currentPage = currentPageIndex.value;
    }
  }
};

const handleNextPage = () => {
  if (currentPageIndex.value < props.story.pages.length) {
    currentPageIndex.value++;
    // Update the story's current page in parent
    if (props.story) {
      props.story.metadata.currentPage = currentPageIndex.value;
    }
  }
};

const handleSaveStory = async () => {
  if (!user.value) {
    showAuthModal.value = true;
    return;
  }
  
  await saveStoryToDatabase();
};

const handleAuthSuccess = async (authenticatedUser) => {
  showAuthModal.value = false;
  if (authenticatedUser) {
    // Small delay to ensure auth state is updated
    setTimeout(async () => {
      await saveStoryToDatabase();
    }, 500);
  }
};

const saveStoryToDatabase = async () => {
  try {
    isSaving.value = true;
    saveError.value = null;
    saveSuccess.value = false;

    if (!user.value) {
      throw new Error('Please sign in to save your story');
    }

    const storyData = {
      title: props.story.title,
      pages: props.story.pages,
      metadata: {
        ...props.story.metadata,
        saved_at: new Date().toISOString()
      }
    };

    console.log('Attempting to save story with data:', storyData);
    
    const { data, error } = await saveStory(storyData);
    
    if (error) {
      console.error('Error saving story:', error);
      saveError.value = error;
      return;
    }

    console.log('Story saved successfully:', data);
    saveSuccess.value = true;
    
    // Hide success message after 3 seconds
    setTimeout(() => {
      saveSuccess.value = false;
    }, 3000);
  } catch (e) {
    console.error('Error in saveStoryToDatabase:', e);
    saveError.value = e.message;
  } finally {
    isSaving.value = false;
  }
};

// Add reading-specific loading messages
const loadingMessages = computed(() => {
  if (props.isReading) {
    return [
      'Turning the page...',
      'Reliving the magic...',
      'Following your adventure...',
      'Remembering the journey...',
      'Revisiting your story...',
      'Reading along with you...',
      'Continuing your tale...',
      'Exploring your path...',
      'Walking down memory lane...',
      'Rediscovering the magic...'
    ];
  }
  return [
    'Imagining what happens next...',
    'Drawing from the magic well...',
    'Crafting the perfect scene...',
    'Sprinkling story dust...',
    'Bringing the tale to life...'
  ];
});
</script>

<style scoped>
.prose {
  @apply text-gray-700;
}

.prose :deep(p) {
  @apply mb-4 leading-relaxed;
}

.prose :deep(p:last-child) {
  @apply mb-0;
}

/* Subtle animations */
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-4px); }
}

.animate-float {
  animation: float 4s ease-in-out infinite;
}

/* Transition utilities */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 300ms;
}
</style> 