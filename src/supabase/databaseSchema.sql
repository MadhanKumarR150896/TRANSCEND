create table members (
  id uuid default gen_random_uuid() primary key not null,
  name text not null,
  email text not null unique,
  created_at timestamptz default now() not null  
);

create table projects (
  id uuid default gen_random_uuid() primary key not null,
  name text not null unique,
  privacy public.project_privacy default 'Public'::project_privacy not null,
  created_at timestamptz default now() not null 
);

create table project_members (
  id uuid default gen_random_uuid() primary key not null ,
  project_id uuid not null references projects (id) on delete cascade,
  member_id uuid not null references members (id),
  created_at timestamptz default now() not null,

  unique (project_id,member_id)
)

create table lists (
  id uuid default gen_random_uuid() primary key not null,
  name text not null,
  project_id uuid not null references projects (id) on delete cascade,
  created_at timestamptz default now() not null,

  unique(project_id,name)
)

create table tasks (
  id uuid default gen_random_uuid() primary key not null,
  name text not null,
  description text,
  list_id uuid not null references lists (id) on delete cascade,
  assigned_to uuid references members (id),
  created_at timestamptz default now() not null,
  
  unique(list_id,name)
)
