<template>
  <div v-if="!isAuthenticated" class="min-h-screen flex items-center justify-center">
    <div class="text-center">
      <p class="text-indigo-600 mb-4">Please log in to view your profile</p>
      <button
        @click="router.push('/login')"
        class="px-6 py-3 bg-indigo-500 text-white rounded-xl hover:bg-indigo-600 transition-all"
      >
        Log In
      </button>
    </div>
  </div>

  <div v-else class="min-h-screen bg-white p-6 sm:p-8 md:p-12">
    <div class="max-w-4xl mx-auto space-y-8">
      <!-- Loading State -->
      <div v-if="isLoading" class="text-center py-12">
        <p class="text-indigo-600">Loading your stories...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-red-50 text-red-600 p-4 rounded-xl">
        {{ sanitizeErrorMessage(error) }}
      </div>

      <template v-else>
        <!-- User Profile Header -->
        <div class="bg-white rounded-3xl shadow-xl border border-indigo-100/50 p-8">
          <div class="flex items-start gap-6">
            <div class="w-20 h-20 rounded-2xl bg-indigo-500 flex items-center justify-center text-white text-3xl font-bold">
              {{ sanitizeText(username).charAt(0).toUpperCase() }}
            </div>
            <div class="flex-grow">
              <h1 class="text-3xl font-bold text-indigo-900 mb-2">{{ sanitizeText(username) }}</h1>
              <div class="flex items-center gap-4 text-indigo-600">
                <span>Joined {{ formatDate(signUpDate) }}</span>
                <span>{{ savedStories.length }} Stories Created</span>
              </div>
            </div>
            <button
              @click="handleNavigation('/create')"
              class="flex items-center gap-2 px-6 py-3 bg-indigo-500 text-white rounded-xl hover:bg-indigo-600 transition-all shadow-sm hover:shadow-md"
            >
              Create New Story
            </button>
          </div>
        </div>

        <!-- Stories Section -->
        <div class="bg-white rounded-3xl shadow-xl border border-indigo-100/50 p-8">
          <h2 class="text-2xl font-bold text-indigo-900 mb-6">Your Story Collection</h2>

          <div class="space-y-6">
            <div v-for="story in savedStories" :key="story.id" class="bg-indigo-50/50 rounded-2xl p-6 hover:bg-indigo-50 transition-colors">
              <div class="flex items-start justify-between gap-4">
                <div class="flex-grow">
                  <h3 class="text-xl font-bold text-indigo-900 mb-2">{{ sanitizeText(story.title) }}</h3>
                  <div class="flex flex-wrap gap-3 text-sm">
                    <span class="text-indigo-600">Created {{ formatDate(story.created_at) }}</span>
                    <span class="text-indigo-600">{{ sanitizeText(story.metadata?.theme) }}</span>
                    <span class="text-indigo-600">{{ sanitizeText(story.metadata?.ageGroup) }}</span>
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
              @click="handleNavigation('/create')"
              class="inline-flex items-center gap-2 px-6 py-3 bg-indigo-500 text-white rounded-xl hover:bg-indigo-600 transition-all shadow-sm hover:shadow-md"
            >
              Create Your First Story
            </button>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useSupabase } from '../composables/useSupabase';
import createDOMPurify from 'dompurify';

const DOMPurify = createDOMPurify(window);

const router = useRouter();
const { supabase } = useSupabase();
const username = ref('');
const signUpDate = ref('');
const savedStories = ref([]);
const isLoading = ref(true);
const error = ref(null);
const currentUser = ref(null);

const isAuthenticated = computed(() => Boolean(currentUser.value));

// Security utility functions
const sanitizeText = (text) => {
  if (!text) return '';
  return DOMPurify.sanitize(text, { ALLOWED_TAGS: [] });
};

const sanitizeErrorMessage = (errorMessage) => {
  const genericError = 'An error occurred. Please try again.';
  if (!errorMessage) return genericError;
  
  // Only show safe error messages, never expose internal errors
  const safeErrors = {
    'Failed to load story': 'Failed to load story. Please try again.',
    'Invalid story format': 'Story format is invalid. Please try again.',
    'Network error': 'Connection error. Please check your internet connection.'
  };
  
  return safeErrors[errorMessage] || genericError;
};

const handleNavigation = (path) => {
  if (!isAuthenticated.value) {
    router.push('/login');
    return;
  }
  router.push(path);
};

const formatDate = (date) => {
  if (!date) return '';
  
  try {
    const parsedDate = new Date(date);
    
    if (isNaN(parsedDate.getTime())) {
      return '';
    }
    
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(parsedDate);
  } catch (error) {
    return '';
  }
};

const readStory = async (story) => {
  try {
    if (!isAuthenticated.value) {
      router.push('/login');
      return;
    }

    if (!story.pages || !Array.isArray(story.pages)) {
      throw new Error('Invalid story format');
    }

    // Validate story belongs to current user
    const { data: storyData, error: storyError } = await supabase
      .from('stories')
      .select('user_id')
      .eq('id', story.id)
      .single();

    if (storyError || storyData.user_id !== currentUser.value?.id) {
      throw new Error('Unauthorized');
    }
    
    const processedStory = {
      ...story,
      metadata: {
        ...story.metadata,
        totalPages: story.pages.length,
        isReading: true
      },
      pages: story.pages.map((page, index) => {
        const nextPage = story.pages[index + 1];
        const choiceMade = nextPage?.previous_choice || page.selected_choice;
        
        return {
          ...page,
          pageNumber: index + 1,
          content: sanitizeText(page.content) || '',
          title: sanitizeText(page.title) || `Page ${index + 1}`,
          choiceMade: index < story.pages.length - 1 ? sanitizeText(choiceMade) : null,
          choices: undefined
        };
      })
    };
    
    try {
      localStorage.setItem('currentStory', JSON.stringify(processedStory));
    } catch (storageError) {
      console.error('Storage error:', storageError);
      // Fallback to session storage or handle error appropriately
    }
    
    router.push({
      name: 'story-reader',
      params: { id: story.id },
      query: { mode: 'reading' }
    });
  } catch (err) {
    if (err.message === 'Unauthorized') {
      error.value = 'You do not have permission to access this story.';
    } else {
      error.value = 'Failed to load story';
    }
  }
};

const loadSavedStories = async () => {
  isLoading.value = true;
  error.value = null;

  try {
    // Get current user
    const { data: userData, error: authError } = await supabase.auth.getUser();
    if (authError) {
      console.error('Auth error:', authError);
      throw new Error('Authentication failed');
    }

    currentUser.value = userData?.user;
    
    if (!currentUser.value) {
      router.push('/login');
      return;
    }

    // Get user data from auth metadata
    username.value = currentUser.value.user_metadata?.username || currentUser.value.email?.split('@')[0] || 'User';
    signUpDate.value = currentUser.value.created_at;
    
    // Load stories
    const { data: storiesData, error: storiesError } = await supabase
      .from('stories')
      .select(`
        id,
        title,
        created_at,
        metadata,
        user_id,
        pages (
          id,
          page_number,
          content,
          title,
          choices,
          previous_choice
        )
      `)
      .eq('user_id', currentUser.value.id)
      .order('created_at', { ascending: false });

    if (storiesError) {
      console.error('Stories error:', storiesError);
      throw new Error('Failed to load stories');
    }

    savedStories.value = (storiesData || []).map(story => ({
      ...story,
      createdAt: story.created_at
    }));
  } catch (err) {
    console.error('Load error:', err);
    error.value = 'Failed to load profile data';
    savedStories.value = [];
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  loadSavedStories();
});
</script> 