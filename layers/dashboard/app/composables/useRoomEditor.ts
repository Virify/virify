interface RoomItem {
  roomNumber: number
}

/**
 * Generic composable for managing a room slide-form editor (open/close, snapshot/restore on cancel).
 * Any source of close (Cancel button, X button, backdrop, Escape) routes through cancel().
 */
export function useRoomEditor<T extends RoomItem>(items: T[]) {
  const isOpen = ref(false)
  const editingIndex = ref<number | null>(null)
  const isAddingNew = ref(false)
  const snapshot = ref<T | null>(null)
  let closingInternally = false

  const editingItem = computed((): T | null =>
    editingIndex.value !== null ? items[editingIndex.value] ?? null : null
  )

  function open(index: number) {
    if (!isAddingNew.value) {
      snapshot.value = JSON.parse(JSON.stringify(items[index])) as T
    }
    editingIndex.value = index
    isOpen.value = true
  }

  function close() {
    closingInternally = true
    isOpen.value = false
    editingIndex.value = null
    isAddingNew.value = false
    snapshot.value = null
    closingInternally = false
  }

  function cancel() {
    if (isAddingNew.value && editingIndex.value !== null) {
      items.splice(editingIndex.value, 1)
      items.forEach((item, i) => { item.roomNumber = i + 1 })
    } else if (editingIndex.value !== null && snapshot.value) {
      const target = items[editingIndex.value]
      if (target) Object.assign(target, snapshot.value)
    }
    close()
  }

  // Route any external close (X button, backdrop, Escape) through cancel()
  watch(isOpen, (val) => {
    if (!val && !closingInternally) {
      cancel()
    }
  })

  return { isOpen, editingIndex, isAddingNew, editingItem, open, close, cancel }
}
