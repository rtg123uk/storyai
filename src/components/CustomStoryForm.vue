<!-- Custom Story Form Component -->
<template>
  <div class="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-12 px-4 sm:px-6 lg:px-8">
    <Card variant="fun" elevation="lg" class="max-w-4xl mx-auto p-8">
      <!-- Header -->
      <div class="text-center mb-8">
        <h2 class="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 animate-float">
          ✨ Share Your Story ✨
        </h2>
        <p class="mt-4 text-lg text-indigo-600">Let's bring your story to life with magical narration!</p>
      </div>

      <!-- Story Form -->
      <form @submit.prevent="submitStory" class="space-y-8">
        <!-- Story Title -->
        <div>
          <label class="block text-lg font-medium text-indigo-800 mb-2">
            Story Title
          </label>
          <Input
            v-model="storyData.title"
            variant="fun"
            placeholder="Enter your story's title"
            required
          />
        </div>

        <!-- Story Content -->
        <div>
          <label class="block text-lg font-medium text-indigo-800 mb-2">
            Story Content
          </label>
          <div class="flex gap-4">
            <!-- Text Input Option -->
            <div class="flex-1">
              <textarea
                v-model="storyData.content"
                rows="12"
                class="w-full rounded-xl border-indigo-200 focus:border-indigo-500 focus:ring-indigo-500 resize-none"
                placeholder="Write or paste your story here..."
                :disabled="isFileUploaded"
                required
              ></textarea>
            </div>

            <!-- Upload Options -->
            <div class="w-64 space-y-4">
              <!-- File Upload -->
              <Card variant="fun" class="p-4">
                <label class="block text-sm font-medium text-indigo-800 mb-2">
                  Upload File
                </label>
                <input
                  type="file"
                  accept=".txt,.doc,.docx,.pdf"
                  @change="handleFileUpload"
                  class="block w-full text-sm text-indigo-600
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border-0
                    file:text-sm file:font-medium
                    file:bg-indigo-50 file:text-indigo-700
                    hover:file:bg-indigo-100"
                />
                <p class="mt-2 text-xs text-indigo-600">
                  Supported formats: TXT, DOC, DOCX, PDF
                </p>
              </Card>
            </div>
          </div>
        </div>

        <!-- Voice Selection -->
        <div>
          <label class="block text-lg font-medium text-indigo-800 mb-4">
            Choose a Storyteller Voice
          </label>
          
          <div v-if="isLoadingVoices" class="text-center py-4">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
            <p class="mt-2 text-sm text-indigo-600">Loading voices...</p>
          </div>
          
          <div v-else-if="voiceError" class="text-red-600 text-sm p-2 rounded bg-red-50">
            {{ voiceError }}
          </div>
          
          <div v-else class="grid grid-cols-3 gap-4">
            <Button
              v-for="voice in availableVoices"
              :key="voice.voice_id"
              @click="storyData.selectedVoiceId = voice.voice_id"
              :variant="storyData.selectedVoiceId === voice.voice_id ? 'fun' : 'secondary'"
              type="button"
              size="lg"
            >
              <div class="flex items-center justify-between w-full">
                <div class="text-center">
                  <div class="font-medium">{{ voice.name }}</div>
                  <div class="text-sm opacity-75">{{ voice.labels?.accent || 'Natural' }}</div>
                </div>
                <Button
                  @click.stop="previewVoice(voice.voice_id)"
                  variant="secondary"
                  size="sm"
                  class="ml-2 rounded-full hover:bg-indigo-100"
                  :disabled="isPreviewingVoice"
                >
                  <span class="flex items-center gap-2">
                    <Icons name="volume-2" size="sm" />
                    <span>Test</span>
                  </span>
                </Button>
              </div>
            </Button>
          </div>
        </div>

        <!-- Submit Button -->
        <div class="flex justify-center pt-4">
          <Button
            type="submit"
            variant="fun"
            size="xl"
            :disabled="!isValid || isSubmitting"
          >
            <span class="flex items-center gap-2">
              <span>{{ isSubmitting ? 'Creating...' : 'Create Story' }}</span>
              <Icons name="magic-wand" size="sm" />
            </span>
          </Button>
        </div>
      </form>
    </Card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { getVoices, textToSpeech } from '../services/elevenlabs';
import Card from './ui/Card.vue';
import Button from './ui/Button.vue';
import Input from './ui/Input.vue';
import Icons from './ui/Icons.vue';

const router = useRouter();

const storyData = ref({
  title: '',
  content: '',
  selectedVoiceId: null
});

const isFileUploaded = ref(false);
const isLoadingVoices = ref(false);
const isPreviewingVoice = ref(false);
const isSubmitting = ref(false);
const voiceError = ref(null);
const availableVoices = ref([]);

// Computed
const isValid = computed(() => {
  return storyData.value.title &&
         storyData.value.content &&
         storyData.value.selectedVoiceId;
});

// Methods
const handleFileUpload = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  try {
    // For now, just handle text files
    if (file.type === 'text/plain') {
      const text = await file.text();
      storyData.value.content = text;
      isFileUploaded.value = true;
    } else {
      alert('Currently only supporting .txt files. More formats coming soon!');
    }
  } catch (error) {
    console.error('Error reading file:', error);
    alert('Error reading file. Please try again.');
  }
};

const previewVoice = async (voiceId) => {
  if (isPreviewingVoice.value) return;
  
  try {
    isPreviewingVoice.value = true;
    await textToSpeech('Hello! I will be your storyteller today.', voiceId);
  } catch (error) {
    console.error('Error previewing voice:', error);
    voiceError.value = 'Failed to preview voice. Please try again.';
  } finally {
    isPreviewingVoice.value = false;
  }
};

const submitStory = async () => {
  if (!isValid.value) return;
  
  try {
    isSubmitting.value = true;
    
    // Format the story data
    const story = {
      title: storyData.value.title,
      metadata: {
        useVoice: true,
        selectedVoiceId: storyData.value.selectedVoiceId,
        isCustomStory: true
      },
      pages: [{
        title: storyData.value.title,
        content: storyData.value.content,
        pageNumber: 1
      }]
    };
    
    // Store in localStorage for now
    localStorage.setItem('currentStory', JSON.stringify(story));
    
    // Navigate to the custom story view
    router.push('/custom-story');
  } catch (error) {
    console.error('Error submitting story:', error);
    alert('Error creating story. Please try again.');
  } finally {
    isSubmitting.value = false;
  }
};

// Load voices on mount
onMounted(async () => {
  try {
    isLoadingVoices.value = true;
    const voices = await getVoices();
    availableVoices.value = voices;
  } catch (error) {
    console.error('Error loading voices:', error);
    voiceError.value = 'Failed to load voices. Please refresh the page.';
  } finally {
    isLoadingVoices.value = false;
  }
});
</script> 