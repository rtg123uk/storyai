import { createClient } from '@supabase/supabase-js';
import { ref, onMounted, onUnmounted } from 'vue';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Create singletons for auth state
const user = ref(null);
const error = ref(null);
const isLoading = ref(true);
let authStateListener = null;

// Initialize user session
const initUser = async () => {
  console.group('Supabase Auth - initUser');
  console.log('Starting auth initialization');
  try {
    const { data: { session } } = await supabase.auth.getSession();
    console.log('Retrieved session:', {
      hasSession: !!session,
      hasUser: !!session?.user,
      userId: session?.user?.id,
      userEmail: session?.user?.email
    });
    
    if (session?.user) {
      console.log('Setting user from session');
      user.value = session.user;
    } else {
      console.log('No authenticated user session found');
      user.value = null;
    }
  } catch (e) {
    console.error('Error initializing user:', e);
    error.value = e.message;
  } finally {
    isLoading.value = false;
    console.log('Auth initialization complete. State:', {
      isAuthenticated: !!user.value,
      isLoading: isLoading.value,
      hasError: !!error.value
    });
  }
  console.groupEnd();
};

// Initialize auth state listener
const initAuthListener = () => {
  console.group('Supabase Auth - initAuthListener');
  console.log('Setting up auth state listener');
  
  if (!authStateListener) {
    authStateListener = supabase.auth.onAuthStateChange((event, session) => {
      console.group('Auth State Change Event');
      console.log('Event type:', event);
      console.log('Session state:', {
        hasSession: !!session,
        hasUser: !!session?.user,
        userId: session?.user?.id,
        userEmail: session?.user?.email
      });
      
      user.value = session?.user || null;
      console.log('Updated user state:', {
        isAuthenticated: !!user.value,
        userEmail: user.value?.email
      });
      console.groupEnd();
    });
    console.log('Auth listener initialized');
  } else {
    console.log('Auth listener already exists');
  }
  console.groupEnd();
};

// Initialize auth state
initUser();
initAuthListener();

export function useSupabase() {
  // Auth functions
  const signIn = async (email, password) => {
    isLoading.value = true;
    error.value = null;
    
    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (authError) throw authError;
      
      console.log('Sign in successful:', data.user);
      user.value = data.user;
      return { user: data.user };
    } catch (e) {
      console.error('Sign in error:', e);
      error.value = e.message;
      return { error: e };
    } finally {
      isLoading.value = false;
    }
  };

  const signUp = async (email, password) => {
    isLoading.value = true;
    error.value = null;
    
    try {
      const { data, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });
      if (authError) throw authError;
      
      console.log('Sign up response:', data);
      
      if (data.user && !data.session) {
        console.log('Email confirmation required. User created but not confirmed:', data.user);
        localStorage.setItem('pendingUser', JSON.stringify(data.user));
        return { 
          user: data.user,
          message: 'Please check your email to confirm your account. Your story will be saved automatically after confirmation.' 
        };
      }
      
      user.value = data.user;
      return { user: data.user };
    } catch (e) {
      console.error('Sign up error:', e);
      error.value = e.message;
      return { error: e };
    } finally {
      isLoading.value = false;
    }
  };

  const signOut = async () => {
    isLoading.value = true;
    error.value = null;
    
    try {
      const { error: authError } = await supabase.auth.signOut();
      if (authError) throw authError;
      user.value = null;
      console.log('Sign out successful');
    } catch (e) {
      console.error('Sign out error:', e);
      error.value = e.message;
    } finally {
      isLoading.value = false;
    }
  };

  // Story functions
  const getStories = async () => {
    if (!user.value?.id) {
      error.value = 'User must be authenticated to get stories';
      return { error: 'Authentication required' };
    }

    isLoading.value = true;
    error.value = null;

    try {
      // First verify the session is still valid
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('Authentication session expired');
      }

      const { data, error: dbError } = await supabase
        .from('stories')
        .select('*')
        .eq('user_id', user.value.id)
        .order('created_at', { ascending: false });
      
      if (dbError) throw dbError;
      return { data };
    } catch (e) {
      console.error('Error getting stories:', e);
      error.value = e.message;
      return { error: e.message };
    } finally {
      isLoading.value = false;
    }
  };

  const saveStory = async (storyData) => {
    console.group('Supabase Save Story - Detailed Debug');
    console.log('Initial story data received:', {
      title: storyData.title,
      pagesCount: storyData.pages?.length,
      pagesSummary: storyData.pages?.map(p => ({
        title: p.title,
        selectedChoice: p.selectedChoice,
        previousChoice: p.previousChoice
      }))
    });

    if (!user.value?.id) {
      error.value = 'User must be authenticated to save stories';
      return { error: 'Authentication required' };
    }

    isLoading.value = true;
    error.value = null;

    try {
      // First verify the session is still valid
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('Authentication session expired');
      }

      // Extract pages from story data
      const { pages, ...storyDetails } = storyData;

      // First save the story
      const { data: story, error: storyError } = await supabase
        .from('stories')
        .insert([{
          title: storyDetails.title,
          user_id: user.value.id,
          metadata: {
            ...storyDetails.metadata,
            useVoice: storyDetails.useVoice || false,
            selectedVoiceId: storyDetails.selectedVoiceId || null,
            saved_at: new Date().toISOString()
          }
        }])
        .select()
        .single();

      if (storyError) throw storyError;
      console.log('Story record created:', story);

      // Then save all pages
      if (Array.isArray(pages)) {
        const pagesData = pages.map((page, index) => {
          const pageData = {
            story_id: story.id,
            page_number: index + 1,
            content: page.content,
            title: page.title || `Page ${index + 1}`,
            choices: page.choices || [],
            previous_choice: page.previousChoice || page.selectedChoice || null
          };
          console.log(`Preparing page ${index + 1} data:`, {
            pageNumber: pageData.page_number,
            previousChoice: pageData.previous_choice,
            sourceChoice: {
              previousChoice: page.previousChoice,
              selectedChoice: page.selectedChoice
            }
          });
          return pageData;
        });

        console.log('Final pages data to insert:', pagesData.map(p => ({
          pageNumber: p.page_number,
          previousChoice: p.previous_choice
        })));

        const { error: pagesError } = await supabase
          .from('pages')
          .insert(pagesData);

        if (pagesError) throw pagesError;
      }

      // Fetch the complete story with pages
      const { data: completeStory, error: fetchError } = await supabase
        .from('stories')
        .select(`
          *,
          pages (
            id,
            page_number,
            content,
            title,
            choices,
            previous_choice
          )
        `)
        .eq('id', story.id)
        .order('page_number', { foreignTable: 'pages' })
        .single();

      if (fetchError) throw fetchError;

      console.log('Complete story after save:', {
        id: completeStory.id,
        title: completeStory.title,
        pagesWithChoices: completeStory.pages.map(p => ({
          pageNumber: p.page_number,
          previousChoice: p.previous_choice
        }))
      });
      console.groupEnd();
      return { data: completeStory };
    } catch (e) {
      console.error('Error in saveStory:', e);
      error.value = e.message;
      console.groupEnd();
      return { error: e.message };
    } finally {
      isLoading.value = false;
    }
  };

  return {
    user,
    error,
    isLoading,
    signIn,
    signUp,
    signOut,
    supabase,
    getStories,
    saveStory
  };
} 