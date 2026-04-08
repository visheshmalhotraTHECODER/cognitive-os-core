// Server Component - fetches real data from SQLite before rendering
import { getTacitKnowledgeGraph } from '@/app/actions';
import { DashboardClient } from './DashboardClient';

export default async function DashboardPage() {
  const { data } = await getTacitKnowledgeGraph();
  return <DashboardClient dbNodes={data} />;
}
