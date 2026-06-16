import { toast } from "sonner"

interface UndoOptions {
  label: string
  undoLabel?: string
  duration?: number
}

/**
 * 🔄 Governance Undo Buffer
 * Shows a toast with an undo button and executes the action immediately.
 * If the user clicks Undo within the toast duration, the action is skipped.
 */
export async function withUndo<T>(
  action: () => Promise<T>,
  options: UndoOptions
): Promise<T | undefined> {
  let isCancelled = false

  toast.success(options.label, {
    duration: options.duration || 5000,
    action: {
      label: options.undoLabel || "Undo",
      onClick: () => {
        isCancelled = true
        toast.info("Action cancelled")
      }
    },
  })

  // Small delay to allow the undo toast to render before executing
  await new Promise(resolve => setTimeout(resolve, 300))

  if (!isCancelled) {
    return action()
  }
}
