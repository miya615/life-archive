# Life Archive ✦

人生を記録し、あとから振り返れる「なんでも記録アプリ」。

**Tech Stack**: Next.js 16 (App Router) + TypeScript + Tailwind CSS v4 + Supabase

---

## 起動手順（初心者向け）

### 1. リポジトリをクローン

```bash
git clone <your-repo-url>
cd life-archive
npm install
```

### 2. Supabaseプロジェクトを作成

1. [supabase.com](https://supabase.com) にアクセスしてアカウント作成
2. 「New project」でプロジェクトを作成
3. 左メニュー「SQL Editor」を開く
4. `supabase-setup.sql` の内容をコピーして貼り付け、「Run」を実行
5. 左メニュー「Settings > API」を開き、以下をコピー:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 3. 環境変数を設定

```bash
cp .env.local.example .env.local
```

`.env.local` を開いて値を入力:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 4. 開発サーバーを起動

```bash
npm run dev
```

[http://localhost:3000](http://localhost:3000) を開く。

---

## Vercelデプロイ手順

1. [vercel.com](https://vercel.com) でアカウント作成
2. 「New Project」→ GitHubリポジトリを選択
3. 「Environment Variables」に `.env.local` と同じ値を入力
4. 「Deploy」をクリック

---

## Supabase Auth設定

1. Supabase Dashboard > Authentication > URL Configuration
2. **Site URL**: `https://your-app.vercel.app`（または `http://localhost:3000`）
3. **Redirect URLs** に同じURLを追加

---

## ディレクトリ構成

```
app/
  auth/          # ログイン・新規登録
  page.tsx       # ホーム
  entries/
    page.tsx     # 記録一覧
    new/         # 新規作成
    [id]/        # 詳細・編集
  timeline/      # 人生年表
  profile/       # マイページ

components/
  layout/        # AppShell, BottomNav
  entries/       # 各ページのUIコンポーネント

lib/
  supabase/      # Supabaseクライアント（client/server/middleware）
  types.ts       # TypeScript型定義
```

---

## 将来のAI機能追加について

`entries`テーブルの`content`フィールドをOpenAI Embeddings APIに渡すだけで
セマンティック検索が実装できる設計にしています。

```typescript
// 将来の実装例
const embedding = await openai.embeddings.create({
  model: "text-embedding-3-small",
  input: entry.content,
});
```

---

## 機能一覧（Ver1）

- ✅ メール認証（Supabase Auth）
- ✅ 記録の作成・編集・削除
- ✅ カテゴリ分類（8種類）
- ✅ 写真アップロード（Supabase Storage）
- ✅ キーワード検索・カテゴリフィルター
- ✅ 人生年表（年・月ごとタイムライン）
- ✅ マイページ（統計・プロフィール編集）
- ✅ スマホファースト・Glassmorphism UI
