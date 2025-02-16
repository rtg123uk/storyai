# AI Story Generator

An interactive children's story generation system that creates personalized, age-appropriate stories using AI.

## Features

- Personalized story generation based on child's age, interests, and preferences
- Interactive storytelling with choice points
- Age-appropriate content and vocabulary
- Educational elements integrated into stories
- Text-to-speech narration
- Beautiful illustrations generated for each story
- Profile management for multiple children
- Story library and favorites

## Tech Stack

- Frontend: Vue.js 3 with Composition API
- UI Framework: Tailwind CSS
- Database: Supabase
- AI Services:
  - OpenAI GPT for story generation
  - DALL-E for illustration generation
  - ElevenLabs for voice generation

## Prerequisites

- Node.js 16+
- npm or yarn
- Supabase account
- OpenAI API key
- ElevenLabs API key

## Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/ai-story-generator.git
cd ai-story-generator
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_OPENAI_API_KEY=your_openai_api_key
VITE_ELEVENLABS_API_KEY=your_elevenlabs_api_key
```

4. Start the development server:
```bash
npm run dev
```

5. Build for production:
```bash
npm run build
```

## Project Structure

```
src/
├── assets/         # Static assets and styles
├── components/     # Vue components
├── composables/    # Composable functions
├── views/          # Page components
├── App.vue         # Root component
└── main.js         # Application entry point
```

## Database Schema

The project uses Supabase with the following tables:

- `children`: Child profiles
- `stories`: Generated stories
- `story_interactions`: Story interaction tracking

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- OpenAI for GPT and DALL-E APIs
- ElevenLabs for text-to-speech
- Supabase for backend services
- Vue.js team for the amazing framework
- Tailwind CSS for the utility-first CSS framework 