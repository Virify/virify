/**
 * Room configuration utilities
 */

/**
 * Convert enum values to readable strings
 */
export const convertRoomEnumToString = (enumValue: string): string => {
  // Handle underscore-separated enums first
  if (enumValue.includes('_')) {
    return enumValue
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }
  
  // Handle all-uppercase enums (like "GYM")
  if (enumValue === enumValue.toUpperCase() && enumValue.length > 1) {
    return enumValue.charAt(0).toUpperCase() + enumValue.slice(1).toLowerCase();
  }
  
  // Handle camelCase enums
  return enumValue.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()).trim();
};

/**
 * Convert floor number to readable text
 */
export const getFloorText = (floorNumber: number | null): string => {
  if (floorNumber === null) return "Unknown Floor";
  if (floorNumber === 0) return "Ground Floor";
  if (floorNumber === 1) return "First Floor";
  if (floorNumber === 2) return "Second Floor";
  if (floorNumber > 2) return `${floorNumber}th Floor`;
  return "Unknown Floor";
};

/**
 * Get room type string from a room object
 */
export const getRoomType = (room: any): string => {
  // Handle kitchen objects - check for kitchen-specific properties that other rooms don't have
  if (room.hasOwnProperty('whiteGoods') || room.hasOwnProperty('breakfastBar') || room.hasOwnProperty('island')) {
    return 'Kitchen';
  }
  
  // If room type is "other", use the room's name instead
  if (room.type && room.type.toLowerCase() === 'other' && room.name) {
    return convertRoomEnumToString(room.name);
  }

  return room.type ? convertRoomEnumToString(room.type) : room.name || 'Room';
};

/**
 * Get garden type string
 */
export const getGardenType = (garden: any): string => {
  return garden.gardenType === 'front' ? 'Front Garden' : 'Rear Garden';
};