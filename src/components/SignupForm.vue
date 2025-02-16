<template>
  <div class="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md mx-auto bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-8 border-2 border-indigo-100">
      <!-- Header -->
      <div class="text-center mb-8">
        <h2 class="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 animate-float">
          ✨ Join the Adventure ✨
        </h2>
        <p class="mt-4 text-lg text-indigo-600">Create your magical storytelling account</p>
      </div>

      <!-- Signup Form -->
      <form @submit.prevent="handleSignup" class="space-y-6">
        <!-- Username -->
        <div>
          <label for="username" class="block text-lg font-medium text-indigo-800">
            <span class="flex items-center gap-2">
              <span class="text-xl">👋</span>
              Choose your username
            </span>
          </label>
          <input
            id="username"
            v-model="formData.username"
            type="text"
            required
            class="mt-2 block w-full px-4 py-3 bg-white border-2 border-indigo-200 rounded-xl text-lg placeholder-indigo-300 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 transition-all duration-300"
            placeholder="Enter your username"
          />
        </div>

        <!-- Email -->
        <div>
          <label for="email" class="block text-lg font-medium text-indigo-800">
            <span class="flex items-center gap-2">
              <span class="text-xl">📧</span>
              Your email address
            </span>
          </label>
          <input
            id="email"
            v-model="formData.email"
            type="email"
            required
            class="mt-2 block w-full px-4 py-3 bg-white border-2 border-indigo-200 rounded-xl text-lg placeholder-indigo-300 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 transition-all duration-300"
            placeholder="Enter your email"
          />
        </div>

        <!-- Password -->
        <div>
          <label for="password" class="block text-lg font-medium text-indigo-800">
            <span class="flex items-center gap-2">
              <span class="text-xl">🔐</span>
              Create a password
            </span>
          </label>
          <input
            id="password"
            v-model="formData.password"
            type="password"
            required
            class="mt-2 block w-full px-4 py-3 bg-white border-2 border-indigo-200 rounded-xl text-lg placeholder-indigo-300 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 transition-all duration-300"
            placeholder="Enter your password"
          />
        </div>

        <!-- Age Group -->
        <div>
          <label class="block text-lg font-medium text-indigo-800">
            <span class="flex items-center gap-2">
              <span class="text-xl">🎂</span>
              Your age group
            </span>
          </label>
          <div class="mt-2 grid grid-cols-2 gap-4">
            <button
              type="button"
              v-for="age in ageGroups"
              :key="age"
              @click="formData.ageGroup = age"
              :class="[
                'px-4 py-3 rounded-xl text-lg font-medium transition-all duration-300 transform hover:-translate-y-1',
                formData.ageGroup === age
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg'
                  : 'bg-white border-2 border-indigo-200 text-indigo-600 hover:border-indigo-400'
              ]"
            >
              {{ age }} years
            </button>
          </div>
        </div>

        <!-- Error Message -->
        <div v-if="error" class="text-red-500 text-center py-2 px-4 bg-red-50 rounded-xl">
          {{ error }}
        </div>

        <!-- Submit Button -->
        <div class="pt-4">
          <button
            type="submit"
            :disabled="!isFormValid || isLoading"
            class="w-full px-6 py-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white text-xl font-bold rounded-xl shadow-lg transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none"
          >
            <span class="flex items-center justify-center gap-2">
              <span>{{ isLoading ? 'Creating Account...' : 'Begin Your Journey' }}</span>
              <span class="text-2xl">✨</span>
            </span>
          </button>
        </div>

        <!-- Login Link -->
        <div class="text-center mt-6">
          <p class="text-indigo-600">
            Already have an account?
            <router-link to="/login" class="font-medium hover:text-indigo-500 underline">
              Sign in here
            </router-link>
          </p>
        </div>
      </form>
    </div>

    <!-- Decorative Elements -->
    <div class="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden -z-10">
      <div class="sparkle-container">
        <div v-for="n in 20" :key="n" class="sparkle" :style="randomSparkleStyle()"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { supabase } from '../services/supabase';

const router = useRouter();
const error = ref('');
const isLoading = ref(false);

const ageGroups = ['3-5', '6-8', '9-12'];

const formData = ref({
  username: '',
  email: '',
  password: '',
  ageGroup: ''
});

const isFormValid = computed(() => {
  return formData.value.username &&
         formData.value.email &&
         formData.value.password &&
         formData.value.ageGroup;
});

const handleSignup = async () => {
  try {
    isLoading.value = true;
    error.value = '';

    // Sign up with Supabase
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: formData.value.email,
      password: formData.value.password,
      options: {
        data: {
          username: formData.value.username,
          age_group: formData.value.ageGroup,
          created_at: new Date().toISOString()
        }
      }
    });

    if (authError) throw authError;

    // Create user profile in profiles table
    const { error: profileError } = await supabase
      .from('profiles')
      .insert([
        {
          id: authData.user.id,
          username: formData.value.username,
          age_group: formData.value.ageGroup,
          created_at: new Date().toISOString()
        }
      ]);

    if (profileError) throw profileError;

    // Save user info to localStorage
    localStorage.setItem('username', formData.value.username);
    localStorage.setItem('signUpDate', new Date().toISOString());

    // Redirect to story creation
    router.push('/');
  } catch (err) {
    console.error('Signup error:', err);
    error.value = err.message || 'An error occurred during signup';
  } finally {
    isLoading.value = false;
  }
};

const randomSparkleStyle = () => {
  const size = Math.random() * 10 + 5;
  return {
    width: `${size}px`,
    height: `${size}px`,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    animationDelay: `${Math.random() * 2}s`,
    animationDuration: `${Math.random() * 2 + 1}s`
  };
};
</script>

<style scoped>
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
</style> 