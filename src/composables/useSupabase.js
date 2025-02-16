import { createClient } from '@supabase/supabase-js';
import { ref, onMounted } from 'vue';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export function useSupabase() {
  const user = ref(null);
  const error = ref(null);
  const isLoading = ref(false);

  // Initialize user on mount
  const initUser = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        console.log('User authenticated from session:', session.user);
        user.value = session.user;
      } else {
        console.log('No authenticated user session');
      }
    } catch (e) {
      console.error('Error initializing user:', e);
      error.value = e.message;
    }
  };

  // Call initUser when the composable is created
  onMounted(() => {
    initUser();
  });

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
      
      console.log('Sign up successful:', data.user);
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

      // Then save all pages
      if (Array.isArray(pages)) {
        const pagesData = pages.map((page, index) => ({
          story_id: story.id,
          page_number: index + 1,
          content: page.content,
          title: page.title || `Page ${index + 1}`,
          choices: page.choices || [],
          previous_choice: page.previousChoice || null
        }));

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

      console.log('Story saved successfully:', completeStory);
      return { data: completeStory };
    } catch (e) {
      console.error('Error in saveStory:', e);
      error.value = e.message;
      return { error: e.message };
    } finally {
      isLoading.value = false;
    }
  };

  // Auth state change listener
  supabase.auth.onAuthStateChange((event, session) => {
    console.log('Auth state changed:', { event, user: session?.user });
    user.value = session?.user || null;
  });

  return {
    supabase,
    user,
    error,
    isLoading,
    signIn,
    signUp,
    signOut,
    getStories,
    saveStory,
  };
} 