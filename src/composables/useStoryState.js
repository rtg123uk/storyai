import { ref, provide, inject } from 'vue';

const StoryStateSymbol = Symbol('StoryState');

export function provideStoryState() {
  const storyState = ref(null);

  const setStoryState = (state) => {
    console.log('Setting story state:', state);
    storyState.value = {
      ...state,
      createdAt: state.createdAt || new Date().toISOString()
    };
  };

  const clearStoryState = () => {
    console.log('Clearing story state');
    storyState.value = null;
  };

  const state = {
    storyState,
    setStoryState,
    clearStoryState
  };

  provide(StoryStateSymbol, state);

  return state;
}

export function useStoryState() {
  const state = inject(StoryStateSymbol);
  if (!state) {
    console.error('Story state not provided. Make sure to call provideStoryState first.');
    throw new Error('Story state not provided');
  }
  return state;
} 