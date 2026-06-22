/**
 * Step 9: Property Images - Options and Utilities
 * Room assignment options for uploaded images
 */

// Re-export types for convenience
export type { AvailableRooms, RoomOption, Step9Room };

/** Maximum file size for image uploads (10MB) */
export const MAX_FILE_SIZE = 10 * 1024 * 1024;

/** Icons for each room type in accordion headers */
export const ROOM_ICONS: Record<string, string> = {
  general: "i-lucide-home",
  bedroom: "i-lucide-bed-double",
  bathroom: "i-lucide-bath",
  kitchen: "i-lucide-cooking-pot",
  reception: "i-lucide-sofa",
  otherRoom: "i-lucide-door-open",
  garden: "i-lucide-flower-2",
  yard: "i-lucide-fence",
  land: "i-lucide-map-pin",
};

/** Image group for accordion display */
export interface ImageGroup {
  key: string;
  label: string;
  icon: string;
  images: MediaAssignment[];
}

/** Accordion item for image groups */
export interface ImageAccordionItem {
  value: string;
  label: string;
  icon: string;
  count: number;
}

/**
 * Create an empty MediaAssignment for a new upload
 */
export function createEmptyMediaAssignment(
  cloudflareId: string,
  filename: string,
): MediaAssignment {
  return {
    cloudflareId,
    filename,
    description: null,
    bedroomId: null,
    bathroomId: null,
    kitchenId: null,
    receptionId: null,
    otherRoomId: null,
    gardenId: null,
    yardId: null,
    landId: null,
    isGeneral: true,
  };
}

/**
 * Group images by their room assignment
 */
export function groupImagesByRoom(
  images: MediaAssignment[],
  availableRooms: AvailableRooms,
): ImageGroup[] {
  const groups: Record<string, ImageGroup> = {};

  for (const image of images) {
    const roomValue = getSelectedRoom(image);

    if (roomValue === "general") {
      if (!groups.general) {
        groups.general = {
          key: "general",
          label: "General Property Images",
          icon: ROOM_ICONS.general ?? "i-lucide-home",
          images: [],
        };
      }
      groups.general.images.push(image);
    } else {
      // Parse room type and ID (e.g., "bedroom-123")
      const parts = roomValue.split("-");
      const roomType = parts[0] ?? "unknown";
      const roomId = parts[1] ?? "0";

      // Find the room name from available rooms
      let roomName = roomType;
      const roomsOfType = availableRooms[`${roomType}s` as keyof AvailableRooms] as
        | Array<{ id: number; name: string }>
        | undefined;
      if (roomsOfType) {
        const room = roomsOfType.find((r) => r.id === parseInt(roomId));
        roomName = room?.name ?? roomType;
      }

      const groupKey = roomValue;
      if (!groups[groupKey]) {
        const typeLabel =
          roomType.charAt(0).toUpperCase() + roomType.slice(1).replace(/([A-Z])/g, " $1");
        groups[groupKey] = {
          key: groupKey,
          label: `${typeLabel}: ${roomName}`,
          icon: ROOM_ICONS[roomType] ?? "i-lucide-square",
          images: [],
        };
      }
      groups[groupKey]!.images.push(image);
    }
  }

  // Sort: general first, then by label
  return Object.values(groups).sort((a, b) => {
    if (a.key === "general") return -1;
    if (b.key === "general") return 1;
    return a.label.localeCompare(b.label);
  });
}

/**
 * Generate accordion items from image groups
 */
export function generateAccordionItems(groups: ImageGroup[]): ImageAccordionItem[] {
  return groups.map((group) => ({
    value: group.key,
    label: group.label,
    icon: group.icon,
    count: group.images.length,
  }));
}

/**
 * Format media data for API submission
 * Ensures the main image (first general image) stays at index 0
 * General images are sorted first, then room-assigned images
 */
export function formatMediaForSubmission(media: MediaAssignment[]) {
  return mapPropertyImagesForSubmission(media);
}

/**
 * Generate room options for image assignment dropdown
 */
export function generateRoomOptions(availableRooms: AvailableRooms): RoomOption[] {
  const options: RoomOption[] = [{ value: "general", label: "General Property Image" }];

  // Add bedrooms
  availableRooms.bedrooms.forEach((room) => {
    options.push({
      value: `bedroom-${room.id}`,
      label: `Bedroom: ${room.name}`,
    });
  });

  // Add bathrooms
  availableRooms.bathrooms.forEach((room) => {
    options.push({
      value: `bathroom-${room.id}`,
      label: `Bathroom: ${room.name}`,
    });
  });

  // Add kitchens
  availableRooms.kitchens.forEach((room) => {
    options.push({
      value: `kitchen-${room.id}`,
      label: `Kitchen: ${room.name}`,
    });
  });

  // Add receptions
  availableRooms.receptions.forEach((room) => {
    options.push({
      value: `reception-${room.id}`,
      label: `Reception: ${room.name}`,
    });
  });

  // Add other rooms
  availableRooms.otherRooms.forEach((room) => {
    options.push({
      value: `otherRoom-${room.id}`,
      label: `Other: ${room.name}`,
    });
  });

  // Add gardens
  availableRooms.gardens.forEach((room) => {
    options.push({
      value: `garden-${room.id}`,
      label: `Garden: ${room.name}`,
    });
  });

  // Add yards
  availableRooms.yards.forEach((room) => {
    options.push({
      value: `yard-${room.id}`,
      label: `Yard: ${room.name}`,
    });
  });

  // Add lands
  availableRooms.lands.forEach((room) => {
    options.push({
      value: `land-${room.id}`,
      label: `Land: ${room.name}`,
    });
  });

  return options;
}

/**
 * Get selected room value from media assignment
 */
export function getSelectedRoom(image: MediaAssignment): string {
  if (image.bedroomId) return `bedroom-${image.bedroomId}`;
  if (image.bathroomId) return `bathroom-${image.bathroomId}`;
  if (image.kitchenId) return `kitchen-${image.kitchenId}`;
  if (image.receptionId) return `reception-${image.receptionId}`;
  if (image.otherRoomId) return `otherRoom-${image.otherRoomId}`;
  if (image.gardenId) return `garden-${image.gardenId}`;
  if (image.yardId) return `yard-${image.yardId}`;
  if (image.landId) return `land-${image.landId}`;
  return "general";
}

/**
 * Parse room assignment from select value
 */
export function parseRoomAssignment(roomValue: string): Partial<MediaAssignment> {
  const assignment: Partial<MediaAssignment> = {
    bedroomId: null,
    bathroomId: null,
    kitchenId: null,
    receptionId: null,
    otherRoomId: null,
    gardenId: null,
    yardId: null,
    landId: null,
    isGeneral: true,
  };

  if (roomValue === "general") {
    return assignment;
  }

  const [roomType, roomIdStr] = roomValue.split("-");
  if (!roomIdStr) return assignment;

  const roomId = parseInt(roomIdStr);
  assignment.isGeneral = false;

  switch (roomType) {
    case "bedroom":
      assignment.bedroomId = roomId;
      break;
    case "bathroom":
      assignment.bathroomId = roomId;
      break;
    case "kitchen":
      assignment.kitchenId = roomId;
      break;
    case "reception":
      assignment.receptionId = roomId;
      break;
    case "otherRoom":
      assignment.otherRoomId = roomId;
      break;
    case "garden":
      assignment.gardenId = roomId;
      break;
    case "yard":
      assignment.yardId = roomId;
      break;
    case "land":
      assignment.landId = roomId;
      break;
  }

  return assignment;
}

/**
 * Extract available rooms from draft listing data
 */
export function getAvailableRoomsFromDraft(draftData?: any): AvailableRooms {
  const property = draftData?.property;

  if (!property) {
    return {
      bedrooms: [],
      bathrooms: [],
      kitchens: [],
      receptions: [],
      otherRooms: [],
      gardens: [],
      yards: [],
      lands: [],
    };
  }

  // For new drafts, rooms don't have database IDs yet - use roomNumber as fallback
  return {
    bedrooms: (property.bedroomFeatures || []).map((room: any, i: number) => ({
      id: room.id ?? room.roomNumber ?? i + 1,
      name: room.name || `Bedroom ${i + 1}`,
      roomNumber: room.roomNumber || i + 1,
    })),
    bathrooms: (property.bathroomFeatures || []).map((room: any, i: number) => ({
      id: room.id ?? room.roomNumber ?? i + 1,
      name: room.name || `Bathroom ${i + 1}`,
      roomNumber: room.roomNumber || i + 1,
    })),
    kitchens: (property.kitchenFeatures || []).map((room: any, i: number) => ({
      id: room.id ?? room.roomNumber ?? i + 1,
      name: room.name || `Kitchen ${i + 1}`,
      roomNumber: room.roomNumber || i + 1,
    })),
    receptions: (property.reception || []).map((room: any, i: number) => ({
      id: room.id ?? room.roomNumber ?? i + 1,
      name: room.name || `Reception ${i + 1}`,
      roomNumber: room.roomNumber || i + 1,
      type: room.type,
    })),
    otherRooms: (property.otherRoom || []).map((room: any, i: number) => ({
      id: room.id ?? room.roomNumber ?? i + 1,
      name: room.name || `Other Room ${i + 1}`,
      roomNumber: room.roomNumber || i + 1,
      type: room.type,
    })),
    gardens: (property.outdoorSpace?.garden || []).map((g: any, i: number) => ({
      id: g.id ?? i + 1,
      name: g.name || `Garden ${i + 1}`,
    })),
    yards: (property.outdoorSpace?.yard || []).map((y: any, i: number) => ({
      id: y.id ?? i + 1,
      name: y.name || `Yard ${i + 1}`,
    })),
    lands: (property.outdoorSpace?.land || []).map((l: any, i: number) => ({
      id: l.id ?? i + 1,
      name: l.name || `Land ${i + 1}`,
    })),
  };
}
