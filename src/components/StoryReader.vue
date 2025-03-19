<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-violet-50 p-6 sm:p-8 md:p-12">
    <!-- Loading State -->
    <div v-if="isLoading" class="flex justify-center items-center min-h-[60vh]">
      <Progress variant="fun" :value="50" class="max-w-md mx-auto" />
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="max-w-4xl mx-auto text-center py-12">
      <div class="text-red-600 mb-4">{{ error }}</div>
      <Button @click="router.push('/profile')" variant="outline">
        Back to Stories
      </Button>
    </div>

    <!-- Story Content -->
    <div v-else-if="story" class="max-w-4xl mx-auto">
      <!-- Story Header -->
      <div class="text-center mb-8">
        <h1 class="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600 mb-2">
          {{ story.title }}
        </h1>
        <p class="text-lg text-indigo-600/75">
          A magical adventure for {{ story.metadata.childName }}
        </p>
      </div>

      <!-- Audio Player -->
      <div v-if="shouldShowAudio" class="mb-8">
        <StoryAudioPlayer
          :text="story.pages[currentPageIndex]?.content"
          :voice-id="story.metadata.selectedVoiceId"
          :autoplay="false"
        />
      </div>

      <!-- Reading Mode: Show all pages with choices made -->
      <div v-if="isReadingMode" class="space-y-12">
        <div v-for="(page, index) in story.pages" :key="index" class="space-y-6">
          <Card variant="fun" class="p-8">
            <div class="prose prose-indigo max-w-none">
              <h2 class="text-2xl font-bold text-indigo-900 mb-4">
                Page {{ page.pageNumber }}
              </h2>
              <div v-html="page.content" class="text-lg text-indigo-800"></div>
            </div>

            <!-- Show the choice that was made (if not the last page) -->
            <div v-if="index < story.pages.length - 1" class="mt-6">
              <h3 class="text-lg font-medium text-indigo-900 mb-4">The Path Chosen:</h3>
              <div class="p-4 bg-indigo-50 rounded-xl text-indigo-600">
                <div class="flex items-center gap-2">
                  <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                  <span class="font-medium">{{ page.choiceMade }}</span>
                </div>
              </div>
            </div>
          </Card>

          <!-- Page Separator -->
          <div v-if="index < story.pages.length - 1" class="border-b border-indigo-100 my-8"></div>
        </div>

        <!-- Footer Navigation for Reading Mode -->
        <div class="mt-12 flex justify-center gap-4">
          <Button @click="router.push('/profile')" variant="outline">
            Back to Stories
          </Button>
          <Button @click="router.push('/')" variant="fun">
            Create New Story
          </Button>
        </div>
      </div>

      <!-- Creation Mode: Show current page with choices -->
      <div v-else>
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useSupabase } from '../composables/useSupabase';
import Card from './ui/Card.vue';
import Button from './ui/Button.vue';
import Progress from './ui/Progress.vue';
import StoryAudioPlayer from './StoryAudioPlayer.vue';

const route = useRoute();
const router = useRouter();
const { supabase } = useSupabase();

const story = ref(null);
const error = ref(null);
const isLoading = ref(true);
const isReadingMode = ref(false);
const currentPageIndex = ref(0);

const shouldShowAudio = computed(() => {
  const hasVoiceEnabled = story.value?.metadata?.useVoice === true;
  const hasVoiceId = Boolean(story.value?.metadata?.selectedVoiceId);
  const hasContent = Boolean(story.value?.pages[currentPageIndex.value]?.content);
  
  console.log('Audio player conditions:', {
    hasVoiceEnabled,
    hasVoiceId,
    hasContent,
    currentPage: currentPageIndex.value,
    totalPages: story.value?.pages?.length
  });
  
  return hasVoiceEnabled && hasVoiceId && hasContent;
});

const loadStory = async () => {
  isLoading.value = true;
  error.value = null;
  
  try {
    console.group('Story Reader - Loading Story');
    // Always set reading mode to true for StoryReader component
    isReadingMode.value = true;
    
    // Get the story ID from route params
    const storyId = route.params.id;
    console.log('Loading story ID:', storyId);

    if (!storyId) {
      throw new Error('No story ID provided');
    }

    // First try to get from localStorage
    const storedStory = localStorage.getItem('currentStory');
    if (storedStory) {
      try {
        const parsedStory = JSON.parse(storedStory);
        if (parsedStory.id === storyId) {
          console.log('Loading story from localStorage:', {
            id: parsedStory.id,
            title: parsedStory.title,
            pagesCount: parsedStory.pages.length,
            pages: parsedStory.pages.map(p => ({
              pageNumber: p.pageNumber,
              choiceMade: p.choiceMade,
              previousChoice: p.previous_choice,
              selectedChoice: p.selected_choice,
              rawChoices: p.choices
            }))
          });
          story.value = parsedStory;
          return;
        }
      } catch (e) {
        console.warn('Failed to parse story from localStorage:', e);
        // Continue to fetch from database
      }
    }

    // If not in localStorage or ID doesn't match, fetch from database
    console.log('Fetching story from database');
    const { data: dbStory, error: dbError } = await supabase
      .from('stories')
      .select(`
        id,
        title,
        metadata,
        pages (
          id,
          page_number,
          content,
          title,
          choices,
          previous_choice
        )
      `)
      .eq('id', storyId)
      .order('page_number', { foreignTable: 'pages' })
      .single();

    if (dbError) {
      console.error('Database error:', dbError);
      throw new Error(`Failed to load story: ${dbError.message}`);
    }

    if (!dbStory) {
      throw new Error('Story not found');
    }

    console.log('Raw database story:', {
      id: dbStory.id,
      title: dbStory.title,
      pagesCount: dbStory.pages.length,
      pages: dbStory.pages.map(p => ({
        pageNumber: p.page_number,
        previousChoice: p.previous_choice,
        rawChoices: p.choices
      }))
    });

    // Process the story data
    story.value = {
      ...dbStory,
      pages: dbStory.pages.map((page, index) => {
        const nextPage = dbStory.pages[index + 1];
        const choiceMade = nextPage?.previous_choice;
        
        const processedPage = {
          ...page,
          pageNumber: page.page_number,
          content: page.content || '',
          title: page.title || `Page ${index + 1}`,
          choiceMade: index < dbStory.pages.length - 1 ? choiceMade : null
        };
        
        console.log(`Processed page ${index + 1}:`, {
          pageNumber: processedPage.pageNumber,
          previousChoice: page.previous_choice,
          choiceMade: processedPage.choiceMade,
          nextPagePreviousChoice: nextPage?.previous_choice,
          rawChoices: page.choices
        });
        
        return processedPage;
      }),
      metadata: {
        ...dbStory.metadata,
        useVoice: dbStory.metadata?.useVoice || false,
        selectedVoiceId: dbStory.metadata?.selectedVoiceId || null
      }
    };

    console.log('Final processed story:', {
      id: story.value.id,
      title: story.value.title,
      pagesCount: story.value.pages.length,
      pages: story.value.pages.map(p => ({
        pageNumber: p.pageNumber,
        choiceMade: p.choiceMade,
        previousChoice: p.previous_choice,
        rawChoices: p.choices
      }))
    });

    // Update localStorage with the latest data
    localStorage.setItem('currentStory', JSON.stringify(story.value));
    console.log('Updated localStorage with latest story data');
  } catch (e) {
    console.error('Error loading story:', e);
    error.value = e.message;
    // Redirect to profile page if there's an error
    router.push('/profile');
  } finally {
    isLoading.value = false;
    console.groupEnd();
  }
};

onMounted(() => {
  loadStory();
});

onUnmounted(() => {
  // Clean up localStorage when leaving
  localStorage.removeItem('currentStory');
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

.backdrop-blur-sm {
  backdrop-filter: blur(8px);
}
</style> 