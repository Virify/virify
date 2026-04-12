// Re-export arrays so existing imports from this file continue to work
export * from './images-to-seed.generated'

import {
  houseImages,
  gardenImages,
  bedroomImages,
  homeofficeImages,
  kitchenImages,
  diningroomImages,
  livingroomImages,
  bathroomImages,
  garageImages,
} from './images-to-seed.generated'

export const getAllImagesByRoom = () => ({
  house: houseImages,
  garden: gardenImages,
  bedroom: bedroomImages,
  homeoffice: homeofficeImages,
  kitchen: kitchenImages,
  diningroom: diningroomImages,
  livingroom: livingroomImages,
  bathroom: bathroomImages,
  garage: garageImages
})

export const getRequiredImages = () => {
  const images = getAllImagesByRoom()
  
  return {
    house: images.house[Math.floor(Math.random() * images.house.length)],
    garden: images.garden[Math.floor(Math.random() * images.garden.length)],
    bedroom: images.bedroom[Math.floor(Math.random() * images.bedroom.length)],
    homeoffice: images.homeoffice[Math.floor(Math.random() * images.homeoffice.length)],
    kitchen: images.kitchen[Math.floor(Math.random() * images.kitchen.length)],
    diningroom: images.diningroom[Math.floor(Math.random() * images.diningroom.length)]
  }
}

export const getRandomAdditionalImages = (count: number, exclude: string[]) => {
  const allImages = Object.values(getAllImagesByRoom()).flat()
  const availableImages = allImages.filter(img => !exclude.includes(img))
  
  const shuffled = availableImages.sort(() => 0.5 - Math.random())
  return shuffled.slice(0, count)
}