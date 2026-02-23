-- BUG CHALLENGES
create table public.bug_challenges (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  broken_code text not null,
  solution_code text not null,
  language text not null,
  difficulty text check (difficulty in ('Easy', 'Medium', 'Hard')),
  xp_reward integer default 30,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- USER MISTAKES (For Mistake Workouts)
create table public.user_mistakes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade not null,
  bug_challenge_id uuid references public.bug_challenges on delete cascade,
  lesson_id uuid references public.lessons on delete cascade,
  wrong_code text,
  attempted_at timestamp with time zone default timezone('utc'::text, now()) not null,
  resolved boolean default false
);

-- RLS POLICIES
alter table public.bug_challenges enable row level security;
create policy "Bug challenges are viewable by everyone." on public.bug_challenges for select using (true);

alter table public.user_mistakes enable row level security;
create policy "Users can view own mistakes." on public.user_mistakes for select using (auth.uid() = user_id);
create policy "Users can insert own mistakes." on public.user_mistakes for insert with check (auth.uid() = user_id);
create policy "Users can update own mistakes." on public.user_mistakes for update using (auth.uid() = user_id);

-- SEED SOME BUG CHALLENGES
insert into public.bug_challenges (title, description, broken_code, solution_code, language, difficulty, xp_reward)
values
('Syntax Slip', 'Fix the syntax error in this Jaclang walker.', 'walker greet { can visit { print("Hello" } }', 'walker greet { can visit { print("Hello"); } }', 'jaclang', 'Easy', 30),
('Python Print', 'Fix the missing parenthesis in Python.', 'print "Hello World"', 'print("Hello World")', 'python', 'Easy', 20),
('JS Loop', 'Fix the infinite loop condition.', 'for (let i = 0; i >= 0; i++) { if (i > 10) break; }', 'for (let i = 0; i < 10; i++) { }', 'javascript', 'Medium', 40);
