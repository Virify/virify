export const houseImages = [
  'a08cd2c3-6cd8-4a42-aa4e-68e0d4160800',
  'd451972a-61ee-4153-87b5-7697a4c0dc00', 
  '6c48e550-09ea-4b56-fb5f-6d9268cd3500',
  'd0f1451c-5944-431d-8b40-583622460f00'
]

export const gardenImages = [
  '1591debc-71cc-4ffd-6ef2-f9d6ac404400',
  '55957534-6202-4033-361b-f67b7fd89000'
]

export const bedroomImages = [
  '97774d3c-da7b-4088-fc2e-c773d4436800',
  '9ef289b1-e2cf-4e70-a1e3-1ca4beba4f00',
  'e589761d-9b78-4f8f-a5d0-c81dbe97e700'
]

export const homeofficeImages = [
  '00263fad-70a3-41e0-83d5-5aa8b83a3500',
  'b0bbd0f9-05be-427d-8835-cff29cb19c00',
  'baa60ea5-5a77-42b5-c954-840afa6c0300'
]

export const kitchenImages = [
  'd181f96f-be34-4e99-2095-eb7319827900',
  '77d357a1-9439-4510-82e2-c0717b853100',
  '89c3c9ff-68cb-4359-0610-346ba6bbd800'
]

export const diningroomImages = [
  '8ca273d5-1c19-410c-5a6a-ae4c46626200',
  '0ba57463-d707-4914-8370-eeaad9efb700',
  '792b6525-3036-4fe7-6972-ee6219cc0900'
]

export const livingroomImages = [
  'f08471ae-a51d-4a43-9632-7a193b129500',
  'f7552b9d-fcaa-4688-cfc6-e7f66910fe00'
]

export const bathroomImages = [
  'afe7c3a4-e948-40f9-314c-8f861d1c9300',
  '5a85c20c-7c37-44c6-ab91-1b38b29a7a00',
  '93002c6a-f156-47d8-8871-433048073200',
  '51972637-4e53-48d5-b11f-5eedb66f7000'
]

export const garageImages = [
  'ab8f7e9e-35d3-4264-8517-e3b9c2062200',
  '479fd527-0e2e-476f-1445-957e70333900'
]

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