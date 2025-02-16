<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 overflow-y-auto">
    <!-- Backdrop -->
    <div class="fixed inset-0 bg-black/50 backdrop-blur-sm" @click="close"></div>

    <!-- Modal -->
    <div class="relative min-h-screen flex items-center justify-center p-4">
      <Card variant="fun" class="w-full max-w-md mx-auto relative z-10">
        <div class="p-6">
          <!-- Header -->
          <div class="text-center mb-6">
            <h2 class="text-2xl font-bold text-indigo-900">{{ isLogin ? 'Welcome Back!' : 'Create Account' }}</h2>
            <p class="text-indigo-600 mt-2">{{ isLogin ? 'Sign in to save your stories' : 'Sign up to start saving stories' }}</p>
          </div>

          <!-- Error Message -->
          <div v-if="error" class="mb-6 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
            {{ error }}
          </div>

          <!-- Form -->
          <form @submit.prevent="handleSubmit" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-indigo-900 mb-1">Email</label>
              <Input
                v-model="email"
                type="email"
                required
                placeholder="your@email.com"
                variant="fun"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-indigo-900 mb-1">Password</label>
              <Input
                v-model="password"
                type="password"
                required
                placeholder="••••••••"
                variant="fun"
              />
            </div>

            <Button
              type="submit"
              variant="fun"
              class="w-full"
              :disabled="isLoading"
            >
              {{ isLogin ? 'Sign In' : 'Sign Up' }}
            </Button>
          </form>

          <!-- Toggle Login/Signup -->
          <div class="mt-6 text-center">
            <button
              @click="isLogin = !isLogin"
              class="text-indigo-600 hover:text-indigo-700 text-sm"
            >
              {{ isLogin ? 'Need an account? Sign up' : 'Already have an account? Sign in' }}
            </button>
          </div>
        </div>
      </Card>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useSupabase } from '../../composables/useSupabase';
import Card from './Card.vue';
import Button from './Button.vue';
import Input from './Input.vue';

const props = defineProps({
  isOpen: Boolean,
});

const emit = defineEmits(['close', 'auth-success']);

const { signIn, signUp } = useSupabase();
const isLogin = ref(true);
const email = ref('');
const password = ref('');
const error = ref('');
const isLoading = ref(false);

const handleSubmit = async () => {
  error.value = '';
  isLoading.value = true;

  try {
    if (isLogin.value) {
      const { user, error: authError } = await signIn(email.value, password.value);
      if (authError) throw authError;
      emit('auth-success', user);
    } else {
      const { user, error: authError } = await signUp(email.value, password.value);
      if (authError) throw authError;
      emit('auth-success', user);
    }
  } catch (e) {
    error.value = e.message;
  } finally {
    isLoading.value = false;
  }
};

const close = () => {
  emit('close');
};
</script> 