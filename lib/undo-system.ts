import { toast } from "sonner"

interface UndoOptions {
  label: string
  undoLabel?: string
  duration?: number
}

/**
 * 🔄 Governance Undo Buffer
 * Wraps a sensitive action in a 5-second buffer with an undo trigger.
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
        toast.info("Action reverted")
      }
    },
  })

  // Wait for the duration to see if it's cancelled
  await new Promise(resolve => setTimeout(resolve, options.duration || 5000))

  if (!isCancelled) {
    return action()
  }
}
