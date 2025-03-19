import { createRouter, createWebHistory } from 'vue-router';
import StoryForm from '../components/StoryForm.vue';
import CustomStoryForm from '../components/CustomStoryForm.vue';
import StoryReader from '../components/StoryReader.vue';
import UserProfile from '../components/UserProfile.vue';
import Landing from '../views/Landing.vue';
import StoryView from '../views/StoryView.vue';
import CustomStoryView from '../views/CustomStoryView.vue';
import { useSupabase } from '../composables/useSupabase';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'landing',
      component: Landing
    },
    {
      path: '/create',
      name: 'create',
      component: StoryForm,
      meta: { requiresAuth: true }
    },
    {
      path: '/custom-story/create',
      name: 'create-custom',
      component: CustomStoryForm,
      meta: { requiresAuth: true }
    },
    {
      path: '/custom-story',
      name: 'custom-story',
      component: CustomStoryView,
      meta: { requiresAuth: true }
    },
    {
      path: '/story',
      name: 'story',
      component: StoryView,
      meta: { requiresAuth: true }
    },
    {
      path: '/profile',
      name: 'profile',
      component: UserProfile,
      meta: { requiresAuth: true }
    },
    {
      path: '/story/:id',
      name: 'story-reader',
      component: StoryReader,
      props: true,
      meta: { requiresAuth: true }
    }
  ]
});

// Navigation guard
router.beforeEach(async (to, from) => {
  console.group('Router Navigation Guard');
  console.log('Navigating to:', to.fullPath);
  console.log('Navigating from:', from.fullPath);
  console.log('Route meta:', to.meta);

  // Don't redirect if already on landing with auth params
  if (to.name === 'landing' && to.query.auth === 'required') {
    console.log('Already on landing with auth params, allowing navigation');
    console.groupEnd();
    return true;
  }

  // Check if route requires authentication
  if (to.meta.requiresAuth) {
    const { user } = useSupabase();
    console.log('Auth required, checking user state:', user.value ? 'authenticated' : 'unauthenticated');
    
    // If user is not logged in, redirect to landing page with a returnTo parameter
    if (!user.value) {
      console.log('User not authenticated, redirecting to landing');
      console.groupEnd();
      
      // Prevent redirect loop by checking if we're already handling auth
      if (from.query.auth === 'required' || to.query.auth === 'required') {
        console.log('Preventing redirect loop - already handling auth');
        return false;
      }
      
      // Only redirect if we're not already on the landing page
      if (to.name !== 'landing') {
        return {
          name: 'landing',
          query: { 
            auth: 'required',
            returnTo: to.fullPath
          },
          replace: true // Use replace instead of push to avoid browser history issues
        };
      }
    }
    console.log('User authenticated, allowing navigation');
  } else {
    console.log('No auth required for this route');
  }
  
  console.groupEnd();
  return true;
});

export default router;