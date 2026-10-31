-- Allow anonymous visitors to submit validated comments only.
-- This does not grant anonymous update or delete access.
begin;

grant insert on table public.comments to anon;

do $comments_sequence$
declare
  id_sequence text;
begin
  id_sequence := pg_get_serial_sequence('public.comments', 'id');
  if id_sequence is not null then
    execute format('grant usage on sequence %s to anon', id_sequence::regclass);
  end if;
end
$comments_sequence$;

do $comments_policy$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'comments'
      and policyname = 'comments_anon_insert_validated_v2'
  ) then
    create policy comments_anon_insert_validated_v2
      on public.comments
      for insert
      to anon
      with check (
        username is not null
        and char_length(btrim(username)) between 1 and 50
        and pinned = false
        and message is not null
        and char_length(btrim(message)) between 1 and 500
      );
  end if;
end
$comments_policy$;

commit;
