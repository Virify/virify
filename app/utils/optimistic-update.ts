import type { Ref } from 'vue'

/**
 * Options for performing an optimistic update
 */
interface OptimisticUpdateOptions<T> {
  /** The reactive ref to update optimistically */
  ref: Ref<T>
  /** Function to apply the optimistic change (returns the new value) */
  optimisticChange: (current: T) => T
  /** The async operation to perform */
  operation: () => Promise<void>
  /** Called on success (after operation completes) */
  onSuccess?: () => void | Promise<void>
  /** Called on error (receives the error) */
  onError?: (error: unknown) => void
}

/**
 * Perform an optimistic update with automatic rollback on failure
 * 
 * This utility handles the common pattern of:
 * 1. Save current state
 * 2. Apply optimistic change immediately
 * 3. Execute async operation
 * 4. On error: rollback to previous state
 * 5. On success: call success handler
 * 
 * @example
 * ```ts
 * await performOptimisticUpdate({
 *   ref: favouriteLookups,
 *   optimisticChange: (current) => [...current, listingId],
 *   operation: () => $fetch(`/api/user/favourites/${listingId}`, { method: 'POST' }),
 *   onSuccess: () => showToast('Added!', { type: 'success' }),
 *   onError: () => showToast('Failed!', { type: 'error' }),
 * })
 * ```
 */
export async function performOptimisticUpdate<T>({
  ref,
  optimisticChange,
  operation,
  onSuccess,
  onError,
}: OptimisticUpdateOptions<T>): Promise<void> {
  // Store previous state for rollback
  const previousValue = Array.isArray(ref.value) 
    ? [...ref.value] as T
    : ref.value

  // Apply optimistic change immediately
  ref.value = optimisticChange(ref.value)

  try {
    await operation()
    await onSuccess?.()
  } catch (error) {
    // Rollback on error
    ref.value = previousValue
    onError?.(error)
    throw error
  }
}

/**
 * Options for performing a multi-ref optimistic update
 */
interface MultiOptimisticUpdateOptions {
  /** Array of refs and their corresponding optimistic changes */
  updates: Array<{
    ref: Ref<any>
    optimisticChange: (current: any) => any
  }>
  /** The async operation to perform */
  operation: () => Promise<void>
  /** Called on success (after operation completes) */
  onSuccess?: () => void | Promise<void>
  /** Called on error (receives the error) */
  onError?: (error: unknown) => void
}

/**
 * Perform optimistic updates on multiple refs with automatic rollback
 * 
 * Useful when you need to update multiple state refs atomically.
 * If the operation fails, ALL refs are rolled back to their previous values.
 * 
 * @example
 * ```ts
 * await performMultiOptimisticUpdate({
 *   updates: [
 *     { ref: noteLookups, optimisticChange: (current) => current.filter(n => n.listingId !== id) },
 *     { ref: userNotes, optimisticChange: (current) => current.filter(n => n.listingId !== id) },
 *   ],
 *   operation: () => $fetch(`/api/user/notes/${id}`, { method: 'DELETE' }),
 *   onSuccess: () => showToast('Deleted!', { type: 'success' }),
 *   onError: () => showToast('Failed!', { type: 'error' }),
 * })
 * ```
 */
export async function performMultiOptimisticUpdate({
  updates,
  operation,
  onSuccess,
  onError,
}: MultiOptimisticUpdateOptions): Promise<void> {
  // Store all previous values for rollback
  const previousValues = updates.map(({ ref }) => 
    Array.isArray(ref.value) ? [...ref.value] : ref.value
  )

  // Apply all optimistic changes immediately
  updates.forEach(({ ref, optimisticChange }) => {
    ref.value = optimisticChange(ref.value)
  })

  try {
    await operation()
    await onSuccess?.()
  } catch (error) {
    // Rollback all refs on error
    updates.forEach(({ ref }, index) => {
      ref.value = previousValues[index]
    })
    onError?.(error)
    throw error
  }
}

/**
 * Options for a pending removal operation (visual feedback pattern)
 */
interface PendingRemovalOptions {
  /** The Set ref tracking pending removals */
  pendingSet: Ref<Set<number>>
  /** The ID to mark as pending */
  id: number
  /** The async operation to perform */
  operation: () => Promise<void>
  /** Called on success */
  onSuccess?: () => void | Promise<void>
  /** Called on error */
  onError?: (error: unknown) => void
}

/**
 * Perform a removal with pending state tracking
 * 
 * Unlike standard optimistic updates, this pattern:
 * 1. Marks the item as "pending removal" (for visual feedback like blur/overlay)
 * 2. Performs the delete operation
 * 3. On success: keeps item in pending state (UI shows "removed" until navigation)
 * 4. On error: removes from pending state (item becomes interactive again)
 * 
 * @example
 * ```ts
 * await performPendingRemoval({
 *   pendingSet: pendingRemoval,
 *   id: listingId,
 *   operation: () => $fetch(`/api/user/favourites/${listingId}`, { method: 'DELETE' }),
 *   onSuccess: () => showToast('Removed!', { type: 'success' }),
 *   onError: () => showToast('Failed!', { type: 'error' }),
 * })
 * ```
 */
export async function performPendingRemoval({
  pendingSet,
  id,
  operation,
  onSuccess,
  onError,
}: PendingRemovalOptions): Promise<void> {
  // Mark as pending (triggers visual feedback)
  pendingSet.value.add(id)
  pendingSet.value = new Set(pendingSet.value) // trigger reactivity

  try {
    await operation()
    // Keep in pending state - item stays visually "removed" until page change
    await onSuccess?.()
  } catch (error) {
    // Remove from pending on error (restore interactivity)
    pendingSet.value.delete(id)
    pendingSet.value = new Set(pendingSet.value)
    onError?.(error)
    throw error
  }
}
