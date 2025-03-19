<template>
  <div class="min-h-screen bg-gradient-to-br from-teal-50 via-blue-50 to-cyan-50">
    <!-- Global Header -->
    <Header />
    
    <!-- Main Content -->
    <main>
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component 
            :is="Component" 
            :story="currentStory" 
            :maxPages="currentStory?.metadata?.storyLength || 5"
            @restart="handleRestart" 
            @start-story="handleStartStory" 
          />
        </transition>
      </router-view>
    </main>

    <!-- Loading Overlay -->
    <LoadingOverlay v-if="isLoading" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import Header from './components/ui/Header.vue';
import LoadingOverlay from './components/LoadingOverlay.vue';
import { generateStoryPage } from './services/ai';
import { provideStoryState } from './composables/useStoryState';

// Initialize story state first
const storyState = provideStoryState();

const router = useRouter();
const isLoading = ref(false);
const currentStory = ref(null);
const errorMessage = ref(null);

const handleRestart = () => {
  // Clear any existing story state
  localStorage.removeItem('currentStory');
  currentStory.value = null;
  storyState.clearStoryState();
  router.push('/');
};

const handleStartStory = async (storyData) => {
  try {
    console.log('Starting story generation with data:', storyData);
    isLoading.value = true;
    
    // Validate required fields
    if (!storyData.childName || !storyData.ageGroup || !storyData.theme) {
      throw new Error('Missing required story data');
    }
    
    // Parse story length to get the number
    const totalPages = parseInt(storyData.storyLength?.toString()) || 5;
    console.log('Parsed total pages:', totalPages);
    
    // Initialize new story with the form data
    const newStory = {
      id: Date.now().toString(),
      title: `${storyData.childName}'s ${storyData.theme} Adventure`,
      metadata: {
        childName: storyData.childName,
        ageGroup: storyData.ageGroup,
        theme: storyData.theme,
        storyLength: totalPages,
        totalPages: totalPages,
        currentPage: 0,
        useVoice: storyData.useVoice || false,
        selectedVoiceId: storyData.selectedVoiceId || null,
        includeFriends: storyData.metadata?.includeFriends || false,
        friendNames: storyData.metadata?.friendNames || [],
        numberOfFriends: storyData.metadata?.numberOfFriends || 0
      },
      createdAt: new Date().toISOString(),
      pages: []
    };
    console.log('Initialized new story:', newStory);

    // Generate the first page
    console.log('Generating first page...');
    const firstPage = await generateStoryPage({
      childName: storyData.childName,
      ageGroup: storyData.ageGroup,
      theme: storyData.theme,
      isFirstPage: true,
      currentPage: 0,
      totalPages: totalPages,
      previousPages: [],
      metadata: {
        useCustomName: storyData.metadata?.useCustomName || false,
        includeFriends: storyData.metadata?.includeFriends || false,
        friendNames: storyData.metadata?.friendNames || []
      }
    });

    console.log('Generated first page:', firstPage);

    if (!firstPage) {
      console.error('First page generation failed - no data returned');
      throw new Error('Failed to generate the first page');
    }

    newStory.pages = [firstPage];
    newStory.metadata.currentPage = 1;
    
    // Save current story
    currentStory.value = newStory;
    storyState.setStoryState(newStory);
    localStorage.setItem('currentStory', JSON.stringify(newStory));
    console.log('Saved story to state and localStorage');
    
    // Navigate to story viewer
    console.log('Attempting navigation to /story');
    await router.push('/story');
    console.log('Navigation completed');
  } catch (error) {
    console.error('Error starting story:', error);
    errorMessage.value = error.message || 'Failed to start story';
  } finally {
    isLoading.value = false;
  }
};

// Load existing story on mount
onMounted(() => {
  const savedStory = localStorage.getItem('currentStory');
  const currentRoute = router.currentRoute.value.name;
  if (savedStory && currentRoute !== 'landing') {
    const parsedStory = JSON.parse(savedStory);
    currentStory.value = parsedStory;
    storyState.setStoryState(parsedStory);
  }
});
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=ABeeZee:ital@0;1&display=swap');

/* Apply ABeeZee font globally */
:root {
  font-family: 'ABeeZee', sans-serif;
}

body {
  margin: 0;
  padding: 0;
  font-family: 'ABeeZee', sans-serif;
}

/* Add any global styles here */

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style> 