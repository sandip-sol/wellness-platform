import fs from 'node:fs/promises';
import path from 'node:path';
import matter from 'gray-matter';

export type LearnPost = {
  slug: string;
  title: string;
  category: string;
  level: string;
  verified: boolean;
  reviewed_by: string;
  updated_at: string;
  sources: string[];
  content: string;
};

function normalizeSources(sources: unknown): string[] {
  if (!sources) return [];
  if (Array.isArray(sources)) {
    return sources.map((s) => String(s).trim()).filter(Boolean);
  }
  if (typeof sources === 'string') {
    return sources
      .split(/\n|,/)
      .map((s) => s.trim())
      .filter(Boolean);
  }
  return [];
}

function parseJsonToPost(obj: unknown): LearnPost | null {
  try {
    const o: any = obj;
    const slug = String(o?.slug || '').trim();
    const title = String(o?.title || '').trim();
    if (!slug || !title) return null;
    return {
      slug,
      title,
      category: String(o?.category || 'General'),
      level: String(o?.level || 'Beginner'),
      verified: Boolean(o?.verified),
      reviewed_by: String(o?.reviewed_by || ''),
      updated_at: String(o?.updated_at || ''),
      sources: normalizeSources(o?.sources),
      content: String(o?.content || '').trim(),
    };
  } catch {
    return null;
  }
}

function parseMarkdownToPost(rawMarkdown: string): LearnPost | null {
  try {
    const fm = matter(rawMarkdown);
    const data: any = fm.data || {};
    const slug = String(data?.slug || '').trim();
    if (!slug) return null;
    return {
      slug,
      title: String(data?.title || slug),
      category: String(data?.category || 'General'),
      level: String(data?.level || 'Beginner'),
      verified: Boolean(data?.verified),
      reviewed_by: String(data?.reviewed_by || ''),
      updated_at: String(data?.updated_at || ''),
      sources: normalizeSources(data?.sources),
      content: String(fm.content || '').trim(),
    };
  } catch {
    return null;
  }
}

async function readDirSafe(dir: string): Promise<string[]> {
  try {
    return await fs.readdir(dir);
  } catch {
    return [];
  }
}

export async function getLearnPosts(): Promise<LearnPost[]> {
  const baseDir = path.join(process.cwd(), 'content', 'learn');
  const files = await readDirSafe(baseDir);

  const map = new Map<string, LearnPost>();

  // Prefer JSON over Markdown on slug collision.
  const mdFiles = files.filter((f) => f.endsWith('.md'));
  const jsonFiles = files.filter((f) => f.endsWith('.json'));

  for (const file of mdFiles) {
    const full = path.join(baseDir, file);
    try {
      const raw = await fs.readFile(full, 'utf8');
      const post = parseMarkdownToPost(raw);
      if (post) map.set(post.slug, post);
    } catch {
      // ignore
    }
  }

  for (const file of jsonFiles) {
    const full = path.join(baseDir, file);
    try {
      const raw = await fs.readFile(full, 'utf8');
      const obj = JSON.parse(raw);
      const post = parseJsonToPost(obj);
      if (post) map.set(post.slug, post);
    } catch {
      // ignore
    }
  }

  return Array.from(map.values()).sort((a, b) => (b.updated_at || '').localeCompare(a.updated_at || ''));
}

export async function getLearnPostBySlug(slug: string): Promise<LearnPost | null> {
  const posts = await getLearnPosts();
  return posts.find((p) => p.slug === slug) ?? null;
}
