type TenureType = 'FREEHOLD' | 'LEASEHOLD' | 'COMMONHOLD' | 'SHARE_OF_FREEHOLD'

function getTenureType(type: TenureType): string
function getTenureType(type: unknown): null
function getTenureType(type: TenureType | unknown): string | null {
  if (type === 'FREEHOLD') return 'Freehold'
  if (type === 'LEASEHOLD') return 'Leasehold'
  if (type === 'COMMONHOLD') return 'Commonhold'
  if (type === 'SHARE_OF_FREEHOLD') return 'Share of freehold'

  return null
}

export { getTenureType }