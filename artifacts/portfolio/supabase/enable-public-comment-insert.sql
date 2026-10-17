-- Allow anonymous visitors to submit validated comments only.
-- This does not grant anonymous update or delete access.
begin;

grant insert on table public.comments to anon;

do $comments_policy$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'comments'
      and policyname = 'comments_anon_insert_validated'
  ) then
    create policy comments_anon_insert_validated
      on public.comments
      for insert
      to anon
      with check (
        username is not null
        and char_length(btrim(username)) between 1 and 50
        and message is not null
        and char_length(btrim(message)) between 1 and 500
      );
  end if;
end
$comments_policy$;

commit;
