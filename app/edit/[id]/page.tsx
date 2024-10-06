import EditPageClient from '@/components/EditPageClient';

// Mark this page as dynamically rendered
export const dynamic = 'force-dynamic';

export default function EditPage({ params }: { params: { id: string } }) {
  return <EditPageClient params={params} />;
}