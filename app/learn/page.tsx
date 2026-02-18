import { getLearnPosts } from '@/lib/learn';
import LearnClient from './LearnClient';

export const dynamic = 'force-static';

export const metadata = {
  title: 'Learn — Safe Space',
  description: 'Evidence-based articles on sexual wellness, health, and relationships.',
};

export default async function LearnIndexPage() {
  const posts = await getLearnPosts();

  return <LearnClient posts={posts} />;
}
