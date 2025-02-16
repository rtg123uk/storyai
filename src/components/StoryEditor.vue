# Create a new file with a WYSIWYG editor component
<template>
  <div class="bg-white shadow sm:rounded-lg p-6">
    <div class="mb-4">
      <label class="block text-sm font-medium text-gray-700">Title</label>
      <input
        type="text"
        v-model="story.title"
        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
      />
    </div>

    <div v-for="(page, index) in story.pages" :key="index" class="mb-8 border-t pt-6">
      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700">Page {{ index + 1 }} Title</label>
        <input
          type="text"
          v-model="page.title"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>

      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-2">Content</label>
        <editor-content :editor="editors[index]" />
      </div>

      <!-- Choices Section -->
      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-2">Choices</label>
        <div v-for="(choice, choiceIndex) in page.choices" :key="choiceIndex" class="flex gap-2 mb-2">
          <input
            type="text"
            v-model="choice.text"
            placeholder="Choice text"
            class="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
          <input
            type="text"
            v-model="choice.description"
            placeholder="Description"
            class="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
          <button
            @click="removeChoice(page, choiceIndex)"
            class="px-2 py-1 text-red-600 hover:text-red-800"
          >
            ×
          </button>
        </div>
        <button
          @click="addChoice(page)"
          class="mt-2 inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
        >
          Add Choice
        </button>
      </div>
    </div>

    <div class="flex justify-between mt-6">
      <button
        @click="addPage"
        class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
      >
        Add Page
      </button>
      <button
        @click="saveStory"
        class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
      >
        Save Story
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useEditor, EditorContent } from '@tiptap/vue-3';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import { useSupabase } from '@/composables/useSupabase';

const props = defineProps({
  storyId: {
    type: String,
    required: true
  }
});

const { supabase } = useSupabase();
const story = ref({ title: '', pages: [] });
const editors = ref([]);

// Initialize editor for each page
const initializeEditor = (content = '') => {
  return useEditor({
    content,
    extensions: [
      StarterKit,
      Image,
      Link,
      Placeholder.configure({
        placeholder: 'Write your story content here...'
      })
    ]
  });
};

// Load story data
const loadStory = async () => {
  try {
    const { data, error } = await supabase
      .from('stories')
      .select('*')
      .eq('id', props.storyId)
      .single();

    if (error) throw error;
    story.value = data;

    // Initialize editors for each page
    editors.value = story.value.pages.map(page => initializeEditor(page.content));
  } catch (error) {
    console.error('Error loading story:', error);
  }
};

// Save story changes
const saveStory = async () => {
  try {
    // Update content from editors
    story.value.pages = story.value.pages.map((page, index) => ({
      ...page,
      content: editors.value[index].getHTML()
    }));

    const { error } = await supabase
      .from('stories')
      .update({
        title: story.value.title,
        pages: story.value.pages,
        metadata: {
          ...story.value.metadata,
          lastEdited: new Date().toISOString()
        }
      })
      .eq('id', props.storyId);

    if (error) throw error;
    console.log('Story saved successfully');
  } catch (error) {
    console.error('Error saving story:', error);
  }
};

// Add a new page
const addPage = () => {
  story.value.pages.push({
    title: `Page ${story.value.pages.length + 1}`,
    content: '',
    choices: []
  });
  editors.value.push(initializeEditor());
};

// Add a new choice to a page
const addChoice = (page) => {
  page.choices.push({
    text: '',
    description: ''
  });
};

// Remove a choice from a page
const removeChoice = (page, choiceIndex) => {
  page.choices.splice(choiceIndex, 1);
};

// Lifecycle hooks
onMounted(() => {
  loadStory();
});

onBeforeUnmount(() => {
  // Destroy editors
  editors.value.forEach(editor => editor.destroy());
});
</script>

<style>
.ProseMirror {
  @apply p-4 min-h-[200px] border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500;
}

.ProseMirror p.is-editor-empty:first-child::before {
  @apply text-gray-400;
  content: attr(data-placeholder);
  float: left;
  height: 0;
  pointer-events: none;
}
</style> 