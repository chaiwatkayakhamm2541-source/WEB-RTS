alter table coffee_slips
  alter column amount type numeric(12, 2)
  using amount::numeric(12, 2);
