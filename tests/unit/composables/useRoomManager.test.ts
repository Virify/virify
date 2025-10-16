import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ref, computed } from 'vue'
import { useRoomManager } from '../../../app/composables/useRoomManager'

// Mock nextTick
vi.mock('vue', async () => {
  const actual = await vi.importActual('vue')
  return {
    ...actual,
    nextTick: vi.fn().mockResolvedValue(undefined)
  }
})

describe('useRoomManager (Room Add/Remove Functionality)', () => {
  interface TestRoom {
    id?: number
    name: string | null
    roomNumber: number
    floor: number
    description: string | null
  }

  const createTestRoom = (roomNumber: number): TestRoom => ({
    name: `Room ${roomNumber}`,
    roomNumber,
    floor: 1,
    description: null
  })

  const roomConfig = {
    isRoomCompleted: (room: TestRoom) => Boolean(room.name && room.roomNumber && room.floor),
    createNewRoom: (roomNumber: number) => createTestRoom(roomNumber)
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Adding Rooms', () => {
    it('should add a new room with correct room number', () => {
      const rooms = ref<TestRoom[]>([])
      const mockEmit = vi.fn()

      const { addRoom } = useRoomManager(computed(() => rooms.value), mockEmit, roomConfig)

      addRoom()

      expect(mockEmit).toHaveBeenCalledWith('update:modelValue', [
        expect.objectContaining({ roomNumber: 1, name: 'Room 1' })
      ])
    })

    it('should add multiple rooms with incrementing room numbers', () => {
      const rooms = ref<TestRoom[]>([])
      const mockEmit = vi.fn()

      const { addRoom } = useRoomManager(computed(() => rooms.value), mockEmit, roomConfig)

      addRoom()
      rooms.value = [createTestRoom(1)]
      
      addRoom()

      expect(mockEmit).toHaveBeenLastCalledWith('update:modelValue', 
        expect.arrayContaining([
          expect.objectContaining({ roomNumber: 2 })
        ])
      )
    })

    it('should automatically expand newly added room', () => {
      const rooms = ref<TestRoom[]>([])
      const mockEmit = vi.fn()

      const { addRoom, lastAddedRoomIndex, isRoomCollapsed } = useRoomManager(
        computed(() => rooms.value),
        mockEmit,
        roomConfig
      )

      addRoom()

      // New room should NOT be in expandedRooms set, but lastAddedRoomIndex should be set
      expect(lastAddedRoomIndex.value).toBe(0)
      // isRoomCollapsed should return false for the newly added room
      expect(isRoomCollapsed(0)).toBe(false)
    })

    it('should prevent adding multiple rooms simultaneously', () => {
      const rooms = ref<TestRoom[]>([createTestRoom(1)])
      rooms.value[0].name = null // Make incomplete
      const mockEmit = vi.fn()

      const { addRoom, hasOpenRoomForm, lastAddedRoomIndex } = useRoomManager(
        computed(() => rooms.value), 
        mockEmit, 
        roomConfig
      )

      // Add the incomplete room
      addRoom()
      
      // Update rooms to reflect the addition
      rooms.value = [...rooms.value, createTestRoom(2)]
      lastAddedRoomIndex.value = rooms.value.length - 1

      // Should have open form due to lastAddedRoomIndex being set
      expect(hasOpenRoomForm.value).toBe(true)
    })
  })

  describe('Removing Rooms', () => {
    it('should remove a room at specified index', () => {
      const rooms = ref<TestRoom[]>([
        createTestRoom(1),
        createTestRoom(2),
        createTestRoom(3)
      ])
      const mockEmit = vi.fn()

      const { removeRoom } = useRoomManager(computed(() => rooms.value), mockEmit, roomConfig)

      removeRoom(1) // Remove second room

      // Rooms are renumbered after removal, so Room 3 becomes Room 2
      expect(mockEmit).toHaveBeenCalledWith('update:modelValue', [
        expect.objectContaining({ name: 'Room 1', roomNumber: 1 }),
        expect.objectContaining({ name: 'Room 3', roomNumber: 2 })
      ])
    })

    it('should renumber remaining rooms after deletion', () => {
      const rooms = ref<TestRoom[]>([
        createTestRoom(1),
        createTestRoom(2),
        createTestRoom(3)
      ])
      const mockEmit = vi.fn()

      const { removeRoom } = useRoomManager(computed(() => rooms.value), mockEmit, roomConfig)

      removeRoom(0) // Remove first room

      const updatedRooms = mockEmit.mock.calls[0][1]
      expect(updatedRooms[0].roomNumber).toBe(1)
      expect(updatedRooms[1].roomNumber).toBe(2)
    })

    it('should handle removing the only room', () => {
      const rooms = ref<TestRoom[]>([createTestRoom(1)])
      const mockEmit = vi.fn()

      const { removeRoom } = useRoomManager(computed(() => rooms.value), mockEmit, roomConfig)

      removeRoom(0)

      expect(mockEmit).toHaveBeenCalledWith('update:modelValue', [])
    })
  })

  describe('Room State Management', () => {
    it('should track expanded rooms correctly', () => {
      const rooms = ref<TestRoom[]>([createTestRoom(1)])
      const mockEmit = vi.fn()

      const { toggleRoom, expandedRooms } = useRoomManager(
        computed(() => rooms.value), 
        mockEmit, 
        roomConfig
      )

      expect(expandedRooms.value.has(0)).toBe(false)

      toggleRoom(0)

      expect(expandedRooms.value.has(0)).toBe(true)

      toggleRoom(0)

      expect(expandedRooms.value.has(0)).toBe(false)
    })

    it('should detect room changes correctly', () => {
      const rooms = ref<TestRoom[]>([createTestRoom(1)])
      const mockEmit = vi.fn()

      const { hasRoomChanges, toggleRoom } = useRoomManager(
        computed(() => rooms.value), 
        mockEmit, 
        roomConfig
      )

      // Initially no changes (no original state stored)
      expect(hasRoomChanges(0)).toBe(false)

      // Toggle room to start editing (this stores the original state)
      toggleRoom(0)

      // Initially should have no changes
      expect(hasRoomChanges(0)).toBe(false)

      // Modify room
      rooms.value[0].name = 'Modified Name'

      // Should detect changes
      expect(hasRoomChanges(0)).toBe(true)
    })

    it('should identify new unsaved rooms', () => {
      const rooms = ref<TestRoom[]>([createTestRoom(1)])
      const mockEmit = vi.fn()

      const { isNewUnsavedRoom, addRoom } = useRoomManager(
        computed(() => rooms.value), 
        mockEmit, 
        roomConfig
      )

      // Initially, room 0 is not new
      expect(isNewUnsavedRoom(0)).toBe(false)
      
      // Add a new room
      addRoom()
      
      // Update rooms array to reflect the addition
      rooms.value = [...rooms.value, createTestRoom(2)]

      // The newly added room should be identified as new unsaved
      expect(isNewUnsavedRoom(1)).toBe(true)
    })
  })

  describe('Room Validation', () => {
    it('should validate room completion correctly', () => {
      const incompleteRoom: TestRoom = {
        name: null,
        roomNumber: 1,
        floor: 1,
        description: null
      }
      const completeRoom: TestRoom = {
        name: 'Complete Room',
        roomNumber: 1,
        floor: 1,
        description: 'A description'
      }

      const rooms = ref<TestRoom[]>([incompleteRoom, completeRoom])
      const mockEmit = vi.fn()

      const { isRoomCompleted } = useRoomManager(
        computed(() => rooms.value), 
        mockEmit, 
        roomConfig
      )

      expect(isRoomCompleted(incompleteRoom)).toBe(false)
      expect(isRoomCompleted(completeRoom)).toBe(true)
    })

    it('should disable add button when there are incomplete rooms', () => {
      const rooms = ref<TestRoom[]>([
        { name: null, roomNumber: 1, floor: 1, description: null }
      ])
      const mockEmit = vi.fn()

      const { addButtonDisabled } = useRoomManager(
        computed(() => rooms.value), 
        mockEmit, 
        roomConfig
      )

      expect(addButtonDisabled.value).toBe(true)
    })

    it('should enable add button when all rooms are complete', () => {
      const rooms = ref<TestRoom[]>([
        { name: 'Room 1', roomNumber: 1, floor: 1, description: null }
      ])
      const mockEmit = vi.fn()

      const { addButtonDisabled } = useRoomManager(
        computed(() => rooms.value), 
        mockEmit, 
        roomConfig
      )

      expect(addButtonDisabled.value).toBe(false)
    })
  })

  describe('Save and Cancel Operations', () => {
    it('should save room and collapse it', () => {
      const rooms = ref<TestRoom[]>([
        { name: 'Room 1', roomNumber: 1, floor: 1, description: null }
      ])
      const mockEmit = vi.fn()

      const { saveRoom, expandedRooms } = useRoomManager(
        computed(() => rooms.value), 
        mockEmit, 
        roomConfig
      )

      expandedRooms.value.add(0)
      expect(expandedRooms.value.has(0)).toBe(true)

      saveRoom(0)

      expect(expandedRooms.value.has(0)).toBe(false)
    })

    it('should cancel room changes and restore original values', () => {
      const originalRoom = { name: 'Original', roomNumber: 1, floor: 1, description: null }
      const rooms = ref<TestRoom[]>([{ ...originalRoom }])
      const mockEmit = vi.fn()

      const { cancelRoom, toggleRoom } = useRoomManager(
        computed(() => rooms.value), 
        mockEmit, 
        roomConfig
      )

      // Toggle room to start editing (this stores original state)
      toggleRoom(0)

      // Modify room
      rooms.value[0].name = 'Modified'

      cancelRoom(0)

      // Should restore original value
      expect(mockEmit).toHaveBeenCalledWith('update:modelValue', [
        expect.objectContaining({ name: 'Original' })
      ])
    })

    it('should remove room if canceling a new unsaved room', () => {
      const rooms = ref<TestRoom[]>([])
      const mockEmit = vi.fn()

      const { addRoom, cancelRoom } = useRoomManager(
        computed(() => rooms.value), 
        mockEmit, 
        roomConfig
      )

      // Add a new room
      addRoom()
      
      // Update local state to match what was emitted
      rooms.value = [createTestRoom(1)]
      
      // Cancel the newly added room (index 0)
      // This should call removeRoom internally which emits an empty array
      cancelRoom(0)

      // Should have called emit to remove the room
      expect(mockEmit).toHaveBeenLastCalledWith('update:modelValue', [])
    })
  })
})
