type PropertyTypeRecord = {
  defaultSelected: boolean
  classifications: string[]
}

type PropertyTypeStore = {
  findFirst(args: { where: { name: string } }): Promise<{ id: number, defaultSelected: boolean } | null>
  create(args: {
    data: {
      name: string
      defaultSelected: boolean
      classifications: {
        create: { name: string }[]
      }
    }
  }): Promise<unknown>
  update(args: {
    where: { id: number }
    data: { defaultSelected: boolean }
  }): Promise<unknown>
}

type PropertyTypePrismaLike = {
  propertyType: PropertyTypeStore
}

export const PROPERTY_TYPES: Record<string, PropertyTypeRecord> = {
  House: {
    defaultSelected: true,
    classifications: ['Terraced', 'Detached', 'Semi-detached', 'End of Terrace', 'Mansion'],
  },
  Cottage: {
    defaultSelected: true,
    classifications: ['Terraced', 'Detached', 'Semi-detached', 'End of Terrace'],
  },
  Bungalow: {
    defaultSelected: false,
    classifications: ['Terraced', 'Detached', 'Semi-detached', 'End of Terrace'],
  },
  Flat: {
    defaultSelected: true,
    classifications: ['Converted', 'Studio', 'Maisonette', 'High-rise', 'Within a Complex', 'Penthouse'],
  },
  Land: {
    defaultSelected: false,
    classifications: ['Residential', 'Commercial', 'Agricultural', 'Development Plot', 'Development Potential'],
  },
  Farms: {
    defaultSelected: false,
    classifications: ['Non-working', 'Working', 'Small Holding'],
  },
  Specialty: {
    defaultSelected: false,
    classifications: ['Retirement Home', 'New Build Home'],
  },
  'Student Accommodation': {
    defaultSelected: false,
    classifications: ['Flat', 'House', 'House-share'],
  },
}

export async function seedPropertyTypes(prisma: PropertyTypePrismaLike) {
  for (const [typeName, config] of Object.entries(PROPERTY_TYPES)) {
    const { defaultSelected, classifications } = config
    const existingType = await prisma.propertyType.findFirst({
      where: { name: typeName },
    })

    if (!existingType) {
      await prisma.propertyType.create({
        data: {
          name: typeName,
          defaultSelected,
          classifications: {
            create: classifications.map(name => ({ name })),
          },
        },
      })
      console.log(`✅ Seeded property type '${typeName}'.`)
      continue
    }

    if (existingType.defaultSelected !== defaultSelected) {
      await prisma.propertyType.update({
        where: { id: existingType.id },
        data: { defaultSelected },
      })
      console.log(`✅ Updated defaultSelected for property type '${typeName}' to ${defaultSelected}.`)
    }
  }
}
