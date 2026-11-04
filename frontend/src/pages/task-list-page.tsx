import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router'
import { AlertCircleIcon } from 'lucide-react'
import { useAuth } from '@/auth/use-auth'
import { useAuthForm } from '@/auth/use-auth-form'
import { FieldError } from '@/components/field-error'
import { TaskDialog } from '@/components/task-dialog'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import * as api from '@/lib/api'
import { ApiError } from '@/lib/api'
import type { Task, TaskStatus, UpdateTaskPayload } from '@/lib/types'

const FIELDS = ['title'] as const

const STATUSES: { value: TaskStatus; label: string }[] = [
  { value: 'pending', label: 'Pendiente' },
  { value: 'in_progress', label: 'En curso' },
  { value: 'done', label: 'Hecho' },
]

type Assignee = Task['assignee']

const assigneeName = (assignee: Assignee) => assignee.fullName ?? 'Sin nombre'

const errorMessage = (error: unknown) =>
  error instanceof ApiError
    ? error.message
    : 'Algo ha ido mal. Inténtalo de nuevo.'

const replaceTask = (tasks: Task[] | null, task: Task) =>
  tasks?.map((current) => (current.id === task.id ? task : current)) ?? null

type TaskRowProps = {
  task: Task
  assignees: Assignee[]
  isPending: boolean
  onOpen: (task: Task) => void
  onStatusChange: (task: Task, status: TaskStatus) => void
  onAssigneeChange: (task: Task, assignee: Assignee) => void
}

function TaskRow({
  task,
  assignees,
  isPending,
  onOpen,
  onStatusChange,
  onAssigneeChange,
}: TaskRowProps) {
  const handleAssigneeChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const assignee = assignees.find(
      ({ id }) => id === Number(event.target.value),
    )
    if (assignee) onAssigneeChange(task, assignee)
  }

  return (
    <li className="grid gap-3 py-4">
      <button
        type="button"
        className="focus-visible:ring-ring/50 rounded-sm text-left font-medium wrap-anywhere outline-none hover:underline focus-visible:ring-[3px]"
        onClick={() => onOpen(task)}
      >
        {task.title}
      </button>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <select
          aria-label={`Responsable de ${task.title}`}
          className="border-input focus-visible:border-ring focus-visible:ring-ring/50 dark:bg-input/30 h-9 max-w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-sm shadow-xs outline-none focus-visible:ring-[3px] disabled:opacity-50"
          value={task.assignee.id}
          disabled={isPending}
          onChange={handleAssigneeChange}
        >
          {assignees.map((assignee) => (
            <option key={assignee.id} value={assignee.id}>
              {assigneeName(assignee)}
            </option>
          ))}
        </select>

        <div
          role="group"
          aria-label={`Estado de ${task.title}`}
          className="flex flex-wrap gap-2"
        >
          {STATUSES.map(({ value, label }) => (
            <Button
              key={value}
              type="button"
              size="sm"
              variant={task.status === value ? 'default' : 'outline'}
              aria-pressed={task.status === value}
              disabled={isPending}
              onClick={() => {
                if (task.status !== value) onStatusChange(task, value)
              }}
            >
              {label}
            </Button>
          ))}
        </div>
      </div>
    </li>
  )
}

export function TaskListPage() {
  const { token } = useAuth()
  const { isSubmitting, formError, fieldErrors, submit } = useAuthForm(FIELDS)
  const [title, setTitle] = useState('')
  // `null` hasta la primera carga buena: una lista que no se ha podido obtener
  // no debe confundirse con una lista vacía.
  const [tasks, setTasks] = useState<Task[] | null>(null)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [updateError, setUpdateError] = useState<string | null>(null)
  const [pendingIds, setPendingIds] = useState<ReadonlySet<number>>(new Set())
  const [openTask, setOpenTask] = useState<Task | null>(null)
  const updatesSeen = useRef(0)

  const loadTasks = useCallback(async () => {
    if (!token) return

    try {
      // Una lista leída antes de que termine un cambio de fila pisaría ese
      // cambio al llegar, así que en ese caso se vuelve a pedir.
      let seen: number
      let nextTasks: Task[]
      do {
        seen = updatesSeen.current
        nextTasks = await api.listTasks(token)
      } while (seen !== updatesSeen.current)

      setTasks(nextTasks)
      setLoadError(null)
    } catch (error) {
      setLoadError(errorMessage(error))
    }
  }, [token])

  useEffect(() => {
    void loadTasks()
  }, [loadTasks])

  // Sin endpoint de equipo, los únicos destinos posibles son los responsables
  // ya presentes, en orden de primera aparición.
  const assignees = useMemo(() => {
    const byId = new Map<number, Assignee>()
    for (const task of tasks ?? []) {
      if (!byId.has(task.assignee.id)) {
        byId.set(task.assignee.id, task.assignee)
      }
    }
    return [...byId.values()]
  }, [tasks])

  const updateTask = async (
    previous: Task,
    optimistic: Task,
    payload: UpdateTaskPayload,
  ) => {
    if (!token) return

    setUpdateError(null)
    setPendingIds((ids) => new Set(ids).add(previous.id))
    setTasks((current) => replaceTask(current, optimistic))

    try {
      const saved = await api.updateTask(token, previous.id, payload)
      setTasks((current) => replaceTask(current, saved))
    } catch (error) {
      setTasks((current) => replaceTask(current, previous))
      setUpdateError(errorMessage(error))
    } finally {
      updatesSeen.current += 1
      setPendingIds((ids) => {
        const next = new Set(ids)
        next.delete(previous.id)
        return next
      })
    }
  }

  const handleStatusChange = (task: Task, status: TaskStatus) =>
    void updateTask(task, { ...task, status }, { status })

  const handleAssigneeChange = (task: Task, assignee: Assignee) =>
    void updateTask(task, { ...task, assignee }, { assigneeId: assignee.id })

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    if (!token) return

    setUpdateError(null)
    return submit(async () => {
      await api.createTask(token, { title })
      setTitle('')
      // La lista se vuelve a pedir para no decidir aquí dónde colocar la tarea
      // nueva: eso sería inventar un orden.
      await loadTasks()
    })
  }

  const listError = loadError ?? updateError

  return (
    <div className="bg-muted/40 flex min-h-svh justify-center p-6">
      <Card className="h-fit w-full max-w-3xl">
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div>
              <CardTitle>Tareas del equipo</CardTitle>
              <CardDescription>
                La lista compartida de quién está en qué.
              </CardDescription>
            </div>
            <Link
              to="/profile"
              className="text-foreground shrink-0 text-sm font-medium underline"
            >
              Mi perfil
            </Link>
          </div>
        </CardHeader>

        <CardContent className="grid gap-4">
          <form onSubmit={handleSubmit} className="grid gap-2" noValidate>
            {formError && (
              <Alert variant="destructive">
                <AlertCircleIcon />
                <AlertDescription>{formError}</AlertDescription>
              </Alert>
            )}

            <Label htmlFor="title">Título de la tarea</Label>
            <div className="flex gap-2">
              <Input
                id="title"
                name="title"
                autoComplete="off"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                aria-invalid={Boolean(fieldErrors.title)}
                aria-describedby={fieldErrors.title ? 'title-error' : undefined}
              />
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Creando…' : 'Crear tarea'}
              </Button>
            </div>
            <FieldError id="title-error" message={fieldErrors.title} />
          </form>

          {listError && (
            <Alert variant="destructive">
              <AlertCircleIcon />
              <AlertDescription>{listError}</AlertDescription>
            </Alert>
          )}

          {tasks === null && !loadError && (
            <p className="text-muted-foreground text-sm">Cargando tareas…</p>
          )}

          {tasks?.length === 0 && (
            <p className="text-muted-foreground text-sm">
              Aquí verá todo el equipo qué hay por hacer y quién lleva cada
              cosa. Todavía no hay ninguna tarea: escribe un título arriba para
              crear la primera.
            </p>
          )}

          {tasks && tasks.length > 0 && (
            <ul className="divide-y">
              {tasks.map((task) => (
                <TaskRow
                  key={task.id}
                  task={task}
                  assignees={assignees}
                  isPending={pendingIds.has(task.id)}
                  onOpen={setOpenTask}
                  onStatusChange={handleStatusChange}
                  onAssigneeChange={handleAssigneeChange}
                />
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      {openTask && (
        <TaskDialog
          key={openTask.id}
          taskId={openTask.id}
          title={openTask.title}
          onClose={() => setOpenTask(null)}
        />
      )}
    </div>
  )
}
