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
router.beforeEach(async (to) => {
  // Check if route requires authentication
  if (to.meta.requiresAuth) {
    const { user } = useSupabase();
    
    // If user is not logged in, redirect to landing page with a returnTo parameter
    if (!user.value) {
      console.log('Protected route requires auth, redirecting to landing page:', to.path);
      return {
        name: 'landing',
        query: { 
          auth: 'required',
          returnTo: to.fullPath
        }
      };
    }
  }
  // Allow all non-protected routes
  return true;
});

export default router;