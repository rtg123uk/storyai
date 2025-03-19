<!-- Create a new Header component -->
<template>
  <header class="sticky top-0 z-50 w-full border-b border-teal-100/50 bg-white/80 backdrop-blur-sm">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex h-16 items-center justify-between">
        <!-- Logo and Brand -->
        <router-link to="/" class="flex items-center gap-3 group">
          <div class="relative w-10 h-10">
            <Icons name="magic-wand" class="w-full h-full text-teal-600 transform group-hover:rotate-12 transition-transform duration-300" />
            <div class="absolute inset-0 bg-teal-400/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
          <span class="text-2xl font-abeezee font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-cyan-600">
            Story-AI
          </span>
        </router-link>

        <!-- Desktop Navigation -->
        <nav class="hidden md:flex items-center gap-6">
          <router-link
            v-for="item in navigationItems"
            :key="item.path"
            :to="item.path"
            class="flex items-center gap-2 px-3 py-2 text-teal-600 hover:text-teal-700 font-medium transition-colors relative group"
          >
            <Icons :name="item.icon" size="sm" />
            <span>{{ item.name }}</span>
            <span class="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-teal-600 to-cyan-600 group-hover:w-full transition-all duration-300"></span>
          </router-link>

          <!-- Auth Buttons -->
          <template v-if="user">
            <div class="flex items-center gap-3">
              <span class="text-teal-600">{{ user.email }}</span>
              <Button 
                @click="handleSignOut" 
                variant="outline" 
                size="sm"
                :disabled="isLoading"
              >
                Sign Out
              </Button>
            </div>
          </template>
        </nav>

        <!-- Mobile Menu Button -->
        <button 
          @click="isMenuOpen = !isMenuOpen"
          class="md:hidden p-2 rounded-lg text-teal-600 hover:bg-teal-50 transition-colors"
          aria-label="Toggle menu"
        >
          <Icons 
            :name="isMenuOpen ? 'close' : 'menu'" 
            size="lg"
            class="text-teal-600 transition-transform duration-300"
            :class="{ 'rotate-180': isMenuOpen }"
          />
        </button>
      </div>
    </div>

    <!-- Mobile Navigation Drawer -->
    <transition
      enter-active-class="transition-all duration-300 ease-in-out"
      enter-from-class="opacity-0 translate-x-full"
      enter-to-class="opacity-100 translate-x-0"
      leave-active-class="transition-all duration-300 ease-in-out"
      leave-from-class="opacity-100 translate-x-0"
      leave-to-class="opacity-0 translate-x-full"
    >
      <div 
        v-if="isMenuOpen"
        class="fixed inset-0 z-50 md:hidden"
        @click="isMenuOpen = false"
      >
        <!-- Backdrop -->
        <div class="fixed inset-0 bg-black/20 backdrop-blur-sm" aria-hidden="true" />

        <!-- Menu Panel -->
        <div 
          class="fixed inset-y-0 right-0 w-full max-w-sm bg-white shadow-xl border-l border-teal-100"
          @click.stop
        >
          <div class="flex flex-col h-full">
            <!-- Mobile Menu Header -->
            <div class="p-4 border-b border-teal-100 bg-white">
              <div class="flex items-center justify-between">
                <span class="text-lg font-semibold text-teal-900">Menu</span>
                <button 
                  @click="isMenuOpen = false"
                  class="p-2 -mr-2 rounded-lg text-teal-600 hover:bg-teal-50 transition-colors"
                >
                  <Icons name="close" size="md" class="text-teal-600" />
                </button>
              </div>
            </div>

            <!-- Mobile Menu Items -->
            <nav class="flex-1 p-4 bg-white">
              <div class="space-y-2">
                <router-link
                  v-for="item in navigationItems"
                  :key="item.path"
                  :to="item.path"
                  class="flex items-center gap-3 px-4 py-3 rounded-xl text-teal-900 hover:bg-teal-50 transition-colors"
                  @click="isMenuOpen = false"
                >
                  <Icons :name="item.icon" size="md" class="text-teal-600" />
                  <span class="text-lg font-medium">{{ item.name }}</span>
                </router-link>

                <!-- Mobile Auth Buttons -->
                <div class="mt-4 px-4">
                  <template v-if="user">
                    <div class="space-y-3">
                      <p class="text-sm text-teal-600">Signed in as {{ user.email }}</p>
                      <Button 
                        @click="handleSignOut" 
                        variant="outline" 
                        class="w-full"
                        :disabled="isLoading"
                      >
                        Sign Out
                      </Button>
                    </div>
                  </template>
                </div>
              </div>
            </nav>
          </div>
        </div>
      </div>
    </transition>
  </header>
</template>

<script setup>
import { ref, computed, inject, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useSupabase } from '../../composables/useSupabase';
import Icons from './Icons.vue';
import Button from './Button.vue';

const router = useRouter();
const { user, signOut } = useSupabase();
const isMenuOpen = ref(false);
const isLoading = ref(false);

// Inject auth state
const { showAuthModal, returnTo } = inject('authState');

const navigationItems = computed(() => {
  const items = [
    { name: 'Create Story', path: '/create', icon: 'book' },
    ...(user.value ? [{ name: 'My Stories', path: '/profile', icon: 'users' }] : [])
  ];
  console.log('Navigation items updated:', items);
  return items;
});

const handleSignOut = async () => {
  console.group('Header - Sign Out');
  try {
    isLoading.value = true;
    console.log('Starting sign out process');
    await signOut();
    console.log('Sign out successful, navigating to landing');
    await router.push('/');
  } catch (error) {
    console.error('Error signing out:', error);
  } finally {
    isLoading.value = false;
    console.log('Sign out process completed');
  }
  console.groupEnd();
};

const handleSignIn = () => {
  console.group('Header - Sign In Flow');
  console.log('Starting sign in process');
  console.log('Initial state:', {
    showAuthModal: showAuthModal.value,
    returnTo: returnTo.value,
    isMenuOpen: isMenuOpen.value,
    currentRoute: router.currentRoute.value.fullPath
  });

  // Set auth state
  showAuthModal.value = true;
  returnTo.value = '/create';

  console.log('Updated state:', {
    showAuthModal: showAuthModal.value,
    returnTo: returnTo.value,
    modalExists: !!document.querySelector('.fixed.inset-0.z-\\[100\\]'),
    authModalComponent: !!document.querySelector('.auth-modal')
  });
  
  // Close mobile menu if open
  if (isMenuOpen.value) {
    isMenuOpen.value = false;
    console.log('Closed mobile menu');
  }

  // Add a small delay to check if the modal state persists
  setTimeout(() => {
    console.log('State after delay:', {
      showAuthModal: showAuthModal.value,
      returnTo: returnTo.value,
      modalExists: !!document.querySelector('.fixed.inset-0.z-\\[100\\]'),
      authModalComponent: !!document.querySelector('.auth-modal')
    });
  }, 100);

  console.groupEnd();
};
</script> 