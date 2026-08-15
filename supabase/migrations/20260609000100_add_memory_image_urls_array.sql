-- Ported from supabase/add-memory-image-urls.sql.
-- Adds multi-photo support to memories, backfilling from the original single image_url.

alter table public.memories
  add column if not exists image_urls text[] default '{}';

update public.memories
set image_urls = array[image_url]
where image_url is not null
  and (image_urls is null or cardinality(image_urls) = 0);
