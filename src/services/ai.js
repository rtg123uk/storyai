import axios from 'axios';

const openaiClient = axios.create({
  baseURL: 'https://api.openai.com/v1',
  headers: {
    'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
    'Content-Type': 'application/json',
  },
});

const elevenlabsClient = axios.create({
  baseURL: 'https://api.elevenlabs.io/v1',
  headers: {
    'xi-api-key': import.meta.env.VITE_ELEVENLABS_API_KEY,
    'Content-Type': 'application/json',
  },
});

// Story diversity configuration
const storyOpeningStyles = [
    'action_packed', // Start with an exciting moment
    'mysterious', // Begin with a curious discovery
    'descriptive', // Paint a vivid scene
    'dialogue', // Start with character conversation
    'question', // Open with an intriguing question
    'daily_life' // Begin in the character's normal world
];

const narrativePerspectives = [
    'third_person', // Traditional storytelling
    'first_person', // From the child's perspective
    'omniscient', // All-knowing narrator
    'interactive' // Direct address to the reader
];

const storyStructures = [
    'hero_journey', // Classic adventure structure
    'mystery_solve', // Puzzle or mystery to solve
    'friendship_tale', // Focus on relationships
    'discovery_quest', // Learning and exploration
    'challenge_overcome', // Facing and beating obstacles
    'magical_transformation' // Change and growth
];

// Helper function to get a random element from an array
const randomElement = (array) => array[Math.floor(Math.random() * array.length)];

// Add after the openaiClient and elevenlabsClient declarations
const TITLE_HISTORY_LIMIT = 100;

// Add new function to check and track titles
const checkAndTrackTitle = async (supabase, title) => {
  try {
    // Get recent titles
    const { data: recentTitles } = await supabase
      .from('story_titles')
      .select('title')
      .order('created_at', { ascending: false })
      .limit(TITLE_HISTORY_LIMIT);

    // Check if title exists in recent titles
    const titleExists = recentTitles?.some(t => t.title.toLowerCase() === title.toLowerCase());

    if (titleExists) {
      // If title exists, generate a unique variant
      const timestamp = new Date().getTime().toString().slice(-4);
      title = `${title} - A New Adventure ${timestamp}`;
    }

    // Add new title to tracking table
    await supabase
      .from('story_titles')
      .insert({ title, created_at: new Date().toISOString() });

    // Clean up old titles if we exceed the limit
    if (recentTitles?.length >= TITLE_HISTORY_LIMIT) {
      const { data: oldestTitles } = await supabase
        .from('story_titles')
        .select('id')
        .order('created_at', { ascending: true })
        .limit(1);

      if (oldestTitles?.[0]) {
        await supabase
          .from('story_titles')
          .delete()
          .eq('id', oldestTitles[0].id);
      }
    }

    return title;
  } catch (error) {
    console.error('Error tracking title:', error);
    return title; // Return original title if tracking fails
  }
};

export const generateCharacterImage = async (characterDetails) => {
  console.log('Generating character image with details:', characterDetails);
  
  try {
    const prompt = generateCharacterPrompt(characterDetails);
    console.log('Character image prompt:', prompt);

    const response = await openaiClient.post('/images/generations', {
      model: 'dall-e-3',
      prompt,
      n: 1,
      size: '1024x1024',
      style: 'vivid',
    });

    console.log('DALL-E response:', response.data);
    return response.data.data[0].url;
  } catch (error) {
    console.error('Error generating character image:', error);
    throw new Error('Failed to generate character image: ' + (error.response?.data?.error?.message || error.message));
  }
};

const generateCharacterPrompt = (details) => {
  const { type, description, traits } = details;
  
  const styleGuide = 'Create a child-friendly character illustration in a warm, engaging digital art style with bright colors and soft edges. The character should be expressive and appealing to children.';
  
  let prompt = `${styleGuide} The character is a ${type}: ${description}.`;
  
  if (traits) {
    prompt += ` The character's personality traits (${traits}) should be reflected in their expression and pose.`;
  }

  switch (type) {
    case 'human':
      prompt += ' Ensure the character has a friendly, welcoming expression and child-appropriate clothing.';
      break;
    case 'animal':
      prompt += ' The animal should be anthropomorphized with friendly features and expressive eyes.';
      break;
    case 'magical':
      prompt += ' Include magical elements like sparkles or glowing effects while maintaining a friendly appearance.';
      break;
    case 'robot':
      prompt += ' The robot should have rounded edges and friendly features, avoiding any scary or industrial elements.';
      break;
  }

  return prompt;
};

export const generateStory = async (storyParams) => {
  console.log('Starting story generation with params:', storyParams);
  const { childName, ageGroup, theme, storyLength, isInteractive, narrationStyle } = storyParams;

  try {
    // Generate the base story structure using OpenAI
    console.log('Calling OpenAI API for story generation...');
    const completion = await openaiClient.post('/chat/completions', {
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are a specialized AI children's story generator designed to create engaging, interactive stories for ${ageGroup} year olds.

          Story Configuration:
          - Opening Style: ${randomElement(storyOpeningStyles)}
          - Narrative Perspective: ${randomElement(narrativePerspectives)}
          - Story Structure: ${randomElement(storyStructures)}
          - Theme: ${theme}
          - Age Group: ${ageGroup}
          
          Create a story with exactly ${storyLength.split(' ')[0]} pages where:
          1. Each page has substantial content (at least 200 words)
          2. Each page offers 2-3 meaningful choices
          3. Choices lead to different adventures or activities
          4. Content is age-appropriate and educational
          5. Language is engaging and descriptive
          6. The story must conclude within exactly ${storyLength.split(' ')[0]} pages
          7. The final page should provide a satisfying conclusion without choices
          8. Generate a UNIQUE and CREATIVE title that hasn't been used before
          
          Requirements:
          1. Start with a fresh, unique opening that matches the selected opening style
          2. Maintain the chosen narrative perspective throughout
          3. Follow the selected story structure while incorporating the theme
          4. Ensure age-appropriate language and concepts
          5. Create vivid scenes with sensory details
          6. Include meaningful character development
          7. Maintain internal consistency and logic
          8. Blend educational elements naturally into the narrative
          
          Format each page's content in markdown like this:
          # Unique Story Title That Hasn't Been Used Before
          Story content goes here (minimum 200 words per page)...`
        },
        {
          role: 'user',
          content: `Create a ${storyLength} interactive story for ${childName} with these requirements:
            1. Theme: ${theme}
            2. Style: ${narrationStyle}
            3. Age Group: ${ageGroup} (adjust vocabulary accordingly)
            4. Interactive Elements:
               - Include meaningful choices on each page (except the last)
               - Each choice leads to a new adventure
               - Keep choices clear and straightforward
               - Make each path fun and engaging
            5. Learning Integration:
               - Include age-appropriate educational content
               - Use vocabulary suitable for ${ageGroup} age group
               - Make learning natural and fun
            6. Story Structure:
               - Exactly ${storyLength.split(' ')[0]} pages
               - Rich content on each page (minimum 200 words)
               - Satisfying conclusion on the final page`
        }
      ],
      temperature: 0.8,
      max_tokens: getMaxTokens(storyLength)
    });

    console.log('Received OpenAI story response:', completion.data);
    let storyStructure;
    try {
      const content = completion.data.choices[0].message.content;
      console.log('Raw content:', content);
      
      // Parse markdown content into story structure
      const pages = content.split('---').map(pageContent => pageContent.trim()).filter(Boolean);
      
      // Extract and track the title
      const rawTitle = pages[0].split('\n')[0].replace('# ', '');
      const uniqueTitle = await checkAndTrackTitle(supabase, rawTitle);
      
      storyStructure = {
        title: uniqueTitle,
        pages: pages.map((pageContent, index) => {
          const lines = pageContent.split('\n').filter(Boolean);
          const title = lines[0].replace('# ', '');
          
          // Extract choices if they exist
          const choiceSection = pageContent.match(/\*\*What would you like to do\?\*\*:([\s\S]*?)(?=\n\n|$)/);
          const choices = choiceSection ? choiceSection[0].match(/\*\*(.*?)\*\*:\s*(.*?)(?=\n|$)/g)?.map(choice => {
            const [option, description] = choice.split(':').map(s => s.trim());
            return {
              text: option.replace(/\*\*/g, ''),
              description: description,
              nextPageIndex: null  // Will be linked dynamically in the viewer
            };
          }) : [];
          
          // Remove choice section and title from content
          let content = pageContent;
          if (choiceSection) {
            content = content.replace(choiceSection[0], '');
          }
          content = content.replace(lines[0], '').trim();
          
          return {
            title,
            content,
            choices,
            pageNumber: index + 1,
            illustration_prompt: `A child-friendly illustration of: ${title}. ${content.split('\n')[0]}`,
            audio_prompt: {
              title,
              content,
              choices,
              useVoice: storyParams.useVoice,
              selectedVoiceId: storyParams.selectedVoiceId
            }
          };
        })
      };
      
      if (!storyStructure.pages || !Array.isArray(storyStructure.pages)) {
        throw new Error('Invalid story structure: missing pages array');
      }
    } catch (parseError) {
      console.error('Markdown parsing error:', parseError);
      throw new Error(`Failed to parse story response: ${parseError.message}`);
    }

    // Generate illustrations and audio for each page
    console.log('Generating illustrations and audio...');
    const pages = await Promise.all(
      storyStructure.pages.map(async (page, index) => {
        let illustration = null;
        let audio = null;
        
        try {
          illustration = await generateIllustration(page.illustration_prompt);
        } catch (error) {
          console.warn(`Warning: Failed to generate illustration for page ${index + 1}:`, error.message);
        }

        if (page.content) {
          try {
            audio = await generatePageNarration(page.content, page.audio_prompt, narrationStyle);
          } catch (error) {
            console.warn(`Warning: Failed to generate audio for page ${index + 1}:`, error.message);
          }
        }

        return {
          ...page,
          illustration,
          audio,
          pageNumber: index + 1
        };
      })
    );

    // Prepare data for storage
    const result = {
      title: storyStructure.title || 'Untitled Story',
      pages: pages.map(page => ({
        ...page,
        content: page.content || '',
        audio: page.audio ? Buffer.from(page.audio).toString('base64') : null
      })),
      metadata: {
        childName,
        ageGroup,
        theme,
        isInteractive,
        narrationStyle,
        storyLength,
        totalPages: pages.length,
        createdAt: new Date().toISOString(),
        useVoice: storyParams.useVoice,
        selectedVoiceId: storyParams.selectedVoiceId
      }
    };

    console.log('Final story structure:', result);
    return result;
  } catch (error) {
    console.error('Error in AI service:', error);
    if (error.response?.status === 429) {
      throw new Error('Rate limit reached. Please try again later.');
    } else if (error.response?.data?.error) {
      throw new Error(`API error: ${error.response.data.error.message}`);
    }
    throw new Error(error.message || 'Failed to generate story');
  }
};

const generateIllustration = async (prompt) => {
  if (!prompt) {
    console.warn('No illustration prompt provided');
    return null;
  }

  try {
    const enhancedPrompt = `Create a child-friendly illustration for a storybook page of the following scene: ${prompt}. 
    Style: Warm, engaging digital art with bright colors and soft edges.`;
    
    const response = await openaiClient.post('/images/generations', {
      model: 'dall-e-3',
      prompt: enhancedPrompt,
      n: 1,
      size: '1024x1024',
      style: 'vivid',
    });

    return response.data.data[0].url;
  } catch (error) {
    console.warn('Warning: Failed to generate illustration:', error.message);
    if (error.response?.status === 429) {
      console.warn('Rate limit reached for image generation');
    }
    return null;
  }
};

const generateMiniGameImage = async (prompt) => {
  try {
    const enhancedPrompt = `Create a fun, educational mini-game illustration with: ${prompt}. 
    Style: Playful, clear, and educational. Make it visually engaging for children.`;

    const response = await openaiClient.post('/images/generations', {
      model: 'dall-e-3',
      prompt: enhancedPrompt,
      n: 1,
      size: '1024x1024',
      style: 'vivid',
    });

    return response.data.data[0].url;
  } catch (error) {
    console.error('Error generating mini-game image:', error);
    throw new Error('Failed to generate mini-game image: ' + error.message);
  }
};

const generatePageNarration = async (content, audioPrompt, style) => {
  if (!content) return null;
  
  // Check if ElevenLabs API key is available
  if (!import.meta.env.VITE_ELEVENLABS_API_KEY) {
    console.warn('ElevenLabs API key not found in environment variables');
    return null;
  }

  try {
    const voiceId = getVoiceId(style);
    // Include title and choices in the narration
    const fullContent = `${audioPrompt.title}. ${audioPrompt.content}${
      audioPrompt.choices?.length 
        ? `. Your choices are: ${audioPrompt.choices.map(c => c.text + ': ' + c.description).join('. ')}`
        : ''
    }`;
    
    const ssmlContent = `<speak><prosody rate="medium" pitch="medium">${fullContent}</prosody></speak>`;

    const response = await elevenlabsClient.post(`/text-to-speech/${voiceId}`, {
      text: ssmlContent,
      model_id: 'eleven_monolingual_v1',
      voice_settings: getVoiceSettings(style),
    });

    return response.data;
  } catch (error) {
    console.warn('Warning: Audio narration generation failed:', error.message);
    if (error.response?.status === 401) {
      console.warn('Invalid or missing ElevenLabs API key');
    } else if (error.response?.status === 429) {
      console.warn('Rate limit reached for audio generation');
    }
    return null;
  }
};

const STORY_LENGTHS = {
  '5 pages': 4000,  // 800 tokens per page for richer content
  '10 pages': 8000, // 800 tokens per page for consistent density
  '15 pages': 12000, // 800 tokens per page for longer stories
};

const getMaxTokens = (length) => {
  return STORY_LENGTHS[length] || 8000; // Default to 10 pages (8000 tokens) if length not specified
};

const getVoiceId = (style) => {
  // Enhanced voice selection with more options
  const voices = {
    warm: 'pNInz6obpgDQGcFmaJgB',    // Warm, gentle voice
    exciting: 'yoZ06aMxZJJ28mfd3POQ', // Energetic, adventurous voice
    calm: 'EXAVITQu4vr4xnSDxMaL',     // Soft, soothing voice
    funny: 'VR6AewLTigWG4xSOukaG',    // Playful, humorous voice
    magical: 'jsCqWAovK2LkecY7zXl4',  // Whimsical, enchanting voice
    wise: 'ThT5KcBeYPX3keUQqHPh',     // Educational, mentor-like voice
  };
  return voices[style] || voices.warm;
};

const getVoiceSettings = (style) => {
  // Enhanced voice settings for different narration styles
  const baseSettings = {
    stability: 0.75,
    similarity_boost: 0.75,
  };

  const styleSettings = {
    warm: { ...baseSettings, speaking_rate: 0.9 },
    exciting: { ...baseSettings, speaking_rate: 1.1, pitch: 1.1 },
    calm: { ...baseSettings, speaking_rate: 0.8, pitch: 0.9 },
    funny: { ...baseSettings, speaking_rate: 1.2, pitch: 1.2 },
    magical: { ...baseSettings, speaking_rate: 0.95, pitch: 1.1 },
    wise: { ...baseSettings, speaking_rate: 0.85, pitch: 0.9 },
  };

  return styleSettings[style] || styleSettings.warm;
};

const extractIllustrationPrompts = (story) => {
  const matches = story.match(/\[ILLUSTRATION\](.*?)(?=\[|$)/g) || [];
  return matches.map(match => match.replace('[ILLUSTRATION]', '').trim());
};

const extractTitle = (story) => {
  const titleMatch = story.match(/^#\s*(.*?)(?:\n|$)/m);
  return titleMatch ? titleMatch[1].trim() : 'Untitled Story';
};

const getStoryPhase = (currentPage, totalPages) => {
  const progress = currentPage / totalPages;
  
  if (progress <= 0.2) return 'introduction';
  if (progress <= 0.4) return 'rising_action';
  if (progress > 0.4 && progress <= 0.6) return 'climax';
  if (progress > 0.6 && progress <= 0.8) return 'falling_action';
  return 'resolution';
};

const buildPagePrompt = ({ childName, ageGroup, theme, choiceMade, isFirstPage, currentPage, totalPages, previousPages, storyPhase }) => {
  const prompts = {
    introduction: `Create the opening page of a children's story for ${childName} (age ${ageGroup}) about ${theme}. 
                  Set up the main character and the story world. Make it engaging and fun.
                  ${previousPages?.metadata?.useCustomName ? `Use their real name "${childName}" as the main character.` : ''}
                  ${previousPages?.metadata?.includeFriends ? `Include their friends: ${previousPages.metadata.friendNames.join(', ')}.` : ''}`,
    
    rising_action: `Continue the story as tension builds. Introduce challenges or obstacles for the character to face. 
                    ${previousPages?.metadata?.includeFriends ? `Remember to include their friends: ${previousPages.metadata.friendNames.join(', ')}.` : ''}
                    Previous choice: "${choiceMade?.text || 'Starting the adventure'}"`,
    
    climax: `This is the peak of the story! Create an exciting and dramatic moment where the main conflict comes to a head. 
             ${previousPages?.metadata?.includeFriends ? `Make sure their friends (${previousPages.metadata.friendNames.join(', ')}) play important roles in the climax.` : ''}
             Make this the most thrilling part of the adventure. Previous choice: "${choiceMade?.text || 'Approaching the climax'}"`,
    
    falling_action: `Begin wrapping up the main conflict while maintaining excitement. Show the consequences of the climax. 
                     ${previousPages?.metadata?.includeFriends ? `Include how their friends (${previousPages.metadata.friendNames.join(', ')}) helped resolve the situation.` : ''}
                     Previous choice: "${choiceMade?.text || 'After the big moment'}"`,
    
    resolution: `Create a satisfying conclusion that wraps up the story and reinforces the theme. 
                 ${previousPages?.metadata?.includeFriends ? `Celebrate the friendship between ${childName} and their friends (${previousPages.metadata.friendNames.join(', ')}).` : ''}
                 Make sure it's meaningful for ${childName} and ties everything together.`
  };

  const basePrompt = prompts[storyPhase];
  
  // Add context about previous pages
  let contextPrompt = '';
  if (previousPages?.length > 0) {
    const lastPage = previousPages[previousPages.length - 1];
    contextPrompt = `\nPrevious page title: "${lastPage.title}"\nPrevious page summary: "${lastPage.content.slice(0, 200)}..."`;
  }

  return `${basePrompt}${contextPrompt}

  Format the response as a JSON object with:
  {
    "title": "An engaging page title",
    "content": "The story content for this page",
    "choices": [
      {
        "text": "First choice option",
        "description": "Brief description of what this choice means"
      },
      {
        "text": "Second choice option",
        "description": "Brief description of what this choice means"
      },
      {
        "text": "Third choice option",
        "description": "Brief description of what this choice means"
      }
    ]
  }

  For the last page, make the choices reflect the ending of the story.
  Age-appropriate language for ${ageGroup} years old.
  Theme: ${theme}
  ${previousPages?.metadata?.useCustomName ? `Remember to use their real name "${childName}" consistently throughout the story.` : ''}
  ${previousPages?.metadata?.includeFriends ? `Include their friends (${previousPages.metadata.friendNames.join(', ')}) as important characters in the story.` : ''}`;
};

export const generateStoryPage = async ({ childName, ageGroup, theme, choiceMade, isFirstPage, currentPage, totalPages, previousPages = [], metadata }) => {
  console.group('📝 Generating Story Page');
  console.log('Parameters:', { childName, ageGroup, theme, currentPage, totalPages, metadata });
  
  try {
    // Determine the story phase
    const storyPhase = getStoryPhase(currentPage, totalPages);
    console.log('Story phase:', storyPhase);

    // Add metadata to previousPages if it's not there
    if (previousPages && !previousPages.metadata && metadata) {
      previousPages.metadata = metadata;
    }

    // Build the prompt based on the story phase
    const prompt = buildPagePrompt({
      childName,
      ageGroup,
      theme,
      choiceMade,
      isFirstPage,
      currentPage,
      totalPages,
      previousPages,
      storyPhase
    });

    console.log('Generated prompt:', prompt);

    // Generate the content
    const pageContent = await generatePageContent(prompt);
    console.log('Generated content:', pageContent);

    // Parse and structure the content
    const parsedContent = parsePageContent(pageContent);
    console.log('Parsed content:', parsedContent);

    // Adjust choices based on story phase
    if (storyPhase === 'resolution') {
      parsedContent.choices = [
        {
          text: "The End",
          description: "Finish the story"
        }
      ];
    }

    return parsedContent;
  } catch (error) {
    console.error('Error generating story page:', error);
    throw error;
  } finally {
    console.groupEnd();
  }
};

const generatePageContent = async (prompt) => {
  try {
    const completion = await openaiClient.post('/chat/completions', {
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a specialized AI children\'s story generator. Create engaging, age-appropriate content in JSON format with title, content, and choices.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.8,
      max_tokens: 1000
    });

    return completion.data.choices[0].message.content;
  } catch (error) {
    console.error('Error generating page content:', error);
    throw error;
  }
};

const parsePageContent = (content) => {
  try {
    // First try to extract JSON from markdown code blocks
    let jsonContent = content;
    const markdownMatch = content.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    if (markdownMatch) {
      jsonContent = markdownMatch[1];
    }

    // Clean up the content string
    jsonContent = jsonContent
      .replace(/```json\s*|\s*```/g, '') // Remove markdown code block markers
      .replace(/\\n/g, ' ')              // Replace escaped newlines
      .replace(/\n/g, ' ')               // Replace actual newlines
      .trim();                           // Remove extra whitespace
    
    // Try to parse the JSON content
    let parsed;
    try {
      parsed = JSON.parse(jsonContent);
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      // If parsing fails, try to create a basic structure from the content
      parsed = {
        title: 'The Adventure Continues',
        content: content.replace(/```json|```/g, '').trim(),
        choices: []
      };
    }
    
    // Clean up and structure the content
    const cleanedContent = {
      title: parsed.title?.trim() || 'The Adventure Continues',
      content: typeof parsed.content === 'string' 
        ? parsed.content.trim()
        : 'Continue on your journey...',
      choices: Array.isArray(parsed.choices) && parsed.choices.length > 0
        ? parsed.choices.map(choice => ({
            text: choice.text?.trim() || 'Continue the adventure',
            description: choice.description?.trim() || 'See what happens next'
          })).slice(0, 3) // Ensure we have at most 3 choices
        : [
            { text: 'Continue exploring', description: 'Move forward in your adventure' },
            { text: 'Take a different path', description: 'Try a new direction' },
            { text: 'Investigate further', description: 'Look more closely at your surroundings' }
          ]
    };

    // Ensure we always have exactly 3 choices
    while (cleanedContent.choices.length < 3) {
      cleanedContent.choices.push(
        { text: 'Continue the adventure', description: 'See what happens next' }
      );
    }

    return cleanedContent;
  } catch (error) {
    console.error('Error parsing page content:', error);
    throw new Error('Failed to parse story content');
  }
};

export const initializeStory = async (storyParams) => {
  const { childName, ageGroup, theme, storyLength } = storyParams;
  
  // Parse the total pages from the storyLength string (e.g., "5 pages" -> 5)
  const totalPages = parseInt(storyLength.split(' ')[0]) || 5;
  console.log(`Initializing story with ${totalPages} pages`);

  const firstPage = await generateStoryPage({ 
    childName, 
    ageGroup, 
    theme, 
    isFirstPage: true, 
    isLastPage: totalPages === 1,
    currentPage: 0,
    totalPages,
    pages: [] // Pass empty pages array for first page
  });
  
  return {
    title: firstPage.title,
    pages: [firstPage],
    metadata: {
      childName,
      ageGroup,
      theme,
      isInteractive: true,
      currentPage: 0,
      totalPages,
      storyPath: [0],
      createdAt: new Date().toISOString()
    }
  };
}; 