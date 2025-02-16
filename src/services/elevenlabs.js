const ELEVENLABS_API_KEY = import.meta.env.VITE_ELEVENLABS_API_KEY;
const API_BASE_URL = 'https://api.elevenlabs.io/v1';

// Fetch available voices
export const getVoices = async () => {
  try {
    // Log the API key length for debugging (without exposing the key)
    console.log('API Key present:', Boolean(ELEVENLABS_API_KEY), 'Length:', ELEVENLABS_API_KEY?.length);

    if (!ELEVENLABS_API_KEY) {
      console.log('No API key found, using sample voices');
      return getSampleVoices();
    }

    const response = await fetch(`${API_BASE_URL}/voices`, {
      headers: {
        'Accept': 'application/json',
        'xi-api-key': ELEVENLABS_API_KEY.trim()
      }
    });
    
    if (!response.ok) {
      console.error('Voice API Error:', response.status, response.statusText);
      const errorText = await response.text();
      console.error('Error details:', errorText);
      return getSampleVoices();
    }
    
    const data = await response.json();
    console.log('Successfully fetched voices:', data.voices?.length || 0, 'voices found');
    return data.voices;
  } catch (error) {
    console.error('Error fetching voices:', error);
    return getSampleVoices();
  }
};

// Sample voices for fallback
const getSampleVoices = () => {
  return [
    {
      voice_id: 'sample-voice-1',
      name: 'Sarah',
      labels: { accent: 'Friendly' }
    },
    {
      voice_id: 'sample-voice-2',
      name: 'Michael',
      labels: { accent: 'Storyteller' }
    }
  ];
};

// Create a simple beep sound for testing
const createBeepSound = () => {
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(440, audioContext.currentTime); // 440 Hz = A4 note
  
  gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.5);
  
  oscillator.start();
  oscillator.stop(audioContext.currentTime + 0.5);
  
  return new Promise(resolve => {
    setTimeout(() => {
      audioContext.close();
      resolve();
    }, 500);
  });
};

// Modify the textToSpeech function
export const textToSpeech = async (text, voiceId) => {
  try {
    console.log('Starting text-to-speech conversion:', { voiceId, textLength: text?.length });
    
    if (!ELEVENLABS_API_KEY) {
      console.log('No API key found, using beep sound');
      await createBeepSound();
      return null;
    }

    if (voiceId.startsWith('sample-voice')) {
      console.log('Sample voice selected, using beep sound');
      await createBeepSound();
      return null;
    }

    const response = await fetch(`${API_BASE_URL}/text-to-speech/${voiceId}`, {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'xi-api-key': ELEVENLABS_API_KEY.trim(),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        text,
        model_id: 'eleven_monolingual_v1',
        voice_settings: {
          stability: 0.75,
          similarity_boost: 0.75
        }
      })
    });

    if (!response.ok) {
      console.error('Text-to-speech API Error:', response.status, response.statusText);
      const errorText = await response.text();
      console.error('Error details:', errorText);
      await createBeepSound();
      return null;
    }

    const audioBlob = await response.blob();
    console.log('Successfully generated audio:', audioBlob.size, 'bytes');
    return URL.createObjectURL(audioBlob);
  } catch (error) {
    console.error('Error converting text to speech:', error);
    await createBeepSound();
    return null;
  }
}; 