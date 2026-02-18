-- Create app_role enum
create type public.app_role as enum ('admin', 'moderator', 'user');

-- PROFILES
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  display_name text,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- USER ROLES
create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade not null,
  role app_role not null default 'user',
  unique(user_id, role)
);

-- USER STATS
create table public.user_stats (
  user_id uuid references auth.users on delete cascade not null primary key,
  total_xp integer default 0,
  current_streak integer default 0,
  longest_streak integer default 0,
  last_active_date date,
  level integer default 1,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- COURSES
create table public.courses (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  difficulty text,
  "order" integer not null,
  image_url text,
  language text not null default 'jaclang',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- LESSONS
create table public.lessons (
  id uuid primary key default gen_random_uuid(),
  course_id uuid references public.courses on delete cascade not null,
  title text not null,
  content text,
  "order" integer not null,
  xp_reward integer default 10,
  code_template text,
  expected_output text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- USER LESSON PROGRESS
create table public.user_lesson_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade not null,
  lesson_id uuid references public.lessons on delete cascade not null,
  status text check (status in ('locked', 'unlocked', 'in_progress', 'completed')) default 'locked',
  completed_at timestamp with time zone,
  score integer,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, lesson_id)
);

-- ACHIEVEMENTS
create table public.achievements (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  icon text,
  xp_reward integer default 50,
  criteria_type text,
  criteria_value integer,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- USER ACHIEVEMENTS
create table public.user_achievements (
  user_id uuid references auth.users on delete cascade not null,
  achievement_id uuid references public.achievements on delete cascade not null,
  unlocked_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (user_id, achievement_id)
);

-- DAILY CHALLENGES
create table public.daily_challenges (
  id uuid primary key default gen_random_uuid(),
  date date unique not null,
  lesson_id uuid references public.lessons on delete cascade,
  custom_content jsonb,
  xp_reward integer default 20,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- USER DAILY CHALLENGES
create table public.user_daily_challenges (
  user_id uuid references auth.users on delete cascade not null,
  challenge_id uuid references public.daily_challenges on delete cascade not null,
  completed_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (user_id, challenge_id)
);

-- LEARNING PATHS
create table public.learning_paths (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  "order" integer not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- LEARNING PATH COURSES
create table public.learning_path_courses (
  path_id uuid references public.learning_paths on delete cascade not null,
  course_id uuid references public.courses on delete cascade not null,
  "order" integer not null,
  primary key (path_id, course_id)
);

-- SECURITY DEFINER FUNCTIONS
create or replace function public.has_role(requested_role public.app_role)
returns boolean as $$
begin
  return exists (
    select 1 from public.user_roles
    where user_id = auth.uid()
    and role = requested_role
  );
end;
$$ language plpgsql security definer;

-- TRIGGERS FOR PROFILE AND STATS CREATION
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, display_name, avatar_url)
  values (new.id, new.raw_user_meta_data->>'display_name', new.raw_user_meta_data->>'avatar_url');

  insert into public.user_stats (user_id)
  values (new.id);

  insert into public.user_roles (user_id, role)
  values (new.id, 'user');

  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- RLS POLICIES

-- Profiles
alter table public.profiles enable row level security;
create policy "Public profiles are viewable by everyone." on public.profiles for select using (true);
create policy "Users can update own profile." on public.profiles for update using (auth.uid() = id);

-- User Roles
alter table public.user_roles enable row level security;
create policy "User roles are viewable by everyone." on public.user_roles for select using (true);
create policy "Only admins can manage roles." on public.user_roles for all using (public.has_role('admin'));

-- User Stats
alter table public.user_stats enable row level security;
create policy "User stats are viewable by everyone." on public.user_stats for select using (true);
create policy "Users can update own stats." on public.user_stats for update using (auth.uid() = user_id);

-- Courses
alter table public.courses enable row level security;
create policy "Courses are viewable by everyone." on public.courses for select using (true);
create policy "Only admins can manage courses." on public.courses for all using (public.has_role('admin'));

-- Lessons
alter table public.lessons enable row level security;
create policy "Lessons are viewable by everyone." on public.lessons for select using (true);
create policy "Only admins can manage lessons." on public.lessons for all using (public.has_role('admin'));

-- User Lesson Progress
alter table public.user_lesson_progress enable row level security;
create policy "Users can view own progress." on public.user_lesson_progress for select using (auth.uid() = user_id);
create policy "Users can update own progress." on public.user_lesson_progress for insert with check (auth.uid() = user_id);
create policy "Users can update own progress_update." on public.user_lesson_progress for update using (auth.uid() = user_id);

-- Achievements
alter table public.achievements enable row level security;
create policy "Achievements are viewable by everyone." on public.achievements for select using (true);
create policy "Only admins can manage achievements." on public.achievements for all using (public.has_role('admin'));

-- User Achievements
alter table public.user_achievements enable row level security;
create policy "User achievements are viewable by everyone." on public.user_achievements for select using (true);
create policy "Users can insert own achievements." on public.user_achievements for insert with check (auth.uid() = user_id);

-- Daily Challenges
alter table public.daily_challenges enable row level security;
create policy "Daily challenges are viewable by everyone." on public.daily_challenges for select using (true);
create policy "Only admins can manage daily challenges." on public.daily_challenges for all using (public.has_role('admin'));

-- User Daily Challenges
alter table public.user_daily_challenges enable row level security;
create policy "Users can view own daily challenge progress." on public.user_daily_challenges for select using (auth.uid() = user_id);
create policy "Users can update own daily challenge progress." on public.user_daily_challenges for insert with check (auth.uid() = user_id);

-- Learning Paths
alter table public.learning_paths enable row level security;
create policy "Learning paths are viewable by everyone." on public.learning_paths for select using (true);
create policy "Only admins can manage learning paths." on public.learning_paths for all using (public.has_role('admin'));

-- Learning Path Courses
alter table public.learning_path_courses enable row level security;
create policy "Learning path courses are viewable by everyone." on public.learning_path_courses for select using (true);
create policy "Only admins can manage learning path courses." on public.learning_path_courses for all using (public.has_role('admin'));

-- Function to award XP
create or replace function public.award_xp(u_id uuid, xp_amount integer)
returns void as $$
declare
  current_xp integer;
  new_level integer;
begin
  update public.user_stats
  set total_xp = total_xp + xp_amount,
      updated_at = now()
  where user_id = u_id
  returning total_xp into current_xp;

  -- Simple level logic: every 100 XP is a level
  new_level := floor(current_xp / 100) + 1;

  update public.user_stats
  set level = new_level
  where user_id = u_id
  and level < new_level;
end;
$$ language plpgsql security definer;

-- Trigger to award XP on lesson completion
create or replace function public.handle_lesson_completion()
returns trigger as $$
declare
  xp_to_award integer;
begin
  if (new.status = 'completed' and (old.status is null or old.status != 'completed')) then
    select xp_reward into xp_to_award from public.lessons where id = new.lesson_id;
    if xp_to_award is not null then
      perform public.award_xp(new.user_id, xp_to_award);
    end if;
  end if;
  return new;
end;
$$ language plpgsql security definer;

create trigger on_lesson_completed
  after update on public.user_lesson_progress
  for each row execute procedure public.handle_lesson_completion();
