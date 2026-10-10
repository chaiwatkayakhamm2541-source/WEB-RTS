create table if not exists s2_registrations (
  uid text primary key,
  character_name text not null,
  discord_name text not null,
  alliance text not null,
  server_name text not null,
  updated_at timestamptz not null default now()
);
