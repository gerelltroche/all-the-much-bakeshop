export function ErrorMessage({ error }: { error?: string | { message?: string } }) {
  if (!error) return null
  const message = typeof error === 'string' ? error : error.message
  if (!message) return null
  return <p className="text-sm text-red-600 mt-1">{message}</p>
}
