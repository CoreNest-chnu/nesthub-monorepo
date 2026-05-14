import { ConfirmationView } from '../../../../../components/orders/ConfirmationView'

type PageProps = {
  params: Promise<{ id: string }>
}

export default async function ConfirmationPage({ params }: PageProps) {
  const { id } = await params
  return <ConfirmationView orderId={id} />
}
