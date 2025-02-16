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
              ✨ Create Your Story ✨
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
                    label="Child's Story Name"
                    placeholder="Enter a fun story name"
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
                      <Button
                        v-for="theme in themes"
                        :key="theme.value"
                        :variant="formData.theme === theme.value ? 'fun' : 'secondary'"
                        class="group relative overflow-hidden"
                        @click="formData.theme = theme.value"
                      >
                        <div class="absolute inset-0 bg-gradient-to-r from-teal-500 via-blue-500 to-cyan-500 opacity-0 group-hover:opacity-10 transition-opacity"></div>
                        <div class="flex items-center gap-2 p-4">
                          <div class="w-10 h-10 rounded-lg bg-teal-100 flex items-center justify-center transform transition-transform group-hover:scale-110 group-hover:rotate-12">
                            <Icons :name="theme.icon" class="w-6 h-6 text-teal-600" />
                          </div>
                          <span class="font-medium">{{ theme.label }}</span>
                        </div>
                      </Button>
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
                      <Button
                        v-for="length in storyLengths"
                        :key="length.value"
                        :variant="formData.storyLength === length.value ? 'fun' : 'secondary'"
                        class="group relative overflow-hidden"
                        @click="formData.storyLength = length.value"
                      >
                        <div class="absolute inset-0 bg-gradient-to-r from-teal-500 via-blue-500 to-cyan-500 opacity-0 group-hover:opacity-10 transition-opacity"></div>
                        <div class="p-4 text-center">
                          <div class="font-medium">{{ length.label }}</div>
                          <div class="text-sm text-teal-600">{{ length.description }}</div>
                        </div>
                      </Button>
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
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import Button from './ui/Button.vue';
import Input from './ui/Input.vue';
import Card from './ui/Card.vue';
import Progress from './ui/Progress.vue';
import { useRouter } from 'vue-router';
import Icons from './ui/Icons.vue';
import { useStoryState } from '../composables/useStoryState';

const emit = defineEmits(['start-story']);
const router = useRouter();
const { setStoryState } = useStoryState();

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

const startStory = async () => {
  if (!isFormValid.value) return;

  const storyData = {
    childName: formData.value.useCustomName ? formData.value.customName : formData.value.childName,
    ageGroup: formData.value.ageGroup,
    theme: formData.value.useCustomTheme ? formData.value.customTheme : formData.value.theme,
    storyLength: formData.value.storyLength,
    metadata: {
      includeFriends: formData.value.includeFriends,
      friendNames: formData.value.friendNames,
      numberOfFriends: formData.value.numberOfFriends
    }
  };

  emit('start-story', storyData);
};
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
</style> 