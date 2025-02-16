import { createRouter, createWebHistory } from 'vue-router';
import StoryForm from '../components/StoryForm.vue';
import CustomStoryForm from '../components/CustomStoryForm.vue';
import StoryReader from '../components/StoryReader.vue';
import UserProfile from '../components/UserProfile.vue';
import Landing from '../views/Landing.vue';
import StoryView from '../views/StoryView.vue';
import CustomStoryView from '../views/CustomStoryView.vue';

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
      component: StoryForm
    },
    {
      path: '/custom-story/create',
      name: 'create-custom',
      component: CustomStoryForm
    },
    {
      path: '/custom-story',
      name: 'custom-story',
      component: CustomStoryView
    },
    {
      path: '/story',
      name: 'story',
      component: StoryView
    },
    {
      path: '/profile',
      name: 'profile',
      component: UserProfile
    },
    {
      path: '/story/:id',
      name: 'story-reader',
      component: StoryReader,
      props: true
    }
  ]
});

export default router;