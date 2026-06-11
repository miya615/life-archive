-- ============================================================
-- Life Archive — Supabase セットアップSQL
-- Supabase Dashboard > SQL Editor に貼り付けて実行してください
-- ============================================================

-- --------------------------------------------------------
-- 1. profiles テーブル
-- --------------------------------------------------------
create table if not exists public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  avatar_url  text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- RLS有効化
alter table public.profiles enable row level security;

create policy "ユーザーは自分のプロフィールのみ参照可能"
  on public.profiles for select
  using (auth.uid() = id);

create policy "ユーザーは自分のプロフィールのみ更新可能"
  on public.profiles for update
  using (auth.uid() = id);

create policy "ユーザーは自分のプロフィールを作成可能"
  on public.profiles for insert
  with check (auth.uid() = id);

-- --------------------------------------------------------
-- 2. entries テーブル
-- --------------------------------------------------------
create table if not exists public.entries (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  title       text not null,
  content     text,
  category    text not null check (category in (
    '日常', '健康', '仕事', '学習', 'お金', '人間関係', 'アイデア', '思い出'
  )),
  entry_date  date not null default current_date,
  image_url   text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- インデックス
create index if not exists entries_user_id_idx on public.entries(user_id);
create index if not exists entries_entry_date_idx on public.entries(entry_date desc);
create index if not exists entries_category_idx on public.entries(category);

-- RLS有効化
alter table public.entries enable row level security;

create policy "ユーザーは自分の記録のみ参照可能"
  on public.entries for select
  using (auth.uid() = user_id);

create policy "ユーザーは自分の記録のみ作成可能"
  on public.entries for insert
  with check (auth.uid() = user_id);

create policy "ユーザーは自分の記録のみ更新可能"
  on public.entries for update
  using (auth.uid() = user_id);

create policy "ユーザーは自分の記録のみ削除可能"
  on public.entries for delete
  using (auth.uid() = user_id);

-- --------------------------------------------------------
-- 3. updated_at 自動更新トリガー
-- --------------------------------------------------------
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger handle_entries_updated_at
  before update on public.entries
  for each row execute procedure public.handle_updated_at();

create trigger handle_profiles_updated_at
  before update on public.profiles
  for each row execute procedure public.handle_updated_at();

-- --------------------------------------------------------
-- 4. 新規ユーザー登録時にprofileを自動作成
-- --------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, display_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1))
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- --------------------------------------------------------
-- 5. Storageバケット（entry-images）
-- --------------------------------------------------------
-- Supabase Dashboard > Storage > New bucket で以下を作成:
--   Bucket name: entry-images
--   Public bucket: ON (公開バケット)
--
-- または SQL で実行:
insert into storage.buckets (id, name, public)
values ('entry-images', 'entry-images', true)
on conflict (id) do nothing;

-- Storage RLSポリシー
create policy "認証済みユーザーは画像をアップロード可能"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'entry-images' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "誰でも画像を閲覧可能"
  on storage.objects for select
  using (bucket_id = 'entry-images');

create policy "所有者のみ画像を削除可能"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'entry-images' and (storage.foldername(name))[1] = auth.uid()::text);
