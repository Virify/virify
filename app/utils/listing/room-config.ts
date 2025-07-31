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
 * Convert floor number to readable text with proper ordinal suffixes
 */
export const getFloorText = (floorNumber: number | null): string => {
  if (floorNumber === null) return "Unknown Floor";
  if (floorNumber === 0) return "Ground Floor";
  
  // Helper function to get ordinal suffix
  const getOrdinalSuffix = (num: number): string => {
    const lastDigit = num % 10;
    const lastTwoDigits = num % 100;
    
    // Special cases for 11th, 12th, 13th
    if (lastTwoDigits >= 11 && lastTwoDigits <= 13) {
      return "th";
    }
    
    switch (lastDigit) {
      case 1: return "st";
      case 2: return "nd";
      case 3: return "rd";
      default: return "th";
    }
  };
  
  return `${floorNumber}${getOrdinalSuffix(floorNumber)} Floor`;
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