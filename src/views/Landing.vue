<template>
    <div class="min-h-screen bg-gradient-to-br from-teal-50 via-blue-50 to-cyan-50 font-abeezee">
      <!-- Hero Section with 3D Card Effect -->
      <div class="relative overflow-hidden">
        <div class="absolute inset-0 z-0">
          <div class="absolute top-0 left-1/4 w-96 h-96 bg-teal-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
          <div class="absolute top-1/4 right-1/4 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
          <div class="absolute -bottom-32 left-1/3 w-96 h-96 bg-cyan-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        </div>
  
        <div class="relative pt-20 lg:pt-32 pb-20 lg:pb-32">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="lg:grid lg:grid-cols-12 lg:gap-8 items-center">
              <div class="col-span-6 text-center lg:text-left">
                <h1 class="text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                  <span class="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 via-blue-600 to-cyan-600 animate-gradient">
                    Unleash Your Child's
                  </span>
                  <br />
                  <span class="text-teal-900">
                    Imagination
                  </span>
                </h1>
                <p class="text-xl lg:text-2xl text-teal-700 mb-8 max-w-2xl lg:mx-0 mx-auto">
                  Create magical, personalized stories that bring your child's dreams to life with AI-powered storytelling.
                </p>
                <div class="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <Button @click="startAdventure" variant="fun" size="xl" class="group">
                    <span class="flex items-center gap-2">
                      Start Creating
                      <span class="text-2xl group-hover:rotate-12 transition-transform">✨</span>
                    </span>
                  </Button>
                </div>
              </div>
              <div class="col-span-6 mt-12 lg:mt-0">
                <div class="perspective-card group">
                  <div class="relative w-full aspect-[4/3] rounded-2xl shadow-2xl transform transition-all duration-300 group-hover:scale-105 group-hover:rotate-2 overflow-hidden">
                    <div class="absolute inset-0 bg-gradient-to-br from-white to-teal-50 p-6">
                      <div class="h-full flex flex-col">
                        <div class="mb-4 w-3/4 h-8 bg-gradient-to-r from-teal-400 to-blue-400 rounded-lg"></div>
                        <div class="space-y-3">
                          <div class="w-full h-4 bg-teal-100 rounded"></div>
                          <div class="w-5/6 h-4 bg-teal-100 rounded"></div>
                          <div class="w-4/6 h-4 bg-teal-100 rounded"></div>
                        </div>
                        <div class="mt-8 grid grid-cols-2 gap-4">
                          <div class="p-4 bg-white rounded-xl shadow-sm">
                            <div class="w-full h-4 bg-teal-100 rounded mb-2"></div>
                            <div class="w-2/3 h-4 bg-teal-50 rounded"></div>
                          </div>
                          <div class="p-4 bg-white rounded-xl shadow-sm">
                            <div class="w-full h-4 bg-teal-100 rounded mb-2"></div>
                            <div class="w-2/3 h-4 bg-teal-50 rounded"></div>
                          </div>
                        </div>
                        <div class="mt-auto flex justify-end">
                          <div class="w-1/3 h-10 bg-gradient-to-r from-teal-500 to-blue-500 rounded-xl shadow-lg"></div>
                        </div>
                      </div>
                    </div>
                    <div class="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-teal-400/20 to-blue-400/20 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
                    <div class="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-cyan-400/20 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Features Showcase -->
      <div class="py-24 bg-white/90 backdrop-blur-sm relative overflow-hidden">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center mb-16">
            <span class="text-teal-600 font-medium text-lg">Magical Features</span>
            <h2 class="text-4xl lg:text-5xl font-bold text-teal-900 mt-2">Everything You Need</h2>
          </div>
  
          <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div v-for="feature in features" :key="feature.title" 
              class="group relative">
              <div class="absolute inset-0 bg-gradient-to-r from-teal-500 to-blue-500 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"></div>
              <Card variant="fun" class="relative transform transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-xl">
                <div class="p-8">
                  <div class="w-16 h-16 rounded-xl bg-teal-100 flex items-center justify-center mb-6 text-3xl transform transition-transform group-hover:scale-110 group-hover:rotate-12">
                    {{ feature.emoji }}
                  </div>
                  <h3 class="text-xl font-bold text-teal-900 mb-3">
                    {{ feature.title }}
                  </h3>
                  <p class="text-teal-600">
                    {{ feature.description }}
                  </p>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Testimonials Section -->
      <div class="py-24 relative overflow-hidden">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center mb-16">
            <span class="text-teal-600 font-medium text-lg">Testimonials</span>
            <h2 class="text-4xl lg:text-5xl font-bold text-teal-900 mt-2">Parents Love Us</h2>
          </div>
  
          <div class="grid md:grid-cols-3 gap-8">
            <Card v-for="testimonial in testimonials" :key="testimonial.name" variant="fun" class="transform hover:-translate-y-2 transition-all duration-300">
              <div class="p-8">
                <div class="flex items-center gap-1 text-yellow-400 mb-6">
                  <Icons name="star-filled" v-for="_ in 5" :key="_" size="sm"></Icons>
                </div>
                <p class="text-teal-900 mb-6">"{{ testimonial.quote }}"</p>
                <div class="flex items-center gap-4">
                  <div class="w-12 h-12 rounded-full bg-gradient-to-r from-teal-500 to-blue-500 flex items-center justify-center text-white font-bold">
                    {{ testimonial.name.charAt(0) }}
                  </div>
                  <div>
                    <div class="font-bold text-teal-900">
                      {{ testimonial.name }}
                    </div>
                    <div class="text-sm text-teal-600">
                      Parent of {{ testimonial.childAge }} year old
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
  
      <!-- How It Works -->
      <div class="py-24 bg-white/90 backdrop-blur-sm">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center mb-16">
            <span class="text-teal-600 font-medium text-lg">Simple Process</span>
            <h2 class="text-4xl lg:text-5xl font-bold text-teal-900 mt-2">How It Works</h2>
          </div>
  
          <div class="grid md:grid-cols-3 gap-12">
            <div v-for="(step, index) in steps" :key="step.title" 
              class="relative group">
              <div class="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-gradient-to-r from-teal-600 to-blue-600 flex items-center justify-center text-white font-bold text-lg z-10">
                {{ index + 1 }}
              </div>
              <Card variant="fun" class="relative pt-8 transform transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-xl">
                <div class="p-8 text-center">
                  <div class="text-4xl mb-4 transform transition-transform group-hover:scale-110 group-hover:rotate-12">
                    {{ step.emoji }}
                  </div>
                  <h3 class="text-xl font-bold text-teal-900 mb-3">
                    {{ step.title }}
                  </h3>
                  <p class="text-teal-600">
                    {{ step.description }}
                  </p>
                </div>
              </Card>
              <div v-if="index < steps.length - 1" class="hidden md:block absolute top-1/2 left-full w-12 h-0.5 bg-teal-200 transform -translate-y-1/2"></div>
            </div>
          </div>
        </div>
      </div>
  
      <!-- FAQ Section -->
      <div class="py-24">
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center mb-16">
            <span class="text-teal-600 font-medium text-lg">FAQ</span>
            <h2 class="text-4xl lg:text-5xl font-bold text-teal-900 mt-2">Common Questions</h2>
          </div>
  
          <div class="space-y-6">
            <Card v-for="faq in faqs" :key="faq.question" variant="fun" class="transition-all duration-300 hover:shadow-lg">
              <div class="p-6">
                <h3 class="text-xl font-bold text-teal-900 mb-3">
                  {{ faq.question }}
                </h3>
                <p class="text-teal-600">
                  {{ faq.answer }}
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
  
      <!-- Call to Action -->
      <div class="relative py-24 overflow-hidden">
        <div class="absolute inset-0 bg-gradient-to-br from-teal-600 via-blue-600 to-cyan-600"></div>
        <div class="absolute inset-0 bg-grid-white/10"></div>
        
        <div class="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 class="text-4xl lg:text-5xl font-bold text-white mb-6">Ready to Start the Adventure?</h2>
          <p class="text-xl text-white/90 mb-12 max-w-2xl mx-auto">
            Join thousands of families creating magical memories with personalized stories.
          </p>
          <Button @click="startAdventure" variant="fun" size="xl" class="group">
            <span class="flex items-center gap-2">
              Start Creating
              <span class="text-2xl group-hover:rotate-12 transition-transform">✨</span>
            </span>
          </Button>
        </div>
      </div>

      <!-- Auth Modal -->
      <AuthModal 
        :is-open="showAuthModal"
        @close="handleAuthModalClose"
        @auth-success="handleAuthSuccess"
      />
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { useRouter, useRoute } from 'vue-router';
  import { useSupabase } from '../composables/useSupabase';
  import Button from '../components/ui/Button.vue';
  import Card from '../components/ui/Card.vue';
  import Icons from '../components/ui/Icons.vue';
  import AuthModal from '../components/ui/AuthModal.vue';
  
  const router = useRouter();
  const route = useRoute();
  const { user } = useSupabase();
  
  const showAuthModal = ref(false);
  const returnTo = ref('');
  
  // Watch for auth query parameter
  onMounted(() => {
    if (route.query.auth === 'required') {
      showAuthModal.value = true;
      returnTo.value = route.query.returnTo || '/create';
    }
  });
  
  const features = [
    {
      emoji: '🎨',
      title: 'AI-Powered Creativity',
      description: 'Unique stories generated just for your child, with beautiful illustrations and engaging plots.'
    },
    {
      emoji: '🎯',
      title: 'Age-Appropriate',
      description: 'Stories tailored to your child\'s age group with suitable vocabulary and themes.'
    },
    {
      emoji: '🔄',
      title: 'Interactive Choices',
      description: 'Let your child shape the story with meaningful choices that affect the narrative.'
    },
    {
      emoji: '🎭',
      title: 'Multiple Themes',
      description: 'Choose from various exciting themes like fantasy, space, ocean, and more.'
    },
    {
      emoji: '📚',
      title: 'Story Library',
      description: 'Save and revisit your favorite stories anytime in your personal collection.'
    },
    {
      emoji: '🌈',
      title: 'Educational Value',
      description: 'Stories that entertain while teaching valuable lessons and expanding vocabulary.'
    }
  ];
  
  const testimonials = [
    {
      quote: 'My daughter absolutely loves the personalized stories. She gets so excited every time we create a new one!',
      name: 'Sarah M.',
      childAge: 6
    },
    {
      quote: 'The interactive choices make storytime so much more engaging. It\'s become our favorite bedtime routine.',
      name: 'Michael P.',
      childAge: 8
    },
    {
      quote: 'Such a creative way to encourage reading. The AI generates amazing stories that my son can\'t get enough of!',
      name: 'Lisa K.',
      childAge: 5
    }
  ];
  
  const steps = [
    {
      emoji: '👤',
      title: 'Create Profile',
      description: 'Enter your child\'s name and age to personalize the experience.'
    },
    {
      emoji: '🎨',
      title: 'Choose Theme',
      description: 'Select from magical themes and set the length of your adventure.'
    },
    {
      emoji: '📖',
      title: 'Start Reading',
      description: 'Watch as the story unfolds with your child\'s choices guiding the way.'
    }
  ];
  
  const faqs = [
    {
      question: 'How are the stories generated?',
      answer: 'Our AI technology creates unique, personalized stories based on your child\'s age, interests, and choices throughout the narrative.'
    },
    {
      question: 'Is the content age-appropriate?',
      answer: 'Yes! All stories are tailored to specific age groups (3-5, 6-8, 9-12) with appropriate vocabulary and themes.'
    },
    {
      question: 'Can we save our favorite stories?',
      answer: 'Absolutely! Your stories are saved in your personal library for you to revisit anytime.'
    },
    {
      question: 'How long are the stories?',
      answer: 'You can choose the story length when creating it, typically ranging from 5-15 pages with interactive choices.'
    }
  ];
  
  const startAdventure = () => {
    if (!user.value) {
      showAuthModal.value = true;
      returnTo.value = '/create';
    } else {
      router.push('/create');
    }
  };
  
  const handleAuthSuccess = async (authenticatedUser) => {
    console.log('Auth success, redirecting to:', returnTo.value);
    showAuthModal.value = false;
    await router.push(returnTo.value || '/create');
  };
  
  const handleAuthModalClose = () => {
    showAuthModal.value = false;
    // If we came from another page, clear the query params
    if (route.query.auth) {
      router.replace({ query: {} });
    }
  };
  </script>
  
  <style scoped>
  @keyframes blob {
    0% { transform: translate(0px, 0px) scale(1); }
    33% { transform: translate(30px, -50px) scale(1.1); }
    66% { transform: translate(-20px, 20px) scale(0.9); }
    100% { transform: translate(0px, 0px) scale(1); }
  }
  
  @keyframes gradient {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
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
  
  .animate-gradient {
    background-size: 200% 200%;
    animation: gradient 4s ease infinite;
  }
  
  .perspective-card {
    perspective: 1000px;
  }
  
  .bg-grid-white\/10 {
    background-image: url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23fff' fill-opacity='0.1' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E");
  }
  </style> 