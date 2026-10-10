alter table coffee_slips drop constraint if exists coffee_slips_amount_check;
alter table coffee_slips add constraint coffee_slips_amount_check check (amount >= 0);
