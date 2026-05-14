import { PaymentView } from '../../../../../components/orders/PaymentView'

type PageProps = {
  params: Promise<{ id: string }>
}

export default async function PaymentPage({ params }: PageProps) {
  const { id } = await params
  return <PaymentView orderId={id} />
}
