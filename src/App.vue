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

    <!-- Auth Modal -->
    <Transition name="fade">
      <div 
        v-if="showAuthModal" 
        class="fixed inset-0 z-[100] overflow-y-auto"
        @vue:before-mount="() => console.log('Auth Modal - Before Mount')"
        @vue:mounted="() => console.log('Auth Modal - Mounted')"
        @vue:before-unmount="() => console.log('Auth Modal - Before Unmount')"
        @vue:unmounted="() => console.log('Auth Modal - Unmounted')"
      >
        <div class="fixed inset-0 bg-black/50 backdrop-blur-sm"></div>
        <div class="fixed inset-0 flex items-center justify-center p-4">
          <Card variant="fun" class="w-full max-w-md mx-auto relative bg-white shadow-xl rounded-lg">
            <AuthModal 
              :is-open="true"
              @success="handleAuthSuccess"
              @close="handleAuthModalClose"
              class="bg-white"
            />
          </Card>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, onMounted, provide, watch, reactive, watchEffect } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import Header from './components/ui/Header.vue';
import LoadingOverlay from './components/LoadingOverlay.vue';
import AuthModal from './components/ui/AuthModal.vue';
import { generateStoryPage } from './services/ai';
import { provideStoryState } from './composables/useStoryState';
import { useSupabase } from './composables/useSupabase';

// Initialize story state first
const storyState = provideStoryState();

const router = useRouter();
const route = useRoute();
const { user, isLoading: authLoading } = useSupabase();

const isLoading = ref(false);
const currentStory = ref(null);
const errorMessage = ref(null);
const showAuthModal = ref(false);
const returnTo = ref('');

// Provide auth state to child components
provide('authState', {
  showAuthModal,
  returnTo
});

// Add watch effect for route changes
watch(
  () => route.fullPath,
  (newPath, oldPath) => {
    console.group('Route Change Detection');
    console.log('Route changed:', { from: oldPath, to: newPath });
    console.log('Current query params:', route.query);
    console.log('Auth state at route change:', {
      user: !!user.value,
      authLoading: authLoading.value,
      showModal: showAuthModal.value,
      returnTo: returnTo.value
    });
    console.groupEnd();
  },
  { immediate: true }
);

// Watch auth loading state
watch(
  authLoading,
  (newVal, oldVal) => {
    console.group('Auth Loading State Change');
    console.log('Auth loading changed:', { from: oldVal, to: newVal });
    console.log('Current route:', route.fullPath);
    console.log('User state:', !!user.value);
    console.log('Modal state:', showAuthModal.value);
    console.groupEnd();

    // If auth finished loading and we have auth required query param
    if (!newVal && route.query.auth === 'required' && !user.value) {
      console.log('Auth finished loading, showing modal for auth required');
      showAuthModal.value = true;
      returnTo.value = route.query.returnTo || '/create';
    }
  }
);

// Watch user state
watch(
  user,
  (newUser, oldUser) => {
    console.group('User State Change');
    console.log('User changed:', { 
      hadUser: !!oldUser, 
      hasUser: !!newUser,
      currentRoute: route.fullPath,
      queryParams: route.query
    });
    console.groupEnd();
  }
);

// Add route watcher to handle auth requirements
watch(
  () => route.query,
  (newQuery) => {
    console.group('Query Params Change');
    console.log('New query params:', newQuery);
    console.log('Auth state:', { user: !!user.value, loading: authLoading.value });
    
    if (newQuery.auth === 'required' && !user.value && !authLoading.value) {
      console.log('Auth required by query params, showing modal');
      showAuthModal.value = true;
      returnTo.value = newQuery.returnTo || '/create';
    }
    console.groupEnd();
  },
  { immediate: true }
);

// Add reactive effect to log modal state changes
watch(showAuthModal, (newVal, oldVal) => {
  console.group('Auth Modal Visibility Change');
  console.log('Modal visibility changed:', { from: oldVal, to: newVal });
  
  // Get modal element
  const modalElement = document.querySelector('.fixed.inset-0.z-\\[100\\]');
  console.log('Modal parent element exists:', !!modalElement);
  console.log('Modal backdrop exists:', !!document.querySelector('.bg-black\\/50'));
  
  // Only try to get computed styles if elements exist
  if (modalElement) {
    console.log('Current z-index hierarchy:', {
      modalZIndex: getComputedStyle(modalElement).zIndex,
      otherHighZElements: Array.from(document.querySelectorAll('[class*="z-"]:not(.z-0)')).map(el => ({
        element: el.tagName,
        zIndex: getComputedStyle(el).zIndex
      }))
    });
  }
  console.groupEnd();
});

// Update the watchEffect to use the correct refs
watchEffect(() => {
  console.group('Auth State Update');
  console.log('Current auth state:', {
    showModal: showAuthModal.value,
    returnTo: returnTo.value,
    modalMounted: !!document.querySelector('.fixed.inset-0.z-\\[100\\]')
  });
  console.groupEnd();
});

// Component setup
onMounted(() => {
  console.group('App Mounted');
  console.log('Initial mount state:', {
    route: route.fullPath,
    query: route.query,
    authLoading: authLoading.value,
    user: !!user.value,
    showModal: showAuthModal.value,
    returnTo: returnTo.value
  });

  // Only show auth modal if auth is required, user is not authenticated, and auth is not loading
  if (route.query.auth === 'required' && !user.value && !authLoading.value) {
    console.log('Showing auth modal on mount');
    showAuthModal.value = true;
    returnTo.value = route.query.returnTo || '/create';
  }

  // Load existing story if available
  const savedStory = localStorage.getItem('currentStory');
  const currentRoute = router.currentRoute.value.name;
  if (savedStory && currentRoute !== 'landing') {
    const parsedStory = JSON.parse(savedStory);
    currentStory.value = parsedStory;
    storyState.setStoryState(parsedStory);
  }
  console.groupEnd();
});

const handleAuthSuccess = async (authenticatedUser) => {
  console.group('Auth Success Handler');
  console.log('Auth success, redirecting to:', returnTo.value);
  console.log('Current route:', route.fullPath);
  console.log('Modal state before close:', showAuthModal.value);
  showAuthModal.value = false;
  
  // Clear auth query params first
  if (route.query.auth) {
    await router.replace({ path: route.path });
  }
  
  // Then navigate to return path
  try {
    await router.push(returnTo.value || '/create');
    console.log('Navigation completed successfully');
    returnTo.value = ''; // Clear returnTo after successful navigation
  } catch (error) {
    console.error('Navigation failed:', error);
  }
  console.groupEnd();
};

const handleAuthModalClose = () => {
  console.group('Auth Modal Close Handler');
  console.log('Modal closing, current state:', showAuthModal.value);
  console.log('Current route:', route.fullPath);
  console.log('Query params:', route.query);
  showAuthModal.value = false;
  returnTo.value = ''; // Clear returnTo on modal close
  
  // If we came from another page, clear the query params
  if (route.query.auth) {
    console.log('Clearing auth query params');
    router.replace({ path: route.path });
  }
  console.groupEnd();
};

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