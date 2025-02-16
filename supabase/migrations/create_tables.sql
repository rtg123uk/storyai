-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Create tables first
create table if not exists public.children (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  age_group text not null,
  avatar_url text,
  preferences jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

create table if not exists public.stories (
    id uuid default uuid_generate_v4() primary key,
    title text not null,
    pages jsonb not null,
    metadata jsonb not null,
    created_at timestamp with time zone default timezone('utc'::text, now())
);

create table if not exists public.story_interactions (
  id uuid default uuid_generate_v4() primary key,
  story_id uuid references public.stories(id),
  child_id uuid references public.children(id),
  page_number integer not null,
  choice_made jsonb,
  time_spent integer,
  audio_played boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

create table if not exists public.story_progress (
  id uuid default uuid_generate_v4() primary key,
  story_id uuid references public.stories(id),
  child_id uuid references public.children(id),
  current_page integer not null default 0,
  path_taken integer[] default array[]::integer[],
  completed boolean default false,
  last_interaction timestamp with time zone default timezone('utc'::text, now()),
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Now handle policies
do $$ 
begin
  -- Drop existing policies if they exist
  if exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'children') then
    drop policy if exists "Enable read access for all users" on public.children;
  end if;
  
  if exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'stories') then
    drop policy if exists "Enable read access for all users" on public.stories;
    drop policy if exists "Enable insert access for all users" on public.stories;
  end if;
  
  if exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'story_interactions') then
    drop policy if exists "Enable read access for all users" on public.story_interactions;
    drop policy if exists "Enable insert access for all users" on public.story_interactions;
  end if;
  
  if exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'story_progress') then
    drop policy if exists "Enable read access for all users" on public.story_progress;
    drop policy if exists "Enable insert access for all users" on public.story_progress;
    drop policy if exists "Enable update access for all users" on public.story_progress;
  end if;
end $$;

-- Enable RLS
alter table public.children enable row level security;
alter table public.stories enable row level security;
alter table public.story_interactions enable row level security;
alter table public.story_progress enable row level security;

-- Create new policies
create policy "Enable read access for all users" on public.children
  for select using (true);

create policy "Enable read access for all users" on public.stories
  for select using (true);

create policy "Enable insert access for all users" on public.stories
  for insert with check (true);

create policy "Enable read access for all users" on public.story_interactions
  for select using (true);

create policy "Enable insert access for all users" on public.story_interactions
  for insert with check (true);

create policy "Enable read access for all users" on public.story_progress
  for select using (true);

create policy "Enable insert access for all users" on public.story_progress
  for insert with check (true);

create policy "Enable update access for all users" on public.story_progress
  for update using (true); 