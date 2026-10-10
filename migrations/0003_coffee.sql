create table if not exists coffee_slips (
  image_hash text primary key,
  donor_name text not null,
  amount integer not null check (amount > 0),
  created_at timestamptz not null default now()
);
