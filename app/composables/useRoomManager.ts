export interface RoomManagerConfig<T> {
  isRoomCompleted: (room: T) => boolean;
  createNewRoom: (roomNumber: number) => T;
}

/**
 * Room management composable
 * @param rooms Array of rooms to manage
 * @param emit Event emitter for updating room data
 * @param config Configuration object for room management
 * @returns Room management functions and state
 */
export function useRoomManager<T>(rooms: Ref<T[]>, emit: (event: "update:modelValue", value: T[]) => void, config: RoomManagerConfig<T>) {
  // State management
  const expandedRooms = ref(new Set<number>());
  const roomRefs = ref<Map<number, HTMLElement>>(new Map());
  const lastAddedRoomIndex = ref<number | null>(null);
  const originalRoomStates = ref<Map<number, T>>(new Map());

  // Computed properties
  const hasAnyRooms = computed(() => rooms.value.length > 0);

  const hasOpenRoomForm = computed(() => {
    if (lastAddedRoomIndex.value !== null) {
      return true;
    }
    return expandedRooms.value.size > 0;
  });

  const addButtonDisabled = computed(() => {
    // Only disable if there are incomplete rooms OR if there's a newly added unsaved room
    return Boolean(
      rooms.value.some((room) => !config.isRoomCompleted(room)) ||
      lastAddedRoomIndex.value !== null
    );
  });

  /**
   * Check if a room is newly added and unsaved
   * @param index Index of the room to check
   * @returns True if the room is newly added and unsaved
   */
  function isNewUnsavedRoom(index: number): boolean {
    return lastAddedRoomIndex.value === index;
  }

  /**
   * Set the reference for a room element
   * @param el Element reference
   * @param index Room index
   */
  function setRoomRef(el: any, index: number): void {
    if (el && "$el" in el) {
      roomRefs.value.set(index, el.$el as HTMLElement);
    } else if (el) {
      roomRefs.value.set(index, el as HTMLElement);
    } else {
      roomRefs.value.delete(index);
    }
  }

  /**
   * Check if a room is collapsed
   * @param index Index of the room
   * @returns True if the room is collapsed, false otherwise
   */
  function isRoomCollapsed(index: number): boolean {
    if (lastAddedRoomIndex.value === index) {
      return false; // Show form for newly added room
    }
    return !expandedRooms.value.has(index); // Collapse all others unless manually expanded
  }

  /**
   * Toggle the collapsed state of a room
   * @param index Index of the room to toggle
   */
  function toggleRoom(index: number): void {
    const expanded = expandedRooms.value;

    if (expanded.has(index)) {
      expanded.delete(index);
      // Clear original state when closing without saving
      originalRoomStates.value.delete(index);
    } else {
      expanded.add(index);
      // Store original state when opening for editing
      originalRoomStates.value.set(index, JSON.parse(JSON.stringify(rooms.value[index])));
    }
  }

  /**
   * Check if a room has unsaved changes
   * @param index Index of the room to check for changes
   * @returns True if the room has unsaved changes, false otherwise
   */
  function hasRoomChanges(index: number): boolean {
    const originalState = originalRoomStates.value.get(index);
    if (!originalState) {
      // If no original state, this is a newly added room, so it has "changes"
      return lastAddedRoomIndex.value === index;
    }

    const currentState = rooms.value[index];
    return JSON.stringify(originalState) !== JSON.stringify(currentState);
  }

  /**
   * Add a new room
   * Creates a new room using the config function and appends it to the rooms array
   * Emits an update event with the new rooms array
   */
  function addRoom(): void {
    const currentRooms = rooms.value;
    const newRoom = config.createNewRoom(currentRooms.length + 1);

    const updatedRooms = [...currentRooms, newRoom];

    // Track the index of the newly added room
    lastAddedRoomIndex.value = updatedRooms.length - 1;

    emit("update:modelValue", updatedRooms);
  }

  /**
   * Save a room
   * @param index Index of the room to save
   */
  function saveRoom(index: number): void {
    // If this was a newly added room, mark it as no longer new
    if (lastAddedRoomIndex.value === index) {
      lastAddedRoomIndex.value = null;
    }

    // If this room was expanded for editing, collapse it
    expandedRooms.value.delete(index);

    // Clear the original state since we're saving
    originalRoomStates.value.delete(index);
  }

  /**
   * Cancel room editing and revert any unsaved changes
   * @param index Index of the room to cancel editing
   */
  function cancelRoom(index: number): void {
    // If this is a newly added room that hasn't been saved, remove it entirely
    if (lastAddedRoomIndex.value === index) {
      removeRoom(index);
      return;
    }

    // If this room was being edited, revert to original state
    const originalState = originalRoomStates.value.get(index);
    if (originalState) {
      const currentRooms = [...rooms.value];
      currentRooms[index] = JSON.parse(JSON.stringify(originalState));
      emit("update:modelValue", currentRooms);
    }

    // Close the room and clear the original state
    expandedRooms.value.delete(index);
    originalRoomStates.value.delete(index);
  }

  /**
   * Remove a room
   * @param index Index of the room to remove
   */
  function removeRoom(index: number): void {
    const currentRooms = rooms.value;
    const updatedRooms = currentRooms.filter((_, i) => i !== index);

    // Update room numbers
    updatedRooms.forEach((room: any, i) => {
      if ("roomNumber" in room) {
        room.roomNumber = i + 1;
      }
    });

    // Reset the last added index since we're removing a room
    lastAddedRoomIndex.value = null;

    // Clear any stored original states and shift indices
    originalRoomStates.value.delete(index);
    const newStates = new Map();
    for (const [stateIndex, state] of originalRoomStates.value.entries()) {
      if (stateIndex < index) {
        newStates.set(stateIndex, state);
      } else if (stateIndex > index) {
        newStates.set(stateIndex - 1, state);
      }
    }
    originalRoomStates.value = newStates;

    emit("update:modelValue", updatedRooms);
  }

  /**
   * Initialize the room manager state
   * Resets the last added room index
   */
  function initializeRoomManager(): void {
    lastAddedRoomIndex.value = null;
  }

  return {
    // State
    expandedRooms,
    roomRefs,
    lastAddedRoomIndex,
    originalRoomStates,

    // Computed
    hasAnyRooms,
    hasOpenRoomForm,
    addButtonDisabled,

    // Functions
    setRoomRef,
    isRoomCollapsed,
    toggleRoom,
    hasRoomChanges,
    addRoom,
    saveRoom,
    cancelRoom,
    removeRoom,
    initializeRoomManager,
    isNewUnsavedRoom,

    // Config access
    isRoomCompleted: config.isRoomCompleted,
  };
}
