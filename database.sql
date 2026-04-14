-- SQL Schema for Supabase (Professional Portfolio & Blog)

-- 1. Projects Table
-- Stores portfolio items with titles, descriptions, images, and tags.
CREATE TABLE IF NOT EXISTS projects (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image TEXT NOT NULL,
  tags TEXT[] NOT NULL DEFAULT '{}',
  link TEXT NOT NULL DEFAULT '#',
  order_index INT DEFAULT 0, -- To control the display order
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Blog Posts Table
-- Stores blog entries. Content is expected to be in Markdown format.
CREATE TABLE IF NOT EXISTS posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL, -- Markdown content
  date TEXT NOT NULL, -- Display date format (e.g., "Oct 24, 2023")
  read_time TEXT NOT NULL, -- Read time estimate (e.g., "5 min read")
  category TEXT NOT NULL,
  image TEXT, -- Optional featured image URL
  slug TEXT UNIQUE, -- Optional SEO friendly URL
  is_published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Email Subscribers Table
-- Stores newsletter signups from the blog page.
CREATE TABLE IF NOT EXISTS subscribers (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS portfolio_sections (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  category TEXT NOT NULL, -- 'About Me', 'Experience', 'Projects', etc.
  title TEXT NOT NULL,
  content TEXT NOT NULL, -- Markdown content
  order_index INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Enable Row Level Security (RLS)
-- This ensures that only authorized access is allowed.
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_sections ENABLE ROW LEVEL SECURITY;

-- 5. Security Policies
-- Public Read Access: Allows anyone to view projects and published posts.
CREATE POLICY "Allow public read access for projects" ON projects FOR SELECT USING (true);
CREATE POLICY "Allow public read access for published posts" ON posts FOR SELECT USING (is_published = true);
CREATE POLICY "Allow public read access for portfolio_sections" ON portfolio_sections FOR SELECT USING (true);

-- Public Insert Access: Allows anyone to subscribe to the newsletter.
CREATE POLICY "Allow public insert for subscribers" ON subscribers FOR INSERT WITH CHECK (true);

-- 6. Indexes for Performance
CREATE INDEX IF NOT EXISTS idx_projects_order ON projects(order_index);
CREATE INDEX IF NOT EXISTS idx_posts_date ON posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_subscribers_email ON subscribers(email);

-- Sample Data (Optional: Uncomment to seed your database)
/*
INSERT INTO projects (title, description, image, tags, link) VALUES 
('Community Portal', 'A platform for local community engagement.', 'https://picsum.photos/seed/community/800/600', ARRAY['React', 'Supabase'], '#'),
('Tech Solutions Hub', 'Enterprise-grade solution for tech management.', 'https://picsum.photos/seed/tech/800/600', ARRAY['TypeScript', 'Tailwind'], '#');

INSERT INTO posts (title, excerpt, content, date, read_time, category) VALUES 
('The Future of Tech', 'Exploring how technology drives community growth.', '## Introduction\n\nTechnology is evolving faster than ever...', 'Apr 14, 2024', '4 min read', 'Technology');
*/
