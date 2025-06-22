import { createClient } from '@/utils/supabase/server'

export default async function Instruments() {
  const supabase = await createClient()
  const { data: instruments } = await supabase.from("instruments").select()

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Instruments</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <pre className="whitespace-pre-wrap text-sm">
          {JSON.stringify(instruments, null, 2)}
        </pre>
      </div>
    </div>
  )
} 