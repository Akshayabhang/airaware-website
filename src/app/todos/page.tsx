import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'

export default async function Page() {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  const { data: todos } = await supabase.from('todos').select()

  return (
    <div className="p-8 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-neutral-800 dark:text-white">Supabase Todos Test</h1>
      <ul className="space-y-2">
        {todos && todos.length > 0 ? (
          todos.map((todo: any) => (
            <li key={todo.id} className="p-3 bg-neutral-100 dark:bg-neutral-800 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300">
              {todo.name}
            </li>
          ))
        ) : (
          <p className="text-neutral-500">No todos found or tables not set up yet.</p>
        )}
      </ul>
    </div>
  )
}
