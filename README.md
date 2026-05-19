# Personal Portfolio

A responsive personal portfolio built with React, Vite, Tailwind CSS, and Supabase. It includes a home page, project showcase, blog system, project inquiry form, and an authenticated admin panel for managing blogs, project requests, and profile links.

## Features

- Profile section with editable image and resume link
- About, skills, experience, education, and projects sections
- Supabase-powered blog listing and blog detail pages
- Admin blog editor with rich text support
- Project inquiry form saved to Supabase
- Admin view for project requests
- Responsive layout with separate desktop scroll columns

## Tech Stack

- React 18
- Vite 7
- Tailwind CSS 3
- React Router
- Supabase
- Tiptap editor
- React Icons

## Getting Started

Install dependencies:

```bash
npm install
```

Create a local environment file:

```bash
cp .env.example .env
```

Add your Supabase values to `.env`:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Run the development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Supabase Setup

The app expects Supabase tables for blogs, project requests, and profile settings. The admin page uses Supabase Auth, so create at least one authenticated user in Supabase for `/admin`.

### Profile Settings

Run this SQL in Supabase SQL Editor to enable editing the profile image URL and resume URL from the admin panel:

```sql
create table if not exists profile_settings (
  id integer primary key default 1,
  image_url text,
  resume_url text,
  updated_at timestamptz default now(),
  constraint profile_settings_single_row check (id = 1)
);

alter table profile_settings enable row level security;

create policy "Anyone can read profile settings"
on profile_settings for select
using (true);

create policy "Authenticated users can update profile settings"
on profile_settings for all
to authenticated
using (true)
with check (true);
```

After this table exists, go to `/admin`, log in, and update the profile image URL and resume URL from the **Resume and Image** section.

### Admin Access

1. Open Supabase Dashboard.
2. Go to **Authentication**.
3. Create a user with email and password.
4. Use that email/password on the app's `/admin` route.

## Project Structure

```text
src/
  components/          Reusable UI and portfolio sections
  components/admin/    Admin panel features
  components/blog/     Blog cards and blog UI
  hooks/               Supabase-powered data hooks
  lib/                 Shared helpers and Supabase client
  pages/               Route pages
```

## Notes

- The profile image and resume link use local fallback values if Supabase is not configured or the `profile_settings` row is empty.
- Blog thumbnails are uploaded to the `blog-thumbs` Supabase Storage bucket.
- Keep `.env` out of git. Use `.env.example` for public environment variable names only.
