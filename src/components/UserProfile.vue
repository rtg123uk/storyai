<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-violet-50 p-6 sm:p-8 md:p-12">
    <div class="max-w-4xl mx-auto space-y-8">
      <!-- User Profile Header -->
      <div class="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-indigo-100/50 p-8">
        <div class="flex items-start gap-6">
          <div class="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-400 to-violet-400 flex items-center justify-center text-white text-3xl font-bold">
            {{ username.charAt(0).toUpperCase() }}
          </div>
          <div class="flex-grow">
            <h1 class="text-3xl font-bold text-indigo-900 mb-2">{{ username }}</h1>
            <div class="flex items-center gap-4 text-indigo-600">
              <span>Joined {{ formatDate(signUpDate) }}</span>
              <span>{{ savedStories.length }} Stories Created</span>
            </div>
          </div>
          <button
            @click="startNewStory"
            class="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-violet-500 text-white rounded-xl hover:from-indigo-600 hover:to-violet-600 transition-all shadow-sm hover:shadow-md"
          >
            Create New Story
          </button>
        </div>
      </div>

      <!-- Stories Section -->
      <div class="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-indigo-100/50 p-8">
        <h2 class="text-2xl font-bold text-indigo-900 mb-6">Your Story Collection</h2>

        <div class="space-y-6">
          <div v-for="story in savedStories" :key="story.id" class="bg-indigo-50/50 rounded-2xl p-6 hover:bg-indigo-50 transition-colors">
            <div class="flex items-start justify-between gap-4">
              <div class="flex-grow">
                <h3 class="text-xl font-bold text-indigo-900 mb-2">{{ story.title }}</h3>
                <div class="flex flex-wrap gap-3 text-sm">
                  <span class="text-indigo-600">Created {{ formatDate(story.created_at) }}</span>
                  <span class="text-indigo-600">{{ story.metadata.theme }}</span>
                  <span class="text-indigo-600">{{ story.metadata.ageGroup }}</span>
                </div>
              </div>
              <button
                @click="readStory(story)"
                class="flex items-center gap-2 px-4 py-2 bg-white rounded-xl text-indigo-600 hover:bg-indigo-100 transition-colors shadow-sm hover:shadow-md"
              >
                Read Story
              </button>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-if="savedStories.length === 0" class="text-center py-12">
          <h3 class="text-xl font-medium text-indigo-900 mb-2">No Stories Yet</h3>
          <p class="text-indigo-600 mb-6">Start your first adventure to see it here!</p>
          <button
            @click="startNewStory"
            class="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-violet-500 text-white rounded-xl hover:from-indigo-600 hover:to-violet-600 transition-all shadow-sm hover:shadow-md"
          >
            Create Your First Story
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useSupabase } from '../composables/useSupabase';

const router = useRouter();
const { supabase } = useSupabase();
const username = ref('');
const signUpDate = ref('');
const savedStories = ref([]);
const isLoading = ref(true);
const error = ref(null);

const formatDate = (date) => {
  if (!date) {
    console.warn('Empty date provided to formatDate');
    return '';
  }
  
  try {
    // Try parsing as ISO string first
    const parsedDate = new Date(date);
    
    // Validate the date
    if (isNaN(parsedDate.getTime())) {
      console.error('Invalid date:', date);
      return '';
    }
    
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(parsedDate);
  } catch (error) {
    console.error('Error formatting date:', error, 'for input:', date);
    return '';
  }
};

const readStory = (story) => {
  try {
    console.group('Story Processing for Reading - Choice Data Debug');
    console.log('Initial story data:', {
      id: story.id,
      pages: story.pages.map(page => ({
        pageNumber: page.page_number,
        previous_choice: page.previous_choice,
        selected_choice: page.selected_choice,
        hasChoices: Boolean(page.choices)
      }))
    });

    if (!story.pages || !Array.isArray(story.pages)) {
      throw new Error('Invalid story format: missing pages array');
    }
    
    // Process the story to include only selected choices and proper page structure
    const processedStory = {
      ...story,
      metadata: {
        ...story.metadata,
        totalPages: story.pages.length,
        isReading: true
      },
      pages: story.pages.map((page, index) => {
        // Get the choice that was made for this page
        const nextPage = story.pages[index + 1];
        const choiceMade = nextPage?.previous_choice || page.selected_choice;
        
        const processedPage = {
          ...page,
          pageNumber: index + 1,
          content: page.content || '',
          title: page.title || `Page ${index + 1}`,
          choiceMade: index < story.pages.length - 1 ? choiceMade : null,
          choices: undefined
        };

        console.log(`Processing page ${index + 1}:`, {
          previous_choice: page.previous_choice,
          selected_choice: page.selected_choice,
          nextPagePreviousChoice: nextPage?.previous_choice,
          computedChoiceMade: choiceMade,
          finalChoiceMade: processedPage.choiceMade
        });

        return processedPage;
      })
    };
    
    console.log('Final processed story:', {
      id: processedStory.id,
      pages: processedStory.pages.map(page => ({
        pageNumber: page.pageNumber,
        choiceMade: page.choiceMade
      }))
    });
    
    localStorage.setItem('currentStory', JSON.stringify(processedStory));
    console.log('Stored processed story in localStorage');
    console.groupEnd();
    
    router.push({
      name: 'story-reader',
      params: { id: story.id },
      query: { mode: 'reading' }
    });
  } catch (error) {
    console.error('Error preparing story for reading:', error);
    console.groupEnd();
  }
};

const startNewStory = () => {
  router.push('/');
};

const loadSavedStories = async () => {
  isLoading.value = true;
  error.value = null;

  try {
    console.group('Story Loading - Choice Data Debug');
    console.log('Fetching stories with choice data...');
    
    const { data, error: fetchError } = await supabase
      .from('stories')
      .select(`
        id,
        title,
        created_at,
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
      .order('created_at', { ascending: false });

    if (fetchError) throw fetchError;

    if (data && data.length > 0) {
      // Log the first story's choice data
      const firstStory = data[0];
      console.log('First story raw data:', {
        id: firstStory.id,
        title: firstStory.title,
        pagesCount: firstStory.pages.length,
        pages: firstStory.pages.map(page => ({
          pageNumber: page.page_number,
          previous_choice: page.previous_choice,
          hasChoices: Boolean(page.choices)
        }))
      });
    }

    // Process stories to ensure dates and choices are handled correctly
    savedStories.value = data.map(story => ({
      ...story,
      createdAt: story.created_at
    }));
    
    console.log('Processed stories:', savedStories.value.map(story => ({
      id: story.id,
      pagesWithChoices: story.pages.map(page => ({
        pageNumber: page.page_number,
        previous_choice: page.previous_choice
      }))
    })));
    console.groupEnd();
  } catch (err) {
    console.error('Error loading stories:', err);
    error.value = err.message;
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  loadSavedStories();
});
</script> 