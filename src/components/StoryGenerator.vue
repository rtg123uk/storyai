<template>
  <div class="bg-white shadow sm:rounded-lg p-6">
    <form @submit.prevent="handleStoryGeneration" class="space-y-6">
      <!-- Basic Info -->
      <div>
        <label for="childName" class="block text-sm font-medium text-gray-700">Child's Name</label>
        <input
          type="text"
          id="childName"
          v-model="formData.childName"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          required
        />
      </div>

      <!-- Story Settings -->
      <div class="border-t border-gray-200 pt-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Story Settings</h3>
        
        <div class="space-y-6">
          <div>
            <label for="ageGroup" class="block text-sm font-medium text-gray-700">Age Group</label>
            <select
              id="ageGroup"
              v-model="formData.ageGroup"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            >
              <option value="3-5">3-5 years</option>
              <option value="6-8">6-8 years</option>
              <option value="9-12">9-12 years</option>
            </select>
          </div>

          <div>
            <label for="theme" class="block text-sm font-medium text-gray-700">Story Theme</label>
            <input
              type="text"
              id="theme"
              v-model="formData.theme"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
              placeholder="e.g., space adventure, friendship, nature discovery"
            />
          </div>

          <div>
            <label for="storyLength" class="block text-sm font-medium text-gray-700">Story Length</label>
            <select
              id="storyLength"
              v-model="formData.storyLength"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            >
              <option value="short">Short (5-10 minutes)</option>
              <option value="medium">Medium (10-15 minutes)</option>
              <option value="long">Long (15-20 minutes)</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Interactive Story</label>
            <div class="mt-2">
              <label class="inline-flex items-center">
                <input
                  type="checkbox"
                  v-model="formData.isInteractive"
                  class="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
                <span class="ml-2">Enable interactive elements</span>
              </label>
            </div>
          </div>

          <div>
            <label for="narrationStyle" class="block text-sm font-medium text-gray-700">Narration Style</label>
            <select
              id="narrationStyle"
              v-model="formData.narrationStyle"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            >
              <option value="warm">Warm and Gentle</option>
              <option value="exciting">Exciting and Dynamic</option>
              <option value="calm">Calm and Soothing</option>
              <option value="funny">Fun and Playful</option>
            </select>
          </div>
        </div>
      </div>

      <div class="border-t border-gray-200 pt-6">
        <button
          type="submit"
          :disabled="isGenerating"
          class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <template v-if="isGenerating">
            <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Generating Story...
          </template>
          <template v-else>
            Generate Story
          </template>
        </button>
      </div>
    </form>

    <div v-if="error" class="mt-4 p-4 bg-red-50 text-red-700 rounded-md">
      <p class="font-medium">Error:</p>
      <p class="mt-1">{{ error }}</p>
    </div>

    <StoryViewer
      v-if="generatedStory"
      :story="generatedStory"
      class="mt-8"
    />
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue';
import { useSupabase } from '@/composables/useSupabase';
import { generateStory } from '@/services/ai';
import { marked } from 'marked';
import StoryViewer from './StoryViewer.vue';

const props = defineProps({
  childName: String,
  ageGroup: {
    type: String,
    validator: (value) => ['3-5', '6-8', '9-12'].includes(value)
  },
  theme: String,
  storyLength: {
    type: String,
    validator: (value) => ['short', 'medium', 'long'].includes(value)
  },
  isInteractive: Boolean,
  narrationStyle: String
});

const formData = reactive({
  childName: props.childName || '',
  ageGroup: props.ageGroup || '3-5',
  theme: props.theme || '',
  storyLength: props.storyLength || 'medium',
  isInteractive: props.isInteractive || false,
  narrationStyle: props.narrationStyle || 'warm'
});

const generatedStory = ref(null);
const isGenerating = ref(false);
const error = ref(null);
const { supabase } = useSupabase();

const formattedContent = computed(() => {
  if (!generatedStory.value?.content) return '';
  return marked(generatedStory.value.content);
});

const handleStoryGeneration = async () => {
  console.log('Starting story generation with data:', formData);
  isGenerating.value = true;
  error.value = null;

  try {
    // Generate the story using AI service
    console.log('Calling AI service...');
    const story = await generateStory(formData);
    console.log('Received story:', story);
    
    if (!story) {
      throw new Error('No story was generated');
    }

    generatedStory.value = story;

    // Save to Supabase
    console.log('Saving to Supabase...');
    const { data, error: dbError } = await supabase.from('stories').insert({
      title: story.title,
      pages: story.pages,
      metadata: story.metadata
    }).select();

    if (dbError) {
      console.error('Supabase error:', dbError);
      throw new Error(`Database error: ${dbError.message}`);
    }

    console.log('Story saved successfully:', data);
  } catch (e) {
    console.error('Error in story generation:', e);
    error.value = e.message || 'An unexpected error occurred while generating the story';
  } finally {
    isGenerating.value = false;
  }
};
</script>

<style scoped>
.prose {
  @apply text-gray-900;
}

.prose img {
  @apply rounded-lg shadow-md;
}

audio {
  @apply rounded-md shadow-sm;
}

audio::-webkit-media-controls-panel {
  @apply bg-gray-100;
}
</style> 