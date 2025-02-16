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
              <span class="flex items-center gap-2">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Joined {{ formatDate(signUpDate) }}
              </span>
              <span class="flex items-center gap-2">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                {{ savedStories.length }} Stories Created
              </span>
            </div>
          </div>
          <button
            @click="startNewStory"
            class="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-violet-500 text-white rounded-xl hover:from-indigo-600 hover:to-violet-600 transition-all shadow-sm hover:shadow-md"
          >
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span class="font-medium">Create New Story</span>
          </button>
        </div>
      </div>

      <!-- Stories Section -->
      <div class="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-indigo-100/50 p-8">
        <h2 class="text-2xl font-bold text-indigo-900 mb-6 flex items-center gap-3">
          <svg class="w-6 h-6 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          Your Story Collection
        </h2>

        <div class="space-y-6">
          <div v-for="story in savedStories" :key="story.id" class="bg-indigo-50/50 rounded-2xl p-6 hover:bg-indigo-50 transition-colors">
            <div class="flex items-start justify-between gap-4">
              <div class="flex-grow">
                <h3 class="text-xl font-bold text-indigo-900 mb-2">{{ story.title }}</h3>
                <div class="flex flex-wrap gap-3 text-sm">
                  <span class="flex items-center gap-1.5 text-indigo-600">
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Created {{ formatDate(story.createdAt) }}
                  </span>
                  <span class="flex items-center gap-1.5 text-indigo-600">
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    For {{ story.metadata.childName }}
                  </span>
                  <span class="flex items-center gap-1.5 text-indigo-600">
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    {{ story.metadata.theme }}
                  </span>
                </div>
              </div>
              <button
                @click="readStory(story)"
                class="flex items-center gap-2 px-4 py-2 bg-white rounded-xl text-indigo-600 hover:bg-indigo-100 transition-colors shadow-sm hover:shadow-md"
              >
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <span class="font-medium">Read Story</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-if="savedStories.length === 0" class="text-center py-12">
          <div class="w-24 h-24 mx-auto mb-6 text-indigo-300">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h3 class="text-xl font-medium text-indigo-900 mb-2">No Stories Yet</h3>
          <p class="text-indigo-600 mb-6">Start your first adventure to see it here!</p>
          <button
            @click="startNewStory"
            class="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-violet-500 text-white rounded-xl hover:from-indigo-600 hover:to-violet-600 transition-all shadow-sm hover:shadow-md"
          >
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span class="font-medium">Create Your First Story</span>
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
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const readStory = (story) => {
  try {
    if (!story.pages || !Array.isArray(story.pages)) {
      throw new Error('Invalid story format: missing pages array');
    }

    console.log('Processing story for reading:', story);
    
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
        const choiceMade = nextPage?.previousChoice || page.selectedChoice;
        
        return {
          ...page,
          pageNumber: index + 1,
          content: page.content || '',
          title: page.title || `Page ${index + 1}`,
          choiceMade: index < story.pages.length - 1 ? choiceMade : null,
          choices: undefined
        };
      })
    };
    
    console.log('Processed story for reading:', processedStory);
    localStorage.setItem('currentStory', JSON.stringify(processedStory));
    
    router.push({
      name: 'story-reader',
      params: { id: story.id },
      query: { mode: 'reading' }
    });
  } catch (error) {
    console.error('Error preparing story for reading:', error);
  }
};

const startNewStory = () => {
  router.push('/');
};

const loadSavedStories = async () => {
  isLoading.value = true;
  error.value = null;

  try {
    const { data, error: fetchError } = await supabase
      .from('stories')
      .select('*, pages, metadata')
      .order('created_at', { ascending: false });

    if (fetchError) throw fetchError;

    savedStories.value = data;
    console.log('Loaded stories with complete data:', data);
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