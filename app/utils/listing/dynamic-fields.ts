/**
 * Dynamic field generation for property tables
 * This generates field definitions from the actual data structure to avoid tight coupling
 */

interface FieldConfig {
  key: string
  label: string
  type?: 'string' | 'boolean' | 'number' | 'array' | 'date'
  formatter?: (value: any) => string
  condition?: (value: any) => boolean
  priority?: number // For ordering fields
}

// Field metadata - only contains presentation logic, not data structure assumptions
const FIELD_METADATA: Record<string, Partial<FieldConfig>> = {
  // Common fields
  roomNumber: { label: 'Room Number', type: 'number', priority: 1 },
  size: { label: 'Size', type: 'number', formatter: (value: number) => value ? `${value} m²` : '', priority: 2 },
  description: { label: 'Description', type: 'string', priority: 100 },
  
  // Bedroom fields
  bed: { 
    label: 'Room Size', 
    type: 'array', 
    formatter: (bedTypes: string[]) => {
      if (!Array.isArray(bedTypes) || bedTypes.length === 0) return ''
      const hasSingle = bedTypes.some(type => type.toLowerCase() === 'single')
      const hasLarger = bedTypes.some(type => ['double', 'queen', 'king', 'super_king'].includes(type.toLowerCase()))
      if (hasSingle && !hasLarger) return 'Single'
      else if (hasLarger || (!hasSingle && bedTypes.length > 0)) return 'Large'
      return 'Single'
    },
    priority: 3
  },
  builtInStorage: { label: 'Built-in Storage', type: 'boolean', priority: 10 },
  enSuite: { label: 'En-suite', type: 'boolean', priority: 4 },
  walkInWardrobe: { label: 'Walk-in Wardrobe', type: 'boolean', priority: 11 },
  
  // Bathroom fields
  bathtub: { label: 'Bathtub', type: 'boolean', priority: 5 },
  walkInShower: { label: 'Walk-in Shower', type: 'boolean', priority: 6 },
  downstairs: { label: 'Downstairs', type: 'boolean', priority: 7 },
  upstairs: { label: 'Upstairs', type: 'boolean', priority: 8 },
  
  // Date fields
  moveInDate: { 
    label: 'Move-in Date', 
    type: 'date', 
    formatter: (value: string) => value ? new Date(value).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '',
    priority: 1
  },
  
  // Financial fields
  serviceCharges: { label: 'Service Charges', type: 'number', formatter: (value: number) => value ? `£${value}` : '', priority: 2 },
  groundRent: { label: 'Ground Rent', type: 'number', formatter: (value: number) => value ? `£${value}` : '', priority: 3 },
  councilTaxBand: { label: 'Council Tax Band', type: 'string', priority: 1 },
  
  // Energy fields
  epcRating: { label: 'EPC Rating', type: 'string', priority: 1 },
  maxDownloadSpeedMbps: { label: 'Max Download Speed', type: 'number', formatter: (value: number) => value ? `${value} Mbps` : '', priority: 20 },
  
  // Size fields with m² formatting
  totalSize: { label: 'Total Size', type: 'number', formatter: (value: number) => value ? `${value} m²` : '', priority: 1 },
  frontGardenSize: { label: 'Front Garden Size', type: 'number', formatter: (value: number) => value ? `${value} m²` : '', priority: 15 },
  rearGardenSize: { label: 'Rear Garden Size', type: 'number', formatter: (value: number) => value ? `${value} m²` : '', priority: 16 },
  
  // Common boolean fields - auto-detected and formatted
  petFriendly: { label: 'Pet Friendly', type: 'boolean' },
  homeOffice: { label: 'Home Office', type: 'boolean' },
  pool: { label: 'Pool', type: 'boolean' },
  internet: { label: 'Internet', type: 'boolean' },
  cableTv: { label: 'Cable TV', type: 'boolean' },
  phone: { label: 'Phone', type: 'boolean' },
  laundry: { label: 'Laundry', type: 'boolean' },
  concierge: { label: 'Concierge', type: 'boolean' },
  shop: { label: 'Shop', type: 'boolean' },
  gym: { label: 'Gym', type: 'boolean' },
  
  // Accessibility
  wheelchairFriendly: { label: 'Wheelchair Friendly', type: 'boolean' },
  stepFreeAccess: { label: 'Step-free Access', type: 'boolean' },
  wideDoorways: { label: 'Wide Doorways', type: 'boolean' },
  wetRoom: { label: 'Wet Room', type: 'boolean' },
  handrails: { label: 'Handrails', type: 'boolean' },
  elevator: { label: 'Elevator', type: 'boolean' },
  stairs: { label: 'Stairs', type: 'boolean' },
  accessibleParking: { label: 'Accessible Parking', type: 'boolean' },
  
  // Parking
  garage: { label: 'Garage', type: 'boolean' },
  driveway: { label: 'Driveway', type: 'boolean' },
  permitParking: { label: 'Permit Parking', type: 'boolean' },
  onStreet: { label: 'On Street', type: 'boolean' },
  noParking: { label: 'No Parking', type: 'boolean' },
  carport: { label: 'Carport', type: 'boolean' },
  allocatedParking: { label: 'Allocated Parking', type: 'boolean' },
  evCharging: { label: 'EV Charging', type: 'boolean' },
  
  // Security
  gatedCommunity: { label: 'Gated Community', type: 'boolean' },
  cctv: { label: 'CCTV', type: 'boolean' },
  alarmSystem: { label: 'Alarm System', type: 'boolean' },
  neighborhoodWatch: { label: 'Neighborhood Watch', type: 'boolean' },
  intercomSystem: { label: 'Intercom System', type: 'boolean' },
  security: { label: 'Security', type: 'boolean' },
  reception: { label: 'Reception', type: 'boolean' },
  
  // Storage
  attic: { label: 'Attic', type: 'boolean' },
  basement: { label: 'Basement', type: 'boolean' },
  separateDressing: { label: 'Separate Dressing', type: 'boolean' },
  underStairsStorage: { label: 'Under Stairs Storage', type: 'boolean' },
  pantry: { label: 'Pantry', type: 'boolean' },
  
  // Outdoor
  frontGarden: { label: 'Front Garden', type: 'boolean' },
  rearGarden: { label: 'Rear Garden', type: 'boolean' },
  sunTerrace: { label: 'Sun Terrace', type: 'boolean' },
  terrace: { label: 'Terrace', type: 'boolean' },
  balcony: { label: 'Balcony', type: 'boolean' },
  patio: { label: 'Patio', type: 'boolean' },
  separateParcel: { label: 'Separate Parcel', type: 'boolean' },
  shed: { label: 'Shed', type: 'boolean' },
  summerHouse: { label: 'Summer House', type: 'boolean' },
  gardenOffice: { label: 'Garden Office', type: 'boolean' },
  
  // Kitchen
  modern: { label: 'Modern', type: 'boolean' },
  openPlan: { label: 'Open Plan', type: 'boolean' },
  whiteGoods: { label: 'White Goods', type: 'boolean' },
  breakfastBar: { label: 'Breakfast Bar', type: 'boolean' },
  island: { label: 'Island', type: 'boolean' },
  utilityAccess: { label: 'Utility Access', type: 'boolean' },
  
  // Living Area
  fireplace: { label: 'Fireplace', type: 'string' },
  gamesRoom: { label: 'Games Room', type: 'boolean' },
  homeCinema: { label: 'Home Cinema', type: 'boolean' },
  
  // Dining
  openConcept: { label: 'Open Concept', type: 'boolean' },
  
  // Utility
  appliances: { label: 'Appliances', type: 'array' },
  storage: { label: 'Storage', type: 'boolean' },
  sink: { label: 'Sink', type: 'boolean' },
  plumbing: { label: 'Plumbing', type: 'boolean' },
  
  // Additional toilet
  guestCloakroom: { label: 'Guest Cloakroom', type: 'boolean' },
  
  // Energy arrays
  primaryHeatingType: { label: 'Primary Heating', type: 'array' },
  secondaryHeatingType: { label: 'Secondary Heating', type: 'array' },
  boilerType: { label: 'Boiler Type', type: 'string' },
  hotWaterSource: { label: 'Hot Water Source', type: 'string' },
  renewables: { label: 'Renewables', type: 'array' },
  connectedUtilities: { label: 'Connected Utilities', type: 'array' },
  broadbandType: { label: 'Broadband Type', type: 'string' },
  fullFibreAvailable: { label: 'Full Fibre Available', type: 'boolean' }
}

// Skip fields that are not user-facing
const SKIP_FIELDS = new Set([
  'id', 'propertyId', 'createdAt', 'updatedAt', 'userId', 'estateAgentId', 
  'addressId', 'propertyTypeId', 'propertyClassificationId'
])

/**
 * Format enum values to be human-readable
 */
function formatEnumValue(value: string): string {
  if (value === 'NILL' || value === 'NULL') return ''
  
  return value
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
}

/**
 * Check if a value should be skipped (empty or NILL)
 */
function shouldSkipValue(value: any): boolean {
  if (value === null || value === undefined || value === '') return true
  if (typeof value === 'string' && (value === 'NILL' || value === 'NULL')) return true
  if (Array.isArray(value) && value.length === 0) return true
  if (Array.isArray(value) && value.every(v => v === 'NILL' || v === 'NULL')) return true
  return false
}

/**
 * Generate field definitions dynamically from actual data
 */
export function generateFieldsFromData(data: any): FieldConfig[] {
  if (!data || typeof data !== 'object') return []
  
  const fields: FieldConfig[] = []
  
  for (const [key, value] of Object.entries(data)) {
    // Skip internal fields
    if (SKIP_FIELDS.has(key)) continue
    
    // Skip empty or NILL values
    if (shouldSkipValue(value)) continue
    
    // Get metadata for this field
    const metadata = FIELD_METADATA[key] || {}
    
    // Auto-detect type if not specified
    let type = metadata.type
    if (!type) {
      if (Array.isArray(value)) {
        type = 'array'
      } else if (typeof value === 'boolean') {
        type = 'boolean'
      } else if (typeof value === 'number') {
        type = 'number'
      } else if (typeof value === 'string' && value.includes('T') && value.includes('Z')) {
        type = 'date'
      } else {
        type = 'string'
      }
    }
    
    // Generate human-readable label if not specified
    const label = metadata.label || key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())
    
    // Create formatter that handles enums
    let formatter = metadata.formatter
    if (!formatter) {
      if (type === 'array') {
        formatter = (arr: any[]) => {
          if (!Array.isArray(arr)) return ''
          return arr
            .filter(item => item !== 'NILL' && item !== 'NULL')
            .map(item => typeof item === 'string' ? formatEnumValue(item) : item)
            .join(', ')
        }
      } else if (type === 'string') {
        formatter = (str: string) => {
          if (typeof str !== 'string') return str
          // Check if it looks like an enum (all caps with underscores)
          if (/^[A-Z_]+$/.test(str)) {
            return formatEnumValue(str)
          }
          return str
        }
      }
    }
    
    fields.push({
      key,
      label,
      type,
      formatter,
      condition: metadata.condition,
      priority: metadata.priority || 50
    })
  }
  
  // Sort by priority, then alphabetically
  return fields.sort((a, b) => {
    if (a.priority !== b.priority) {
      return (a.priority || 50) - (b.priority || 50)
    }
    return a.label.localeCompare(b.label)
  })
}

/**
 * Generate fields for array data (multiple items)
 */
export function generateFieldsFromArray(data: any[]): FieldConfig[] {
  if (!Array.isArray(data) || data.length === 0) return []
  
  // Use first item as template, but check all items for field presence
  const allFields = new Set<string>()
  data.forEach(item => {
    if (item && typeof item === 'object') {
      Object.keys(item).forEach(key => allFields.add(key))
    }
  })
  
  // Generate fields based on first item structure
  const sampleItem = data[0]
  const fieldsFromSample = generateFieldsFromData(sampleItem)
  
  // Filter to only include fields that exist in the sample
  return fieldsFromSample.filter(field => allFields.has(field.key))
}

/**
 * Convenience function to generate fields from any data type
 */
export function generateDynamicFields(data: any): FieldConfig[] {
  if (Array.isArray(data)) {
    return generateFieldsFromArray(data)
  } else {
    return generateFieldsFromData(data)
  }
}