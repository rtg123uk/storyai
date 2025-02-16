<template>
  <div class="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-12 px-4 sm:px-6 lg:px-8">
    <Card variant="fun" class="max-w-4xl mx-auto">
      <div class="p-8">
        <h1 class="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600 mb-8">
          Your Story Collection ✨
        </h1>

        <div v-if="isLoading" class="text-center py-12">
          <Progress variant="fun" :value="50" class="max-w-md mx-auto mb-4" />
          <p class="text-indigo-600">Loading your magical stories...</p>
        </div>

        <div v-else-if="stories.length === 0" class="text-center py-12">
          <p class="text-xl text-indigo-600 mb-6">You haven't saved any stories yet!</p>
          <Button @click="router.push('/')" variant="fun" size="lg">
            Create Your First Story
          </Button>
        </div>

        <div v-else class="grid gap-6">
          <Card 
            v-for="story in stories" 
            :key="story.id"
            variant="interactive"
            class="p-6"
          >
            <div class="flex items-start justify-between">
              <div>
                <h3 class="text-2xl font-bold text-indigo-900 mb-2">
                  {{ story.title }}
                </h3>
                <div class="flex gap-2 mb-4">
                  <Badge variant="outline">{{ story.metadata.theme }}</Badge>
                  <Badge variant="outline">{{ story.metadata.ageGroup }} years</Badge>
                  <Badge variant="outline">{{ story.pages.length }} pages</Badge>
                </div>
                <p class="text-indigo-600">
                  Created on {{ formatDate(story.metadata.createdAt) }}
                </p>
              </div>
              <Button @click="readStory(story)" variant="fun" size="sm">
                Read Again
              </Button>
            </div>
          </Card>
        </div>

        <div class="mt-8 flex justify-center">
          <Button @click="router.push('/')" variant="outline" size="lg">
            Create New Story
          </Button>
        </div>
      </div>
    </Card>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useSupabase } from '../composables/useSupabase';
import Card from '../components/ui/Card.vue';
import Button from '../components/ui/Button.vue';
import Badge from '../components/ui/Badge.vue';
import Progress from '../components/ui/Progress.vue';

const router = useRouter();
const route = useRoute();
const { supabase } = useSupabase();
const stories = ref([]);
const isLoading = ref(true);

// Load stories function
const loadStories = async () => {
  try {
    isLoading.value = true;
    const { data, error } = await supabase
      .from('stories')
      .select(`
        *,
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

    if (error) throw error;
    stories.value = data || [];
  } catch (error) {
    console.error('Error loading stories:', error);
    stories.value = [];
  } finally {
    isLoading.value = false;
  }
};

// Initial load
onMounted(() => {
  loadStories();
});

// Add navigation event listener to reload data when navigating back
const handleNavigation = (event) => {
  if (event.type === 'popstate') {
    loadStories();
  }
};

onMounted(() => {
  window.addEventListener('popstate', handleNavigation);
});

onBeforeUnmount(() => {
  window.removeEventListener('popstate', handleNavigation);
});

const formatDate = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const readStory = async (story) => {
  try {
    console.log('Reading story:', story);
    isLoading.value = true;
    
    // Get the complete story with all pages from the database
    const { data: completeStory, error } = await supabase
      .from('stories')
      .select(`
        *,
        pages (
          id,
          page_number,
          content,
          title,
          choices,
          previous_choice
        )
      `)
      .eq('id', story.id)
      .order('page_number', { foreignTable: 'pages' })
      .single();

    if (error) {
      console.error('Database error:', error);
      throw new Error(`Failed to load story: ${error.message}`);
    }
    
    if (!completeStory) {
      console.error('Story not found');
      throw new Error('Story not found');
    }

    console.log('Retrieved complete story:', completeStory);
    
    // Process the story data
    const processedStory = {
      ...completeStory,
      pages: completeStory.pages.map(page => ({
        ...page,
        pageNumber: page.page_number,
        choiceMade: page.previous_choice
      }))
    };
    
    // Store the processed story in localStorage
    localStorage.setItem('currentStory', JSON.stringify(processedStory));
    console.log('Stored story in localStorage');

    // Navigate to story reader view
    await router.push({
      name: 'story-reader',
      params: { id: story.id }
    });
  } catch (error) {
    console.error('Error preparing story for reading:', error);
    throw error;
  } finally {
    isLoading.value = false;
  }
};
</script> 