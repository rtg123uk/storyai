<template>
  <div class="min-h-screen">
    <LoadingOverlay v-if="isLoading" :messages="[
      'Opening your storybook...',
      'Gathering the magic...',
      'Preparing your adventure...',
      'Setting the scene...',
      'Almost ready...'
    ]" />
    
    <div v-else>
      <StoryViewer
        v-if="story"
        :story="story"
        :is-reading="story.isReading"
        @restart="handleRestart"
        @save-story="handleSaveStory"
        @make-choice="handleChoice"
      />
      
      <div v-else class="flex flex-col items-center justify-center min-h-screen">
        <p class="text-xl text-red-600">{{ errorMessage || 'Story not found' }}</p>
        <button 
          @click="router.push('/create')" 
          class="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          Create New Story
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useStoryState } from '../composables/useStoryState';
import { useSupabase } from '../composables/useSupabase';
import StoryViewer from '../components/StoryViewer.vue';
import { generateStoryPage } from '../services/ai';
import LoadingOverlay from '../components/LoadingOverlay.vue';

const router = useRouter();
const route = useRoute();
const { storyState, setStoryState, clearStoryState } = useStoryState();
const { supabase, user, saveStory } = useSupabase();
const story = ref(null);
const isLoading = ref(true);
const errorMessage = ref('');

const initializeStory = async () => {
  try {
    console.group('📚 Story Initialization');
    console.log('Checking story state:', storyState.value);
    
    if (!storyState.value) {
      console.error('No story state found');
      errorMessage.value = 'No story data found. Please create a new story.';
      isLoading.value = false;
      console.groupEnd();
      return;
    }

    // Initialize the story with the state data
    story.value = {
      title: storyState.value.title || `${storyState.value.childName}'s ${storyState.value.theme} Adventure`,
      pages: storyState.value.pages || [],
      metadata: {
        childName: storyState.value.childName,
        ageGroup: storyState.value.ageGroup,
        theme: storyState.value.theme,
        currentPage: storyState.value.metadata?.currentPage || 1,
        totalPages: storyState.value.metadata?.totalPages || 5,
        storyPath: storyState.value.metadata?.storyPath || [0],
        createdAt: storyState.value.metadata?.createdAt || new Date().toISOString(),
        useVoice: storyState.value.metadata?.useVoice || false,
        selectedVoiceId: storyState.value.metadata?.selectedVoiceId || null
      }
    };

    // If we don't have any pages yet, generate the first page
    if (!story.value.pages.length) {
      console.log('Generating first page for new story');
      const firstPage = await generateStoryPage({
        childName: story.value.metadata.childName,
        ageGroup: story.value.metadata.ageGroup,
        theme: story.value.metadata.theme,
        isFirstPage: true,
        currentPage: 1,
        totalPages: story.value.metadata.totalPages,
        previousPages: [],
        metadata: {
          useCustomName: storyState.value.metadata?.useCustomName || false,
          includeFriends: storyState.value.metadata?.includeFriends || false,
          friendNames: storyState.value.metadata?.friendNames || []
        }
      });

      if (!firstPage) {
        throw new Error('Failed to generate first page');
      }

      story.value.pages = [firstPage];
      setStoryState(story.value);
      localStorage.setItem('currentStory', JSON.stringify(story.value));
    }

    console.log('Story initialized:', story.value);
    isLoading.value = false;
  } catch (error) {
    console.error('Error initializing story:', error);
    errorMessage.value = 'An error occurred while loading your story.';
    isLoading.value = false;
  } finally {
    console.groupEnd();
  }
};

const handleChoice = async (choice) => {
  console.group('Story Choice Handler');
  console.log('Choice received:', choice);
  console.log('Current story state:', story.value);

  try {
    isLoading.value = true;
    const nextPageNumber = story.value.pages.length + 1;
    
    // If we already have this page in the story, just update the current page
    if (nextPageNumber <= story.value.pages.length) {
      story.value.metadata.currentPage = nextPageNumber;
      setStoryState(story.value);
      localStorage.setItem('currentStory', JSON.stringify(story.value));
      console.log('Moving to existing page:', nextPageNumber);
      return;
    }
    
    console.log('Generating next page:', nextPageNumber);
    const newPage = await generateStoryPage({
      childName: story.value.metadata.childName,
      ageGroup: story.value.metadata.ageGroup,
      theme: story.value.metadata.theme,
      choiceMade: choice,
      isFirstPage: false,
      currentPage: nextPageNumber,
      totalPages: story.value.metadata.totalPages,
      previousPages: story.value.pages
    });
    
    if (!newPage) {
      throw new Error('Failed to generate new page');
    }

    // Update story with new page in memory
    story.value.pages.push(newPage);
    story.value.metadata.currentPage = nextPageNumber;
    
    // Update both state management systems
    setStoryState(story.value);
    localStorage.setItem('currentStory', JSON.stringify(story.value));
    
    console.log('Story updated with new page:', story.value);
  } catch (error) {
    console.error('Error handling choice:', error);
    errorMessage.value = 'Failed to generate the next part of the story. Please try again.';
  } finally {
    isLoading.value = false;
    console.groupEnd();
  }
};

const handleSaveStory = async () => {
  try {
    if (!user.value) {
      errorMessage.value = 'Please sign in to save your story';
      return;
    }

    isLoading.value = true;
    const { data, error } = await saveStory({
      title: story.value.title,
      pages: story.value.pages,
      metadata: story.value.metadata
    });

    if (error) throw error;
    router.push('/profile');
  } catch (error) {
    console.error('Error saving story:', error);
    errorMessage.value = 'Failed to save your story. Please try again.';
  } finally {
    isLoading.value = false;
  }
};

const handleRestart = () => {
  clearStoryState();
  router.push('/');
};

// Add method to handle page navigation
const handlePageNavigation = (pageNumber) => {
  console.log('Navigating to page:', pageNumber);
  if (pageNumber > 0 && pageNumber <= story.value.pages.length) {
    story.value.metadata.currentPage = pageNumber;
    setStoryState(story.value);
    localStorage.setItem('currentStory', JSON.stringify(story.value));
  }
};

onMounted(() => {
  initializeStory();
});
</script> 