-- First, disable RLS to make changes
ALTER TABLE public.stories DISABLE ROW LEVEL SECURITY;

-- Drop existing tables if they exist
DROP TABLE IF EXISTS public.pages CASCADE;
DROP TABLE IF EXISTS public.stories CASCADE;

-- Create the stories table
CREATE TABLE public.stories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    title TEXT NOT NULL,
    metadata JSONB NOT NULL,
    user_id UUID NOT NULL,
    CONSTRAINT fk_user
        FOREIGN KEY (user_id)
        REFERENCES auth.users(id)
        ON DELETE CASCADE
);

-- Create the pages table with foreign key to stories
CREATE TABLE public.pages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    story_id UUID NOT NULL REFERENCES public.stories(id) ON DELETE CASCADE,
    page_number INTEGER NOT NULL,
    content TEXT NOT NULL,
    title TEXT,
    choices JSONB,
    previous_choice TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(story_id, page_number)
);

-- Create indexes for better performance
CREATE INDEX idx_stories_user_id ON public.stories(user_id);
CREATE INDEX idx_pages_story_id ON public.pages(story_id);

-- Enable RLS on stories
ALTER TABLE public.stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;

-- Create policies for stories
CREATE POLICY "Enable read for user's own stories"
ON public.stories FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Enable insert with user_id"
ON public.stories FOR INSERT
WITH CHECK (
    auth.role() = 'authenticated' AND
    auth.uid() = user_id
);

CREATE POLICY "Enable update for user's own stories"
ON public.stories FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Enable delete for user's own stories"
ON public.stories FOR DELETE
USING (auth.uid() = user_id);

-- Create policies for pages
CREATE POLICY "Enable read for pages of user's stories"
ON public.pages FOR SELECT
USING (EXISTS (
    SELECT 1 FROM public.stories
    WHERE stories.id = pages.story_id
    AND stories.user_id = auth.uid()
));

CREATE POLICY "Enable insert for pages of user's stories"
ON public.pages FOR INSERT
WITH CHECK (EXISTS (
    SELECT 1 FROM public.stories
    WHERE stories.id = pages.story_id
    AND stories.user_id = auth.uid()
));

CREATE POLICY "Enable update for pages of user's stories"
ON public.pages FOR UPDATE
USING (EXISTS (
    SELECT 1 FROM public.stories
    WHERE stories.id = pages.story_id
    AND stories.user_id = auth.uid()
));

CREATE POLICY "Enable delete for pages of user's stories"
ON public.pages FOR DELETE
USING (EXISTS (
    SELECT 1 FROM public.stories
    WHERE stories.id = pages.story_id
    AND stories.user_id = auth.uid()
));

-- Grant necessary permissions
GRANT ALL ON public.stories TO authenticated;
GRANT ALL ON public.pages TO authenticated;
GRANT USAGE ON SCHEMA public TO authenticated;

-- Create trigger to automatically set user_id
CREATE OR REPLACE FUNCTION set_user_id()
RETURNS TRIGGER AS $$
BEGIN
    NEW.user_id = auth.uid();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER set_user_id_trigger
    BEFORE INSERT ON public.stories
    FOR EACH ROW
    EXECUTE FUNCTION set_user_id();

-- Create a function to check auth status (for debugging)
CREATE OR REPLACE FUNCTION check_auth_status()
RETURNS TABLE (
    is_authenticated boolean,
    current_user_id uuid,
    current_role text
) LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
    RETURN QUERY SELECT
        auth.role() = 'authenticated',
        auth.uid(),
        auth.role()::text;
END;
$$; 