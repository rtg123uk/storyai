<template>
  <main>
    <StoryForm @start-story="startStory" />
  </main>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { useStoryState } from '../composables/useStoryState';
import StoryForm from '../components/StoryForm.vue';

const router = useRouter();
const { setStoryState } = useStoryState();

const startStory = (formData) => {
  // Store form data in story state
  setStoryState({
    childName: formData.childName,
    ageGroup: formData.ageGroup,
    theme: formData.theme,
    storyLength: formData.storyLength
  });

  // Navigate to story view without query parameters
  router.push({ name: 'story' });
};
</script> 