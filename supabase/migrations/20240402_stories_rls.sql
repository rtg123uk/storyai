-- Enable RLS
ALTER TABLE public.stories ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Enable read for users" ON public.stories;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON public.stories;
DROP POLICY IF EXISTS "Enable update for users based on user_id" ON public.stories;
DROP POLICY IF EXISTS "Enable delete for users based on user_id" ON public.stories;

-- Create policies
-- Allow users to read their own stories
CREATE POLICY "Enable read for users"
ON public.stories
FOR SELECT
USING (auth.uid() = user_id);

-- Allow authenticated users to insert their own stories
CREATE POLICY "Enable insert for authenticated users"
ON public.stories
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own stories
CREATE POLICY "Enable update for users based on user_id"
ON public.stories
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Allow users to delete their own stories
CREATE POLICY "Enable delete for users based on user_id"
ON public.stories
FOR DELETE
USING (auth.uid() = user_id);

-- Ensure the stories table has the correct structure
DO $$ 
BEGIN
  -- Add user_id column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'stories' 
    AND column_name = 'user_id'
  ) THEN
    ALTER TABLE public.stories 
    ADD COLUMN user_id UUID REFERENCES auth.users(id);
  END IF;
END $$;

-- Create index on user_id for better performance
CREATE INDEX IF NOT EXISTS stories_user_id_idx ON public.stories(user_id); 