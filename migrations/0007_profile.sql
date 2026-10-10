create table if not exists user_profiles (
  user_id text primary key references "user" ("id") on delete cascade,
  image text not null,
  updated_at timestamptz not null default now()
);
