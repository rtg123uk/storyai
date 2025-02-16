<template>
  <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
    <div class="px-4 py-6 sm:px-0">
      <h1 class="text-3xl font-bold text-gray-900 mb-8">Your Stories</h1>
      
      <div v-if="loading" class="text-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
        <p class="mt-4 text-gray-600">Loading stories...</p>
      </div>

      <div v-else-if="stories.length === 0" class="text-center py-12">
        <p class="text-gray-600">No stories found. Start by creating your first story!</p>
        <router-link
          to="/"
          class="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
        >
          Create New Story
        </router-link>
      </div>

      <div v-else class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div
          v-for="story in stories"
          :key="story.id"
          class="bg-white overflow-hidden shadow rounded-lg"
        >
          <div class="p-6">
            <h2 class="text-xl font-semibold text-gray-900 mb-2">{{ story.title }}</h2>
            <div class="flex items-center text-sm text-gray-500 mb-4">
              <span>{{ formatDate(story.created_at) }}</span>
              <span class="mx-2">•</span>
              <span>{{ story.age_group }} years</span>
            </div>
            <p class="text-gray-600 mb-4 line-clamp-3">
              {{ getStoryPreview(story.content) }}
            </p>
            <div class="flex items-center justify-between">
              <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
                :class="getThemeClass(story.theme)"
              >
                {{ story.theme }}
              </span>
              <div class="flex gap-2">
                <router-link
                  :to="{ name: 'story-editor', params: { id: story.id }}"
                  class="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
                >
                  Edit
                </router-link>
                <button
                  @click="openStory(story)"
                  class="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
                >
                  Read
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useSupabase } from '@/composables/useSupabase';
import { format } from 'date-fns';

const { getStories } = useSupabase();
const stories = ref([]);
const loading = ref(true);

onMounted(async () => {
  try {
    stories.value = await getStories();
  } finally {
    loading.value = false;
  }
});

const formatDate = (date) => {
  return format(new Date(date), 'MMM d, yyyy');
};

const getStoryPreview = (content) => {
  if (typeof content === 'string') {
    return content.slice(0, 150) + '...';
  }
  return JSON.stringify(content).slice(0, 150) + '...';
};

const getThemeClass = (theme) => {
  const themes = {
    adventure: 'bg-green-100 text-green-800',
    fantasy: 'bg-purple-100 text-purple-800',
    science: 'bg-blue-100 text-blue-800',
    nature: 'bg-yellow-100 text-yellow-800',
    default: 'bg-gray-100 text-gray-800'
  };
  return themes[theme.toLowerCase()] || themes.default;
};

const openStory = (story) => {
  // TODO: Implement story detail view
  console.log('Opening story:', story.id);
};
</script> 