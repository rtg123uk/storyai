<!-- Create a new file with custom SVG icons -->
<template>
  <svg v-if="name === 'castle'" viewBox="0 0 24 24" :class="sizeClasses">
    <path fill="currentColor" d="M8 9v11h8V9l-4-4-4 4zm4-7l9 9h-3v11h-4v-8h-4v8H6V11H3l9-9z"/>
  </svg>

  <svg v-else-if="name === 'rocket'" viewBox="0 0 24 24" :class="sizeClasses">
    <path fill="currentColor" d="M13.13 22.19l-1.63-3.83c1.57-.58 3.04-1.36 4.4-2.27l-2.77 6.1M5.64 12.5l-3.83-1.63 6.1-2.77c-.91 1.36-1.69 2.83-2.27 4.4M21.61 2.39S16.66.269 11 5.93c-2.19 2.19-3.5 4.6-4.35 6.71-.37.91-.57 1.77-.7 2.54-.12.77-.12 1.4-.12 1.4s.63 0 1.4-.12c.77-.13 1.63-.33 2.54-.7 2.11-.85 4.52-2.16 6.71-4.35C21.73 7.34 21.61 2.39 21.61 2.39M8.54 15.46L7.12 14.04l5.65-5.65 1.41 1.41-5.64 5.66z"/>
  </svg>

  <svg v-else-if="name === 'ocean'" viewBox="0 0 24 24" :class="sizeClasses">
    <path fill="currentColor" d="M18.97 19H5.03c-1.1 0-2-.9-2-2s.9-2 2-2h13.94c1.1 0 2 .9 2 2s-.9 2-2 2m0-4H5.03c-1.1 0-2-.9-2-2s.9-2 2-2h13.94c1.1 0 2 .9 2 2s-.9 2-2 2m0-4H5.03c-1.1 0-2-.9-2-2s.9-2 2-2h13.94c1.1 0 2 .9 2 2s-.9 2-2 2z"/>
  </svg>

  <svg v-else-if="name === 'lion'" viewBox="0 0 24 24" :class="sizeClasses">
    <path fill="currentColor" d="M12 3c.55 0 1 .45 1 1v2h2.14c.31-1.75 1.83-3 3.64-3 .5 0 .95.11 1.37.3.43-.19.88-.3 1.37-.3 1.81 0 3.33 1.25 3.64 3H19v2h1c.55 0 1 .45 1 1s-.45 1-1 1h-1v2h1c.55 0 1 .45 1 1s-.45 1-1 1h-1v2h1c.55 0 1 .45 1 1s-.45 1-1 1h-1v2h-2.14c-.31 1.75-1.83 3-3.64 3-.5 0-.95-.11-1.37-.3-.43.19-.88.3-1.37.3-1.81 0-3.33-1.25-3.64-3H11v-2H9c-.55 0-1-.45-1-1s.45-1 1-1h2v-2H9c-.55 0-1-.45-1-1s.45-1 1-1h2v-2H9c-.55 0-1-.45-1-1s.45-1 1-1h2V6h-2c-.55 0-1-.45-1-1s.45-1 1-1h2V3z"/>
  </svg>

  <svg v-else-if="name === 'dinosaur'" viewBox="0 0 24 24" :class="sizeClasses">
    <path fill="currentColor" d="M12 3c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2m-1 20H8v-6H6V9h12v8h-2v6h-3v-4h-2v4z"/>
  </svg>

  <svg v-else-if="name === 'magic-wand'" viewBox="0 0 24 24" :class="sizeClasses">
    <path fill="currentColor" d="M7.5 5.6L5 7l1.4-2.5L5 2l2.5 1.4L10 2 8.6 4.5 10 7 7.5 5.6m12 9.8L22 14l-1.4 2.5L22 19l-2.5-1.4L17 19l1.4-2.5L17 14l2.5 1.4M22 2l-1.4 2.5L22 7l-2.5-1.4L17 7l1.4-2.5L17 2l2.5 1.4L22 2m-8.66 10.78l2.44-2.44-2.44-2.44 1.06-1.06 2.44 2.44 2.44-2.44 1.06 1.06-2.44 2.44 2.44 2.44-1.06 1.06-2.44-2.44-2.44 2.44-1.06-1.06M2 19l1.4-2.5L2 14l2.5 1.4L7 14l-1.4 2.5L7 19l-2.5-1.4L2 19"/>
  </svg>

  <svg v-else-if="name === 'book'" viewBox="0 0 24 24" :class="sizeClasses">
    <path fill="currentColor" d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2m0 18H6V4h2v8l2.5-1.5L13 12V4h5v16"/>
  </svg>

  <svg v-else-if="name === 'age'" viewBox="0 0 24 24" :class="sizeClasses">
    <path fill="currentColor" d="M12 2A10 10 0 0 0 2 12a10 10 0 0 0 10 10 10 10 0 0 0 10-10A10 10 0 0 0 12 2m4.2 14.2L11 13V7h1.5v5.2l4.5 2.7-.8 1.3z"/>
  </svg>

  <svg v-else-if="name === 'theme'" viewBox="0 0 24 24" :class="sizeClasses">
    <path fill="currentColor" d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9c.83 0 1.5-.67 1.5-1.5 0-.39-.15-.74-.39-1.01-.23-.26-.38-.61-.38-.99 0-.83.67-1.5 1.5-1.5H16c2.76 0 5-2.24 5-5 0-4.42-4.03-8-9-8zm-5.5 9c-.83 0-1.5-.67-1.5-1.5S5.67 9 6.5 9 8 9.67 8 10.5 7.33 12 6.5 12zm3-4C8.67 8 8 7.33 8 6.5S8.67 5 9.5 5s1.5.67 1.5 1.5S10.33 8 9.5 8zm5 0c-.83 0-1.5-.67-1.5-1.5S13.67 5 14.5 5s1.5.67 1.5 1.5S15.33 8 14.5 8zm3 4c-.83 0-1.5-.67-1.5-1.5S16.67 9 17.5 9s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>
  </svg>

  <svg v-else-if="name === 'length'" viewBox="0 0 24 24" :class="sizeClasses">
    <path fill="currentColor" d="M3 5h18v4H3V5m0 5h18v4H3v-4m0 5h18v4H3v-4"/>
  </svg>

  <svg v-else-if="name === 'star'" viewBox="0 0 24 24" :class="sizeClasses">
    <path fill="currentColor" d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
  </svg>

  <svg v-else-if="name === 'star-filled'" viewBox="0 0 24 24" :class="sizeClasses">
    <path fill="currentColor" d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
  </svg>

  <svg v-else-if="name === 'map'" viewBox="0 0 24 24" :class="sizeClasses">
    <path fill="currentColor" d="M15 19l-6-2.11V5l6 2.11M20.5 3h-.16L15 5.1 9 3 3.36 4.9c-.21.07-.36.25-.36.48V20.5c0 .28.22.5.5.5.05 0 .11 0 .16-.03L9 18.9l6 2.1 5.64-1.9c.21-.1.36-.25.36-.48V3.5c0-.28-.22-.5-.5-.5z"/>
  </svg>

  <svg v-else-if="name === 'search'" viewBox="0 0 24 24" :class="sizeClasses">
    <path fill="currentColor" d="M9.5 3A6.5 6.5 0 0 1 16 9.5c0 1.61-.59 3.09-1.56 4.23l.27.27h.79l5 5-1.5 1.5-5-5v-.79l-.27-.27A6.516 6.516 0 0 1 9.5 16 6.5 6.5 0 0 1 3 9.5 6.5 6.5 0 0 1 9.5 3m0 2C7 5 5 7 5 9.5S7 14 9.5 14 14 12 14 9.5 12 5 9.5 5z"/>
  </svg>

  <svg v-else-if="name === 'sword'" viewBox="0 0 24 24" :class="sizeClasses">
    <path fill="currentColor" d="M6.92 5H5l9 9 1-1-8.08-8M19 15.13L7.87 4 19 4v11.13M19 21.13V19l-2-2v4.13h2m-4-4L13 19l-2-2 2-2 2 2m-4-4L9 17l-2-2 2-2 2 2m-4-4L5 15l-2-2 2-2 2 2m-4-4L1 13V4h9L5 9l2 2"/>
  </svg>

  <svg v-else-if="name === 'tree'" viewBox="0 0 24 24" :class="sizeClasses">
    <path fill="currentColor" d="M12 3c-2.2 0-4 1.8-4 4 0 .7.2 1.4.5 2H7c-1.7 0-3 1.3-3 3s1.3 3 3 3h2v2H7c-2.8 0-5-2.2-5-5s2.2-5 5-5c0-3.3 2.7-6 6-6s6 2.7 6 6c2.8 0 5 2.2 5 5s-2.2 5-5 5h-2v-2h2c1.7 0 3-1.3 3-3s-1.3-3-3-3h-1.5c.3-.6.5-1.3.5-2 0-2.2-1.8-4-4-4m0 14h-2v5h2v-5z"/>
  </svg>

  <svg v-else-if="name === 'mountain'" viewBox="0 0 24 24" :class="sizeClasses">
    <path fill="currentColor" d="M14 6l-3.75 5 2.85 3.8-1.6 1.2L7 10l-6 8h22L14 6z"/>
  </svg>

  <svg v-else-if="name === 'light'" viewBox="0 0 24 24" :class="sizeClasses">
    <path fill="currentColor" d="M12 2a7 7 0 0 1 7 7c0 2.38-1.19 4.47-3 5.74V17a1 1 0 0 1-1 1h-6a1 1 0 0 1-1-1v-2.26C6.19 13.47 5 11.38 5 9a7 7 0 0 1 7-7M9 21v-1h6v1a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1m3-17a5 5 0 0 0-5 5c0 2.05 1.23 3.81 3 4.58V16h4v-2.42c1.77-.77 3-2.53 3-4.58a5 5 0 0 0-5-5z"/>
  </svg>

  <svg v-else-if="name === 'moon'" viewBox="0 0 24 24" :class="sizeClasses">
    <path fill="currentColor" d="M17.75 4.09L15.22 6.03L16.13 9.09L13.5 7.28L10.87 9.09L11.78 6.03L9.25 4.09L12.44 4L13.5 1L14.56 4L17.75 4.09M21.25 11L19.61 12.25L20.2 14.23L18.5 13.06L16.8 14.23L17.39 12.25L15.75 11L17.81 10.95L18.5 9L19.19 10.95L21.25 11M18.97 15.95C19.8 15.87 20.69 17.05 20.16 17.8C19.84 18.25 19.5 18.67 19.08 19.07C15.17 23 8.84 23 4.94 19.07C1.03 15.17 1.03 8.83 4.94 4.93C5.34 4.53 5.76 4.17 6.21 3.85C6.96 3.32 8.14 4.21 8.06 5.04C7.79 7.9 8.75 10.87 10.95 13.06C13.14 15.26 16.1 16.22 18.97 15.95M17.33 17.97C14.5 17.81 11.7 16.64 9.53 14.5C7.36 12.31 6.2 9.5 6.04 6.68C3.23 9.82 3.34 14.64 6.35 17.66C9.37 20.67 14.19 20.78 17.33 17.97Z"/>
  </svg>

  <svg v-else-if="name === 'users'" viewBox="0 0 24 24" :class="sizeClasses">
    <path fill="currentColor" d="M16 17v2H2v-2s0-4 7-4 7 4 7 4m-3.5-9.5A3.5 3.5 0 1 0 9 11a3.5 3.5 0 0 0 3.5-3.5m3.44 5.5A5.32 5.32 0 0 1 18 17v2h4v-2s0-3.63-6.06-4M15 4a3.39 3.39 0 0 0-1.93.59 5 5 0 0 1 0 5.82A3.39 3.39 0 0 0 15 11a3.5 3.5 0 0 0 0-7z"/>
  </svg>

  <svg v-else-if="name === 'gem'" viewBox="0 0 24 24" :class="sizeClasses">
    <path fill="currentColor" d="M16,9H19L14,16M10,9H14L12,17M5,9H8L10,16M15,4H17L19,7H16M11,4H13L14,7H10M7,4H9L8,7H5M6,2L2,8L12,22L22,8L18,2H6Z"/>
  </svg>

  <svg v-else-if="name === 'trophy'" viewBox="0 0 24 24" :class="sizeClasses">
    <path fill="currentColor" d="M20.2,2H19.5H18C17.1,2 16,3 16,4H8C8,3 6.9,2 6,2H4.5H3.8H2V11C2,12 3,13 4,13H6.2C6.6,15 7.9,16.7 11,17V19.1C8.8,19.3 8,20.4 8,21.7V22H16V21.7C16,20.4 15.2,19.3 13,19.1V17C16.1,16.7 17.4,15 17.8,13H20C21,13 22,12 22,11V2H20.2M4,11V4H6V6V11C5.1,11 4.3,11 4,11M20,11C19.7,11 18.9,11 18,11V6V4H20V11Z"/>
  </svg>

  <svg v-else-if="name === 'sparkles'" viewBox="0 0 24 24" :class="sizeClasses">
    <path fill="currentColor" d="M19,11.5C19,11.5 17,13.67 17,15A2,2 0 0,0 19,17A2,2 0 0,0 21,15C21,13.67 19,11.5 19,11.5M5.21,10L10,5.21L14.79,10M16.56,8.94L7.62,0L6.21,1.41L8.59,3.79L3.44,8.94C2.85,9.5 2.85,10.47 3.44,11.06L8.94,16.56C9.23,16.85 9.62,17 10,17C10.38,17 10.77,16.85 11.06,16.56L16.56,11.06C17.15,10.47 17.15,9.5 16.56,8.94Z"/>
  </svg>

  <svg v-else-if="name === 'arrow-left'" viewBox="0 0 24 24" :class="sizeClasses">
    <path fill="currentColor" d="M20,11V13H8L13.5,18.5L12.08,19.92L4.16,12L12.08,4.08L13.5,5.5L8,11H20Z"/>
  </svg>

  <svg v-else-if="name === 'save'" viewBox="0 0 24 24" :class="sizeClasses">
    <path fill="currentColor" d="M15,9H5V5H15M12,19A3,3 0 0,1 9,16A3,3 0 0,1 12,13A3,3 0 0,1 15,16A3,3 0 0,1 12,19M17,3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V7L17,3Z"/>
  </svg>

  <svg v-else-if="name === 'question'" viewBox="0 0 24 24" :class="sizeClasses">
    <path fill="currentColor" d="M15.07,11.25L14.17,12.17C13.45,12.89 13,13.5 13,15H11V14.5C11,13.39 11.45,12.39 12.17,11.67L13.41,10.41C13.78,10.05 14,9.55 14,9C14,7.89 13.1,7 12,7A2,2 0 0,0 10,9H8A4,4 0 0,1 12,5A4,4 0 0,1 16,9C16,9.88 15.64,10.67 15.07,11.25M13,19H11V17H13M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12C22,6.47 17.5,2 12,2Z"/>
  </svg>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  name: {
    type: String,
    required: true
  },
  size: {
    type: String,
    default: 'md'
  }
});

const sizeClasses = computed(() => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-10 h-10'
  };
  return sizes[props.size] || sizes.md;
});
</script> 