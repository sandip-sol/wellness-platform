import Link from 'next/link';
import { getLearnPosts } from '@/lib/learn';
import Badge from '@/components/kit/Badge';
import styles from './page.module.css';

export const dynamic = 'force-static';

export const metadata = {
  title: 'Learn — Safe Space',
  description: 'Evidence-based articles on sexual wellness, health, and relationships.',
};

export default async function LearnIndexPage() {
  const posts = await getLearnPosts();

  return (
    <div className={styles.learnPage}>
      <div className={styles.learnHeader}>
        <h1 className={styles.learnTitle}>Learn</h1>
        <p className={styles.learnSubtitle}>
          Evidence-based articles on sexual wellness, health, and relationships.
          Written for clarity, reviewed for accuracy.
        </p>
      </div>

      {posts.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>📚</div>
          <p>No articles published yet. Check back soon!</p>
        </div>
      ) : (
        <div className={`${styles.articleList} stagger-children`}>
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/learn/${post.slug}`}
              className={styles.articleCard}
            >
              <div className={styles.articleCardHeader}>
                <span className={styles.articleTitle}>{post.title}</span>
              </div>
              <div className={styles.articleMeta}>
                <Badge variant="category" label={post.category} />
                <Badge variant="category" label={post.level} />
                {post.verified && <Badge variant="expert-reviewed" />}
                {post.updated_at && (
                  <span className={styles.articleMetaText}>
                    Updated: {post.updated_at}
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
