import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { getLearnPostBySlug, getLearnPosts } from '@/lib/learn';
import { TextToSpeechButton } from '@/components/tts/TextToSpeechButton';
import Badge from '@/components/kit/Badge';
import styles from './page.module.css';

export const dynamic = 'force-static';

export async function generateStaticParams() {
  const posts = await getLearnPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export default async function LearnPostPage({ params }: { params: { slug: string } }) {
  const post = await getLearnPostBySlug(params.slug);
  if (!post) return notFound();

  return (
    <div className={styles.articlePage}>
      <Link href="/learn" className={styles.backLink}>
        ← Back to Learn
      </Link>

      <div className={styles.articleHeader}>
        <h1 className={styles.articleTitle}>{post.title}</h1>
        <div className={styles.articleMeta}>
          <Badge variant="category" label={post.category} />
          <Badge variant="category" label={post.level} />
          {post.verified && <Badge variant="expert-reviewed" />}
          {post.updated_at && (
            <span className={styles.articleMetaText}>Updated: {post.updated_at}</span>
          )}
        </div>
      </div>

      <div className={styles.articleToolbar}>
        <TextToSpeechButton text={post.content} />
      </div>

      <article className={styles.articleContent}>
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
      </article>

      {post.sources?.length ? (
        <section className={styles.sourcesSection}>
          <h2 className={styles.sourcesTitle}>Sources</h2>
          <ul className={styles.sourcesList}>
            {post.sources.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
