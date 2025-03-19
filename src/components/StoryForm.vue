<template>
  <div class="min-h-screen bg-gradient-to-br from-teal-50 via-blue-50 to-cyan-50 font-abeezee">
    <!-- Background Orbs -->
    <div class="absolute inset-0 z-0">
      <div class="absolute top-0 left-1/4 w-96 h-96 bg-teal-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
      <div class="absolute top-1/4 right-1/4 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
      <div class="absolute -bottom-32 left-1/3 w-96 h-96 bg-cyan-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
    </div>

    <div class="relative py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-4xl mx-auto">
        <Card variant="fun" elevation="lg" class="p-8 relative overflow-hidden">
          <!-- Magical Header -->
          <div class="text-center mb-12 relative">
            <div class="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-gradient-to-r from-teal-300/20 via-blue-300/20 to-cyan-300/20 rounded-full blur-3xl -z-10 animate-pulse"></div>
            <h2 class="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-600 via-blue-600 to-cyan-600 animate-float">
              ✨ Create Your Own Story ✨
            </h2>
            <p class="mt-4 text-xl text-teal-600 font-medium">Let's embark on a magical journey together!</p>
          </div>

          <div class="space-y-12">
            <!-- Basic Info Section -->
            <section class="space-y-6">
              <h3 class="text-2xl font-bold text-teal-900 text-center">Character Details</h3>
              <div class="max-w-2xl mx-auto space-y-6">
                <div class="p-6 bg-white/50 rounded-xl space-y-4">
                  <div class="flex items-center space-x-3">
                    <input 
                      type="checkbox" 
                      v-model="formData.useCustomName"
                      class="h-4 w-4 text-teal-600 rounded border-gray-300"
                    >
                    <label class="text-sm text-teal-700 font-medium">Use a real name</label>
                  </div>

                  <Input
                    v-if="formData.useCustomName"
                    v-model="formData.customName"
                    label="Child's Real Name"
                    placeholder="Enter the child's real name"
                    :required="true"
                  />
                  <Input
                    v-else
                    v-model="formData.childName"
                    label="Character Name"
                    placeholder="Enter a character name"
                    :required="true"
                  />

                  <Input
                    v-model="formData.ageGroup"
                    label="Age"
                    placeholder="Enter child's age"
                    :required="true"
                  />

                  <div class="space-y-4">
                    <div class="flex items-center space-x-3">
                      <input 
                        type="checkbox" 
                        v-model="formData.includeFriends"
                        class="h-4 w-4 text-teal-600 rounded border-gray-300"
                      >
                      <label class="text-sm text-teal-700 font-medium">Include friends in the story</label>
                    </div>

                    <div v-if="formData.includeFriends" class="space-y-4">
                      <Input
                        v-model="formData.numberOfFriends"
                        label="Number of Friends"
                        placeholder="How many friends? (1-3)"
                        type="number"
                        min="1"
                        max="3"
                        :required="true"
                      />

                      <div v-if="formData.numberOfFriends" class="space-y-4">
                        <Input
                          v-for="index in parseInt(formData.numberOfFriends)"
                          :key="index"
                          v-model="formData.friendNames[index - 1]"
                          :label="`Friend ${index}'s Name`"
                          :placeholder="`Enter friend ${index}'s name`"
                          :required="true"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <!-- Story Settings Section -->
            <section class="space-y-6">
              <h3 class="text-2xl font-bold text-teal-900 text-center">Story Settings</h3>
              <div class="max-w-2xl mx-auto space-y-6">
                <div class="p-6 bg-white/50 rounded-xl space-y-6">
                  <div class="space-y-4">
                    <div class="flex items-center space-x-3">
                      <input 
                        type="checkbox" 
                        v-model="formData.useCustomTheme"
                        class="h-4 w-4 text-teal-600 rounded border-gray-300"
                      >
                      <label class="text-sm text-teal-700 font-medium">Create a custom theme</label>
                    </div>

                    <div v-if="!formData.useCustomTheme" class="grid grid-cols-2 gap-4">
                      <div
                        v-for="theme in themes"
                        :key="theme.value"
                        class="relative"
                        @click="formData.theme = theme.value"
                      >
                        <div class="absolute inset-0 bg-gradient-to-r from-teal-500/20 to-blue-500/20 rounded-xl transition-opacity duration-200"
                          :class="{ 'opacity-100': formData.theme === theme.value, 'opacity-0': formData.theme !== theme.value }">
                        </div>
                        <div class="relative cursor-pointer rounded-xl border-2 transition-all duration-200 hover:scale-[1.02]"
                          :class="[
                            formData.theme === theme.value 
                              ? 'border-teal-500 bg-white shadow-lg' 
                              : 'border-transparent bg-white/50 hover:border-teal-200'
                          ]"
                        >
                          <div class="flex items-center gap-3 p-4">
                            <div class="relative w-14 h-14 group-hover:scale-110 transition-transform duration-300">
                              <div class="absolute inset-0 bg-gradient-to-br from-teal-400/20 to-blue-400/20 rounded-xl blur-md"></div>
                              <div class="relative w-full h-full rounded-xl bg-gradient-to-br from-teal-50 to-blue-50 flex items-center justify-center shadow-inner">
                                <div class="absolute inset-0 bg-white/50 rounded-xl"></div>
                                <div class="relative transform transition-all duration-300 group-hover:rotate-6">
                                  <Icons 
                                    :name="theme.icon" 
                                    class="w-8 h-8" 
                                    :class="[
                                      formData.theme === theme.value 
                                        ? 'text-teal-600' 
                                        : 'text-teal-500'
                                    ]"
                                  />
                                  <div class="absolute -inset-1 bg-gradient-to-br from-teal-400/10 to-blue-400/10 rounded-lg blur group-hover:opacity-75 transition-opacity"></div>
                                </div>
                              </div>
                            </div>
                            <div class="flex-1">
                              <h3 class="font-medium text-teal-900">{{ theme.label }}</h3>
                              <p class="text-sm text-teal-600/75">
                                {{ getThemeDescription(theme.value) }}
                              </p>
                            </div>
                            <div class="w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200"
                              :class="[
                                formData.theme === theme.value 
                                  ? 'border-teal-500 bg-teal-500' 
                                  : 'border-teal-200 bg-transparent'
                              ]"
                            >
                              <Icons 
                                name="check" 
                                class="w-3 h-3 text-white"
                                v-if="formData.theme === theme.value"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <Input
                      v-if="formData.useCustomTheme"
                      v-model="formData.customTheme"
                      label="Custom Theme"
                      placeholder="Describe your theme"
                      :required="true"
                    />
                  </div>

                  <div class="space-y-4">
                    <label class="block text-sm font-medium text-teal-700">Story Length</label>
                    <div class="grid grid-cols-3 gap-4">
                      <div
                        v-for="length in storyLengths"
                        :key="length.value"
                        class="relative"
                        @click="formData.storyLength = length.value"
                      >
                        <div class="absolute inset-0 bg-gradient-to-r from-teal-500/20 to-blue-500/20 rounded-xl transition-opacity duration-200"
                          :class="{ 'opacity-100': formData.storyLength === length.value, 'opacity-0': formData.storyLength !== length.value }">
                        </div>
                        <div class="relative cursor-pointer rounded-xl border-2 transition-all duration-200 hover:scale-[1.02]"
                          :class="[
                            formData.storyLength === length.value 
                              ? 'border-teal-500 bg-white shadow-lg' 
                              : 'border-transparent bg-white/50 hover:border-teal-200'
                          ]"
                        >
                          <div class="p-4 text-center">
                            <div class="mb-2">
                              <span class="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-teal-100 to-blue-100 text-teal-600 font-medium">
                                {{ length.value }}
                              </span>
                            </div>
                            <h3 class="font-medium text-teal-900">{{ length.label }}</h3>
                            <p class="text-sm text-teal-600/75">{{ length.description }}</p>
                            <div class="mt-2 flex justify-center">
                              <div class="w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200"
                                :class="[
                                  formData.storyLength === length.value 
                                    ? 'border-teal-500 bg-teal-500' 
                                    : 'border-teal-200 bg-transparent'
                                ]"
                              >
                                <Icons 
                                  name="check" 
                                  class="w-3 h-3 text-white"
                                  v-if="formData.storyLength === length.value"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <!-- Submit Section -->
            <section class="max-w-2xl mx-auto">
              <div class="space-y-6">
                <Progress :value="formProgress" variant="fun" />
                <p class="text-center text-teal-600 font-medium">{{ formProgressText }}</p>
                <Button
                  variant="fun"
                  size="xl"
                  class="w-full group"
                  :disabled="!isFormValid"
                  @click="startStory"
                >
                  <span class="flex items-center justify-center gap-2">
                    Begin Your Story
                    <span class="text-2xl group-hover:rotate-12 transition-transform">✨</span>
                  </span>
                </Button>
              </div>
            </section>
          </div>
        </Card>
      </div>
    </div>

    <!-- Auth Modal -->
    <Transition name="fade">
      <div v-if="showAuthModal" class="fixed inset-0 z-[100] overflow-y-auto">
        <!-- Overlay -->
        <div class="fixed inset-0 bg-black/50 backdrop-blur-sm" @click="handleAuthModalClose"></div>
        
        <!-- Modal Container -->
        <div class="fixed inset-0 flex items-center justify-center p-4">
          <Card variant="fun" class="w-full max-w-md mx-auto relative">
            <AuthModal 
              :is-open="true"
              @success="handleAuthSuccess" 
              @close="handleAuthModalClose"
            />
          </Card>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, inject, onMounted, watch } from 'vue';
import Button from './ui/Button.vue';
import Input from './ui/Input.vue';
import Card from './ui/Card.vue';
import Progress from './ui/Progress.vue';
import { useRouter } from 'vue-router';
import Icons from './ui/Icons.vue';
import { useStoryState } from '../composables/useStoryState';
import { useSupabase } from '../composables/useSupabase';
import AuthModal from './ui/AuthModal.vue';

const emit = defineEmits(['start-story']);
const router = useRouter();
const { setStoryState } = useStoryState();
const { user, isLoading: isAuthLoading } = useSupabase();
const { showAuthModal, returnTo } = inject('authState');

const themes = [
  { value: 'fantasy', label: 'Fantasy', icon: 'castle' },
  { value: 'space', label: 'Space', icon: 'rocket' },
  { value: 'ocean', label: 'Ocean', icon: 'ocean' },
  { value: 'jungle', label: 'Jungle', icon: 'lion' },
  { value: 'dinosaurs', label: 'Dinosaurs', icon: 'dinosaur' },
  { value: 'magic', label: 'Magic School', icon: 'magic-wand' }
];

const storyLengths = [
  { value: 5, label: 'Short', description: '5 pages' },
  { value: 10, label: 'Medium', description: '10 pages' },
  { value: 15, label: 'Long', description: '15 pages' }
];

const formData = ref({
  useCustomName: false,
  customName: '',
  childName: '',
  includeFriends: false,
  friendNames: [],
  numberOfFriends: '',
  ageGroup: '',
  theme: '',
  useCustomTheme: false,
  customTheme: '',
  storyLength: ''
});

const isFormValid = computed(() => {
  return (formData.value.useCustomName ? formData.value.customName?.trim() : formData.value.childName?.trim()) &&
         formData.value.ageGroup &&
         (!formData.value.includeFriends || (
           formData.value.numberOfFriends &&
           formData.value.friendNames.length === parseInt(formData.value.numberOfFriends) &&
           formData.value.friendNames.every(name => name?.trim())
         )) &&
         (formData.value.useCustomTheme ? formData.value.customTheme?.trim() : formData.value.theme) &&
         formData.value.storyLength;
});

const formProgress = computed(() => {
  let progress = 0;
  const hasName = formData.value.useCustomName ? formData.value.customName?.trim() : formData.value.childName?.trim();
  const hasTheme = formData.value.useCustomTheme ? formData.value.customTheme?.trim() : formData.value.theme;
  const hasFriends = !formData.value.includeFriends || (
    formData.value.numberOfFriends && 
    formData.value.friendNames.length === parseInt(formData.value.numberOfFriends) && 
    formData.value.friendNames.every(name => name?.trim())
  );
  
  if (hasName) progress += 25;
  if (formData.value.ageGroup) progress += 25;
  if (hasTheme) progress += 25;
  if (formData.value.storyLength) progress += 25;
  return progress;
});

const formProgressText = computed(() => {
  if (formProgress.value === 0) return "Let's begin your adventure!";
  if (formProgress.value === 100) return "Ready to start your magical journey!";
  return `${formProgress.value}% complete - Keep going!`;
});

const getThemeDescription = (themeValue) => {
  const descriptions = {
    'fantasy': 'Magical realms & mythical creatures',
    'space': 'Cosmic adventures in the stars',
    'ocean': 'Underwater mysteries & sea friends',
    'jungle': 'Wild adventures in nature',
    'dinosaurs': 'Prehistoric tales & discoveries',
    'magic': 'Spells, potions & wizardry'
  };
  return descriptions[themeValue] || 'Choose your adventure';
};

const startStory = async () => {
  console.group('Story Form - Start Story');
  console.log('Form validation state:', isFormValid.value);
  console.log('User state:', user.value ? 'authenticated' : 'unauthenticated');
  
  if (!isFormValid.value) return;

  // Check if user is authenticated
  if (!user.value) {
    console.log('User not authenticated, showing auth modal');
    showAuthModal.value = true;
    console.groupEnd();
    return;
  }

  const storyData = {
    childName: formData.value.useCustomName ? formData.value.customName : formData.value.childName,
    ageGroup: formData.value.ageGroup,
    theme: formData.value.useCustomTheme ? formData.value.customTheme : formData.value.theme,
    storyLength: formData.value.storyLength,
    metadata: {
      useCustomName: formData.value.useCustomName,
      includeFriends: formData.value.includeFriends,
      friendNames: formData.value.friendNames.filter(name => name?.trim()),
      numberOfFriends: parseInt(formData.value.numberOfFriends) || 0
    }
  };

  console.log('Emitting story data:', storyData);
  emit('start-story', storyData);
  console.groupEnd();
};

const handleAuthSuccess = () => {
  console.group('Story Form - Auth Success');
  console.log('Auth successful, hiding modal');
  showAuthModal.value = false;
  console.groupEnd();
};

const handleAuthModalClose = () => {
  console.group('Story Form - Auth Modal Close');
  console.log('Modal closed by user');
  showAuthModal.value = false;
  returnTo.value = '';
  console.groupEnd();
};

// Add logging for initial state
console.group('StoryForm - Component Setup');
console.log('Initial auth state:', {
  user: !!user.value,
  isLoading: isAuthLoading.value
});
console.groupEnd();

// Check auth state on mount
onMounted(async () => {
  console.group('StoryForm - Mounted');
  console.log('Initial mount state:', {
    hasUser: !!user.value,
    isLoading: isAuthLoading.value,
    showingModal: showAuthModal.value
  });
  
  // Wait for auth state to be loaded
  if (isAuthLoading.value) {
    console.log('Auth state is still loading, waiting...');
    await new Promise(resolve => {
      const unwatch = watch(isAuthLoading, (newValue, oldValue) => {
        console.log('Auth loading state changed:', { 
          from: oldValue, 
          to: newValue,
          hasUser: !!user.value 
        });
        if (!newValue) {
          unwatch();
          resolve();
        }
      });
    });
  }
  
  console.log('Auth state check complete:', {
    hasUser: !!user.value,
    userEmail: user.value?.email,
    isLoading: isAuthLoading.value,
    showingModal: showAuthModal.value
  });
  
  // Reset modal state if user is authenticated
  if (user.value) {
    console.log('User is authenticated, ensuring modal is hidden');
    showAuthModal.value = false;
  } else {
    console.log('No user found after auth check, showing modal');
    showAuthModal.value = true;
    returnTo.value = '/create';
  }
  console.groupEnd();
});

// Watch for auth state changes with immediate effect
watch([user, isAuthLoading], ([newUser, newLoading], [oldUser, oldLoading]) => {
  console.group('StoryForm - Auth State Change');
  console.log('Auth state updated:', {
    userChanged: !!oldUser !== !!newUser,
    loadingChanged: oldLoading !== newLoading,
    hasUser: !!newUser,
    isLoading: newLoading,
    showingModal: showAuthModal.value
  });
  
  if (newUser) {
    console.log('User is authenticated, ensuring modal is hidden');
    showAuthModal.value = false;
  }
  console.groupEnd();
}, { immediate: true });
</script>

<style scoped>
/* Import ABeeZee font */
@import url('https://fonts.googleapis.com/css2?family=ABeeZee:ital@0;1&display=swap');

/* Define the font family */
.font-abeezee {
  font-family: 'ABeeZee', sans-serif;
}

@keyframes blob {
  0% { transform: translate(0px, 0px) scale(1); }
  33% { transform: translate(30px, -50px) scale(1.1); }
  66% { transform: translate(-20px, 20px) scale(0.9); }
  100% { transform: translate(0px, 0px) scale(1); }
}

.animate-blob {
  animation: blob 7s infinite;
}

.animation-delay-2000 {
  animation-delay: 2s;
}

.animation-delay-4000 {
  animation-delay: 4s;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}

.sparkle-container {
  position: absolute;
  width: 100%;
  height: 100%;
}

.sparkle {
  position: absolute;
  background: radial-gradient(circle at center, #fff 0%, transparent 70%);
  border-radius: 50%;
  opacity: 0;
  animation: sparkle-animation 2s ease-in-out infinite;
}

@keyframes sparkle-animation {
  0% { transform: scale(0); opacity: 0; }
  50% { transform: scale(1); opacity: 0.8; }
  100% { transform: scale(0); opacity: 0; }
}

/* Transitions */
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease;
}

.slide-fade-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.slide-fade-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

.fade-enter-to,
.fade-leave-from {
  opacity: 1;
  transform: scale(1);
}
</style> 