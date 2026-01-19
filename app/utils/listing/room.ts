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
  // Handle kitchen objects - check for roomNumber being optional (kitchens have optional roomNumber)
  if (room.hasOwnProperty('roomNumber') && room.roomNumber === null && room.name) {
    return 'Kitchen';
  }
  
  // If room type is "other", use the room's name instead
  if (room.type && room.type.toLowerCase() === 'other' && room.name) {
    return convertEnumToString(room.name);
  }

  return room.type ? convertEnumToString(room.type) : room.name || 'Room';
};