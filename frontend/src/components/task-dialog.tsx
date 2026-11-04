import { useEffect, useRef, useState } from 'react'
import { AlertCircleIcon, TriangleAlertIcon, XIcon } from 'lucide-react'
import { useAuth } from '@/auth/use-auth'
import { FieldError } from '@/components/field-error'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import * as api from '@/lib/api'
import { ApiError } from '@/lib/api'
import type { Task } from '@/lib/types'

const INVALID_DATE = 'Esa fecha no existe o está incompleta.'
const SAVE_DELAY_MS = 500

const errorMessage = (error: unknown) =>
  error instanceof ApiError
    ? error.message
    : 'Algo ha ido mal. Inténtalo de nuevo.'

/**
 * Una fecha a medias también da `value === ''`, igual que un campo vacío, y sin
 * distinguirlas borraría la fecha guardada. Al teclear el año, además, el campo
 * pasa por `0002-…`, que la API rechaza: tampoco es una fecha terminada.
 */
const isUnfinished = (input: HTMLInputElement) =>
  input.validity.badInput || (input.value !== '' && input.value < '1000')

type TaskDialogProps = {
  taskId: number
  title: string
  onClose: () => void
}

export function TaskDialog({ taskId, title, onClose }: TaskDialogProps) {
  const { token } = useAuth()
  const [task, setTask] = useState<Task | null>(null)
  const [draft, setDraft] = useState('')
  const [loadError, setLoadError] = useState<string | null>(null)
  const [dateError, setDateError] = useState<string | null>(null)
  const [saveError, setSaveError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const saveTimer = useRef<number | undefined>(undefined)
  // Lo último que confirmó el servidor y lo último que se le ha pedido.
  const savedValue = useRef('')
  const requestedValue = useRef('')
  // Los guardados se encadenan para que una respuesta tardía no pise uno posterior.
  const lastSave = useRef<Promise<boolean> | null>(null)
  const isClosing = useRef(false)

  useEffect(() => {
    if (!token) return

    let cancelled = false

    api
      .getTask(token, taskId)
      .then((loaded) => {
        if (cancelled) return
        const value = loaded.dueDate ?? ''
        savedValue.current = value
        requestedValue.current = value
        setTask(loaded)
        setDraft(value)
      })
      .catch((error: unknown) => {
        if (!cancelled) setLoadError(errorMessage(error))
      })

    return () => {
      cancelled = true
      window.clearTimeout(saveTimer.current)
    }
  }, [token, taskId])

  const save = (value: string) => {
    if (!token) return Promise.resolve(false)

    requestedValue.current = value

    const run = async () => {
      try {
        const saved = await api.updateTask(token, taskId, {
          dueDate: value || null,
        })
        savedValue.current = saved.dueDate ?? ''
        setTask(saved)
        setDateError(null)
        setSaveError(null)
        return true
      } catch (error) {
        const fieldError =
          error instanceof ApiError ? error.fieldErrors.dueDate : undefined
        setDateError(fieldError ?? null)
        setSaveError(fieldError ? null : errorMessage(error))
        // Si no se ha pedido nada después, el campo vuelve a lo que de verdad
        // está guardado. Así, además, se puede cerrar sin reintentar sin fin.
        if (requestedValue.current === value) {
          requestedValue.current = savedValue.current
          setDraft(savedValue.current)
        }
        return false
      }
    }

    const current = (lastSave.current ?? Promise.resolve(true)).then(run)
    lastSave.current = current
    void current.finally(() => {
      if (lastSave.current === current) lastSave.current = null
    })

    return current
  }

  /** Guarda lo pendiente sin esperar y resuelve si ha ido bien. */
  const flush = () => {
    window.clearTimeout(saveTimer.current)

    const input = inputRef.current
    if (input) {
      if (isUnfinished(input)) {
        setDateError(INVALID_DATE)
      } else if (input.value !== requestedValue.current) {
        return save(input.value)
      }
    }

    return lastSave.current ?? Promise.resolve(true)
  }

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const input = event.target
    setDraft(input.value)
    // Cancela también lo pendiente: una fecha que se está corrigiendo no debe
    // llegar a guardarse.
    window.clearTimeout(saveTimer.current)

    if (input.validity.badInput) {
      setDateError(INVALID_DATE)
      return
    }

    setDateError(null)
    if (!isUnfinished(input)) {
      saveTimer.current = window.setTimeout(() => void flush(), SAVE_DELAY_MS)
    }
  }

  const handleRemove = () => {
    window.clearTimeout(saveTimer.current)
    // Hay que limpiar el campo a mano: con una fecha a medias, su valor ya es
    // '' y React no lo tocaría, de modo que los trozos escritos seguirían ahí.
    if (inputRef.current) inputRef.current.value = ''
    setDraft('')
    setDateError(null)
    void save('')
  }

  const handleOpenChange = async (open: boolean) => {
    if (open || isClosing.current) return

    isClosing.current = true
    const saved = await flush()
    isClosing.current = false

    if (saved) onClose()
  }

  return (
    <Dialog open onOpenChange={(open) => void handleOpenChange(open)}>
      <DialogContent aria-describedby={undefined} showCloseButton={false}>
        <DialogHeader>
          <DialogTitle className="pr-6 wrap-anywhere">{title}</DialogTitle>
        </DialogHeader>

        {/* El botón que trae el componente generado se anuncia en inglés. */}
        <DialogClose asChild>
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="Cerrar"
            className="absolute top-3 right-3"
          >
            <XIcon />
          </Button>
        </DialogClose>

        {loadError && (
          <Alert variant="destructive">
            <AlertCircleIcon />
            <AlertDescription>{loadError}</AlertDescription>
          </Alert>
        )}

        {!task && !loadError && (
          <p className="text-muted-foreground text-sm">Cargando tarea…</p>
        )}

        {task && (
          <div className="grid gap-4">
            {saveError && (
              <Alert variant="destructive">
                <AlertCircleIcon />
                <AlertDescription>{saveError}</AlertDescription>
              </Alert>
            )}

            <div className="grid gap-2">
              <Label htmlFor="dueDate">Fecha de vencimiento</Label>
              <div className="flex flex-wrap items-center gap-2">
                <input
                  ref={inputRef}
                  id="dueDate"
                  name="dueDate"
                  type="date"
                  // Sin un máximo, el segmento del año admite hasta seis dígitos.
                  max="9999-12-31"
                  className="border-input focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:border-destructive dark:bg-input/30 h-9 rounded-md border bg-transparent px-3 py-1 text-sm shadow-xs outline-none focus-visible:ring-[3px]"
                  value={draft}
                  onChange={handleDateChange}
                  onBlur={() => void flush()}
                  aria-invalid={Boolean(dateError)}
                  aria-describedby={dateError ? 'dueDate-error' : undefined}
                />
                {task.dueDate && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleRemove}
                  >
                    Quitar fecha
                  </Button>
                )}
              </div>
              <FieldError id="dueDate-error" message={dateError ?? undefined} />
            </div>

            {task.isOverdue && (
              <Alert variant="destructive">
                <TriangleAlertIcon />
                <AlertDescription>Vencida</AlertDescription>
              </Alert>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
