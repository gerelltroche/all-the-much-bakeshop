import { getActiveDrop } from '@/lib/drops'
import OrderForm from '@/components/OrderForm'

export default async function WinterDropPage(): Promise<JSX.Element> {
  const drop = await getActiveDrop('winter-2025')

  if (drop === null) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Drop Not Found</h1>
          <p className="text-gray-600">The Winter 2025 drop could not be found.</p>
        </div>
      </div>
    )
  }

  if (!drop.isActive) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Orders Closed</h1>
          <p className="text-gray-600">
            The {drop.name} ordering period has ended.
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Cutoff date: {drop.cutoffDate.toLocaleDateString()}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-4 py-12">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold mb-2">{drop.name}</h1>
        <p className="text-gray-600">
          Order by {drop.cutoffDate.toLocaleDateString()}
        </p>
      </div>

      <OrderForm
        dropId={drop.id}
        dropName={drop.name}
        orderType="public"
      />
    </div>
  )
}
