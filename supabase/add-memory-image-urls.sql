-- Run this in the Supabase SQL editor to support multiple photos per memory.
alter table public.memories
  add column if not exists image_urls text[] default '{}';

update public.memories
set image_urls = array[image_url]
where image_url is not null
  and (image_urls is null or cardinality(image_urls) = 0);
