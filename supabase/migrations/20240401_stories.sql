-- Drop dependent tables first
DROP TABLE IF EXISTS public.story_interactions;

-- Drop main table with CASCADE to handle any remaining dependencies
DROP TABLE IF EXISTS public.stories CASCADE;

-- Create stories table with proper schema
CREATE TABLE public.stories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    title TEXT NOT NULL,
    pages JSONB NOT NULL,
    metadata JSONB NOT NULL
);

-- Recreate story_interactions table
CREATE TABLE public.story_interactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    story_id UUID REFERENCES public.stories(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    interaction_type TEXT NOT NULL,
    interaction_data JSONB
);

-- Enable RLS
ALTER TABLE public.stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.story_interactions ENABLE ROW LEVEL SECURITY;

-- Create policies for stories
CREATE POLICY "Enable read access for all users"
ON public.stories FOR SELECT
USING (true);

CREATE POLICY "Enable insert access for all users"
ON public.stories FOR INSERT
WITH CHECK (true);

-- Create policies for story_interactions
CREATE POLICY "Enable read access for all users"
ON public.story_interactions FOR SELECT
USING (true);

CREATE POLICY "Enable insert access for all users"
ON public.story_interactions FOR INSERT
WITH CHECK (true); 