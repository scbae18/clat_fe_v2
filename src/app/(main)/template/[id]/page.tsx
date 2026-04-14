import { redirect } from 'next/navigation'

export default async function TemplateDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  redirect(`/template/${id}/edit`)
}
