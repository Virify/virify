import { formatSearchResults } from '../../shared/utils/format-search-results'

const data = [
  {
    "id": 5,
    "price": 256850.02,
    "moveInDate": "2027-01-14T05:50:46.481Z",
    "listingTier": "BASIC",
    "listingStartDate": "2026-01-19T11:13:38.185Z",
    "listingEndDate": "2026-03-13T05:17:36.811Z",
    "viewingOptions": "guest petticoat verbally international boohoo chime reproach duh reckless speedily",
    "verificationLevel": "UNVERIFIED",
    "userId": 1,
    "propertyId": 4,
    "estateAgentId": null,
    "publishedAt": "2026-01-16T11:55:28.374Z",
    "published": true,
    "createdAt": "2026-01-19T11:13:38.214Z",
    "updatedAt": "2026-01-19T11:13:38.214Z",
    "archived": false,
    "archivedAt": null,
    "rentalListing": null,
    "saleListing": {
      "id": 3,
      "listingId": 5,
      "tenureType": "COMMONHOLD",
      "chain": true,
      "sharedOwnership": true,
      "priceType": "OFFERS_OVER",
      "availabilityStatus": "UNDER_OFFER",
      "draftListingId": null
    },
    "property": {
      "id": 4,
      "description": "ha late horn nerve solidly oof numb yahoo minister ample than what beyond geez versus forenenst when knotty where brr",
      "value": 189029.89,
      "size": 447,
      "yearBuilt": "2025",
      "chainFree": true,
      "vacant": false,
      "constructionType": "NON_STANDARD",
      "floorLevel": null,
      "totalFloors": 5,
      "numberBedrooms": 4,
      "numberBathrooms": 2,
      "numberReceptions": 2,
      "numberOtherRooms": 2,
      "numberKitchens": 1,
      "createdAt": "2026-01-19T11:12:45.002Z",
      "updatedAt": "2026-01-19T11:12:45.002Z",
      "addressId": 13,
      "userId": 1,
      "estateAgentId": null,
      "propertyTypeId": 3,
      "propertyClassificationId": 13,
      "address": {
        "id": 13,
        "number": "53",
        "flat": null,
        "name": null,
        "street": "Clifton Street",
        "city": "Cardiff",
        "postcode": "CF24 1LS",
        "country": null,
        "locality": null,
        "county": null,
        "district": null,
        "fullAddress": "53, Clifton Street, Cardiff, CF24 1LS",
        "lat": 51.485421,
        "lon": -3.157762,
        "createdAt": "2026-01-19T11:12:45.002Z",
        "updatedAt": "2026-01-19T11:12:45.002Z"
      },
      "media": [
        {
          "id": 39,
          "image": "a08cd2c3-6cd8-4a42-aa4e-68e0d4160800",
          "videoTour": null,
          "floorPlan": null,
          "metadata": "{\"alt\":\"Exterior - status uh-huh enchanted\",\"description\":\"however integer aha amongst rebel\",\"roomType\":\"Exterior\",\"cloudflareImageId\":\"a08cd2c3-6cd8-4a42-aa4e-68e0d4160800\"}",
          "propertyId": 4,
          "sortOrder": 0,
          "createdAt": "2026-01-19T11:12:58.464Z",
          "updatedAt": "2026-01-19T11:12:58.464Z",
          "bedroomId": null,
          "bathroomId": null,
          "receptionId": null,
          "otherRoomId": null,
          "kitchenId": null,
          "gardenId": null,
          "outdoorSpaceId": null,
          "landId": null,
          "yardId": null
        },
        {
          "id": 40,
          "image": "1591debc-71cc-4ffd-6ef2-f9d6ac404400",
          "videoTour": null,
          "floorPlan": null,
          "metadata": "{\"alt\":\"Garden - apropos silky unless\",\"description\":\"iridescence preregister frozen provided crowded\",\"roomType\":\"Garden\",\"cloudflareImageId\":\"1591debc-71cc-4ffd-6ef2-f9d6ac404400\"}",
          "propertyId": 4,
          "sortOrder": 0,
          "createdAt": "2026-01-19T11:12:58.464Z",
          "updatedAt": "2026-01-19T11:12:58.464Z",
          "bedroomId": null,
          "bathroomId": null,
          "receptionId": null,
          "otherRoomId": null,
          "kitchenId": null,
          "gardenId": null,
          "outdoorSpaceId": null,
          "landId": null,
          "yardId": null
        },
        {
          "id": 41,
          "image": "792b6525-3036-4fe7-6972-ee6219cc0900",
          "videoTour": null,
          "floorPlan": null,
          "metadata": "{\"alt\":\"Dining Room\",\"description\":\"given barring once shaft behind\",\"roomType\":\"Dining Room\",\"cloudflareImageId\":\"792b6525-3036-4fe7-6972-ee6219cc0900\"}",
          "propertyId": 4,
          "sortOrder": 0,
          "createdAt": "2026-01-19T11:12:58.464Z",
          "updatedAt": "2026-01-19T11:12:58.464Z",
          "bedroomId": null,
          "bathroomId": null,
          "receptionId": null,
          "otherRoomId": null,
          "kitchenId": null,
          "gardenId": null,
          "outdoorSpaceId": null,
          "landId": null,
          "yardId": null
        },
        {
          "id": 42,
          "image": "b0bbd0f9-05be-427d-8835-cff29cb19c00",
          "videoTour": null,
          "floorPlan": null,
          "metadata": "{\"alt\":\"Home Office\",\"description\":\"jaggedly if mechanically gosh pity\",\"roomType\":\"Home Office\",\"cloudflareImageId\":\"b0bbd0f9-05be-427d-8835-cff29cb19c00\"}",
          "propertyId": 4,
          "sortOrder": 0,
          "createdAt": "2026-01-19T11:12:58.464Z",
          "updatedAt": "2026-01-19T11:12:58.464Z",
          "bedroomId": null,
          "bathroomId": null,
          "receptionId": null,
          "otherRoomId": null,
          "kitchenId": null,
          "gardenId": null,
          "outdoorSpaceId": null,
          "landId": null,
          "yardId": null
        },
        {
          "id": 43,
          "image": "e589761d-9b78-4f8f-a5d0-c81dbe97e700",
          "videoTour": null,
          "floorPlan": null,
          "metadata": "{\"alt\":\"Bedroom 1\",\"description\":\"partially moisten absentmindedly even whoever\",\"roomType\":\"Bedroom 1\",\"cloudflareImageId\":\"e589761d-9b78-4f8f-a5d0-c81dbe97e700\"}",
          "propertyId": 4,
          "sortOrder": 0,
          "createdAt": "2026-01-19T11:12:58.464Z",
          "updatedAt": "2026-01-19T11:12:58.464Z",
          "bedroomId": 1,
          "bathroomId": null,
          "receptionId": null,
          "otherRoomId": null,
          "kitchenId": null,
          "gardenId": null,
          "outdoorSpaceId": null,
          "landId": null,
          "yardId": null
        }
      ],
      "type": {
        "id": 3,
        "name": "Bungalow",
        "defaultSelected": true
      },
      "classification": {
        "id": 13,
        "name": "End of Terrace",
        "categoryId": 3
      },
      "bedroomFeatures": [
        {
          "id": 1,
          "roomNumber": 1,
          "name": "Spare Bedroom",
          "bed": [
            "SINGLE"
          ],
          "floor": 2,
          "description": "skeleton fondly which lively plain why though disappointment swift aha",
          "features": [
            "BUILT_IN_STORAGE",
            "BALCONY",
            "PATIO_DOORS",
            "BUILT_IN_DESK"
          ],
          "size": 36,
          "propertyId": 4,
          "createdAt": "2026-01-19T11:12:45.002Z",
          "updatedAt": "2026-01-19T11:12:45.002Z",
          "media": [
            {
              "id": 43,
              "image": "e589761d-9b78-4f8f-a5d0-c81dbe97e700",
              "videoTour": null,
              "floorPlan": null,
              "metadata": "{\"alt\":\"Bedroom 1\",\"description\":\"partially moisten absentmindedly even whoever\",\"roomType\":\"Bedroom 1\",\"cloudflareImageId\":\"e589761d-9b78-4f8f-a5d0-c81dbe97e700\"}",
              "propertyId": 4,
              "sortOrder": 0,
              "createdAt": "2026-01-19T11:12:58.464Z",
              "updatedAt": "2026-01-19T11:12:58.464Z",
              "bedroomId": 1,
              "bathroomId": null,
              "receptionId": null,
              "otherRoomId": null,
              "kitchenId": null,
              "gardenId": null,
              "outdoorSpaceId": null,
              "landId": null,
              "yardId": null
            }
          ]
        },
        {
          "id": 3,
          "roomNumber": 2,
          "name": "Spare Bedroom",
          "bed": [
            "SUPER_KING"
          ],
          "floor": 4,
          "description": "blah avow provided fiddle however fantastic silver yahoo catalog ha",
          "features": [
            "EN_SUITE",
            "BAY_WINDOW",
            "BALCONY",
            "PATIO_DOORS",
            "BUILT_IN_DESK"
          ],
          "size": 13,
          "propertyId": 4,
          "createdAt": "2026-01-19T11:12:45.002Z",
          "updatedAt": "2026-01-19T11:12:45.002Z",
          "media": []
        },
        {
          "id": 4,
          "roomNumber": 3,
          "name": "Nursery",
          "bed": [
            "SINGLE"
          ],
          "floor": 1,
          "description": "knowingly for insistent before odd untidy courageously how barring flowery",
          "features": [
            "BAY_WINDOW",
            "BUILT_IN_DESK"
          ],
          "size": 44,
          "propertyId": 4,
          "createdAt": "2026-01-19T11:12:45.002Z",
          "updatedAt": "2026-01-19T11:12:45.002Z",
          "media": []
        },
        {
          "id": 5,
          "roomNumber": 4,
          "name": "Teenager's Bedroom",
          "bed": [
            "KING"
          ],
          "floor": 2,
          "description": "gee oily ew appropriate how institutionalize sans concerning declaration if",
          "features": [
            "WALK_IN_WARDROBE",
            "BAY_WINDOW"
          ],
          "size": 49,
          "propertyId": 4,
          "createdAt": "2026-01-19T11:12:45.002Z",
          "updatedAt": "2026-01-19T11:12:45.002Z",
          "media": []
        }
      ],
      "bathroomFeatures": [
        {
          "id": 1,
          "roomNumber": 1,
          "floor": 0,
          "name": "Powder Room",
          "features": [
            "TOILET",
            "BATHTUB"
          ],
          "description": "dimly failing sternly legal obediently pace meanwhile disposer guard blah",
          "size": 44,
          "propertyId": 4,
          "createdAt": "2026-01-19T11:12:45.002Z",
          "updatedAt": "2026-01-19T11:12:45.002Z",
          "media": []
        },
        {
          "id": 4,
          "roomNumber": 2,
          "floor": 5,
          "name": "Shared Bathroom",
          "features": [
            "EN_SUITE",
            "BATHTUB",
            "WALK_IN_SHOWER"
          ],
          "description": "dearly meatloaf ouch vibraphone parade pish meh equally defrag outgoing",
          "size": 44,
          "propertyId": 4,
          "createdAt": "2026-01-19T11:12:45.002Z",
          "updatedAt": "2026-01-19T11:12:45.002Z",
          "media": []
        }
      ],
      "otherRoom": [
        {
          "id": 4,
          "roomNumber": 1,
          "floor": 2,
          "name": "madly psst",
          "type": "GYM",
          "description": "sunder questionably next whoa repeatedly yippee behind whoa unhappy meanwhile",
          "size": 49,
          "features": [
            "OPEN_PLAN",
            "OPEN_CONCEPT",
            "BAY_WINDOW",
            "SERVING_HATCH",
            "BAR_AREA",
            "SOUND_PROOFING",
            "ACCOUSTIC_PANELS",
            "STONE_FLOORING"
          ],
          "propertyId": 4,
          "createdAt": "2026-01-19T11:12:45.002Z",
          "updatedAt": "2026-01-19T11:12:45.002Z",
          "media": []
        },
        {
          "id": 5,
          "roomNumber": 2,
          "floor": 4,
          "name": "however tabulate",
          "type": "OFFICE",
          "description": "contravene menacing oof bliss ouch vary destock hence nervously dishonor",
          "size": 39,
          "features": [
            "OPEN_CONCEPT",
            "BALCONY",
            "HAS_VIEW",
            "BUILT_IN_STORAGE",
            "BAR_AREA",
            "ACCOUSTIC_PANELS",
            "HARDWOOD_FLOORING"
          ],
          "propertyId": 4,
          "createdAt": "2026-01-19T11:12:45.002Z",
          "updatedAt": "2026-01-19T11:12:45.002Z",
          "media": []
        }
      ],
      "parking": {
        "id": 3,
        "description": "drag zowie ugh along elderly but randomize shell finally hmph",
        "features": [
          "DRIVEWAY",
          "ON_STREET",
          "CARPORT"
        ],
        "propertyId": 4,
        "createdAt": "2026-01-19T11:12:45.002Z",
        "updatedAt": "2026-01-19T11:12:45.002Z"
      },
      "amenities": [
        {
          "id": 1,
          "type": "EDUCATION",
          "subtype": "SCHOOL",
          "name": "Lemke - Swift School",
          "distanceM": 5430,
          "description": null,
          "location": null,
          "propertyId": 4,
          "createdAt": "2026-01-19T11:12:45.002Z"
        },
        {
          "id": 2,
          "type": "EDUCATION",
          "subtype": "SCHOOL",
          "name": "Herzog Group School",
          "distanceM": 5816,
          "description": null,
          "location": null,
          "propertyId": 4,
          "createdAt": "2026-01-19T11:12:45.002Z"
        },
        {
          "id": 3,
          "type": "EDUCATION",
          "subtype": "SCHOOL",
          "name": "Bogisich LLC School",
          "distanceM": 1913,
          "description": null,
          "location": null,
          "propertyId": 4,
          "createdAt": "2026-01-19T11:12:45.002Z"
        },
        {
          "id": 4,
          "type": "HEALTHCARE",
          "subtype": "HOSPITAL",
          "name": "Wintheiser LLC Hospital",
          "distanceM": 260,
          "description": null,
          "location": null,
          "propertyId": 4,
          "createdAt": "2026-01-19T11:12:45.002Z"
        },
        {
          "id": 5,
          "type": "HEALTHCARE",
          "subtype": "HOSPITAL",
          "name": "Beer - Lowe Hospital",
          "distanceM": 2163,
          "description": null,
          "location": null,
          "propertyId": 4,
          "createdAt": "2026-01-19T11:12:45.002Z"
        },
        {
          "id": 6,
          "type": "HEALTHCARE",
          "subtype": "HOSPITAL",
          "name": "Schulist - Morissette Hospital",
          "distanceM": 218,
          "description": null,
          "location": null,
          "propertyId": 4,
          "createdAt": "2026-01-19T11:12:45.002Z"
        },
        {
          "id": 7,
          "type": "TRANSPORT",
          "subtype": "TRAIN_STATION",
          "name": "Luisfurt Train Station",
          "distanceM": 6154,
          "description": null,
          "location": null,
          "propertyId": 4,
          "createdAt": "2026-01-19T11:12:45.002Z"
        },
        {
          "id": 8,
          "type": "TRANSPORT",
          "subtype": "TRAIN_STATION",
          "name": "North Nicoletteworth Train Station",
          "distanceM": 484,
          "description": null,
          "location": null,
          "propertyId": 4,
          "createdAt": "2026-01-19T11:12:45.002Z"
        },
        {
          "id": 9,
          "type": "TRANSPORT",
          "subtype": "TRAIN_STATION",
          "name": "South Devontown Train Station",
          "distanceM": 2275,
          "description": null,
          "location": null,
          "propertyId": 4,
          "createdAt": "2026-01-19T11:12:45.002Z"
        },
        {
          "id": 10,
          "type": "TRANSPORT",
          "subtype": "BUS_STOP",
          "name": "Prosacco Heights Bus Stop",
          "distanceM": 4905,
          "description": null,
          "location": null,
          "propertyId": 4,
          "createdAt": "2026-01-19T11:12:45.002Z"
        },
        {
          "id": 11,
          "type": "TRANSPORT",
          "subtype": "BUS_STOP",
          "name": "Dorcas Field Bus Stop",
          "distanceM": 6461,
          "description": null,
          "location": null,
          "propertyId": 4,
          "createdAt": "2026-01-19T11:12:45.002Z"
        },
        {
          "id": 12,
          "type": "TRANSPORT",
          "subtype": "BUS_STOP",
          "name": "Kingsway Bus Stop",
          "distanceM": 3171,
          "description": null,
          "location": null,
          "propertyId": 4,
          "createdAt": "2026-01-19T11:12:45.002Z"
        },
        {
          "id": 13,
          "type": "GREEN_SPACE",
          "subtype": "PARK",
          "name": "Port Josephine Park",
          "distanceM": 253,
          "description": null,
          "location": null,
          "propertyId": 4,
          "createdAt": "2026-01-19T11:12:45.002Z"
        },
        {
          "id": 14,
          "type": "GREEN_SPACE",
          "subtype": "PARK",
          "name": "Ursulaland Park",
          "distanceM": 7160,
          "description": null,
          "location": null,
          "propertyId": 4,
          "createdAt": "2026-01-19T11:12:45.002Z"
        },
        {
          "id": 15,
          "type": "GREEN_SPACE",
          "subtype": "PARK",
          "name": "Altoona Park",
          "distanceM": 6311,
          "description": null,
          "location": null,
          "propertyId": 4,
          "createdAt": "2026-01-19T11:12:45.002Z"
        },
        {
          "id": 16,
          "type": "SHOPPING_ENTERTAINMENT",
          "subtype": "GYM",
          "name": "Lang - Will Gym",
          "distanceM": 8498,
          "description": null,
          "location": null,
          "propertyId": 4,
          "createdAt": "2026-01-19T11:12:45.002Z"
        },
        {
          "id": 17,
          "type": "SHOPPING_ENTERTAINMENT",
          "subtype": "GYM",
          "name": "Lindgren, Connelly and Mayert Gym",
          "distanceM": 2741,
          "description": null,
          "location": null,
          "propertyId": 4,
          "createdAt": "2026-01-19T11:12:45.002Z"
        },
        {
          "id": 18,
          "type": "SHOPPING_ENTERTAINMENT",
          "subtype": "GYM",
          "name": "Green LLC Gym",
          "distanceM": 730,
          "description": null,
          "location": null,
          "propertyId": 4,
          "createdAt": "2026-01-19T11:12:45.002Z"
        }
      ],
      "additionalFeatures": {
        "id": 1,
        "description": "once gymnast than upon fooey ick when intently trained ugh",
        "petFriendly": false,
        "moveInDate": "2026-10-23T08:12:36.010Z",
        "features": [
          "INTERNET",
          "CONCIERGE",
          "SHOP"
        ],
        "propertyId": 4,
        "createdAt": "2026-01-19T11:12:45.002Z",
        "updatedAt": "2026-01-19T11:12:45.002Z"
      },
      "accessibilityFeatures": {
        "id": 1,
        "description": "tight lasting hence whose sport always but aw huzzah er",
        "features": [
          "STAIRS",
          "ACCESSIBLE_PARKING"
        ],
        "propertyId": 4,
        "createdAt": "2026-01-19T11:12:45.002Z",
        "updatedAt": "2026-01-19T11:12:45.002Z"
      },
      "kitchenFeatures": [
        {
          "id": 2,
          "roomNumber": 1,
          "floor": 3,
          "name": "reproach beneath",
          "features": [
            "MODERN",
            "OPEN_PLAN",
            "ISLAND",
            "UTILITY_ACCESS"
          ],
          "description": "woot average through squiggly versus after husky worth duh when",
          "size": 46,
          "propertyId": 4,
          "createdAt": "2026-01-19T11:12:45.002Z",
          "updatedAt": "2026-01-19T11:12:45.002Z",
          "media": []
        }
      ],
      "reception": [
        {
          "id": 4,
          "roomNumber": 1,
          "floor": 4,
          "name": "fledgling table",
          "type": "GAMES_ROOM",
          "description": "notwithstanding off consequently accredit greatly pace towards joint although muted",
          "size": 36,
          "features": [
            "OPEN_PLAN",
            "OPEN_CONCEPT",
            "BALCONY",
            "BAY_WINDOW",
            "PATIO_DOORS",
            "SERVING_HATCH",
            "BAR_AREA",
            "ACCOUSTIC_PANELS",
            "HARDWOOD_FLOORING"
          ],
          "propertyId": 4,
          "createdAt": "2026-01-19T11:12:45.002Z",
          "updatedAt": "2026-01-19T11:12:45.002Z",
          "media": []
        },
        {
          "id": 5,
          "roomNumber": 2,
          "floor": 2,
          "name": "comestible vice",
          "type": "GAMES_ROOM",
          "description": "yum inspect urban on hmph wetly too minus republican since",
          "size": 35,
          "features": [
            "BUILT_IN_SHELVING",
            "HAS_VIEW",
            "BUILT_IN_STORAGE",
            "CONSERVATORY"
          ],
          "propertyId": 4,
          "createdAt": "2026-01-19T11:12:45.002Z",
          "updatedAt": "2026-01-19T11:12:45.002Z",
          "media": []
        }
      ],
      "utility": {
        "id": 2,
        "description": "cutlet schnitzel cute sternly gulp than shiny among bungalow near",
        "features": [
          "SINK",
          "PLUMBING"
        ],
        "size": 6.545317043441095,
        "propertyId": 4,
        "createdAt": "2026-01-19T11:12:45.002Z",
        "updatedAt": "2026-01-19T11:12:45.002Z"
      },
      "outdoorSpace": {
        "id": 1,
        "description": "out considering quinoa sharply nun trivial provided blah within captain",
        "totalArea": 864.12,
        "features": [
          "TERRACE",
          "SEPARATE_PARCEL",
          "GARDEN_OFFICE"
        ],
        "propertyId": 4,
        "createdAt": "2026-01-19T11:12:45.002Z",
        "updatedAt": "2026-01-19T11:12:45.002Z",
        "yard": [
          {
            "id": 1,
            "description": "definite pfft fold blah unexpectedly afore whoever waltz wherever given",
            "name": "Front Yard",
            "size": 118.76,
            "additionalDetails": true,
            "facing": "EAST",
            "position": "FRONT",
            "features": [
              "PATIO"
            ],
            "createdAt": "2026-01-19T11:12:45.002Z",
            "updatedAt": "2026-01-19T11:12:45.002Z",
            "outdoorSpaceId": 1,
            "media": []
          },
          {
            "id": 2,
            "description": null,
            "name": "Side Yard",
            "size": 128.96,
            "additionalDetails": false,
            "facing": "EAST",
            "position": "SIDE",
            "features": [],
            "createdAt": "2026-01-19T11:12:45.002Z",
            "updatedAt": "2026-01-19T11:12:45.002Z",
            "outdoorSpaceId": 1,
            "media": []
          }
        ],
        "garden": [
          {
            "id": 1,
            "description": "annex splay mmm piglet nor whereas formal outdo hairy manner",
            "name": "Front Garden",
            "size": 33.71,
            "additionalDetails": true,
            "facing": "WEST",
            "position": "FRONT",
            "features": [],
            "createdAt": "2026-01-19T11:12:45.002Z",
            "updatedAt": "2026-01-19T11:12:45.002Z",
            "outdoorSpaceId": 1,
            "media": []
          },
          {
            "id": 2,
            "description": "incidentally unlined badly boo that prime ew entomb phooey scrape",
            "name": "Rear Garden",
            "size": 17.95,
            "additionalDetails": true,
            "facing": "NORTH",
            "position": "REAR",
            "features": [
              "SHED",
              "SUMMER_HOUSE"
            ],
            "createdAt": "2026-01-19T11:12:45.002Z",
            "updatedAt": "2026-01-19T11:12:45.002Z",
            "outdoorSpaceId": 1,
            "media": []
          }
        ],
        "land": [
          {
            "id": 1,
            "description": null,
            "additionalDetails": false,
            "size": 236.78,
            "name": "Field",
            "separateParcel": false,
            "features": [],
            "createdAt": "2026-01-19T11:12:45.002Z",
            "updatedAt": "2026-01-19T11:12:45.002Z",
            "outdoorSpaceId": 1,
            "media": []
          },
          {
            "id": 2,
            "description": "astride sprinkles yum drug a agreeable or caring afterwards zowie",
            "additionalDetails": true,
            "size": 327.96,
            "name": "Orchard",
            "separateParcel": true,
            "features": [
              "WOODLAND",
              "POND",
              "OUTBUILDING"
            ],
            "createdAt": "2026-01-19T11:12:45.002Z",
            "updatedAt": "2026-01-19T11:12:45.002Z",
            "outdoorSpaceId": 1,
            "media": []
          }
        ],
        "media": []
      },
      "energyAndUtilities": {
        "id": 3,
        "propertyId": 4,
        "description": "developmental before unwieldy ack seldom tuxedo swing wholly destock between",
        "epcRating": "A",
        "epcCertificateUrl": "https://austere-bidet.net",
        "primaryHeatingType": [
          "ELECTRIC",
          "PASSIVE"
        ],
        "secondaryHeatingType": [
          "PASSIVE",
          "HEAT_PUMP"
        ],
        "boilerType": "BACK_BOILER",
        "hotWaterSource": "HEAT_PUMP",
        "renewables": [
          "BATTERY_STORAGE",
          "SMART_METER"
        ],
        "connectedUtilities": [
          "GAS",
          "CESSPIT"
        ],
        "broadbandType": "CABLE",
        "fullFibreAvailable": false,
        "maxDownloadSpeedMbps": 869,
        "createdAt": "2026-01-19T11:12:45.002Z",
        "updatedAt": "2026-01-19T11:12:45.002Z"
      },
      "securityFeatures": {
        "id": 3,
        "description": "orange times cease silently as after alongside mid modulo who trusty classic swing triangular whoever",
        "features": [
          "SECURITY"
        ],
        "propertyId": 4,
        "createdAt": "2026-01-19T11:12:45.002Z",
        "updatedAt": "2026-01-19T11:12:45.002Z"
      },
      "storageFeatures": {
        "id": 4,
        "description": "because reporter valentine likewise absent bright minister voluminous than amid godparent until yin before readjust candid whoa when into frightfully",
        "features": [
          "UNDER_STAIRS_STORAGE"
        ],
        "propertyId": 4,
        "createdAt": "2026-01-19T11:12:45.002Z",
        "updatedAt": "2026-01-19T11:12:45.002Z"
      },
      "runningCosts": {
        "id": 3,
        "description": "beyond till feminize like past likewise certification evenly next unselfish roadway times highly seldom as",
        "councilTaxBand": "G",
        "serviceCharges": 260.05,
        "groundRent": 377.3,
        "propertyId": 4,
        "createdAt": "2026-01-19T11:12:45.002Z",
        "updatedAt": "2026-01-19T11:12:45.002Z"
      }
    },
    "user": {
      "id": 1,
      "username": "Virify",
      "email": "admin@virify.co.uk",
      "createdAt": "2026-01-19T11:12:43.934Z"
    },
    "listingType": "buy"
  },
  {
    "id": 19,
    "price": 386972.85,
    "moveInDate": "2026-02-09T12:48:29.858Z",
    "listingTier": "FEATURED",
    "listingStartDate": "2026-01-19T11:13:38.186Z",
    "listingEndDate": "2026-01-20T23:01:31.813Z",
    "viewingOptions": "loose accidentally optimal torn growing french priesthood duh aboard bonnet",
    "verificationLevel": "BASIC",
    "userId": 2,
    "propertyId": 19,
    "estateAgentId": null,
    "publishedAt": "2026-01-19T10:41:24.454Z",
    "published": true,
    "createdAt": "2026-01-19T11:13:38.221Z",
    "updatedAt": "2026-01-19T11:13:38.221Z",
    "archived": false,
    "archivedAt": null,
    "rentalListing": null,
    "saleListing": {
      "id": 7,
      "listingId": 19,
      "tenureType": "FREEHOLD",
      "chain": false,
      "sharedOwnership": false,
      "priceType": "OFFERS_OVER",
      "availabilityStatus": "AVAILABLE",
      "draftListingId": null
    },
    "property": {
      "id": 19,
      "description": "pigpen fondly optimistically phew neatly sweetly since strictly gah yahoo drat boom embarrassment including inconsequential scarcely likewise hm midst obscure",
      "value": 536892.1,
      "size": 181,
      "yearBuilt": "2025",
      "chainFree": true,
      "vacant": true,
      "constructionType": "STANDARD",
      "floorLevel": null,
      "totalFloors": 5,
      "numberBedrooms": 2,
      "numberBathrooms": 1,
      "numberReceptions": 1,
      "numberOtherRooms": 3,
      "numberKitchens": 1,
      "createdAt": "2026-01-19T11:12:45.066Z",
      "updatedAt": "2026-01-19T11:12:45.066Z",
      "addressId": 28,
      "userId": 1,
      "estateAgentId": null,
      "propertyTypeId": 1,
      "propertyClassificationId": 5,
      "address": {
        "id": 28,
        "number": "117",
        "flat": null,
        "name": null,
        "street": "Henke Court",
        "city": "Cardiff",
        "postcode": "CF10 4EJ",
        "country": null,
        "locality": null,
        "county": null,
        "district": null,
        "fullAddress": "117, Henke Court, Cardiff, CF10 4EJ",
        "lat": 51.470991,
        "lon": -3.164458,
        "createdAt": "2026-01-19T11:12:45.066Z",
        "updatedAt": "2026-01-19T11:12:45.066Z"
      },
      "media": [
        {
          "id": 124,
          "image": "6c48e550-09ea-4b56-fb5f-6d9268cd3500",
          "videoTour": null,
          "floorPlan": null,
          "metadata": "{\"alt\":\"Exterior - lazy as often\",\"description\":\"inexperienced but excepting gee provided\",\"roomType\":\"Exterior\",\"cloudflareImageId\":\"6c48e550-09ea-4b56-fb5f-6d9268cd3500\"}",
          "propertyId": 19,
          "sortOrder": 0,
          "createdAt": "2026-01-19T11:12:58.602Z",
          "updatedAt": "2026-01-19T11:12:58.602Z",
          "bedroomId": null,
          "bathroomId": null,
          "receptionId": null,
          "otherRoomId": null,
          "kitchenId": null,
          "gardenId": null,
          "outdoorSpaceId": null,
          "landId": null,
          "yardId": null
        },
        {
          "id": 125,
          "image": "55957534-6202-4033-361b-f67b7fd89000",
          "videoTour": null,
          "floorPlan": null,
          "metadata": "{\"alt\":\"Garden - discontinue despite whoever\",\"description\":\"before unless insistent meadow secularize\",\"roomType\":\"Garden\",\"cloudflareImageId\":\"55957534-6202-4033-361b-f67b7fd89000\"}",
          "propertyId": 19,
          "sortOrder": 0,
          "createdAt": "2026-01-19T11:12:58.602Z",
          "updatedAt": "2026-01-19T11:12:58.602Z",
          "bedroomId": null,
          "bathroomId": null,
          "receptionId": null,
          "otherRoomId": null,
          "kitchenId": null,
          "gardenId": null,
          "outdoorSpaceId": null,
          "landId": null,
          "yardId": null
        },
        {
          "id": 126,
          "image": "792b6525-3036-4fe7-6972-ee6219cc0900",
          "videoTour": null,
          "floorPlan": null,
          "metadata": "{\"alt\":\"Dining Room\",\"description\":\"finally nauseate christen bestride pace\",\"roomType\":\"Dining Room\",\"cloudflareImageId\":\"792b6525-3036-4fe7-6972-ee6219cc0900\"}",
          "propertyId": 19,
          "sortOrder": 0,
          "createdAt": "2026-01-19T11:12:58.602Z",
          "updatedAt": "2026-01-19T11:12:58.602Z",
          "bedroomId": null,
          "bathroomId": null,
          "receptionId": null,
          "otherRoomId": null,
          "kitchenId": null,
          "gardenId": null,
          "outdoorSpaceId": null,
          "landId": null,
          "yardId": null
        },
        {
          "id": 127,
          "image": "baa60ea5-5a77-42b5-c954-840afa6c0300",
          "videoTour": null,
          "floorPlan": null,
          "metadata": "{\"alt\":\"Home Office\",\"description\":\"gosh greedy consequently pine blissfully\",\"roomType\":\"Home Office\",\"cloudflareImageId\":\"baa60ea5-5a77-42b5-c954-840afa6c0300\"}",
          "propertyId": 19,
          "sortOrder": 0,
          "createdAt": "2026-01-19T11:12:58.602Z",
          "updatedAt": "2026-01-19T11:12:58.602Z",
          "bedroomId": null,
          "bathroomId": null,
          "receptionId": null,
          "otherRoomId": null,
          "kitchenId": null,
          "gardenId": null,
          "outdoorSpaceId": null,
          "landId": null,
          "yardId": null
        },
        {
          "id": 128,
          "image": "97774d3c-da7b-4088-fc2e-c773d4436800",
          "videoTour": null,
          "floorPlan": null,
          "metadata": "{\"alt\":\"Bedroom 1\",\"description\":\"improbable comb investigate to presell\",\"roomType\":\"Bedroom 1\",\"cloudflareImageId\":\"97774d3c-da7b-4088-fc2e-c773d4436800\"}",
          "propertyId": 19,
          "sortOrder": 0,
          "createdAt": "2026-01-19T11:12:58.602Z",
          "updatedAt": "2026-01-19T11:12:58.602Z",
          "bedroomId": 55,
          "bathroomId": null,
          "receptionId": null,
          "otherRoomId": null,
          "kitchenId": null,
          "gardenId": null,
          "outdoorSpaceId": null,
          "landId": null,
          "yardId": null
        },
        {
          "id": 129,
          "image": "97774d3c-da7b-4088-fc2e-c773d4436800",
          "videoTour": null,
          "floorPlan": null,
          "metadata": "{\"alt\":\"Bedroom 2 - filter anenst correctly\",\"description\":\"degrease warped blah yowza hmph\",\"roomType\":\"Bedroom 2\",\"cloudflareImageId\":\"97774d3c-da7b-4088-fc2e-c773d4436800\"}",
          "propertyId": 19,
          "sortOrder": 0,
          "createdAt": "2026-01-19T11:12:58.602Z",
          "updatedAt": "2026-01-19T11:12:58.602Z",
          "bedroomId": 56,
          "bathroomId": null,
          "receptionId": null,
          "otherRoomId": null,
          "kitchenId": null,
          "gardenId": null,
          "outdoorSpaceId": null,
          "landId": null,
          "yardId": null
        },
        {
          "id": 130,
          "image": "97774d3c-da7b-4088-fc2e-c773d4436800",
          "videoTour": null,
          "floorPlan": null,
          "metadata": "{\"alt\":\"Bedroom 2 - taut juggernaut oh\",\"description\":\"verve blah indeed tensely bitterly\",\"roomType\":\"Bedroom 2\",\"cloudflareImageId\":\"97774d3c-da7b-4088-fc2e-c773d4436800\"}",
          "propertyId": 19,
          "sortOrder": 0,
          "createdAt": "2026-01-19T11:12:58.602Z",
          "updatedAt": "2026-01-19T11:12:58.602Z",
          "bedroomId": 56,
          "bathroomId": null,
          "receptionId": null,
          "otherRoomId": null,
          "kitchenId": null,
          "gardenId": null,
          "outdoorSpaceId": null,
          "landId": null,
          "yardId": null
        },
        {
          "id": 131,
          "image": "77d357a1-9439-4510-82e2-c0717b853100",
          "videoTour": null,
          "floorPlan": null,
          "metadata": "{\"alt\":\"Kitchen 3 - offend after vice\",\"description\":\"why lumpy mmm wrongly midst\",\"roomType\":\"Kitchen 3\",\"cloudflareImageId\":\"77d357a1-9439-4510-82e2-c0717b853100\"}",
          "propertyId": 19,
          "sortOrder": 0,
          "createdAt": "2026-01-19T11:12:58.602Z",
          "updatedAt": "2026-01-19T11:12:58.602Z",
          "bedroomId": null,
          "bathroomId": null,
          "receptionId": null,
          "otherRoomId": null,
          "kitchenId": 40,
          "gardenId": null,
          "outdoorSpaceId": null,
          "landId": null,
          "yardId": null
        },
        {
          "id": 132,
          "image": "5a85c20c-7c37-44c6-ab91-1b38b29a7a00",
          "videoTour": null,
          "floorPlan": null,
          "metadata": "{\"alt\":\"Bathroom 1 - times over publication\",\"description\":\"team demonstrate or accurate sans\",\"roomType\":\"Bathroom 1\",\"cloudflareImageId\":\"5a85c20c-7c37-44c6-ab91-1b38b29a7a00\"}",
          "propertyId": 19,
          "sortOrder": 0,
          "createdAt": "2026-01-19T11:12:58.602Z",
          "updatedAt": "2026-01-19T11:12:58.602Z",
          "bedroomId": null,
          "bathroomId": 29,
          "receptionId": null,
          "otherRoomId": null,
          "kitchenId": null,
          "gardenId": null,
          "outdoorSpaceId": null,
          "landId": null,
          "yardId": null
        },
        {
          "id": 133,
          "image": "f08471ae-a51d-4a43-9632-7a193b129500",
          "videoTour": null,
          "floorPlan": null,
          "metadata": "{\"alt\":\"Reception 1 - midst supposing obligation\",\"description\":\"governance well-documented where because unless\",\"roomType\":\"Reception 1\",\"cloudflareImageId\":\"f08471ae-a51d-4a43-9632-7a193b129500\"}",
          "propertyId": 19,
          "sortOrder": 0,
          "createdAt": "2026-01-19T11:12:58.602Z",
          "updatedAt": "2026-01-19T11:12:58.602Z",
          "bedroomId": null,
          "bathroomId": null,
          "receptionId": 40,
          "otherRoomId": null,
          "kitchenId": null,
          "gardenId": null,
          "outdoorSpaceId": null,
          "landId": null,
          "yardId": null
        },
        {
          "id": 134,
          "image": "51972637-4e53-48d5-b11f-5eedb66f7000",
          "videoTour": null,
          "floorPlan": null,
          "metadata": "{\"alt\":\"Other Room 1 - boo instead furthermore\",\"description\":\"victoriously meanwhile regarding woot derby\",\"roomType\":\"Other Room 1\",\"cloudflareImageId\":\"51972637-4e53-48d5-b11f-5eedb66f7000\"}",
          "propertyId": 19,
          "sortOrder": 0,
          "createdAt": "2026-01-19T11:12:58.602Z",
          "updatedAt": "2026-01-19T11:12:58.602Z",
          "bedroomId": null,
          "bathroomId": null,
          "receptionId": null,
          "otherRoomId": 42,
          "kitchenId": null,
          "gardenId": null,
          "outdoorSpaceId": null,
          "landId": null,
          "yardId": null
        },
        {
          "id": 135,
          "image": "ab8f7e9e-35d3-4264-8517-e3b9c2062200",
          "videoTour": null,
          "floorPlan": null,
          "metadata": "{\"alt\":\"Other Room 1 - nudge apud hm\",\"description\":\"flat which hovercraft deployment pfft\",\"roomType\":\"Other Room 1\",\"cloudflareImageId\":\"ab8f7e9e-35d3-4264-8517-e3b9c2062200\"}",
          "propertyId": 19,
          "sortOrder": 0,
          "createdAt": "2026-01-19T11:12:58.602Z",
          "updatedAt": "2026-01-19T11:12:58.602Z",
          "bedroomId": null,
          "bathroomId": null,
          "receptionId": null,
          "otherRoomId": 42,
          "kitchenId": null,
          "gardenId": null,
          "outdoorSpaceId": null,
          "landId": null,
          "yardId": null
        },
        {
          "id": 136,
          "image": "baa60ea5-5a77-42b5-c954-840afa6c0300",
          "videoTour": null,
          "floorPlan": null,
          "metadata": "{\"alt\":\"Other Room 2 - under but programme\",\"description\":\"supportive weary meanwhile zowie violently\",\"roomType\":\"Other Room 2\",\"cloudflareImageId\":\"baa60ea5-5a77-42b5-c954-840afa6c0300\"}",
          "propertyId": 19,
          "sortOrder": 0,
          "createdAt": "2026-01-19T11:12:58.602Z",
          "updatedAt": "2026-01-19T11:12:58.602Z",
          "bedroomId": null,
          "bathroomId": null,
          "receptionId": null,
          "otherRoomId": 43,
          "kitchenId": null,
          "gardenId": null,
          "outdoorSpaceId": null,
          "landId": null,
          "yardId": null
        },
        {
          "id": 137,
          "image": "ab8f7e9e-35d3-4264-8517-e3b9c2062200",
          "videoTour": null,
          "floorPlan": null,
          "metadata": "{\"alt\":\"Other Room 3 - huzzah once ugh\",\"description\":\"meanwhile grubby excitedly masculinize upbeat\",\"roomType\":\"Other Room 3\",\"cloudflareImageId\":\"ab8f7e9e-35d3-4264-8517-e3b9c2062200\"}",
          "propertyId": 19,
          "sortOrder": 0,
          "createdAt": "2026-01-19T11:12:58.602Z",
          "updatedAt": "2026-01-19T11:12:58.602Z",
          "bedroomId": null,
          "bathroomId": null,
          "receptionId": null,
          "otherRoomId": 44,
          "kitchenId": null,
          "gardenId": null,
          "outdoorSpaceId": null,
          "landId": null,
          "yardId": null
        },
        {
          "id": 138,
          "image": "51972637-4e53-48d5-b11f-5eedb66f7000",
          "videoTour": null,
          "floorPlan": null,
          "metadata": "{\"alt\":\"Other Room 3 - um finally next\",\"description\":\"narrowcast what inasmuch even schnitzel\",\"roomType\":\"Other Room 3\",\"cloudflareImageId\":\"51972637-4e53-48d5-b11f-5eedb66f7000\"}",
          "propertyId": 19,
          "sortOrder": 0,
          "createdAt": "2026-01-19T11:12:58.602Z",
          "updatedAt": "2026-01-19T11:12:58.602Z",
          "bedroomId": null,
          "bathroomId": null,
          "receptionId": null,
          "otherRoomId": 44,
          "kitchenId": null,
          "gardenId": null,
          "outdoorSpaceId": null,
          "landId": null,
          "yardId": null
        }
      ],
      "type": {
        "id": 1,
        "name": "House",
        "defaultSelected": true
      },
      "classification": {
        "id": 5,
        "name": "Mansion",
        "categoryId": 1
      },
      "bedroomFeatures": [
        {
          "id": 55,
          "roomNumber": 1,
          "name": "Guest Bedroom",
          "bed": [
            "SINGLE"
          ],
          "floor": 4,
          "description": "till than correctly for cutover swine peony amidst pity graft",
          "features": [
            "BALCONY",
            "BUILT_IN_DESK"
          ],
          "size": 49,
          "propertyId": 19,
          "createdAt": "2026-01-19T11:12:45.066Z",
          "updatedAt": "2026-01-19T11:12:45.066Z",
          "media": [
            {
              "id": 128,
              "image": "97774d3c-da7b-4088-fc2e-c773d4436800",
              "videoTour": null,
              "floorPlan": null,
              "metadata": "{\"alt\":\"Bedroom 1\",\"description\":\"improbable comb investigate to presell\",\"roomType\":\"Bedroom 1\",\"cloudflareImageId\":\"97774d3c-da7b-4088-fc2e-c773d4436800\"}",
              "propertyId": 19,
              "sortOrder": 0,
              "createdAt": "2026-01-19T11:12:58.602Z",
              "updatedAt": "2026-01-19T11:12:58.602Z",
              "bedroomId": 55,
              "bathroomId": null,
              "receptionId": null,
              "otherRoomId": null,
              "kitchenId": null,
              "gardenId": null,
              "outdoorSpaceId": null,
              "landId": null,
              "yardId": null
            }
          ]
        },
        {
          "id": 56,
          "roomNumber": 2,
          "name": "Teenager's Bedroom",
          "bed": [
            "QUEEN"
          ],
          "floor": 3,
          "description": "flight without yum modulo with metabolite even because thankfully not",
          "features": [
            "WALK_IN_WARDROBE",
            "BALCONY",
            "PATIO_DOORS",
            "BUILT_IN_DESK"
          ],
          "size": 18,
          "propertyId": 19,
          "createdAt": "2026-01-19T11:12:45.066Z",
          "updatedAt": "2026-01-19T11:12:45.066Z",
          "media": [
            {
              "id": 129,
              "image": "97774d3c-da7b-4088-fc2e-c773d4436800",
              "videoTour": null,
              "floorPlan": null,
              "metadata": "{\"alt\":\"Bedroom 2 - filter anenst correctly\",\"description\":\"degrease warped blah yowza hmph\",\"roomType\":\"Bedroom 2\",\"cloudflareImageId\":\"97774d3c-da7b-4088-fc2e-c773d4436800\"}",
              "propertyId": 19,
              "sortOrder": 0,
              "createdAt": "2026-01-19T11:12:58.602Z",
              "updatedAt": "2026-01-19T11:12:58.602Z",
              "bedroomId": 56,
              "bathroomId": null,
              "receptionId": null,
              "otherRoomId": null,
              "kitchenId": null,
              "gardenId": null,
              "outdoorSpaceId": null,
              "landId": null,
              "yardId": null
            },
            {
              "id": 130,
              "image": "97774d3c-da7b-4088-fc2e-c773d4436800",
              "videoTour": null,
              "floorPlan": null,
              "metadata": "{\"alt\":\"Bedroom 2 - taut juggernaut oh\",\"description\":\"verve blah indeed tensely bitterly\",\"roomType\":\"Bedroom 2\",\"cloudflareImageId\":\"97774d3c-da7b-4088-fc2e-c773d4436800\"}",
              "propertyId": 19,
              "sortOrder": 0,
              "createdAt": "2026-01-19T11:12:58.602Z",
              "updatedAt": "2026-01-19T11:12:58.602Z",
              "bedroomId": 56,
              "bathroomId": null,
              "receptionId": null,
              "otherRoomId": null,
              "kitchenId": null,
              "gardenId": null,
              "outdoorSpaceId": null,
              "landId": null,
              "yardId": null
            }
          ]
        }
      ],
      "bathroomFeatures": [
        {
          "id": 29,
          "roomNumber": 1,
          "floor": 0,
          "name": "Master Bathroom",
          "features": [],
          "description": "mysteriously self-reliant nor shallow tidy and ugh meh overheard unhealthy",
          "size": 39,
          "propertyId": 19,
          "createdAt": "2026-01-19T11:12:45.066Z",
          "updatedAt": "2026-01-19T11:12:45.066Z",
          "media": [
            {
              "id": 132,
              "image": "5a85c20c-7c37-44c6-ab91-1b38b29a7a00",
              "videoTour": null,
              "floorPlan": null,
              "metadata": "{\"alt\":\"Bathroom 1 - times over publication\",\"description\":\"team demonstrate or accurate sans\",\"roomType\":\"Bathroom 1\",\"cloudflareImageId\":\"5a85c20c-7c37-44c6-ab91-1b38b29a7a00\"}",
              "propertyId": 19,
              "sortOrder": 0,
              "createdAt": "2026-01-19T11:12:58.602Z",
              "updatedAt": "2026-01-19T11:12:58.602Z",
              "bedroomId": null,
              "bathroomId": 29,
              "receptionId": null,
              "otherRoomId": null,
              "kitchenId": null,
              "gardenId": null,
              "outdoorSpaceId": null,
              "landId": null,
              "yardId": null
            }
          ]
        }
      ],
      "otherRoom": [
        {
          "id": 42,
          "roomNumber": 1,
          "floor": 1,
          "name": "behind greedily",
          "type": "OTHER",
          "description": "range uselessly tough plus under sans scout redound repossess till",
          "size": 35,
          "features": [
            "BALCONY",
            "BAY_WINDOW",
            "BUILT_IN_SHELVING",
            "BUILT_IN_STORAGE",
            "SERVING_HATCH"
          ],
          "propertyId": 19,
          "createdAt": "2026-01-19T11:12:45.066Z",
          "updatedAt": "2026-01-19T11:12:45.066Z",
          "media": [
            {
              "id": 134,
              "image": "51972637-4e53-48d5-b11f-5eedb66f7000",
              "videoTour": null,
              "floorPlan": null,
              "metadata": "{\"alt\":\"Other Room 1 - boo instead furthermore\",\"description\":\"victoriously meanwhile regarding woot derby\",\"roomType\":\"Other Room 1\",\"cloudflareImageId\":\"51972637-4e53-48d5-b11f-5eedb66f7000\"}",
              "propertyId": 19,
              "sortOrder": 0,
              "createdAt": "2026-01-19T11:12:58.602Z",
              "updatedAt": "2026-01-19T11:12:58.602Z",
              "bedroomId": null,
              "bathroomId": null,
              "receptionId": null,
              "otherRoomId": 42,
              "kitchenId": null,
              "gardenId": null,
              "outdoorSpaceId": null,
              "landId": null,
              "yardId": null
            },
            {
              "id": 135,
              "image": "ab8f7e9e-35d3-4264-8517-e3b9c2062200",
              "videoTour": null,
              "floorPlan": null,
              "metadata": "{\"alt\":\"Other Room 1 - nudge apud hm\",\"description\":\"flat which hovercraft deployment pfft\",\"roomType\":\"Other Room 1\",\"cloudflareImageId\":\"ab8f7e9e-35d3-4264-8517-e3b9c2062200\"}",
              "propertyId": 19,
              "sortOrder": 0,
              "createdAt": "2026-01-19T11:12:58.602Z",
              "updatedAt": "2026-01-19T11:12:58.602Z",
              "bedroomId": null,
              "bathroomId": null,
              "receptionId": null,
              "otherRoomId": 42,
              "kitchenId": null,
              "gardenId": null,
              "outdoorSpaceId": null,
              "landId": null,
              "yardId": null
            }
          ]
        },
        {
          "id": 43,
          "roomNumber": 2,
          "floor": 2,
          "name": "bah daughter",
          "type": "POOL_ROOM",
          "description": "intrepid satirize whispered and ajar monthly beloved musty where for",
          "size": 33,
          "features": [
            "HAS_VIEW",
            "BUILT_IN_STORAGE",
            "ACCOUSTIC_PANELS",
            "BUILT_IN_DESK"
          ],
          "propertyId": 19,
          "createdAt": "2026-01-19T11:12:45.066Z",
          "updatedAt": "2026-01-19T11:12:45.066Z",
          "media": [
            {
              "id": 136,
              "image": "baa60ea5-5a77-42b5-c954-840afa6c0300",
              "videoTour": null,
              "floorPlan": null,
              "metadata": "{\"alt\":\"Other Room 2 - under but programme\",\"description\":\"supportive weary meanwhile zowie violently\",\"roomType\":\"Other Room 2\",\"cloudflareImageId\":\"baa60ea5-5a77-42b5-c954-840afa6c0300\"}",
              "propertyId": 19,
              "sortOrder": 0,
              "createdAt": "2026-01-19T11:12:58.602Z",
              "updatedAt": "2026-01-19T11:12:58.602Z",
              "bedroomId": null,
              "bathroomId": null,
              "receptionId": null,
              "otherRoomId": 43,
              "kitchenId": null,
              "gardenId": null,
              "outdoorSpaceId": null,
              "landId": null,
              "yardId": null
            }
          ]
        },
        {
          "id": 44,
          "roomNumber": 3,
          "floor": 2,
          "name": "courteous lovingly",
          "type": "OTHER",
          "description": "hearten atop construe until markup amidst cosset during beneath tough",
          "size": 44,
          "features": [
            "HAS_VIEW",
            "SERVING_HATCH",
            "HARDWOOD_FLOORING",
            "BUILT_IN_DESK"
          ],
          "propertyId": 19,
          "createdAt": "2026-01-19T11:12:45.066Z",
          "updatedAt": "2026-01-19T11:12:45.066Z",
          "media": [
            {
              "id": 137,
              "image": "ab8f7e9e-35d3-4264-8517-e3b9c2062200",
              "videoTour": null,
              "floorPlan": null,
              "metadata": "{\"alt\":\"Other Room 3 - huzzah once ugh\",\"description\":\"meanwhile grubby excitedly masculinize upbeat\",\"roomType\":\"Other Room 3\",\"cloudflareImageId\":\"ab8f7e9e-35d3-4264-8517-e3b9c2062200\"}",
              "propertyId": 19,
              "sortOrder": 0,
              "createdAt": "2026-01-19T11:12:58.602Z",
              "updatedAt": "2026-01-19T11:12:58.602Z",
              "bedroomId": null,
              "bathroomId": null,
              "receptionId": null,
              "otherRoomId": 44,
              "kitchenId": null,
              "gardenId": null,
              "outdoorSpaceId": null,
              "landId": null,
              "yardId": null
            },
            {
              "id": 138,
              "image": "51972637-4e53-48d5-b11f-5eedb66f7000",
              "videoTour": null,
              "floorPlan": null,
              "metadata": "{\"alt\":\"Other Room 3 - um finally next\",\"description\":\"narrowcast what inasmuch even schnitzel\",\"roomType\":\"Other Room 3\",\"cloudflareImageId\":\"51972637-4e53-48d5-b11f-5eedb66f7000\"}",
              "propertyId": 19,
              "sortOrder": 0,
              "createdAt": "2026-01-19T11:12:58.602Z",
              "updatedAt": "2026-01-19T11:12:58.602Z",
              "bedroomId": null,
              "bathroomId": null,
              "receptionId": null,
              "otherRoomId": 44,
              "kitchenId": null,
              "gardenId": null,
              "outdoorSpaceId": null,
              "landId": null,
              "yardId": null
            }
          ]
        }
      ],
      "parking": {
        "id": 19,
        "description": "anaesthetise wetly psst properly evil digital now ha french scowl",
        "features": [
          "GARAGE",
          "ON_STREET",
          "ALLOCATED_PARKING"
        ],
        "propertyId": 19,
        "createdAt": "2026-01-19T11:12:45.066Z",
        "updatedAt": "2026-01-19T11:12:45.066Z"
      },
      "amenities": [
        {
          "id": 325,
          "type": "EDUCATION",
          "subtype": "SCHOOL",
          "name": "Wisoky Group School",
          "distanceM": 2802,
          "description": null,
          "location": null,
          "propertyId": 19,
          "createdAt": "2026-01-19T11:12:45.066Z"
        },
        {
          "id": 326,
          "type": "EDUCATION",
          "subtype": "SCHOOL",
          "name": "Strosin and Sons School",
          "distanceM": 3893,
          "description": null,
          "location": null,
          "propertyId": 19,
          "createdAt": "2026-01-19T11:12:45.066Z"
        },
        {
          "id": 327,
          "type": "EDUCATION",
          "subtype": "SCHOOL",
          "name": "Block - Denesik School",
          "distanceM": 3529,
          "description": null,
          "location": null,
          "propertyId": 19,
          "createdAt": "2026-01-19T11:12:45.066Z"
        },
        {
          "id": 328,
          "type": "HEALTHCARE",
          "subtype": "HOSPITAL",
          "name": "Keeling, Hills and Hodkiewicz Hospital",
          "distanceM": 2517,
          "description": null,
          "location": null,
          "propertyId": 19,
          "createdAt": "2026-01-19T11:12:45.066Z"
        },
        {
          "id": 329,
          "type": "HEALTHCARE",
          "subtype": "HOSPITAL",
          "name": "Nikolaus, Stanton and Keebler Hospital",
          "distanceM": 5704,
          "description": null,
          "location": null,
          "propertyId": 19,
          "createdAt": "2026-01-19T11:12:45.066Z"
        },
        {
          "id": 330,
          "type": "HEALTHCARE",
          "subtype": "HOSPITAL",
          "name": "Stiedemann, Lesch and Herzog Hospital",
          "distanceM": 8533,
          "description": null,
          "location": null,
          "propertyId": 19,
          "createdAt": "2026-01-19T11:12:45.066Z"
        },
        {
          "id": 331,
          "type": "TRANSPORT",
          "subtype": "TRAIN_STATION",
          "name": "Rathberg Train Station",
          "distanceM": 2560,
          "description": null,
          "location": null,
          "propertyId": 19,
          "createdAt": "2026-01-19T11:12:45.066Z"
        },
        {
          "id": 332,
          "type": "TRANSPORT",
          "subtype": "TRAIN_STATION",
          "name": "North Thelmaborough Train Station",
          "distanceM": 8034,
          "description": null,
          "location": null,
          "propertyId": 19,
          "createdAt": "2026-01-19T11:12:45.066Z"
        },
        {
          "id": 333,
          "type": "TRANSPORT",
          "subtype": "TRAIN_STATION",
          "name": "Lexington-Fayette Train Station",
          "distanceM": 3749,
          "description": null,
          "location": null,
          "propertyId": 19,
          "createdAt": "2026-01-19T11:12:45.066Z"
        },
        {
          "id": 334,
          "type": "TRANSPORT",
          "subtype": "BUS_STOP",
          "name": "Skiles Shore Bus Stop",
          "distanceM": 4665,
          "description": null,
          "location": null,
          "propertyId": 19,
          "createdAt": "2026-01-19T11:12:45.066Z"
        },
        {
          "id": 335,
          "type": "TRANSPORT",
          "subtype": "BUS_STOP",
          "name": "Douglas Road Bus Stop",
          "distanceM": 5631,
          "description": null,
          "location": null,
          "propertyId": 19,
          "createdAt": "2026-01-19T11:12:45.066Z"
        },
        {
          "id": 336,
          "type": "TRANSPORT",
          "subtype": "BUS_STOP",
          "name": "Ramiro Glen Bus Stop",
          "distanceM": 772,
          "description": null,
          "location": null,
          "propertyId": 19,
          "createdAt": "2026-01-19T11:12:45.066Z"
        },
        {
          "id": 337,
          "type": "GREEN_SPACE",
          "subtype": "PARK",
          "name": "North Deontaemouth Park",
          "distanceM": 7990,
          "description": null,
          "location": null,
          "propertyId": 19,
          "createdAt": "2026-01-19T11:12:45.066Z"
        },
        {
          "id": 338,
          "type": "GREEN_SPACE",
          "subtype": "PARK",
          "name": "Annabellburgh Park",
          "distanceM": 3122,
          "description": null,
          "location": null,
          "propertyId": 19,
          "createdAt": "2026-01-19T11:12:45.066Z"
        },
        {
          "id": 339,
          "type": "GREEN_SPACE",
          "subtype": "PARK",
          "name": "Lake Maraland Park",
          "distanceM": 1601,
          "description": null,
          "location": null,
          "propertyId": 19,
          "createdAt": "2026-01-19T11:12:45.066Z"
        },
        {
          "id": 340,
          "type": "SHOPPING_ENTERTAINMENT",
          "subtype": "GYM",
          "name": "Ortiz - McGlynn Gym",
          "distanceM": 2737,
          "description": null,
          "location": null,
          "propertyId": 19,
          "createdAt": "2026-01-19T11:12:45.066Z"
        },
        {
          "id": 341,
          "type": "SHOPPING_ENTERTAINMENT",
          "subtype": "GYM",
          "name": "Windler LLC Gym",
          "distanceM": 8506,
          "description": null,
          "location": null,
          "propertyId": 19,
          "createdAt": "2026-01-19T11:12:45.066Z"
        },
        {
          "id": 342,
          "type": "SHOPPING_ENTERTAINMENT",
          "subtype": "GYM",
          "name": "Davis, Schowalter and Mueller Gym",
          "distanceM": 259,
          "description": null,
          "location": null,
          "propertyId": 19,
          "createdAt": "2026-01-19T11:12:45.066Z"
        }
      ],
      "additionalFeatures": {
        "id": 19,
        "description": "yet hm miscalculate disposer better squeaky gadzooks solemnly reorganisation gifted",
        "petFriendly": true,
        "moveInDate": "2026-03-20T22:25:14.628Z",
        "features": [
          "CONCIERGE"
        ],
        "propertyId": 19,
        "createdAt": "2026-01-19T11:12:45.066Z",
        "updatedAt": "2026-01-19T11:12:45.066Z"
      },
      "accessibilityFeatures": {
        "id": 19,
        "description": "oof drat concerning total clamor assist knottily liberalize regarding thunderbolt",
        "features": [
          "STEP_FREE_ACCESS",
          "WET_ROOM",
          "ACCESSIBLE_PARKING"
        ],
        "propertyId": 19,
        "createdAt": "2026-01-19T11:12:45.066Z",
        "updatedAt": "2026-01-19T11:12:45.066Z"
      },
      "kitchenFeatures": [
        {
          "id": 40,
          "roomNumber": 3,
          "floor": 5,
          "name": "because coagulate",
          "features": [
            "BREAKFAST_BAR",
            "ISLAND",
            "UTILITY_ACCESS",
            "PANTRY"
          ],
          "description": "um functional favorite overcoat across clone if judgementally meh always",
          "size": 14,
          "propertyId": 19,
          "createdAt": "2026-01-19T11:12:45.066Z",
          "updatedAt": "2026-01-19T11:12:45.066Z",
          "media": [
            {
              "id": 131,
              "image": "77d357a1-9439-4510-82e2-c0717b853100",
              "videoTour": null,
              "floorPlan": null,
              "metadata": "{\"alt\":\"Kitchen 3 - offend after vice\",\"description\":\"why lumpy mmm wrongly midst\",\"roomType\":\"Kitchen 3\",\"cloudflareImageId\":\"77d357a1-9439-4510-82e2-c0717b853100\"}",
              "propertyId": 19,
              "sortOrder": 0,
              "createdAt": "2026-01-19T11:12:58.602Z",
              "updatedAt": "2026-01-19T11:12:58.602Z",
              "bedroomId": null,
              "bathroomId": null,
              "receptionId": null,
              "otherRoomId": null,
              "kitchenId": 40,
              "gardenId": null,
              "outdoorSpaceId": null,
              "landId": null,
              "yardId": null
            }
          ]
        }
      ],
      "reception": [
        {
          "id": 40,
          "roomNumber": 1,
          "floor": 2,
          "name": "unwilling dutiful",
          "type": "GAMES_ROOM",
          "description": "whose what rarely delightfully toward mad pfft approach gadzooks pfft",
          "size": 30,
          "features": [
            "OPEN_PLAN",
            "BAY_WINDOW",
            "HAS_VIEW",
            "PATIO_DOORS",
            "BUILT_IN_STORAGE",
            "SOUND_PROOFING",
            "ACCOUSTIC_PANELS",
            "HARDWOOD_FLOORING",
            "BUILT_IN_DESK",
            "FIREPLACE"
          ],
          "propertyId": 19,
          "createdAt": "2026-01-19T11:12:45.066Z",
          "updatedAt": "2026-01-19T11:12:45.066Z",
          "media": [
            {
              "id": 133,
              "image": "f08471ae-a51d-4a43-9632-7a193b129500",
              "videoTour": null,
              "floorPlan": null,
              "metadata": "{\"alt\":\"Reception 1 - midst supposing obligation\",\"description\":\"governance well-documented where because unless\",\"roomType\":\"Reception 1\",\"cloudflareImageId\":\"f08471ae-a51d-4a43-9632-7a193b129500\"}",
              "propertyId": 19,
              "sortOrder": 0,
              "createdAt": "2026-01-19T11:12:58.602Z",
              "updatedAt": "2026-01-19T11:12:58.602Z",
              "bedroomId": null,
              "bathroomId": null,
              "receptionId": 40,
              "otherRoomId": null,
              "kitchenId": null,
              "gardenId": null,
              "outdoorSpaceId": null,
              "landId": null,
              "yardId": null
            }
          ]
        }
      ],
      "utility": {
        "id": 19,
        "description": "lost admired briskly archive chops questionable yowza hm duh substantiate",
        "features": [
          "STORAGE",
          "PLUMBING"
        ],
        "size": 32.18464118374644,
        "propertyId": 19,
        "createdAt": "2026-01-19T11:12:45.066Z",
        "updatedAt": "2026-01-19T11:12:45.066Z"
      },
      "outdoorSpace": null,
      "energyAndUtilities": {
        "id": 19,
        "propertyId": 19,
        "description": "adventurously whereas deliberately gadzooks limited oxidise since plus frightfully preclude",
        "epcRating": "A",
        "epcCertificateUrl": "https://bare-whack.biz/",
        "primaryHeatingType": [
          "OTHER"
        ],
        "secondaryHeatingType": [
          "PASSIVE"
        ],
        "boilerType": "BACK_BOILER",
        "hotWaterSource": "HEAT_PUMP",
        "renewables": [
          "SMART_METER"
        ],
        "connectedUtilities": [
          "GAS",
          "ELECTRICITY",
          "WATER"
        ],
        "broadbandType": "CABLE",
        "fullFibreAvailable": false,
        "maxDownloadSpeedMbps": 779,
        "createdAt": "2026-01-19T11:12:45.066Z",
        "updatedAt": "2026-01-19T11:12:45.066Z"
      },
      "securityFeatures": {
        "id": 19,
        "description": "um likewise till phooey rowdy geez daintily writhing um however hence dwell boo pfft incidentally",
        "features": [
          "CCTV"
        ],
        "propertyId": 19,
        "createdAt": "2026-01-19T11:12:45.066Z",
        "updatedAt": "2026-01-19T11:12:45.066Z"
      },
      "storageFeatures": {
        "id": 19,
        "description": "spectate pry onto gad readily aha dull swiftly broadly barring fraudster under under via yuck fooey especially why jellyfish hmph",
        "features": [
          "ATTIC"
        ],
        "propertyId": 19,
        "createdAt": "2026-01-19T11:12:45.066Z",
        "updatedAt": "2026-01-19T11:12:45.066Z"
      },
      "runningCosts": {
        "id": 19,
        "description": "gladly ravioli outbid pish unnecessarily molasses gosh regarding yippee decongestant gadzooks duh very yuck boohoo",
        "councilTaxBand": "B",
        "serviceCharges": 82.32,
        "groundRent": 168.36,
        "propertyId": 19,
        "createdAt": "2026-01-19T11:12:45.066Z",
        "updatedAt": "2026-01-19T11:12:45.066Z"
      }
    },
    "user": {
      "id": 2,
      "username": "Zakary6_1",
      "email": "1_Torrance_Hahn@hotmail.com",
      "createdAt": "2026-01-19T11:13:37.360Z"
    },
    "listingType": "buy"
  },
  {
    "id": 29,
    "price": 754532.04,
    "moveInDate": "2026-05-11T20:15:22.528Z",
    "listingTier": "BASIC",
    "listingStartDate": "2026-01-19T11:13:38.190Z",
    "listingEndDate": "2026-04-07T09:28:58.318Z",
    "viewingOptions": "corporation only agreement huzzah gee like ha afore waft through",
    "verificationLevel": "BASIC",
    "userId": 5,
    "propertyId": 29,
    "estateAgentId": null,
    "publishedAt": "2026-01-10T20:41:59.297Z",
    "published": true,
    "createdAt": "2026-01-19T11:13:38.226Z",
    "updatedAt": "2026-01-19T11:13:38.226Z",
    "archived": false,
    "archivedAt": null,
    "rentalListing": null,
    "saleListing": {
      "id": 13,
      "listingId": 29,
      "tenureType": "LEASEHOLD",
      "chain": true,
      "sharedOwnership": true,
      "priceType": "FIXED",
      "availabilityStatus": "UNDER_OFFER",
      "draftListingId": null
    },
    "property": {
      "id": 29,
      "description": "amidst to sore vanadyl mid above roundabout hm roundabout encouragement throughout impartial gladly apropos abaft swim bobble gadzooks next westernize",
      "value": 756484.67,
      "size": 83,
      "yearBuilt": "2025",
      "chainFree": true,
      "vacant": false,
      "constructionType": "NON_STANDARD",
      "floorLevel": null,
      "totalFloors": 1,
      "numberBedrooms": 4,
      "numberBathrooms": 1,
      "numberReceptions": 2,
      "numberOtherRooms": 2,
      "numberKitchens": 1,
      "createdAt": "2026-01-19T11:12:45.119Z",
      "updatedAt": "2026-01-19T11:12:45.119Z",
      "addressId": 38,
      "userId": 1,
      "estateAgentId": null,
      "propertyTypeId": 1,
      "propertyClassificationId": 5,
      "address": {
        "id": 38,
        "number": "CATHEDRAL HOUSE",
        "flat": null,
        "name": null,
        "street": "Hamilton Street",
        "city": "Cardiff",
        "postcode": "CF11 9FG",
        "country": null,
        "locality": null,
        "county": null,
        "district": null,
        "fullAddress": "CATHEDRAL HOUSE, Hamilton Street, Cardiff, CF11 9FG",
        "lat": 51.481655,
        "lon": -3.179194,
        "createdAt": "2026-01-19T11:12:45.119Z",
        "updatedAt": "2026-01-19T11:12:45.119Z"
      },
      "media": [
        {
          "id": 250,
          "image": "a08cd2c3-6cd8-4a42-aa4e-68e0d4160800",
          "videoTour": null,
          "floorPlan": null,
          "metadata": "{\"alt\":\"Exterior - angle why save\",\"description\":\"besides whoa needily imagineer colossal\",\"roomType\":\"Exterior\",\"cloudflareImageId\":\"a08cd2c3-6cd8-4a42-aa4e-68e0d4160800\"}",
          "propertyId": 29,
          "sortOrder": 0,
          "createdAt": "2026-01-19T11:12:58.662Z",
          "updatedAt": "2026-01-19T11:12:58.662Z",
          "bedroomId": null,
          "bathroomId": null,
          "receptionId": null,
          "otherRoomId": null,
          "kitchenId": null,
          "gardenId": null,
          "outdoorSpaceId": null,
          "landId": null,
          "yardId": null
        },
        {
          "id": 251,
          "image": "1591debc-71cc-4ffd-6ef2-f9d6ac404400",
          "videoTour": null,
          "floorPlan": null,
          "metadata": "{\"alt\":\"Garden - less carelessly mesh\",\"description\":\"whopping natural topsail for ack\",\"roomType\":\"Garden\",\"cloudflareImageId\":\"1591debc-71cc-4ffd-6ef2-f9d6ac404400\"}",
          "propertyId": 29,
          "sortOrder": 0,
          "createdAt": "2026-01-19T11:12:58.662Z",
          "updatedAt": "2026-01-19T11:12:58.662Z",
          "bedroomId": null,
          "bathroomId": null,
          "receptionId": null,
          "otherRoomId": null,
          "kitchenId": null,
          "gardenId": null,
          "outdoorSpaceId": null,
          "landId": null,
          "yardId": null
        },
        {
          "id": 252,
          "image": "0ba57463-d707-4914-8370-eeaad9efb700",
          "videoTour": null,
          "floorPlan": null,
          "metadata": "{\"alt\":\"Dining Room\",\"description\":\"tousle unbalance notwithstanding shore ha\",\"roomType\":\"Dining Room\",\"cloudflareImageId\":\"0ba57463-d707-4914-8370-eeaad9efb700\"}",
          "propertyId": 29,
          "sortOrder": 0,
          "createdAt": "2026-01-19T11:12:58.662Z",
          "updatedAt": "2026-01-19T11:12:58.662Z",
          "bedroomId": null,
          "bathroomId": null,
          "receptionId": null,
          "otherRoomId": null,
          "kitchenId": null,
          "gardenId": null,
          "outdoorSpaceId": null,
          "landId": null,
          "yardId": null
        },
        {
          "id": 253,
          "image": "baa60ea5-5a77-42b5-c954-840afa6c0300",
          "videoTour": null,
          "floorPlan": null,
          "metadata": "{\"alt\":\"Home Office\",\"description\":\"now gust behind crazy sardonic\",\"roomType\":\"Home Office\",\"cloudflareImageId\":\"baa60ea5-5a77-42b5-c954-840afa6c0300\"}",
          "propertyId": 29,
          "sortOrder": 0,
          "createdAt": "2026-01-19T11:12:58.662Z",
          "updatedAt": "2026-01-19T11:12:58.662Z",
          "bedroomId": null,
          "bathroomId": null,
          "receptionId": null,
          "otherRoomId": null,
          "kitchenId": null,
          "gardenId": null,
          "outdoorSpaceId": null,
          "landId": null,
          "yardId": null
        },
        {
          "id": 254,
          "image": "9ef289b1-e2cf-4e70-a1e3-1ca4beba4f00",
          "videoTour": null,
          "floorPlan": null,
          "metadata": "{\"alt\":\"Bedroom 1\",\"description\":\"after now between intend yesterday\",\"roomType\":\"Bedroom 1\",\"cloudflareImageId\":\"9ef289b1-e2cf-4e70-a1e3-1ca4beba4f00\"}",
          "propertyId": 29,
          "sortOrder": 0,
          "createdAt": "2026-01-19T11:12:58.662Z",
          "updatedAt": "2026-01-19T11:12:58.662Z",
          "bedroomId": 87,
          "bathroomId": null,
          "receptionId": null,
          "otherRoomId": null,
          "kitchenId": null,
          "gardenId": null,
          "outdoorSpaceId": null,
          "landId": null,
          "yardId": null
        }
      ],
      "type": {
        "id": 1,
        "name": "House",
        "defaultSelected": true
      },
      "classification": {
        "id": 5,
        "name": "Mansion",
        "categoryId": 1
      },
      "bedroomFeatures": [
        {
          "id": 87,
          "roomNumber": 1,
          "name": "Teenager's Bedroom",
          "bed": [
            "DOUBLE"
          ],
          "floor": 1,
          "description": "label even advanced lanky sniveling who moral modulo weakly wide-eyed",
          "features": [
            "BUILT_IN_STORAGE",
            "BALCONY"
          ],
          "size": 24,
          "propertyId": 29,
          "createdAt": "2026-01-19T11:12:45.119Z",
          "updatedAt": "2026-01-19T11:12:45.119Z",
          "media": [
            {
              "id": 254,
              "image": "9ef289b1-e2cf-4e70-a1e3-1ca4beba4f00",
              "videoTour": null,
              "floorPlan": null,
              "metadata": "{\"alt\":\"Bedroom 1\",\"description\":\"after now between intend yesterday\",\"roomType\":\"Bedroom 1\",\"cloudflareImageId\":\"9ef289b1-e2cf-4e70-a1e3-1ca4beba4f00\"}",
              "propertyId": 29,
              "sortOrder": 0,
              "createdAt": "2026-01-19T11:12:58.662Z",
              "updatedAt": "2026-01-19T11:12:58.662Z",
              "bedroomId": 87,
              "bathroomId": null,
              "receptionId": null,
              "otherRoomId": null,
              "kitchenId": null,
              "gardenId": null,
              "outdoorSpaceId": null,
              "landId": null,
              "yardId": null
            }
          ]
        },
        {
          "id": 88,
          "roomNumber": 2,
          "name": "Nursery",
          "bed": [
            "SINGLE"
          ],
          "floor": 1,
          "description": "indeed intensely meanwhile flood whoever hm fast requite over adventurously",
          "features": [
            "HAS_VIEW"
          ],
          "size": 41,
          "propertyId": 29,
          "createdAt": "2026-01-19T11:12:45.119Z",
          "updatedAt": "2026-01-19T11:12:45.119Z",
          "media": []
        },
        {
          "id": 89,
          "roomNumber": 3,
          "name": "Nursery",
          "bed": [
            "DOUBLE"
          ],
          "floor": 1,
          "description": "however provision whereas off midst blaring excitable why encode or",
          "features": [
            "BUILT_IN_STORAGE",
            "WALK_IN_WARDROBE",
            "BAY_WINDOW",
            "BALCONY",
            "BUILT_IN_DESK"
          ],
          "size": 34,
          "propertyId": 29,
          "createdAt": "2026-01-19T11:12:45.119Z",
          "updatedAt": "2026-01-19T11:12:45.119Z",
          "media": []
        },
        {
          "id": 90,
          "roomNumber": 4,
          "name": "Child's Bedroom",
          "bed": [
            "QUEEN"
          ],
          "floor": 1,
          "description": "artistic beside inasmuch rectangular fill as foolish revitalise intent from",
          "features": [
            "BAY_WINDOW"
          ],
          "size": 33,
          "propertyId": 29,
          "createdAt": "2026-01-19T11:12:45.119Z",
          "updatedAt": "2026-01-19T11:12:45.119Z",
          "media": []
        }
      ],
      "bathroomFeatures": [
        {
          "id": 43,
          "roomNumber": 1,
          "floor": 0,
          "name": "Shared Bathroom",
          "features": [
            "TOILET",
            "BATHTUB",
            "WALK_IN_SHOWER"
          ],
          "description": "ack hairy story which prickly although bashfully arrogantly inasmuch besides",
          "size": 43,
          "propertyId": 29,
          "createdAt": "2026-01-19T11:12:45.119Z",
          "updatedAt": "2026-01-19T11:12:45.119Z",
          "media": []
        }
      ],
      "otherRoom": [
        {
          "id": 65,
          "roomNumber": 1,
          "floor": 0,
          "name": "avow fooey",
          "type": "WINE_CELLAR",
          "description": "blah as politely that fat ouch phooey incidentally jittery aha",
          "size": 49,
          "features": [
            "BUILT_IN_STORAGE",
            "STONE_FLOORING",
            "BUILT_IN_DESK"
          ],
          "propertyId": 29,
          "createdAt": "2026-01-19T11:12:45.119Z",
          "updatedAt": "2026-01-19T11:12:45.119Z",
          "media": []
        },
        {
          "id": 66,
          "roomNumber": 2,
          "floor": 0,
          "name": "consequently interestingly",
          "type": "STUDY",
          "description": "unbearably of furthermore outside airbrush mmm swerve handful more so",
          "size": 30,
          "features": [
            "OPEN_PLAN",
            "HAS_VIEW",
            "SERVING_HATCH",
            "BAR_AREA",
            "SOUND_PROOFING",
            "HARDWOOD_FLOORING",
            "BUILT_IN_DESK",
            "FIREPLACE"
          ],
          "propertyId": 29,
          "createdAt": "2026-01-19T11:12:45.119Z",
          "updatedAt": "2026-01-19T11:12:45.119Z",
          "media": []
        }
      ],
      "parking": {
        "id": 29,
        "description": "slight oof snow bourgeoisie until beneath flint impostor amend afterwards",
        "features": [
          "PERMIT_PARKING",
          "ON_STREET"
        ],
        "propertyId": 29,
        "createdAt": "2026-01-19T11:12:45.119Z",
        "updatedAt": "2026-01-19T11:12:45.119Z"
      },
      "amenities": [
        {
          "id": 505,
          "type": "EDUCATION",
          "subtype": "SCHOOL",
          "name": "Marks - Schaden School",
          "distanceM": 5106,
          "description": null,
          "location": null,
          "propertyId": 29,
          "createdAt": "2026-01-19T11:12:45.119Z"
        },
        {
          "id": 506,
          "type": "EDUCATION",
          "subtype": "SCHOOL",
          "name": "Huel, Rolfson and Tillman School",
          "distanceM": 965,
          "description": null,
          "location": null,
          "propertyId": 29,
          "createdAt": "2026-01-19T11:12:45.119Z"
        },
        {
          "id": 507,
          "type": "EDUCATION",
          "subtype": "SCHOOL",
          "name": "Crona and Sons School",
          "distanceM": 1935,
          "description": null,
          "location": null,
          "propertyId": 29,
          "createdAt": "2026-01-19T11:12:45.119Z"
        },
        {
          "id": 508,
          "type": "HEALTHCARE",
          "subtype": "HOSPITAL",
          "name": "Koch, Hand and Mann Hospital",
          "distanceM": 5868,
          "description": null,
          "location": null,
          "propertyId": 29,
          "createdAt": "2026-01-19T11:12:45.119Z"
        },
        {
          "id": 509,
          "type": "HEALTHCARE",
          "subtype": "HOSPITAL",
          "name": "Gibson, Botsford and Hodkiewicz Hospital",
          "distanceM": 560,
          "description": null,
          "location": null,
          "propertyId": 29,
          "createdAt": "2026-01-19T11:12:45.119Z"
        },
        {
          "id": 510,
          "type": "HEALTHCARE",
          "subtype": "HOSPITAL",
          "name": "Rutherford LLC Hospital",
          "distanceM": 2846,
          "description": null,
          "location": null,
          "propertyId": 29,
          "createdAt": "2026-01-19T11:12:45.119Z"
        },
        {
          "id": 511,
          "type": "TRANSPORT",
          "subtype": "TRAIN_STATION",
          "name": "Lubowitzshire Train Station",
          "distanceM": 6239,
          "description": null,
          "location": null,
          "propertyId": 29,
          "createdAt": "2026-01-19T11:12:45.119Z"
        },
        {
          "id": 512,
          "type": "TRANSPORT",
          "subtype": "TRAIN_STATION",
          "name": "Fairfield Train Station",
          "distanceM": 1129,
          "description": null,
          "location": null,
          "propertyId": 29,
          "createdAt": "2026-01-19T11:12:45.119Z"
        },
        {
          "id": 513,
          "type": "TRANSPORT",
          "subtype": "TRAIN_STATION",
          "name": "Charlieside Train Station",
          "distanceM": 7795,
          "description": null,
          "location": null,
          "propertyId": 29,
          "createdAt": "2026-01-19T11:12:45.119Z"
        },
        {
          "id": 514,
          "type": "TRANSPORT",
          "subtype": "BUS_STOP",
          "name": "S Division Street Bus Stop",
          "distanceM": 5259,
          "description": null,
          "location": null,
          "propertyId": 29,
          "createdAt": "2026-01-19T11:12:45.119Z"
        },
        {
          "id": 515,
          "type": "TRANSPORT",
          "subtype": "BUS_STOP",
          "name": "Auer Walk Bus Stop",
          "distanceM": 1598,
          "description": null,
          "location": null,
          "propertyId": 29,
          "createdAt": "2026-01-19T11:12:45.119Z"
        },
        {
          "id": 516,
          "type": "TRANSPORT",
          "subtype": "BUS_STOP",
          "name": "Raynor Extension Bus Stop",
          "distanceM": 8054,
          "description": null,
          "location": null,
          "propertyId": 29,
          "createdAt": "2026-01-19T11:12:45.119Z"
        },
        {
          "id": 517,
          "type": "GREEN_SPACE",
          "subtype": "PARK",
          "name": "Colliercester Park",
          "distanceM": 2812,
          "description": null,
          "location": null,
          "propertyId": 29,
          "createdAt": "2026-01-19T11:12:45.119Z"
        },
        {
          "id": 518,
          "type": "GREEN_SPACE",
          "subtype": "PARK",
          "name": "Port Frederickworth Park",
          "distanceM": 2553,
          "description": null,
          "location": null,
          "propertyId": 29,
          "createdAt": "2026-01-19T11:12:45.119Z"
        },
        {
          "id": 519,
          "type": "GREEN_SPACE",
          "subtype": "PARK",
          "name": "Modesto Park",
          "distanceM": 3203,
          "description": null,
          "location": null,
          "propertyId": 29,
          "createdAt": "2026-01-19T11:12:45.119Z"
        },
        {
          "id": 520,
          "type": "SHOPPING_ENTERTAINMENT",
          "subtype": "GYM",
          "name": "Oberbrunner - Murazik Gym",
          "distanceM": 8152,
          "description": null,
          "location": null,
          "propertyId": 29,
          "createdAt": "2026-01-19T11:12:45.119Z"
        },
        {
          "id": 521,
          "type": "SHOPPING_ENTERTAINMENT",
          "subtype": "GYM",
          "name": "Hansen Inc Gym",
          "distanceM": 7684,
          "description": null,
          "location": null,
          "propertyId": 29,
          "createdAt": "2026-01-19T11:12:45.119Z"
        },
        {
          "id": 522,
          "type": "SHOPPING_ENTERTAINMENT",
          "subtype": "GYM",
          "name": "Marks Group Gym",
          "distanceM": 2259,
          "description": null,
          "location": null,
          "propertyId": 29,
          "createdAt": "2026-01-19T11:12:45.119Z"
        }
      ],
      "additionalFeatures": {
        "id": 29,
        "description": "modulo reasonable feminize scrutinise overproduce refine contractor settle anenst important",
        "petFriendly": false,
        "moveInDate": "2026-11-19T15:02:55.243Z",
        "features": [
          "SHOP"
        ],
        "propertyId": 29,
        "createdAt": "2026-01-19T11:12:45.119Z",
        "updatedAt": "2026-01-19T11:12:45.119Z"
      },
      "accessibilityFeatures": {
        "id": 29,
        "description": "whoever snarling ew finding following outset whoa because drat hm",
        "features": [
          "WHEELCHAIR_FRIENDLY",
          "HANDRAILS",
          "ACCESSIBLE_PARKING"
        ],
        "propertyId": 29,
        "createdAt": "2026-01-19T11:12:45.119Z",
        "updatedAt": "2026-01-19T11:12:45.119Z"
      },
      "kitchenFeatures": [
        {
          "id": 59,
          "roomNumber": 2,
          "floor": 1,
          "name": "whether who",
          "features": [
            "MODERN",
            "BREAKFAST_BAR"
          ],
          "description": "knight huge highly qua curl if worriedly given amid chubby",
          "size": 10,
          "propertyId": 29,
          "createdAt": "2026-01-19T11:12:45.119Z",
          "updatedAt": "2026-01-19T11:12:45.119Z",
          "media": []
        }
      ],
      "reception": [
        {
          "id": 57,
          "roomNumber": 1,
          "floor": 1,
          "name": "the forenenst",
          "type": "HOME_CINEMA",
          "description": "boo although quarrelsome e-mail whereas foolish stealthily jealous rosin fence",
          "size": 28,
          "features": [
            "BALCONY",
            "PATIO_DOORS",
            "BAR_AREA",
            "HARDWOOD_FLOORING"
          ],
          "propertyId": 29,
          "createdAt": "2026-01-19T11:12:45.119Z",
          "updatedAt": "2026-01-19T11:12:45.119Z",
          "media": []
        },
        {
          "id": 58,
          "roomNumber": 2,
          "floor": 1,
          "name": "mindless um",
          "type": "FAMILY_ROOM",
          "description": "because what pfft militate blah after yuck instead frightened fatal",
          "size": 47,
          "features": [
            "OPEN_PLAN",
            "OPEN_CONCEPT",
            "HAS_VIEW",
            "ACCOUSTIC_PANELS",
            "STONE_FLOORING"
          ],
          "propertyId": 29,
          "createdAt": "2026-01-19T11:12:45.119Z",
          "updatedAt": "2026-01-19T11:12:45.119Z",
          "media": []
        }
      ],
      "utility": {
        "id": 29,
        "description": "after unpleasant amongst blink who drat the supportive pfft irresponsible",
        "features": [
          "STORAGE"
        ],
        "size": 49.65283449223268,
        "propertyId": 29,
        "createdAt": "2026-01-19T11:12:45.119Z",
        "updatedAt": "2026-01-19T11:12:45.119Z"
      },
      "outdoorSpace": null,
      "energyAndUtilities": {
        "id": 29,
        "propertyId": 29,
        "description": "density above but into even heavy pish youthfully hunger hmph",
        "epcRating": "C",
        "epcCertificateUrl": "https://gray-circumference.info/",
        "primaryHeatingType": [
          "PASSIVE",
          "HEAT_PUMP",
          "SOLAR_THERMAL"
        ],
        "secondaryHeatingType": [
          "UNDERFLOOR"
        ],
        "boilerType": "CONVENTIONAL",
        "hotWaterSource": "SOLAR_THERMAL",
        "renewables": [
          "SMART_METER",
          "SOLAR_PV",
          "EV_CHARGING"
        ],
        "connectedUtilities": [
          "ELECTRICITY",
          "DRAINAGE",
          "GAS",
          "CESSPIT"
        ],
        "broadbandType": "FTTC",
        "fullFibreAvailable": false,
        "maxDownloadSpeedMbps": 644,
        "createdAt": "2026-01-19T11:12:45.119Z",
        "updatedAt": "2026-01-19T11:12:45.119Z"
      },
      "securityFeatures": {
        "id": 29,
        "description": "statue because persecute aggravating shyly fuss finally overcharge barge plus monthly except puzzled upliftingly daughter",
        "features": [
          "CCTV"
        ],
        "propertyId": 29,
        "createdAt": "2026-01-19T11:12:45.119Z",
        "updatedAt": "2026-01-19T11:12:45.119Z"
      },
      "storageFeatures": {
        "id": 29,
        "description": "eek stealthily pull thongs creative roughly crackle per uselessly when small controvert huzzah unbalance tectonics productive apropos plus sparse difficult",
        "features": [
          "UNDER_STAIRS_STORAGE"
        ],
        "propertyId": 29,
        "createdAt": "2026-01-19T11:12:45.119Z",
        "updatedAt": "2026-01-19T11:12:45.119Z"
      },
      "runningCosts": {
        "id": 29,
        "description": "bludgeon likely till ugh whereas passport untimely relative descent portly accompany essential jealous besmirch when",
        "councilTaxBand": "F",
        "serviceCharges": 198.11,
        "groundRent": 285.04,
        "propertyId": 29,
        "createdAt": "2026-01-19T11:12:45.119Z",
        "updatedAt": "2026-01-19T11:12:45.119Z"
      }
    },
    "user": {
      "id": 5,
      "username": "Devonte.McKenzie50_3",
      "email": "3_Golda_DuBuque@hotmail.com",
      "createdAt": "2026-01-19T11:13:37.360Z"
    },
    "listingType": "buy"
  },
  {
    "id": 38,
    "price": 315137.87,
    "moveInDate": "2026-03-28T01:37:14.464Z",
    "listingTier": "BASIC",
    "listingStartDate": "2026-01-19T11:13:38.190Z",
    "listingEndDate": "2026-04-02T07:58:02.146Z",
    "viewingOptions": "inside vulgarise unimpressively swat frilly beloved aha hungrily yeast inasmuch",
    "verificationLevel": "BASIC",
    "userId": 8,
    "propertyId": 113,
    "estateAgentId": null,
    "publishedAt": "2026-01-15T09:02:48.167Z",
    "published": true,
    "createdAt": "2026-01-19T11:13:38.231Z",
    "updatedAt": "2026-01-19T11:13:38.231Z",
    "archived": false,
    "archivedAt": null,
    "rentalListing": null,
    "saleListing": {
      "id": 17,
      "listingId": 38,
      "tenureType": "COMMONHOLD",
      "chain": false,
      "sharedOwnership": false,
      "priceType": "OFFERS_OVER",
      "availabilityStatus": "AVAILABLE",
      "draftListingId": null
    },
    "property": {
      "id": 113,
      "description": "receptor pace since round until yowza fleck aw unnaturally slope about mmm over wetly construe how gah amidst towards cleverly",
      "value": 430827.9,
      "size": 302,
      "yearBuilt": "2025",
      "chainFree": false,
      "vacant": true,
      "constructionType": "STANDARD",
      "floorLevel": null,
      "totalFloors": 4,
      "numberBedrooms": 5,
      "numberBathrooms": 2,
      "numberReceptions": 3,
      "numberOtherRooms": 1,
      "numberKitchens": 1,
      "createdAt": "2026-01-19T11:12:45.535Z",
      "updatedAt": "2026-01-19T11:12:45.535Z",
      "addressId": 122,
      "userId": 1,
      "estateAgentId": null,
      "propertyTypeId": 3,
      "propertyClassificationId": 12,
      "address": {
        "id": 122,
        "number": "WINDSOR COURT",
        "flat": null,
        "name": null,
        "street": "Maes Yr Awel",
        "city": "Cardiff",
        "postcode": "CF15 8AT",
        "country": null,
        "locality": null,
        "county": null,
        "district": null,
        "fullAddress": "WINDSOR COURT, Maes Yr Awel, Cardiff, CF15 8AT",
        "lat": 51.481655,
        "lon": -3.179194,
        "createdAt": "2026-01-19T11:12:45.535Z",
        "updatedAt": "2026-01-19T11:12:45.535Z"
      },
      "media": [
        {
          "id": 1250,
          "image": "a08cd2c3-6cd8-4a42-aa4e-68e0d4160800",
          "videoTour": null,
          "floorPlan": null,
          "metadata": "{\"alt\":\"Exterior - whenever for bonnet\",\"description\":\"playfully whoa extremely ha whoa\",\"roomType\":\"Exterior\",\"cloudflareImageId\":\"a08cd2c3-6cd8-4a42-aa4e-68e0d4160800\"}",
          "propertyId": 113,
          "sortOrder": 0,
          "createdAt": "2026-01-19T11:12:59.255Z",
          "updatedAt": "2026-01-19T11:12:59.255Z",
          "bedroomId": null,
          "bathroomId": null,
          "receptionId": null,
          "otherRoomId": null,
          "kitchenId": null,
          "gardenId": null,
          "outdoorSpaceId": null,
          "landId": null,
          "yardId": null
        },
        {
          "id": 1251,
          "image": "55957534-6202-4033-361b-f67b7fd89000",
          "videoTour": null,
          "floorPlan": null,
          "metadata": "{\"alt\":\"Garden - impact nor easily\",\"description\":\"interviewer drat obediently lest frightfully\",\"roomType\":\"Garden\",\"cloudflareImageId\":\"55957534-6202-4033-361b-f67b7fd89000\"}",
          "propertyId": 113,
          "sortOrder": 0,
          "createdAt": "2026-01-19T11:12:59.255Z",
          "updatedAt": "2026-01-19T11:12:59.255Z",
          "bedroomId": null,
          "bathroomId": null,
          "receptionId": null,
          "otherRoomId": null,
          "kitchenId": null,
          "gardenId": null,
          "outdoorSpaceId": null,
          "landId": null,
          "yardId": null
        },
        {
          "id": 1252,
          "image": "8ca273d5-1c19-410c-5a6a-ae4c46626200",
          "videoTour": null,
          "floorPlan": null,
          "metadata": "{\"alt\":\"Dining Room\",\"description\":\"now winding oof scheme speedy\",\"roomType\":\"Dining Room\",\"cloudflareImageId\":\"8ca273d5-1c19-410c-5a6a-ae4c46626200\"}",
          "propertyId": 113,
          "sortOrder": 0,
          "createdAt": "2026-01-19T11:12:59.255Z",
          "updatedAt": "2026-01-19T11:12:59.255Z",
          "bedroomId": null,
          "bathroomId": null,
          "receptionId": null,
          "otherRoomId": null,
          "kitchenId": null,
          "gardenId": null,
          "outdoorSpaceId": null,
          "landId": null,
          "yardId": null
        },
        {
          "id": 1253,
          "image": "b0bbd0f9-05be-427d-8835-cff29cb19c00",
          "videoTour": null,
          "floorPlan": null,
          "metadata": "{\"alt\":\"Home Office\",\"description\":\"clear of good-natured psst back\",\"roomType\":\"Home Office\",\"cloudflareImageId\":\"b0bbd0f9-05be-427d-8835-cff29cb19c00\"}",
          "propertyId": 113,
          "sortOrder": 0,
          "createdAt": "2026-01-19T11:12:59.255Z",
          "updatedAt": "2026-01-19T11:12:59.255Z",
          "bedroomId": null,
          "bathroomId": null,
          "receptionId": null,
          "otherRoomId": null,
          "kitchenId": null,
          "gardenId": null,
          "outdoorSpaceId": null,
          "landId": null,
          "yardId": null
        },
        {
          "id": 1254,
          "image": "9ef289b1-e2cf-4e70-a1e3-1ca4beba4f00",
          "videoTour": null,
          "floorPlan": null,
          "metadata": "{\"alt\":\"Bedroom 1\",\"description\":\"toward colorize before gee bestride\",\"roomType\":\"Bedroom 1\",\"cloudflareImageId\":\"9ef289b1-e2cf-4e70-a1e3-1ca4beba4f00\"}",
          "propertyId": 113,
          "sortOrder": 0,
          "createdAt": "2026-01-19T11:12:59.255Z",
          "updatedAt": "2026-01-19T11:12:59.255Z",
          "bedroomId": 321,
          "bathroomId": null,
          "receptionId": null,
          "otherRoomId": null,
          "kitchenId": null,
          "gardenId": null,
          "outdoorSpaceId": null,
          "landId": null,
          "yardId": null
        }
      ],
      "type": {
        "id": 3,
        "name": "Bungalow",
        "defaultSelected": true
      },
      "classification": {
        "id": 12,
        "name": "Semi-detached",
        "categoryId": 3
      },
      "bedroomFeatures": [
        {
          "id": 321,
          "roomNumber": 1,
          "name": "Nursery",
          "bed": [
            "SINGLE"
          ],
          "floor": 4,
          "description": "hunger pish woot reservation ha steep usher simple thankfully gadzooks",
          "features": [
            "BALCONY",
            "HAS_VIEW",
            "BUILT_IN_DESK"
          ],
          "size": 26,
          "propertyId": 113,
          "createdAt": "2026-01-19T11:12:45.535Z",
          "updatedAt": "2026-01-19T11:12:45.535Z",
          "media": [
            {
              "id": 1254,
              "image": "9ef289b1-e2cf-4e70-a1e3-1ca4beba4f00",
              "videoTour": null,
              "floorPlan": null,
              "metadata": "{\"alt\":\"Bedroom 1\",\"description\":\"toward colorize before gee bestride\",\"roomType\":\"Bedroom 1\",\"cloudflareImageId\":\"9ef289b1-e2cf-4e70-a1e3-1ca4beba4f00\"}",
              "propertyId": 113,
              "sortOrder": 0,
              "createdAt": "2026-01-19T11:12:59.255Z",
              "updatedAt": "2026-01-19T11:12:59.255Z",
              "bedroomId": 321,
              "bathroomId": null,
              "receptionId": null,
              "otherRoomId": null,
              "kitchenId": null,
              "gardenId": null,
              "outdoorSpaceId": null,
              "landId": null,
              "yardId": null
            }
          ]
        },
        {
          "id": 322,
          "roomNumber": 2,
          "name": "Teenager's Bedroom",
          "bed": [
            "KING"
          ],
          "floor": 1,
          "description": "ack ecliptic low over grok oof between charter knuckle rudely",
          "features": [
            "EN_SUITE",
            "BALCONY",
            "HAS_VIEW",
            "PATIO_DOORS"
          ],
          "size": 29,
          "propertyId": 113,
          "createdAt": "2026-01-19T11:12:45.535Z",
          "updatedAt": "2026-01-19T11:12:45.535Z",
          "media": []
        },
        {
          "id": 323,
          "roomNumber": 3,
          "name": "Child's Bedroom",
          "bed": [
            "SUPER_KING"
          ],
          "floor": 1,
          "description": "consequently gadzooks likewise noxious abaft mad cycle calmly mild lest",
          "features": [
            "BUILT_IN_STORAGE",
            "WALK_IN_WARDROBE",
            "BALCONY",
            "HAS_VIEW",
            "PATIO_DOORS"
          ],
          "size": 41,
          "propertyId": 113,
          "createdAt": "2026-01-19T11:12:45.535Z",
          "updatedAt": "2026-01-19T11:12:45.535Z",
          "media": []
        },
        {
          "id": 324,
          "roomNumber": 4,
          "name": "Spare Bedroom",
          "bed": [
            "SINGLE"
          ],
          "floor": 4,
          "description": "blah requite beard whale consequently save zowie calmly up downright",
          "features": [
            "EN_SUITE",
            "BUILT_IN_STORAGE",
            "BALCONY",
            "PATIO_DOORS"
          ],
          "size": 43,
          "propertyId": 113,
          "createdAt": "2026-01-19T11:12:45.535Z",
          "updatedAt": "2026-01-19T11:12:45.535Z",
          "media": []
        },
        {
          "id": 325,
          "roomNumber": 5,
          "name": "Child's Bedroom",
          "bed": [
            "SUPER_KING"
          ],
          "floor": 3,
          "description": "yearningly till overconfidently wonderfully er section vivacious vanadyl average a",
          "features": [
            "BAY_WINDOW",
            "PATIO_DOORS"
          ],
          "size": 38,
          "propertyId": 113,
          "createdAt": "2026-01-19T11:12:45.535Z",
          "updatedAt": "2026-01-19T11:12:45.535Z",
          "media": []
        }
      ],
      "bathroomFeatures": [
        {
          "id": 170,
          "roomNumber": 1,
          "floor": 0,
          "name": "Powder Room",
          "features": [
            "TOILET",
            "WALK_IN_SHOWER"
          ],
          "description": "admired paintwork yet abaft dimly penalise blah till dreamily swiftly",
          "size": 14,
          "propertyId": 113,
          "createdAt": "2026-01-19T11:12:45.535Z",
          "updatedAt": "2026-01-19T11:12:45.535Z",
          "media": []
        },
        {
          "id": 171,
          "roomNumber": 2,
          "floor": 1,
          "name": "Powder Room",
          "features": [
            "EN_SUITE",
            "BATHTUB",
            "WALK_IN_SHOWER"
          ],
          "description": "marathon aha till develop than ugh roughly than iridescence negotiation",
          "size": 30,
          "propertyId": 113,
          "createdAt": "2026-01-19T11:12:45.535Z",
          "updatedAt": "2026-01-19T11:12:45.535Z",
          "media": []
        }
      ],
      "otherRoom": [
        {
          "id": 235,
          "roomNumber": 1,
          "floor": 0,
          "name": "as on",
          "type": "POOL_ROOM",
          "description": "label er brr portly coincide outside aw unnecessarily for beautifully",
          "size": 49,
          "features": [
            "PATIO_DOORS",
            "BUILT_IN_STORAGE",
            "STONE_FLOORING"
          ],
          "propertyId": 113,
          "createdAt": "2026-01-19T11:12:45.535Z",
          "updatedAt": "2026-01-19T11:12:45.535Z",
          "media": []
        }
      ],
      "parking": {
        "id": 113,
        "description": "shadowbox ligate grown prickly fax searchingly hypothesize ick psst wing",
        "features": [
          "ON_STREET",
          "ALLOCATED_PARKING"
        ],
        "propertyId": 113,
        "createdAt": "2026-01-19T11:12:45.535Z",
        "updatedAt": "2026-01-19T11:12:45.535Z"
      },
      "amenities": [
        {
          "id": 2017,
          "type": "EDUCATION",
          "subtype": "SCHOOL",
          "name": "Lowe - Parker School",
          "distanceM": 5579,
          "description": null,
          "location": null,
          "propertyId": 113,
          "createdAt": "2026-01-19T11:12:45.535Z"
        },
        {
          "id": 2018,
          "type": "EDUCATION",
          "subtype": "SCHOOL",
          "name": "Kuphal, Terry and Nikolaus School",
          "distanceM": 5126,
          "description": null,
          "location": null,
          "propertyId": 113,
          "createdAt": "2026-01-19T11:12:45.535Z"
        },
        {
          "id": 2019,
          "type": "EDUCATION",
          "subtype": "SCHOOL",
          "name": "Russel, Hansen and Senger School",
          "distanceM": 4880,
          "description": null,
          "location": null,
          "propertyId": 113,
          "createdAt": "2026-01-19T11:12:45.535Z"
        },
        {
          "id": 2020,
          "type": "HEALTHCARE",
          "subtype": "HOSPITAL",
          "name": "Carter - Lebsack Hospital",
          "distanceM": 4797,
          "description": null,
          "location": null,
          "propertyId": 113,
          "createdAt": "2026-01-19T11:12:45.535Z"
        },
        {
          "id": 2021,
          "type": "HEALTHCARE",
          "subtype": "HOSPITAL",
          "name": "Windler - Feest Hospital",
          "distanceM": 2252,
          "description": null,
          "location": null,
          "propertyId": 113,
          "createdAt": "2026-01-19T11:12:45.535Z"
        },
        {
          "id": 2022,
          "type": "HEALTHCARE",
          "subtype": "HOSPITAL",
          "name": "Champlin, Shields and Hilll Hospital",
          "distanceM": 112,
          "description": null,
          "location": null,
          "propertyId": 113,
          "createdAt": "2026-01-19T11:12:45.535Z"
        },
        {
          "id": 2023,
          "type": "TRANSPORT",
          "subtype": "TRAIN_STATION",
          "name": "Binsfield Train Station",
          "distanceM": 816,
          "description": null,
          "location": null,
          "propertyId": 113,
          "createdAt": "2026-01-19T11:12:45.535Z"
        },
        {
          "id": 2024,
          "type": "TRANSPORT",
          "subtype": "TRAIN_STATION",
          "name": "Raultown Train Station",
          "distanceM": 8866,
          "description": null,
          "location": null,
          "propertyId": 113,
          "createdAt": "2026-01-19T11:12:45.535Z"
        },
        {
          "id": 2025,
          "type": "TRANSPORT",
          "subtype": "TRAIN_STATION",
          "name": "Carterstad Train Station",
          "distanceM": 3328,
          "description": null,
          "location": null,
          "propertyId": 113,
          "createdAt": "2026-01-19T11:12:45.535Z"
        },
        {
          "id": 2026,
          "type": "TRANSPORT",
          "subtype": "BUS_STOP",
          "name": "Betty Skyway Bus Stop",
          "distanceM": 5278,
          "description": null,
          "location": null,
          "propertyId": 113,
          "createdAt": "2026-01-19T11:12:45.535Z"
        },
        {
          "id": 2027,
          "type": "TRANSPORT",
          "subtype": "BUS_STOP",
          "name": "Ash Close Bus Stop",
          "distanceM": 8385,
          "description": null,
          "location": null,
          "propertyId": 113,
          "createdAt": "2026-01-19T11:12:45.535Z"
        },
        {
          "id": 2028,
          "type": "TRANSPORT",
          "subtype": "BUS_STOP",
          "name": "Moen Dale Bus Stop",
          "distanceM": 1419,
          "description": null,
          "location": null,
          "propertyId": 113,
          "createdAt": "2026-01-19T11:12:45.535Z"
        },
        {
          "id": 2029,
          "type": "GREEN_SPACE",
          "subtype": "PARK",
          "name": "Lefflerview Park",
          "distanceM": 5862,
          "description": null,
          "location": null,
          "propertyId": 113,
          "createdAt": "2026-01-19T11:12:45.535Z"
        },
        {
          "id": 2030,
          "type": "GREEN_SPACE",
          "subtype": "PARK",
          "name": "Lehi Park",
          "distanceM": 5807,
          "description": null,
          "location": null,
          "propertyId": 113,
          "createdAt": "2026-01-19T11:12:45.535Z"
        },
        {
          "id": 2031,
          "type": "GREEN_SPACE",
          "subtype": "PARK",
          "name": "New Jerel Park",
          "distanceM": 7005,
          "description": null,
          "location": null,
          "propertyId": 113,
          "createdAt": "2026-01-19T11:12:45.535Z"
        },
        {
          "id": 2032,
          "type": "SHOPPING_ENTERTAINMENT",
          "subtype": "GYM",
          "name": "Rau, Cummerata and Anderson Gym",
          "distanceM": 6318,
          "description": null,
          "location": null,
          "propertyId": 113,
          "createdAt": "2026-01-19T11:12:45.535Z"
        },
        {
          "id": 2033,
          "type": "SHOPPING_ENTERTAINMENT",
          "subtype": "GYM",
          "name": "Mosciski - Bergnaum Gym",
          "distanceM": 1410,
          "description": null,
          "location": null,
          "propertyId": 113,
          "createdAt": "2026-01-19T11:12:45.535Z"
        },
        {
          "id": 2034,
          "type": "SHOPPING_ENTERTAINMENT",
          "subtype": "GYM",
          "name": "Heidenreich, Schaefer and Kling Gym",
          "distanceM": 3440,
          "description": null,
          "location": null,
          "propertyId": 113,
          "createdAt": "2026-01-19T11:12:45.535Z"
        }
      ],
      "additionalFeatures": {
        "id": 113,
        "description": "consequently yawn capitalize which character impanel cauliflower unaccountably although rubbery",
        "petFriendly": false,
        "moveInDate": "2026-08-22T12:19:53.506Z",
        "features": [
          "POOL",
          "INTERNET",
          "SHOP"
        ],
        "propertyId": 113,
        "createdAt": "2026-01-19T11:12:45.535Z",
        "updatedAt": "2026-01-19T11:12:45.535Z"
      },
      "accessibilityFeatures": {
        "id": 113,
        "description": "odd accompanist as shyly statement provided toward woot fortunately ew",
        "features": [
          "STEP_FREE_ACCESS",
          "WET_ROOM",
          "HANDRAILS"
        ],
        "propertyId": 113,
        "createdAt": "2026-01-19T11:12:45.535Z",
        "updatedAt": "2026-01-19T11:12:45.535Z"
      },
      "kitchenFeatures": [
        {
          "id": 231,
          "roomNumber": 3,
          "floor": 3,
          "name": "legging lively",
          "features": [
            "MODERN",
            "OPEN_PLAN",
            "WHITE_GOODS",
            "BREAKFAST_BAR",
            "ISLAND"
          ],
          "description": "phrase quaff phew oof although more because design quietly yet",
          "size": 42,
          "propertyId": 113,
          "createdAt": "2026-01-19T11:12:45.535Z",
          "updatedAt": "2026-01-19T11:12:45.535Z",
          "media": []
        }
      ],
      "reception": [
        {
          "id": 231,
          "roomNumber": 1,
          "floor": 4,
          "name": "but mid",
          "type": "LIVING_ROOM",
          "description": "ouch about disbar traduce under or thoughtfully sometimes er detective",
          "size": 29,
          "features": [
            "OPEN_CONCEPT",
            "BUILT_IN_SHELVING",
            "PATIO_DOORS",
            "SERVING_HATCH",
            "SOUND_PROOFING",
            "HARDWOOD_FLOORING",
            "BUILT_IN_DESK"
          ],
          "propertyId": 113,
          "createdAt": "2026-01-19T11:12:45.535Z",
          "updatedAt": "2026-01-19T11:12:45.535Z",
          "media": []
        },
        {
          "id": 232,
          "roomNumber": 2,
          "floor": 1,
          "name": "along knowingly",
          "type": "HOME_CINEMA",
          "description": "blushing eek strictly mockingly geez altruistic tributary yowza where psst",
          "size": 15,
          "features": [
            "OPEN_PLAN",
            "BAY_WINDOW",
            "BUILT_IN_SHELVING",
            "HAS_VIEW",
            "ACCOUSTIC_PANELS",
            "CONSERVATORY"
          ],
          "propertyId": 113,
          "createdAt": "2026-01-19T11:12:45.535Z",
          "updatedAt": "2026-01-19T11:12:45.535Z",
          "media": []
        },
        {
          "id": 233,
          "roomNumber": 3,
          "floor": 3,
          "name": "canter absent",
          "type": "LIVING_ROOM",
          "description": "mathematics norm lively discrete flimsy infamous jagged golden apud entry",
          "size": 42,
          "features": [
            "OPEN_CONCEPT",
            "BUILT_IN_SHELVING",
            "PATIO_DOORS",
            "BUILT_IN_STORAGE",
            "HARDWOOD_FLOORING",
            "CONSERVATORY"
          ],
          "propertyId": 113,
          "createdAt": "2026-01-19T11:12:45.535Z",
          "updatedAt": "2026-01-19T11:12:45.535Z",
          "media": []
        }
      ],
      "utility": {
        "id": 113,
        "description": "casket monthly meh oval almost sniveling indeed rawhide epic premier",
        "features": [],
        "size": 13.04605301966834,
        "propertyId": 113,
        "createdAt": "2026-01-19T11:12:45.535Z",
        "updatedAt": "2026-01-19T11:12:45.535Z"
      },
      "outdoorSpace": {
        "id": 91,
        "description": "pertain yum clinch offensively dark cute handle quash boohoo aside",
        "totalArea": 354.38,
        "features": [
          "BALCONY",
          "SUMMER_HOUSE",
          "GARDEN_OFFICE"
        ],
        "propertyId": 113,
        "createdAt": "2026-01-19T11:12:45.535Z",
        "updatedAt": "2026-01-19T11:12:45.535Z",
        "yard": [
          {
            "id": 152,
            "description": null,
            "name": "Rear Yard",
            "size": 20.06,
            "additionalDetails": false,
            "facing": "WEST",
            "position": "REAR",
            "features": [],
            "createdAt": "2026-01-19T11:12:45.535Z",
            "updatedAt": "2026-01-19T11:12:45.535Z",
            "outdoorSpaceId": 91,
            "media": []
          }
        ],
        "garden": [
          {
            "id": 135,
            "description": null,
            "name": "Front Garden",
            "size": 56.12,
            "additionalDetails": false,
            "facing": "SOUTH",
            "position": "FRONT",
            "features": [],
            "createdAt": "2026-01-19T11:12:45.535Z",
            "updatedAt": "2026-01-19T11:12:45.535Z",
            "outdoorSpaceId": 91,
            "media": []
          },
          {
            "id": 136,
            "description": null,
            "name": "Side Garden",
            "size": 89.14,
            "additionalDetails": false,
            "facing": "WEST",
            "position": "SIDE",
            "features": [],
            "createdAt": "2026-01-19T11:12:45.535Z",
            "updatedAt": "2026-01-19T11:12:45.535Z",
            "outdoorSpaceId": 91,
            "media": []
          }
        ],
        "land": [
          {
            "id": 113,
            "description": null,
            "additionalDetails": false,
            "size": 189.06,
            "name": "Paddock",
            "separateParcel": false,
            "features": [],
            "createdAt": "2026-01-19T11:12:45.535Z",
            "updatedAt": "2026-01-19T11:12:45.535Z",
            "outdoorSpaceId": 91,
            "media": []
          }
        ],
        "media": []
      },
      "energyAndUtilities": {
        "id": 113,
        "propertyId": 113,
        "description": "above ick bend lest tiny strictly or near gloomy since",
        "epcRating": "F",
        "epcCertificateUrl": "https://surprised-devastation.org/",
        "primaryHeatingType": [
          "OIL",
          "UNDERFLOOR"
        ],
        "secondaryHeatingType": [
          "LPG",
          "SOLAR_THERMAL"
        ],
        "boilerType": "CONVENTIONAL",
        "hotWaterSource": "SOLAR_THERMAL",
        "renewables": [
          "EV_CHARGING",
          "SMART_METER"
        ],
        "connectedUtilities": [
          "SEPTIC_TANK",
          "GAS",
          "ELECTRICITY"
        ],
        "broadbandType": "MOBILE",
        "fullFibreAvailable": false,
        "maxDownloadSpeedMbps": 198,
        "createdAt": "2026-01-19T11:12:45.535Z",
        "updatedAt": "2026-01-19T11:12:45.535Z"
      },
      "securityFeatures": {
        "id": 113,
        "description": "pfft coal save unto gape charm drat following sometimes bashfully concerning phew once behind what",
        "features": [
          "CCTV",
          "NEIGHBORHOOD_WATCH",
          "INTERCOM_SYSTEM"
        ],
        "propertyId": 113,
        "createdAt": "2026-01-19T11:12:45.535Z",
        "updatedAt": "2026-01-19T11:12:45.535Z"
      },
      "storageFeatures": {
        "id": 113,
        "description": "wavy madly brr indeed coaxingly stunt castanet ugh nougat weep windy back from yuck validity starboard clone an amount step",
        "features": [
          "UNDER_STAIRS_STORAGE"
        ],
        "propertyId": 113,
        "createdAt": "2026-01-19T11:12:45.535Z",
        "updatedAt": "2026-01-19T11:12:45.535Z"
      },
      "runningCosts": {
        "id": 113,
        "description": "outside ack basket procurement stabilise fantastic bidet courteous by ascribe lest forager next kettledrum yippee",
        "councilTaxBand": "E",
        "serviceCharges": 230.06,
        "groundRent": 83.25,
        "propertyId": 113,
        "createdAt": "2026-01-19T11:12:45.535Z",
        "updatedAt": "2026-01-19T11:12:45.535Z"
      }
    },
    "user": {
      "id": 8,
      "username": "Ben3_5",
      "email": "5_Garrett_Rowe@gmail.com",
      "createdAt": "2026-01-19T11:13:37.360Z"
    },
    "listingType": "buy"
  },
  {
    "id": 59,
    "price": 215236.86,
    "moveInDate": "2026-04-02T16:00:06.746Z",
    "listingTier": "FEATURED",
    "listingStartDate": "2026-01-19T11:13:38.282Z",
    "listingEndDate": "2027-01-18T06:32:32.936Z",
    "viewingOptions": "evenly wherever reschedule deeply provided miserly if scuffle oxidise tusk",
    "verificationLevel": "UNVERIFIED",
    "userId": 12,
    "propertyId": 31,
    "estateAgentId": null,
    "publishedAt": "2026-01-15T16:34:25.449Z",
    "published": true,
    "createdAt": "2026-01-19T11:13:39.082Z",
    "updatedAt": "2026-01-19T11:13:39.082Z",
    "archived": false,
    "archivedAt": null,
    "rentalListing": null,
    "saleListing": {
      "id": 25,
      "listingId": 59,
      "tenureType": "LEASEHOLD",
      "chain": true,
      "sharedOwnership": false,
      "priceType": "GUIDE_PRICE",
      "availabilityStatus": "UNDER_OFFER",
      "draftListingId": null
    },
    "property": {
      "id": 31,
      "description": "as psst closely chow gadzooks an given thoroughly instead before indeed drat carefully who bah taut unlike trouser throughout that",
      "value": 591772.12,
      "size": 110,
      "yearBuilt": "2025",
      "chainFree": true,
      "vacant": true,
      "constructionType": "NON_STANDARD",
      "floorLevel": null,
      "totalFloors": 1,
      "numberBedrooms": 4,
      "numberBathrooms": 1,
      "numberReceptions": 2,
      "numberOtherRooms": 1,
      "numberKitchens": 2,
      "createdAt": "2026-01-19T11:12:45.138Z",
      "updatedAt": "2026-01-19T11:12:45.138Z",
      "addressId": 40,
      "userId": 1,
      "estateAgentId": null,
      "propertyTypeId": 1,
      "propertyClassificationId": 3,
      "address": {
        "id": 40,
        "number": "18",
        "flat": null,
        "name": null,
        "street": "Green Street",
        "city": "Cardiff",
        "postcode": "CF11 6LN",
        "country": null,
        "locality": null,
        "county": null,
        "district": null,
        "fullAddress": "18, Green Street, Cardiff, CF11 6LN",
        "lat": 51.480555,
        "lon": -3.188261,
        "createdAt": "2026-01-19T11:12:45.138Z",
        "updatedAt": "2026-01-19T11:12:45.138Z"
      },
      "media": [
        {
          "id": 317,
          "image": "d0f1451c-5944-431d-8b40-583622460f00",
          "videoTour": null,
          "floorPlan": null,
          "metadata": "{\"alt\":\"Exterior - meander around pfft\",\"description\":\"cuddly whenever vaguely pro monstrous\",\"roomType\":\"Exterior\",\"cloudflareImageId\":\"d0f1451c-5944-431d-8b40-583622460f00\"}",
          "propertyId": 31,
          "sortOrder": 0,
          "createdAt": "2026-01-19T11:12:58.677Z",
          "updatedAt": "2026-01-19T11:12:58.677Z",
          "bedroomId": null,
          "bathroomId": null,
          "receptionId": null,
          "otherRoomId": null,
          "kitchenId": null,
          "gardenId": null,
          "outdoorSpaceId": null,
          "landId": null,
          "yardId": null
        },
        {
          "id": 318,
          "image": "55957534-6202-4033-361b-f67b7fd89000",
          "videoTour": null,
          "floorPlan": null,
          "metadata": "{\"alt\":\"Garden - pillbox hepatitis elevator\",\"description\":\"brochure boggle until exactly welcome\",\"roomType\":\"Garden\",\"cloudflareImageId\":\"55957534-6202-4033-361b-f67b7fd89000\"}",
          "propertyId": 31,
          "sortOrder": 0,
          "createdAt": "2026-01-19T11:12:58.677Z",
          "updatedAt": "2026-01-19T11:12:58.677Z",
          "bedroomId": null,
          "bathroomId": null,
          "receptionId": null,
          "otherRoomId": null,
          "kitchenId": null,
          "gardenId": null,
          "outdoorSpaceId": null,
          "landId": null,
          "yardId": null
        },
        {
          "id": 319,
          "image": "792b6525-3036-4fe7-6972-ee6219cc0900",
          "videoTour": null,
          "floorPlan": null,
          "metadata": "{\"alt\":\"Dining Room\",\"description\":\"gah strong whoa beneath euphonium\",\"roomType\":\"Dining Room\",\"cloudflareImageId\":\"792b6525-3036-4fe7-6972-ee6219cc0900\"}",
          "propertyId": 31,
          "sortOrder": 0,
          "createdAt": "2026-01-19T11:12:58.677Z",
          "updatedAt": "2026-01-19T11:12:58.677Z",
          "bedroomId": null,
          "bathroomId": null,
          "receptionId": null,
          "otherRoomId": null,
          "kitchenId": null,
          "gardenId": null,
          "outdoorSpaceId": null,
          "landId": null,
          "yardId": null
        },
        {
          "id": 320,
          "image": "baa60ea5-5a77-42b5-c954-840afa6c0300",
          "videoTour": null,
          "floorPlan": null,
          "metadata": "{\"alt\":\"Home Office\",\"description\":\"er offset hopeful glittering whether\",\"roomType\":\"Home Office\",\"cloudflareImageId\":\"baa60ea5-5a77-42b5-c954-840afa6c0300\"}",
          "propertyId": 31,
          "sortOrder": 0,
          "createdAt": "2026-01-19T11:12:58.677Z",
          "updatedAt": "2026-01-19T11:12:58.677Z",
          "bedroomId": null,
          "bathroomId": null,
          "receptionId": null,
          "otherRoomId": null,
          "kitchenId": null,
          "gardenId": null,
          "outdoorSpaceId": null,
          "landId": null,
          "yardId": null
        },
        {
          "id": 321,
          "image": "9ef289b1-e2cf-4e70-a1e3-1ca4beba4f00",
          "videoTour": null,
          "floorPlan": null,
          "metadata": "{\"alt\":\"Bedroom 1\",\"description\":\"than circulate store best-seller mmm\",\"roomType\":\"Bedroom 1\",\"cloudflareImageId\":\"9ef289b1-e2cf-4e70-a1e3-1ca4beba4f00\"}",
          "propertyId": 31,
          "sortOrder": 0,
          "createdAt": "2026-01-19T11:12:58.677Z",
          "updatedAt": "2026-01-19T11:12:58.677Z",
          "bedroomId": 94,
          "bathroomId": null,
          "receptionId": null,
          "otherRoomId": null,
          "kitchenId": null,
          "gardenId": null,
          "outdoorSpaceId": null,
          "landId": null,
          "yardId": null
        },
        {
          "id": 322,
          "image": "97774d3c-da7b-4088-fc2e-c773d4436800",
          "videoTour": null,
          "floorPlan": null,
          "metadata": "{\"alt\":\"Bedroom 2 - relative wherever graffiti\",\"description\":\"unless between drat instantly cluttered\",\"roomType\":\"Bedroom 2\",\"cloudflareImageId\":\"97774d3c-da7b-4088-fc2e-c773d4436800\"}",
          "propertyId": 31,
          "sortOrder": 0,
          "createdAt": "2026-01-19T11:12:58.677Z",
          "updatedAt": "2026-01-19T11:12:58.677Z",
          "bedroomId": 95,
          "bathroomId": null,
          "receptionId": null,
          "otherRoomId": null,
          "kitchenId": null,
          "gardenId": null,
          "outdoorSpaceId": null,
          "landId": null,
          "yardId": null
        },
        {
          "id": 323,
          "image": "9ef289b1-e2cf-4e70-a1e3-1ca4beba4f00",
          "videoTour": null,
          "floorPlan": null,
          "metadata": "{\"alt\":\"Bedroom 3 - yuck frightfully usually\",\"description\":\"minus drat yum whoa against\",\"roomType\":\"Bedroom 3\",\"cloudflareImageId\":\"9ef289b1-e2cf-4e70-a1e3-1ca4beba4f00\"}",
          "propertyId": 31,
          "sortOrder": 0,
          "createdAt": "2026-01-19T11:12:58.677Z",
          "updatedAt": "2026-01-19T11:12:58.677Z",
          "bedroomId": 96,
          "bathroomId": null,
          "receptionId": null,
          "otherRoomId": null,
          "kitchenId": null,
          "gardenId": null,
          "outdoorSpaceId": null,
          "landId": null,
          "yardId": null
        },
        {
          "id": 324,
          "image": "e589761d-9b78-4f8f-a5d0-c81dbe97e700",
          "videoTour": null,
          "floorPlan": null,
          "metadata": "{\"alt\":\"Bedroom 3 - superb reference aboard\",\"description\":\"abacus unfortunate searchingly wholly ramp\",\"roomType\":\"Bedroom 3\",\"cloudflareImageId\":\"e589761d-9b78-4f8f-a5d0-c81dbe97e700\"}",
          "propertyId": 31,
          "sortOrder": 0,
          "createdAt": "2026-01-19T11:12:58.677Z",
          "updatedAt": "2026-01-19T11:12:58.677Z",
          "bedroomId": 96,
          "bathroomId": null,
          "receptionId": null,
          "otherRoomId": null,
          "kitchenId": null,
          "gardenId": null,
          "outdoorSpaceId": null,
          "landId": null,
          "yardId": null
        },
        {
          "id": 325,
          "image": "e589761d-9b78-4f8f-a5d0-c81dbe97e700",
          "videoTour": null,
          "floorPlan": null,
          "metadata": "{\"alt\":\"Bedroom 4 - uh-huh factorise save\",\"description\":\"hunt geez gratefully once thigh\",\"roomType\":\"Bedroom 4\",\"cloudflareImageId\":\"e589761d-9b78-4f8f-a5d0-c81dbe97e700\"}",
          "propertyId": 31,
          "sortOrder": 0,
          "createdAt": "2026-01-19T11:12:58.677Z",
          "updatedAt": "2026-01-19T11:12:58.677Z",
          "bedroomId": 97,
          "bathroomId": null,
          "receptionId": null,
          "otherRoomId": null,
          "kitchenId": null,
          "gardenId": null,
          "outdoorSpaceId": null,
          "landId": null,
          "yardId": null
        },
        {
          "id": 326,
          "image": "e589761d-9b78-4f8f-a5d0-c81dbe97e700",
          "videoTour": null,
          "floorPlan": null,
          "metadata": "{\"alt\":\"Bedroom 4 - acidly lest vary\",\"description\":\"more guard until overproduce celebrate\",\"roomType\":\"Bedroom 4\",\"cloudflareImageId\":\"e589761d-9b78-4f8f-a5d0-c81dbe97e700\"}",
          "propertyId": 31,
          "sortOrder": 0,
          "createdAt": "2026-01-19T11:12:58.677Z",
          "updatedAt": "2026-01-19T11:12:58.677Z",
          "bedroomId": 97,
          "bathroomId": null,
          "receptionId": null,
          "otherRoomId": null,
          "kitchenId": null,
          "gardenId": null,
          "outdoorSpaceId": null,
          "landId": null,
          "yardId": null
        },
        {
          "id": 327,
          "image": "d181f96f-be34-4e99-2095-eb7319827900",
          "videoTour": null,
          "floorPlan": null,
          "metadata": "{\"alt\":\"Kitchen 1 - oof scale shush\",\"description\":\"provider hm whether geez down\",\"roomType\":\"Kitchen 1\",\"cloudflareImageId\":\"d181f96f-be34-4e99-2095-eb7319827900\"}",
          "propertyId": 31,
          "sortOrder": 0,
          "createdAt": "2026-01-19T11:12:58.677Z",
          "updatedAt": "2026-01-19T11:12:58.677Z",
          "bedroomId": null,
          "bathroomId": null,
          "receptionId": null,
          "otherRoomId": null,
          "kitchenId": 63,
          "gardenId": null,
          "outdoorSpaceId": null,
          "landId": null,
          "yardId": null
        },
        {
          "id": 328,
          "image": "d181f96f-be34-4e99-2095-eb7319827900",
          "videoTour": null,
          "floorPlan": null,
          "metadata": "{\"alt\":\"Kitchen 1 - absent aw so\",\"description\":\"although meanwhile castanet some fondly\",\"roomType\":\"Kitchen 1\",\"cloudflareImageId\":\"d181f96f-be34-4e99-2095-eb7319827900\"}",
          "propertyId": 31,
          "sortOrder": 0,
          "createdAt": "2026-01-19T11:12:58.677Z",
          "updatedAt": "2026-01-19T11:12:58.677Z",
          "bedroomId": null,
          "bathroomId": null,
          "receptionId": null,
          "otherRoomId": null,
          "kitchenId": 63,
          "gardenId": null,
          "outdoorSpaceId": null,
          "landId": null,
          "yardId": null
        },
        {
          "id": 329,
          "image": "d181f96f-be34-4e99-2095-eb7319827900",
          "videoTour": null,
          "floorPlan": null,
          "metadata": "{\"alt\":\"Kitchen 1 - sting runny intent\",\"description\":\"meh excess fold minus divert\",\"roomType\":\"Kitchen 1\",\"cloudflareImageId\":\"d181f96f-be34-4e99-2095-eb7319827900\"}",
          "propertyId": 31,
          "sortOrder": 0,
          "createdAt": "2026-01-19T11:12:58.677Z",
          "updatedAt": "2026-01-19T11:12:58.677Z",
          "bedroomId": null,
          "bathroomId": null,
          "receptionId": null,
          "otherRoomId": null,
          "kitchenId": 64,
          "gardenId": null,
          "outdoorSpaceId": null,
          "landId": null,
          "yardId": null
        },
        {
          "id": 330,
          "image": "51972637-4e53-48d5-b11f-5eedb66f7000",
          "videoTour": null,
          "floorPlan": null,
          "metadata": "{\"alt\":\"Bathroom 1 - whether steak refer\",\"description\":\"ah the painfully excepting once\",\"roomType\":\"Bathroom 1\",\"cloudflareImageId\":\"51972637-4e53-48d5-b11f-5eedb66f7000\"}",
          "propertyId": 31,
          "sortOrder": 0,
          "createdAt": "2026-01-19T11:12:58.677Z",
          "updatedAt": "2026-01-19T11:12:58.677Z",
          "bedroomId": null,
          "bathroomId": 46,
          "receptionId": null,
          "otherRoomId": null,
          "kitchenId": null,
          "gardenId": null,
          "outdoorSpaceId": null,
          "landId": null,
          "yardId": null
        },
        {
          "id": 331,
          "image": "5a85c20c-7c37-44c6-ab91-1b38b29a7a00",
          "videoTour": null,
          "floorPlan": null,
          "metadata": "{\"alt\":\"Bathroom 1 - final partially woot\",\"description\":\"far circa nervous apropos median\",\"roomType\":\"Bathroom 1\",\"cloudflareImageId\":\"5a85c20c-7c37-44c6-ab91-1b38b29a7a00\"}",
          "propertyId": 31,
          "sortOrder": 0,
          "createdAt": "2026-01-19T11:12:58.677Z",
          "updatedAt": "2026-01-19T11:12:58.677Z",
          "bedroomId": null,
          "bathroomId": 46,
          "receptionId": null,
          "otherRoomId": null,
          "kitchenId": null,
          "gardenId": null,
          "outdoorSpaceId": null,
          "landId": null,
          "yardId": null
        },
        {
          "id": 332,
          "image": "f08471ae-a51d-4a43-9632-7a193b129500",
          "videoTour": null,
          "floorPlan": null,
          "metadata": "{\"alt\":\"Reception 1 - clumsy damp besides\",\"description\":\"inside out out stake these\",\"roomType\":\"Reception 1\",\"cloudflareImageId\":\"f08471ae-a51d-4a43-9632-7a193b129500\"}",
          "propertyId": 31,
          "sortOrder": 0,
          "createdAt": "2026-01-19T11:12:58.677Z",
          "updatedAt": "2026-01-19T11:12:58.677Z",
          "bedroomId": null,
          "bathroomId": null,
          "receptionId": 64,
          "otherRoomId": null,
          "kitchenId": null,
          "gardenId": null,
          "outdoorSpaceId": null,
          "landId": null,
          "yardId": null
        },
        {
          "id": 333,
          "image": "f7552b9d-fcaa-4688-cfc6-e7f66910fe00",
          "videoTour": null,
          "floorPlan": null,
          "metadata": "{\"alt\":\"Reception 1 - optimal receptor impure\",\"description\":\"overwork during than whether anguished\",\"roomType\":\"Reception 1\",\"cloudflareImageId\":\"f7552b9d-fcaa-4688-cfc6-e7f66910fe00\"}",
          "propertyId": 31,
          "sortOrder": 0,
          "createdAt": "2026-01-19T11:12:58.677Z",
          "updatedAt": "2026-01-19T11:12:58.677Z",
          "bedroomId": null,
          "bathroomId": null,
          "receptionId": 64,
          "otherRoomId": null,
          "kitchenId": null,
          "gardenId": null,
          "outdoorSpaceId": null,
          "landId": null,
          "yardId": null
        },
        {
          "id": 334,
          "image": "f08471ae-a51d-4a43-9632-7a193b129500",
          "videoTour": null,
          "floorPlan": null,
          "metadata": "{\"alt\":\"Reception 2 - typewriter rear considering\",\"description\":\"cinder worth qua prime opposite\",\"roomType\":\"Reception 2\",\"cloudflareImageId\":\"f08471ae-a51d-4a43-9632-7a193b129500\"}",
          "propertyId": 31,
          "sortOrder": 0,
          "createdAt": "2026-01-19T11:12:58.677Z",
          "updatedAt": "2026-01-19T11:12:58.677Z",
          "bedroomId": null,
          "bathroomId": null,
          "receptionId": 65,
          "otherRoomId": null,
          "kitchenId": null,
          "gardenId": null,
          "outdoorSpaceId": null,
          "landId": null,
          "yardId": null
        },
        {
          "id": 335,
          "image": "f7552b9d-fcaa-4688-cfc6-e7f66910fe00",
          "videoTour": null,
          "floorPlan": null,
          "metadata": "{\"alt\":\"Reception 2 - doubter hence mortally\",\"description\":\"but instead reorient courageous by\",\"roomType\":\"Reception 2\",\"cloudflareImageId\":\"f7552b9d-fcaa-4688-cfc6-e7f66910fe00\"}",
          "propertyId": 31,
          "sortOrder": 0,
          "createdAt": "2026-01-19T11:12:58.677Z",
          "updatedAt": "2026-01-19T11:12:58.677Z",
          "bedroomId": null,
          "bathroomId": null,
          "receptionId": 65,
          "otherRoomId": null,
          "kitchenId": null,
          "gardenId": null,
          "outdoorSpaceId": null,
          "landId": null,
          "yardId": null
        },
        {
          "id": 336,
          "image": "479fd527-0e2e-476f-1445-957e70333900",
          "videoTour": null,
          "floorPlan": null,
          "metadata": "{\"alt\":\"Other Room 1 - blind concerned medium\",\"description\":\"limp lest gosh wetly phew\",\"roomType\":\"Other Room 1\",\"cloudflareImageId\":\"479fd527-0e2e-476f-1445-957e70333900\"}",
          "propertyId": 31,
          "sortOrder": 0,
          "createdAt": "2026-01-19T11:12:58.677Z",
          "updatedAt": "2026-01-19T11:12:58.677Z",
          "bedroomId": null,
          "bathroomId": null,
          "receptionId": null,
          "otherRoomId": 68,
          "kitchenId": null,
          "gardenId": null,
          "outdoorSpaceId": null,
          "landId": null,
          "yardId": null
        }
      ],
      "type": {
        "id": 1,
        "name": "House",
        "defaultSelected": true
      },
      "classification": {
        "id": 3,
        "name": "Semi-detached",
        "categoryId": 1
      },
      "bedroomFeatures": [
        {
          "id": 94,
          "roomNumber": 1,
          "name": "Master Bedroom",
          "bed": [
            "QUEEN"
          ],
          "floor": 1,
          "description": "ashamed instead until phooey unsightly lest swiftly middle whose swim",
          "features": [
            "BUILT_IN_STORAGE",
            "HAS_VIEW",
            "PATIO_DOORS"
          ],
          "size": 24,
          "propertyId": 31,
          "createdAt": "2026-01-19T11:12:45.138Z",
          "updatedAt": "2026-01-19T11:12:45.138Z",
          "media": [
            {
              "id": 321,
              "image": "9ef289b1-e2cf-4e70-a1e3-1ca4beba4f00",
              "videoTour": null,
              "floorPlan": null,
              "metadata": "{\"alt\":\"Bedroom 1\",\"description\":\"than circulate store best-seller mmm\",\"roomType\":\"Bedroom 1\",\"cloudflareImageId\":\"9ef289b1-e2cf-4e70-a1e3-1ca4beba4f00\"}",
              "propertyId": 31,
              "sortOrder": 0,
              "createdAt": "2026-01-19T11:12:58.677Z",
              "updatedAt": "2026-01-19T11:12:58.677Z",
              "bedroomId": 94,
              "bathroomId": null,
              "receptionId": null,
              "otherRoomId": null,
              "kitchenId": null,
              "gardenId": null,
              "outdoorSpaceId": null,
              "landId": null,
              "yardId": null
            }
          ]
        },
        {
          "id": 95,
          "roomNumber": 2,
          "name": "Nursery",
          "bed": [
            "DOUBLE"
          ],
          "floor": 1,
          "description": "plus functional boldly affect provided eek inject bind gulp alongside",
          "features": [
            "EN_SUITE",
            "BAY_WINDOW",
            "BALCONY",
            "PATIO_DOORS"
          ],
          "size": 44,
          "propertyId": 31,
          "createdAt": "2026-01-19T11:12:45.138Z",
          "updatedAt": "2026-01-19T11:12:45.138Z",
          "media": [
            {
              "id": 322,
              "image": "97774d3c-da7b-4088-fc2e-c773d4436800",
              "videoTour": null,
              "floorPlan": null,
              "metadata": "{\"alt\":\"Bedroom 2 - relative wherever graffiti\",\"description\":\"unless between drat instantly cluttered\",\"roomType\":\"Bedroom 2\",\"cloudflareImageId\":\"97774d3c-da7b-4088-fc2e-c773d4436800\"}",
              "propertyId": 31,
              "sortOrder": 0,
              "createdAt": "2026-01-19T11:12:58.677Z",
              "updatedAt": "2026-01-19T11:12:58.677Z",
              "bedroomId": 95,
              "bathroomId": null,
              "receptionId": null,
              "otherRoomId": null,
              "kitchenId": null,
              "gardenId": null,
              "outdoorSpaceId": null,
              "landId": null,
              "yardId": null
            }
          ]
        },
        {
          "id": 96,
          "roomNumber": 3,
          "name": "Nursery",
          "bed": [
            "KING"
          ],
          "floor": 1,
          "description": "so narrowcast and hmph throughout seriously misread unselfish birdbath bend",
          "features": [
            "BAY_WINDOW",
            "BALCONY",
            "PATIO_DOORS"
          ],
          "size": 32,
          "propertyId": 31,
          "createdAt": "2026-01-19T11:12:45.138Z",
          "updatedAt": "2026-01-19T11:12:45.138Z",
          "media": [
            {
              "id": 323,
              "image": "9ef289b1-e2cf-4e70-a1e3-1ca4beba4f00",
              "videoTour": null,
              "floorPlan": null,
              "metadata": "{\"alt\":\"Bedroom 3 - yuck frightfully usually\",\"description\":\"minus drat yum whoa against\",\"roomType\":\"Bedroom 3\",\"cloudflareImageId\":\"9ef289b1-e2cf-4e70-a1e3-1ca4beba4f00\"}",
              "propertyId": 31,
              "sortOrder": 0,
              "createdAt": "2026-01-19T11:12:58.677Z",
              "updatedAt": "2026-01-19T11:12:58.677Z",
              "bedroomId": 96,
              "bathroomId": null,
              "receptionId": null,
              "otherRoomId": null,
              "kitchenId": null,
              "gardenId": null,
              "outdoorSpaceId": null,
              "landId": null,
              "yardId": null
            },
            {
              "id": 324,
              "image": "e589761d-9b78-4f8f-a5d0-c81dbe97e700",
              "videoTour": null,
              "floorPlan": null,
              "metadata": "{\"alt\":\"Bedroom 3 - superb reference aboard\",\"description\":\"abacus unfortunate searchingly wholly ramp\",\"roomType\":\"Bedroom 3\",\"cloudflareImageId\":\"e589761d-9b78-4f8f-a5d0-c81dbe97e700\"}",
              "propertyId": 31,
              "sortOrder": 0,
              "createdAt": "2026-01-19T11:12:58.677Z",
              "updatedAt": "2026-01-19T11:12:58.677Z",
              "bedroomId": 96,
              "bathroomId": null,
              "receptionId": null,
              "otherRoomId": null,
              "kitchenId": null,
              "gardenId": null,
              "outdoorSpaceId": null,
              "landId": null,
              "yardId": null
            }
          ]
        },
        {
          "id": 97,
          "roomNumber": 4,
          "name": "Guest Bedroom",
          "bed": [
            "DOUBLE"
          ],
          "floor": 1,
          "description": "accidentally mmm consequently hovercraft comparison milky mysteriously bah hence unrealistic",
          "features": [
            "EN_SUITE",
            "BAY_WINDOW",
            "PATIO_DOORS",
            "BUILT_IN_DESK"
          ],
          "size": 14,
          "propertyId": 31,
          "createdAt": "2026-01-19T11:12:45.138Z",
          "updatedAt": "2026-01-19T11:12:45.138Z",
          "media": [
            {
              "id": 325,
              "image": "e589761d-9b78-4f8f-a5d0-c81dbe97e700",
              "videoTour": null,
              "floorPlan": null,
              "metadata": "{\"alt\":\"Bedroom 4 - uh-huh factorise save\",\"description\":\"hunt geez gratefully once thigh\",\"roomType\":\"Bedroom 4\",\"cloudflareImageId\":\"e589761d-9b78-4f8f-a5d0-c81dbe97e700\"}",
              "propertyId": 31,
              "sortOrder": 0,
              "createdAt": "2026-01-19T11:12:58.677Z",
              "updatedAt": "2026-01-19T11:12:58.677Z",
              "bedroomId": 97,
              "bathroomId": null,
              "receptionId": null,
              "otherRoomId": null,
              "kitchenId": null,
              "gardenId": null,
              "outdoorSpaceId": null,
              "landId": null,
              "yardId": null
            },
            {
              "id": 326,
              "image": "e589761d-9b78-4f8f-a5d0-c81dbe97e700",
              "videoTour": null,
              "floorPlan": null,
              "metadata": "{\"alt\":\"Bedroom 4 - acidly lest vary\",\"description\":\"more guard until overproduce celebrate\",\"roomType\":\"Bedroom 4\",\"cloudflareImageId\":\"e589761d-9b78-4f8f-a5d0-c81dbe97e700\"}",
              "propertyId": 31,
              "sortOrder": 0,
              "createdAt": "2026-01-19T11:12:58.677Z",
              "updatedAt": "2026-01-19T11:12:58.677Z",
              "bedroomId": 97,
              "bathroomId": null,
              "receptionId": null,
              "otherRoomId": null,
              "kitchenId": null,
              "gardenId": null,
              "outdoorSpaceId": null,
              "landId": null,
              "yardId": null
            }
          ]
        }
      ],
      "bathroomFeatures": [
        {
          "id": 46,
          "roomNumber": 1,
          "floor": 0,
          "name": "Shared Bathroom",
          "features": [
            "TOILET",
            "BATHTUB",
            "WALK_IN_SHOWER"
          ],
          "description": "boo round avaricious inasmuch procurement careless across quantify whose cutover",
          "size": 15,
          "propertyId": 31,
          "createdAt": "2026-01-19T11:12:45.138Z",
          "updatedAt": "2026-01-19T11:12:45.138Z",
          "media": [
            {
              "id": 330,
              "image": "51972637-4e53-48d5-b11f-5eedb66f7000",
              "videoTour": null,
              "floorPlan": null,
              "metadata": "{\"alt\":\"Bathroom 1 - whether steak refer\",\"description\":\"ah the painfully excepting once\",\"roomType\":\"Bathroom 1\",\"cloudflareImageId\":\"51972637-4e53-48d5-b11f-5eedb66f7000\"}",
              "propertyId": 31,
              "sortOrder": 0,
              "createdAt": "2026-01-19T11:12:58.677Z",
              "updatedAt": "2026-01-19T11:12:58.677Z",
              "bedroomId": null,
              "bathroomId": 46,
              "receptionId": null,
              "otherRoomId": null,
              "kitchenId": null,
              "gardenId": null,
              "outdoorSpaceId": null,
              "landId": null,
              "yardId": null
            },
            {
              "id": 331,
              "image": "5a85c20c-7c37-44c6-ab91-1b38b29a7a00",
              "videoTour": null,
              "floorPlan": null,
              "metadata": "{\"alt\":\"Bathroom 1 - final partially woot\",\"description\":\"far circa nervous apropos median\",\"roomType\":\"Bathroom 1\",\"cloudflareImageId\":\"5a85c20c-7c37-44c6-ab91-1b38b29a7a00\"}",
              "propertyId": 31,
              "sortOrder": 0,
              "createdAt": "2026-01-19T11:12:58.677Z",
              "updatedAt": "2026-01-19T11:12:58.677Z",
              "bedroomId": null,
              "bathroomId": 46,
              "receptionId": null,
              "otherRoomId": null,
              "kitchenId": null,
              "gardenId": null,
              "outdoorSpaceId": null,
              "landId": null,
              "yardId": null
            }
          ]
        }
      ],
      "otherRoom": [
        {
          "id": 68,
          "roomNumber": 1,
          "floor": 0,
          "name": "geez scholarship",
          "type": "WINE_CELLAR",
          "description": "if spectacles dividend and under zowie pension arid plus indeed",
          "size": 22,
          "features": [
            "BAR_AREA",
            "SOUND_PROOFING",
            "STONE_FLOORING",
            "HARDWOOD_FLOORING",
            "BUILT_IN_DESK"
          ],
          "propertyId": 31,
          "createdAt": "2026-01-19T11:12:45.138Z",
          "updatedAt": "2026-01-19T11:12:45.138Z",
          "media": [
            {
              "id": 336,
              "image": "479fd527-0e2e-476f-1445-957e70333900",
              "videoTour": null,
              "floorPlan": null,
              "metadata": "{\"alt\":\"Other Room 1 - blind concerned medium\",\"description\":\"limp lest gosh wetly phew\",\"roomType\":\"Other Room 1\",\"cloudflareImageId\":\"479fd527-0e2e-476f-1445-957e70333900\"}",
              "propertyId": 31,
              "sortOrder": 0,
              "createdAt": "2026-01-19T11:12:58.677Z",
              "updatedAt": "2026-01-19T11:12:58.677Z",
              "bedroomId": null,
              "bathroomId": null,
              "receptionId": null,
              "otherRoomId": 68,
              "kitchenId": null,
              "gardenId": null,
              "outdoorSpaceId": null,
              "landId": null,
              "yardId": null
            }
          ]
        }
      ],
      "parking": {
        "id": 32,
        "description": "amongst fatal hyphenation unbalance exhausted nucleotidase avow pfft typify meanwhile",
        "features": [
          "PERMIT_PARKING",
          "NO_PARKING",
          "EV_CHARGING"
        ],
        "propertyId": 31,
        "createdAt": "2026-01-19T11:12:45.138Z",
        "updatedAt": "2026-01-19T11:12:45.138Z"
      },
      "amenities": [
        {
          "id": 541,
          "type": "EDUCATION",
          "subtype": "SCHOOL",
          "name": "Yundt and Sons School",
          "distanceM": 2247,
          "description": null,
          "location": null,
          "propertyId": 31,
          "createdAt": "2026-01-19T11:12:45.138Z"
        },
        {
          "id": 542,
          "type": "EDUCATION",
          "subtype": "SCHOOL",
          "name": "Bauch, Friesen and Yost School",
          "distanceM": 1088,
          "description": null,
          "location": null,
          "propertyId": 31,
          "createdAt": "2026-01-19T11:12:45.138Z"
        },
        {
          "id": 543,
          "type": "EDUCATION",
          "subtype": "SCHOOL",
          "name": "Terry - Jakubowski School",
          "distanceM": 6350,
          "description": null,
          "location": null,
          "propertyId": 31,
          "createdAt": "2026-01-19T11:12:45.138Z"
        },
        {
          "id": 544,
          "type": "HEALTHCARE",
          "subtype": "HOSPITAL",
          "name": "Greenfelder, Ledner and Harris Hospital",
          "distanceM": 2753,
          "description": null,
          "location": null,
          "propertyId": 31,
          "createdAt": "2026-01-19T11:12:45.138Z"
        },
        {
          "id": 545,
          "type": "HEALTHCARE",
          "subtype": "HOSPITAL",
          "name": "Ortiz Group Hospital",
          "distanceM": 8653,
          "description": null,
          "location": null,
          "propertyId": 31,
          "createdAt": "2026-01-19T11:12:45.138Z"
        },
        {
          "id": 546,
          "type": "HEALTHCARE",
          "subtype": "HOSPITAL",
          "name": "Cassin, Zieme and Herzog Hospital",
          "distanceM": 5945,
          "description": null,
          "location": null,
          "propertyId": 31,
          "createdAt": "2026-01-19T11:12:45.138Z"
        },
        {
          "id": 547,
          "type": "TRANSPORT",
          "subtype": "TRAIN_STATION",
          "name": "Lebsackworth Train Station",
          "distanceM": 7665,
          "description": null,
          "location": null,
          "propertyId": 31,
          "createdAt": "2026-01-19T11:12:45.138Z"
        },
        {
          "id": 548,
          "type": "TRANSPORT",
          "subtype": "TRAIN_STATION",
          "name": "Theresiaburgh Train Station",
          "distanceM": 7264,
          "description": null,
          "location": null,
          "propertyId": 31,
          "createdAt": "2026-01-19T11:12:45.138Z"
        },
        {
          "id": 549,
          "type": "TRANSPORT",
          "subtype": "TRAIN_STATION",
          "name": "West Deltaland Train Station",
          "distanceM": 7168,
          "description": null,
          "location": null,
          "propertyId": 31,
          "createdAt": "2026-01-19T11:12:45.138Z"
        },
        {
          "id": 550,
          "type": "TRANSPORT",
          "subtype": "BUS_STOP",
          "name": "Logan Neck Bus Stop",
          "distanceM": 2398,
          "description": null,
          "location": null,
          "propertyId": 31,
          "createdAt": "2026-01-19T11:12:45.138Z"
        },
        {
          "id": 551,
          "type": "TRANSPORT",
          "subtype": "BUS_STOP",
          "name": "Dickinson Mall Bus Stop",
          "distanceM": 3400,
          "description": null,
          "location": null,
          "propertyId": 31,
          "createdAt": "2026-01-19T11:12:45.138Z"
        },
        {
          "id": 552,
          "type": "TRANSPORT",
          "subtype": "BUS_STOP",
          "name": "Hegmann Gateway Bus Stop",
          "distanceM": 8723,
          "description": null,
          "location": null,
          "propertyId": 31,
          "createdAt": "2026-01-19T11:12:45.138Z"
        },
        {
          "id": 553,
          "type": "GREEN_SPACE",
          "subtype": "PARK",
          "name": "Anabelleside Park",
          "distanceM": 986,
          "description": null,
          "location": null,
          "propertyId": 31,
          "createdAt": "2026-01-19T11:12:45.138Z"
        },
        {
          "id": 554,
          "type": "GREEN_SPACE",
          "subtype": "PARK",
          "name": "Mount Vernon Park",
          "distanceM": 1489,
          "description": null,
          "location": null,
          "propertyId": 31,
          "createdAt": "2026-01-19T11:12:45.138Z"
        },
        {
          "id": 555,
          "type": "GREEN_SPACE",
          "subtype": "PARK",
          "name": "Hyattshire Park",
          "distanceM": 8436,
          "description": null,
          "location": null,
          "propertyId": 31,
          "createdAt": "2026-01-19T11:12:45.138Z"
        },
        {
          "id": 556,
          "type": "SHOPPING_ENTERTAINMENT",
          "subtype": "GYM",
          "name": "Ernser Inc Gym",
          "distanceM": 4021,
          "description": null,
          "location": null,
          "propertyId": 31,
          "createdAt": "2026-01-19T11:12:45.138Z"
        },
        {
          "id": 557,
          "type": "SHOPPING_ENTERTAINMENT",
          "subtype": "GYM",
          "name": "Wolff Inc Gym",
          "distanceM": 5176,
          "description": null,
          "location": null,
          "propertyId": 31,
          "createdAt": "2026-01-19T11:12:45.138Z"
        },
        {
          "id": 558,
          "type": "SHOPPING_ENTERTAINMENT",
          "subtype": "GYM",
          "name": "Schulist and Sons Gym",
          "distanceM": 5102,
          "description": null,
          "location": null,
          "propertyId": 31,
          "createdAt": "2026-01-19T11:12:45.138Z"
        }
      ],
      "additionalFeatures": {
        "id": 31,
        "description": "smog brood decriminalize bustling meanwhile immediately cease bah jovially gosh",
        "petFriendly": true,
        "moveInDate": "2026-02-22T04:46:19.266Z",
        "features": [
          "SHOP"
        ],
        "propertyId": 31,
        "createdAt": "2026-01-19T11:12:45.138Z",
        "updatedAt": "2026-01-19T11:12:45.138Z"
      },
      "accessibilityFeatures": {
        "id": 31,
        "description": "probable gosh huzzah boggle thick spear inwardly own clamp before",
        "features": [
          "WHEELCHAIR_FRIENDLY"
        ],
        "propertyId": 31,
        "createdAt": "2026-01-19T11:12:45.138Z",
        "updatedAt": "2026-01-19T11:12:45.138Z"
      },
      "kitchenFeatures": [
        {
          "id": 63,
          "roomNumber": 1,
          "floor": 1,
          "name": "artistic adaptation",
          "features": [],
          "description": "for gadzooks monasticism into thread geez deduct brr alongside per",
          "size": 49,
          "propertyId": 31,
          "createdAt": "2026-01-19T11:12:45.138Z",
          "updatedAt": "2026-01-19T11:12:45.138Z",
          "media": [
            {
              "id": 327,
              "image": "d181f96f-be34-4e99-2095-eb7319827900",
              "videoTour": null,
              "floorPlan": null,
              "metadata": "{\"alt\":\"Kitchen 1 - oof scale shush\",\"description\":\"provider hm whether geez down\",\"roomType\":\"Kitchen 1\",\"cloudflareImageId\":\"d181f96f-be34-4e99-2095-eb7319827900\"}",
              "propertyId": 31,
              "sortOrder": 0,
              "createdAt": "2026-01-19T11:12:58.677Z",
              "updatedAt": "2026-01-19T11:12:58.677Z",
              "bedroomId": null,
              "bathroomId": null,
              "receptionId": null,
              "otherRoomId": null,
              "kitchenId": 63,
              "gardenId": null,
              "outdoorSpaceId": null,
              "landId": null,
              "yardId": null
            },
            {
              "id": 328,
              "image": "d181f96f-be34-4e99-2095-eb7319827900",
              "videoTour": null,
              "floorPlan": null,
              "metadata": "{\"alt\":\"Kitchen 1 - absent aw so\",\"description\":\"although meanwhile castanet some fondly\",\"roomType\":\"Kitchen 1\",\"cloudflareImageId\":\"d181f96f-be34-4e99-2095-eb7319827900\"}",
              "propertyId": 31,
              "sortOrder": 0,
              "createdAt": "2026-01-19T11:12:58.677Z",
              "updatedAt": "2026-01-19T11:12:58.677Z",
              "bedroomId": null,
              "bathroomId": null,
              "receptionId": null,
              "otherRoomId": null,
              "kitchenId": 63,
              "gardenId": null,
              "outdoorSpaceId": null,
              "landId": null,
              "yardId": null
            }
          ]
        },
        {
          "id": 64,
          "roomNumber": 1,
          "floor": 1,
          "name": "sense huzzah",
          "features": [
            "OPEN_PLAN",
            "UTILITY_ACCESS",
            "PANTRY"
          ],
          "description": "chatter popularity wring mill rarely till modulo since abaft brown",
          "size": 27,
          "propertyId": 31,
          "createdAt": "2026-01-19T11:12:45.138Z",
          "updatedAt": "2026-01-19T11:12:45.138Z",
          "media": [
            {
              "id": 329,
              "image": "d181f96f-be34-4e99-2095-eb7319827900",
              "videoTour": null,
              "floorPlan": null,
              "metadata": "{\"alt\":\"Kitchen 1 - sting runny intent\",\"description\":\"meh excess fold minus divert\",\"roomType\":\"Kitchen 1\",\"cloudflareImageId\":\"d181f96f-be34-4e99-2095-eb7319827900\"}",
              "propertyId": 31,
              "sortOrder": 0,
              "createdAt": "2026-01-19T11:12:58.677Z",
              "updatedAt": "2026-01-19T11:12:58.677Z",
              "bedroomId": null,
              "bathroomId": null,
              "receptionId": null,
              "otherRoomId": null,
              "kitchenId": 64,
              "gardenId": null,
              "outdoorSpaceId": null,
              "landId": null,
              "yardId": null
            }
          ]
        }
      ],
      "reception": [
        {
          "id": 64,
          "roomNumber": 1,
          "floor": 1,
          "name": "indeed sneak",
          "type": "HOME_CINEMA",
          "description": "royal shaft cow against produce so usefully at why reconstitute",
          "size": 42,
          "features": [
            "BUILT_IN_SHELVING",
            "HAS_VIEW",
            "PATIO_DOORS",
            "SERVING_HATCH",
            "HARDWOOD_FLOORING",
            "BUILT_IN_DESK",
            "CONSERVATORY"
          ],
          "propertyId": 31,
          "createdAt": "2026-01-19T11:12:45.138Z",
          "updatedAt": "2026-01-19T11:12:45.138Z",
          "media": [
            {
              "id": 332,
              "image": "f08471ae-a51d-4a43-9632-7a193b129500",
              "videoTour": null,
              "floorPlan": null,
              "metadata": "{\"alt\":\"Reception 1 - clumsy damp besides\",\"description\":\"inside out out stake these\",\"roomType\":\"Reception 1\",\"cloudflareImageId\":\"f08471ae-a51d-4a43-9632-7a193b129500\"}",
              "propertyId": 31,
              "sortOrder": 0,
              "createdAt": "2026-01-19T11:12:58.677Z",
              "updatedAt": "2026-01-19T11:12:58.677Z",
              "bedroomId": null,
              "bathroomId": null,
              "receptionId": 64,
              "otherRoomId": null,
              "kitchenId": null,
              "gardenId": null,
              "outdoorSpaceId": null,
              "landId": null,
              "yardId": null
            },
            {
              "id": 333,
              "image": "f7552b9d-fcaa-4688-cfc6-e7f66910fe00",
              "videoTour": null,
              "floorPlan": null,
              "metadata": "{\"alt\":\"Reception 1 - optimal receptor impure\",\"description\":\"overwork during than whether anguished\",\"roomType\":\"Reception 1\",\"cloudflareImageId\":\"f7552b9d-fcaa-4688-cfc6-e7f66910fe00\"}",
              "propertyId": 31,
              "sortOrder": 0,
              "createdAt": "2026-01-19T11:12:58.677Z",
              "updatedAt": "2026-01-19T11:12:58.677Z",
              "bedroomId": null,
              "bathroomId": null,
              "receptionId": 64,
              "otherRoomId": null,
              "kitchenId": null,
              "gardenId": null,
              "outdoorSpaceId": null,
              "landId": null,
              "yardId": null
            }
          ]
        },
        {
          "id": 65,
          "roomNumber": 2,
          "floor": 1,
          "name": "properly even",
          "type": "FAMILY_ROOM",
          "description": "hmph during efface corny who deafening accessorise demobilise longingly awful",
          "size": 18,
          "features": [
            "SERVING_HATCH",
            "ACCOUSTIC_PANELS",
            "STONE_FLOORING"
          ],
          "propertyId": 31,
          "createdAt": "2026-01-19T11:12:45.138Z",
          "updatedAt": "2026-01-19T11:12:45.138Z",
          "media": [
            {
              "id": 334,
              "image": "f08471ae-a51d-4a43-9632-7a193b129500",
              "videoTour": null,
              "floorPlan": null,
              "metadata": "{\"alt\":\"Reception 2 - typewriter rear considering\",\"description\":\"cinder worth qua prime opposite\",\"roomType\":\"Reception 2\",\"cloudflareImageId\":\"f08471ae-a51d-4a43-9632-7a193b129500\"}",
              "propertyId": 31,
              "sortOrder": 0,
              "createdAt": "2026-01-19T11:12:58.677Z",
              "updatedAt": "2026-01-19T11:12:58.677Z",
              "bedroomId": null,
              "bathroomId": null,
              "receptionId": 65,
              "otherRoomId": null,
              "kitchenId": null,
              "gardenId": null,
              "outdoorSpaceId": null,
              "landId": null,
              "yardId": null
            },
            {
              "id": 335,
              "image": "f7552b9d-fcaa-4688-cfc6-e7f66910fe00",
              "videoTour": null,
              "floorPlan": null,
              "metadata": "{\"alt\":\"Reception 2 - doubter hence mortally\",\"description\":\"but instead reorient courageous by\",\"roomType\":\"Reception 2\",\"cloudflareImageId\":\"f7552b9d-fcaa-4688-cfc6-e7f66910fe00\"}",
              "propertyId": 31,
              "sortOrder": 0,
              "createdAt": "2026-01-19T11:12:58.677Z",
              "updatedAt": "2026-01-19T11:12:58.677Z",
              "bedroomId": null,
              "bathroomId": null,
              "receptionId": 65,
              "otherRoomId": null,
              "kitchenId": null,
              "gardenId": null,
              "outdoorSpaceId": null,
              "landId": null,
              "yardId": null
            }
          ]
        }
      ],
      "utility": {
        "id": 31,
        "description": "that bogus athwart wing corporation duh yum charter descriptive when",
        "features": [
          "PLUMBING"
        ],
        "size": 38.40295381403486,
        "propertyId": 31,
        "createdAt": "2026-01-19T11:12:45.138Z",
        "updatedAt": "2026-01-19T11:12:45.138Z"
      },
      "outdoorSpace": {
        "id": 23,
        "description": "on soliloquy likely whose evenly tremendously finally fortunate meanwhile trusting",
        "totalArea": 801.43,
        "features": [
          "SUN_TERRACE",
          "TERRACE",
          "BALCONY",
          "SHED"
        ],
        "propertyId": 31,
        "createdAt": "2026-01-19T11:12:45.138Z",
        "updatedAt": "2026-01-19T11:12:45.138Z",
        "yard": [
          {
            "id": 41,
            "description": "fooey reproachfully know than violently explode swim arrange anti brr",
            "name": "Rear Yard",
            "size": 113.14,
            "additionalDetails": true,
            "facing": "NORTH",
            "position": "REAR",
            "features": [
              "SUN_TERRACE",
              "PATIO",
              "SHED"
            ],
            "createdAt": "2026-01-19T11:12:45.138Z",
            "updatedAt": "2026-01-19T11:12:45.138Z",
            "outdoorSpaceId": 23,
            "media": []
          }
        ],
        "garden": [],
        "land": [
          {
            "id": 32,
            "description": null,
            "additionalDetails": false,
            "size": 303.73,
            "name": "Field",
            "separateParcel": false,
            "features": [],
            "createdAt": "2026-01-19T11:12:45.138Z",
            "updatedAt": "2026-01-19T11:12:45.138Z",
            "outdoorSpaceId": 23,
            "media": []
          },
          {
            "id": 33,
            "description": null,
            "additionalDetails": false,
            "size": 384.56,
            "name": "Orchard",
            "separateParcel": false,
            "features": [],
            "createdAt": "2026-01-19T11:12:45.138Z",
            "updatedAt": "2026-01-19T11:12:45.138Z",
            "outdoorSpaceId": 23,
            "media": []
          }
        ],
        "media": []
      },
      "energyAndUtilities": {
        "id": 32,
        "propertyId": 31,
        "description": "charm partially alliance ew punctuation border gadzooks if supposing newsprint",
        "epcRating": "C",
        "epcCertificateUrl": "https://mixed-harp.com/",
        "primaryHeatingType": [
          "BIOMASS"
        ],
        "secondaryHeatingType": [
          "OTHER"
        ],
        "boilerType": "BACK_BOILER",
        "hotWaterSource": "OTHER",
        "renewables": [
          "SMART_METER",
          "BATTERY_STORAGE",
          "EV_CHARGING"
        ],
        "connectedUtilities": [
          "SEPTIC_TANK",
          "SEWAGE"
        ],
        "broadbandType": "MOBILE",
        "fullFibreAvailable": true,
        "maxDownloadSpeedMbps": 220,
        "createdAt": "2026-01-19T11:12:45.138Z",
        "updatedAt": "2026-01-19T11:12:45.138Z"
      },
      "securityFeatures": {
        "id": 32,
        "description": "as valuable lest when phony upon ornery rarely metallic soggy misfire bind meanwhile help portly",
        "features": [
          "NEIGHBORHOOD_WATCH"
        ],
        "propertyId": 31,
        "createdAt": "2026-01-19T11:12:45.138Z",
        "updatedAt": "2026-01-19T11:12:45.138Z"
      },
      "storageFeatures": {
        "id": 32,
        "description": "kiddingly if selfish phooey gah eyebrow extract whereas upon shanghai furthermore honesty swerve bestride where toward faraway wide-eyed woefully explode",
        "features": [
          "ATTIC",
          "BASEMENT"
        ],
        "propertyId": 31,
        "createdAt": "2026-01-19T11:12:45.138Z",
        "updatedAt": "2026-01-19T11:12:45.138Z"
      },
      "runningCosts": {
        "id": 32,
        "description": "hmph utter monthly lender cosset for across likewise however scary spherical aw under meh and",
        "councilTaxBand": "C",
        "serviceCharges": 286.3,
        "groundRent": 413.11,
        "propertyId": 31,
        "createdAt": "2026-01-19T11:12:45.138Z",
        "updatedAt": "2026-01-19T11:12:45.138Z"
      }
    },
    "user": {
      "id": 12,
      "username": "Darwin_Prohaska63_10",
      "email": "10_Therese15@gmail.com",
      "createdAt": "2026-01-19T11:13:37.360Z"
    },
    "listingType": "buy"
  },

  {
    "id": 4,
    "price": 211357.5,
    "moveInDate": "2026-08-29T12:30:30.358Z",
    "listingTier": "BASIC",
    "listingStartDate": "2026-01-19T11:13:38.185Z",
    "listingEndDate": "2026-06-06T12:02:26.831Z",
    "viewingOptions": "essence at stiffen fumigate facilitate yippee briskly circa ouch cruelly",
    "verificationLevel": "VERIFIED",
    "userId": 1,
    "propertyId": 6,
    "estateAgentId": null,
    "publishedAt": "2026-01-19T06:59:03.432Z",
    "published": true,
    "createdAt": "2026-01-19T11:13:38.214Z",
    "updatedAt": "2026-01-19T11:13:38.214Z",
    "archived": false,
    "archivedAt": null,
    "rentalListing": null,
    "saleListing": {
      "id": 2,
      "listingId": 4,
      "tenureType": "COMMONHOLD",
      "chain": true,
      "sharedOwnership": false,
      "priceType": "FIXED",
      "availabilityStatus": "UNDER_OFFER",
      "draftListingId": null
    },
    "property": {
      "id": 6,
      "description": "boom numeracy list hopelessly swear solidly circa independence strictly manner indolent wholly afford fooey unto underneath via ha ad um",
      "value": 102686.32,
      "size": 174,
      "yearBuilt": "2026",
      "chainFree": true,
      "vacant": false,
      "constructionType": "NON_STANDARD",
      "floorLevel": null,
      "totalFloors": 5,
      "numberBedrooms": 4,
      "numberBathrooms": 2,
      "numberReceptions": 3,
      "numberOtherRooms": 3,
      "numberKitchens": 1,
      "createdAt": "2026-01-19T11:12:44.967Z",
      "updatedAt": "2026-01-19T11:12:44.967Z",
      "addressId": 17,
      "userId": 1,
      "estateAgentId": null,
      "propertyTypeId": 8,
      "propertyClassificationId": 30,
      "address": {
        "id": 17,
        "number": "70",
        "flat": null,
        "name": null,
        "street": "Richmond Road",
        "city": "Cardiff",
        "postcode": "CF24 3AT",
        "country": null,
        "locality": null,
        "county": null,
        "district": null,
        "fullAddress": "70, Richmond Road, Cardiff, CF24 3AT",
        "lat": 51.489286,
        "lon": -3.171296,
        "createdAt": "2026-01-19T11:12:44.967Z",
        "updatedAt": "2026-01-19T11:12:44.967Z"
      },
      "media": [
        {
          "id": 49,
          "image": "d0f1451c-5944-431d-8b40-583622460f00",
          "videoTour": null,
          "floorPlan": null,
          "metadata": "{\"alt\":\"Exterior - record wallaby machine\",\"description\":\"gruesome rigidly confound fine quip\",\"roomType\":\"Exterior\",\"cloudflareImageId\":\"d0f1451c-5944-431d-8b40-583622460f00\"}",
          "propertyId": 6,
          "sortOrder": 0,
          "createdAt": "2026-01-19T11:12:58.472Z",
          "updatedAt": "2026-01-19T11:12:58.472Z",
          "bedroomId": null,
          "bathroomId": null,
          "receptionId": null,
          "otherRoomId": null,
          "kitchenId": null,
          "gardenId": null,
          "outdoorSpaceId": null,
          "landId": null,
          "yardId": null
        },
        {
          "id": 50,
          "image": "55957534-6202-4033-361b-f67b7fd89000",
          "videoTour": null,
          "floorPlan": null,
          "metadata": "{\"alt\":\"Garden - if weakly boss\",\"description\":\"napkin talkative aside slide when\",\"roomType\":\"Garden\",\"cloudflareImageId\":\"55957534-6202-4033-361b-f67b7fd89000\"}",
          "propertyId": 6,
          "sortOrder": 0,
          "createdAt": "2026-01-19T11:12:58.472Z",
          "updatedAt": "2026-01-19T11:12:58.472Z",
          "bedroomId": null,
          "bathroomId": null,
          "receptionId": null,
          "otherRoomId": null,
          "kitchenId": null,
          "gardenId": null,
          "outdoorSpaceId": null,
          "landId": null,
          "yardId": null
        },
        {
          "id": 51,
          "image": "0ba57463-d707-4914-8370-eeaad9efb700",
          "videoTour": null,
          "floorPlan": null,
          "metadata": "{\"alt\":\"Dining Room\",\"description\":\"how excluding limply than bah\",\"roomType\":\"Dining Room\",\"cloudflareImageId\":\"0ba57463-d707-4914-8370-eeaad9efb700\"}",
          "propertyId": 6,
          "sortOrder": 0,
          "createdAt": "2026-01-19T11:12:58.472Z",
          "updatedAt": "2026-01-19T11:12:58.472Z",
          "bedroomId": null,
          "bathroomId": null,
          "receptionId": null,
          "otherRoomId": null,
          "kitchenId": null,
          "gardenId": null,
          "outdoorSpaceId": null,
          "landId": null,
          "yardId": null
        },
        {
          "id": 52,
          "image": "00263fad-70a3-41e0-83d5-5aa8b83a3500",
          "videoTour": null,
          "floorPlan": null,
          "metadata": "{\"alt\":\"Home Office\",\"description\":\"back dramatize yahoo abnormally so\",\"roomType\":\"Home Office\",\"cloudflareImageId\":\"00263fad-70a3-41e0-83d5-5aa8b83a3500\"}",
          "propertyId": 6,
          "sortOrder": 0,
          "createdAt": "2026-01-19T11:12:58.472Z",
          "updatedAt": "2026-01-19T11:12:58.472Z",
          "bedroomId": null,
          "bathroomId": null,
          "receptionId": null,
          "otherRoomId": null,
          "kitchenId": null,
          "gardenId": null,
          "outdoorSpaceId": null,
          "landId": null,
          "yardId": null
        },
        {
          "id": 53,
          "image": "9ef289b1-e2cf-4e70-a1e3-1ca4beba4f00",
          "videoTour": null,
          "floorPlan": null,
          "metadata": "{\"alt\":\"Bedroom 1\",\"description\":\"gadzooks since ack reward frugal\",\"roomType\":\"Bedroom 1\",\"cloudflareImageId\":\"9ef289b1-e2cf-4e70-a1e3-1ca4beba4f00\"}",
          "propertyId": 6,
          "sortOrder": 0,
          "createdAt": "2026-01-19T11:12:58.472Z",
          "updatedAt": "2026-01-19T11:12:58.472Z",
          "bedroomId": 18,
          "bathroomId": null,
          "receptionId": null,
          "otherRoomId": null,
          "kitchenId": null,
          "gardenId": null,
          "outdoorSpaceId": null,
          "landId": null,
          "yardId": null
        }
      ],
      "type": {
        "id": 8,
        "name": "Student Accommodation",
        "defaultSelected": true
      },
      "classification": {
        "id": 30,
        "name": "Flat",
        "categoryId": 8
      },
      "bedroomFeatures": [
        {
          "id": 18,
          "roomNumber": 1,
          "name": "Spare Bedroom",
          "bed": [
            "SINGLE"
          ],
          "floor": 1,
          "description": "horde sheepishly regal consequently abnormally angle incidentally skyline gosh pendant",
          "features": [
            "BUILT_IN_STORAGE",
            "WALK_IN_WARDROBE"
          ],
          "size": 20,
          "propertyId": 6,
          "createdAt": "2026-01-19T11:12:44.967Z",
          "updatedAt": "2026-01-19T11:12:44.967Z",
          "media": [
            {
              "id": 53,
              "image": "9ef289b1-e2cf-4e70-a1e3-1ca4beba4f00",
              "videoTour": null,
              "floorPlan": null,
              "metadata": "{\"alt\":\"Bedroom 1\",\"description\":\"gadzooks since ack reward frugal\",\"roomType\":\"Bedroom 1\",\"cloudflareImageId\":\"9ef289b1-e2cf-4e70-a1e3-1ca4beba4f00\"}",
              "propertyId": 6,
              "sortOrder": 0,
              "createdAt": "2026-01-19T11:12:58.472Z",
              "updatedAt": "2026-01-19T11:12:58.472Z",
              "bedroomId": 18,
              "bathroomId": null,
              "receptionId": null,
              "otherRoomId": null,
              "kitchenId": null,
              "gardenId": null,
              "outdoorSpaceId": null,
              "landId": null,
              "yardId": null
            }
          ]
        },
        {
          "id": 19,
          "roomNumber": 2,
          "name": "Nursery",
          "bed": [
            "DOUBLE"
          ],
          "floor": 2,
          "description": "boohoo known jive charm fortunately stealthily yahoo damp psst including",
          "features": [
            "EN_SUITE",
            "BUILT_IN_STORAGE",
            "WALK_IN_WARDROBE",
            "BAY_WINDOW",
            "HAS_VIEW",
            "PATIO_DOORS"
          ],
          "size": 11,
          "propertyId": 6,
          "createdAt": "2026-01-19T11:12:44.967Z",
          "updatedAt": "2026-01-19T11:12:44.967Z",
          "media": []
        },
        {
          "id": 20,
          "roomNumber": 3,
          "name": "Nursery",
          "bed": [
            "SINGLE"
          ],
          "floor": 1,
          "description": "until oof geez decongestant pile nearly baa worriedly stark inside",
          "features": [
            "BUILT_IN_STORAGE",
            "BAY_WINDOW",
            "BALCONY",
            "PATIO_DOORS"
          ],
          "size": 15,
          "propertyId": 6,
          "createdAt": "2026-01-19T11:12:44.967Z",
          "updatedAt": "2026-01-19T11:12:44.967Z",
          "media": []
        },
        {
          "id": 21,
          "roomNumber": 4,
          "name": "Child's Bedroom",
          "bed": [
            "QUEEN"
          ],
          "floor": 3,
          "description": "since instead pfft boo huzzah owlishly unlike catalyze pitiful eek",
          "features": [
            "BUILT_IN_STORAGE",
            "WALK_IN_WARDROBE",
            "HAS_VIEW"
          ],
          "size": 46,
          "propertyId": 6,
          "createdAt": "2026-01-19T11:12:44.967Z",
          "updatedAt": "2026-01-19T11:12:44.967Z",
          "media": []
        }
      ],
      "bathroomFeatures": [
        {
          "id": 7,
          "roomNumber": 1,
          "floor": 0,
          "name": "Guest Bathroom",
          "features": [
            "TOILET",
            "BATHTUB"
          ],
          "description": "plastic onto hydrocarbon boohoo defiantly warp sophisticated sideboard huzzah openly",
          "size": 32,
          "propertyId": 6,
          "createdAt": "2026-01-19T11:12:44.967Z",
          "updatedAt": "2026-01-19T11:12:44.967Z",
          "media": []
        },
        {
          "id": 8,
          "roomNumber": 2,
          "floor": 3,
          "name": "Master Bathroom",
          "features": [
            "TOILET",
            "BATHTUB",
            "WALK_IN_SHOWER"
          ],
          "description": "whose gosh necklace vacantly overconfidently ack apropos phooey apt dwell",
          "size": 29,
          "propertyId": 6,
          "createdAt": "2026-01-19T11:12:44.967Z",
          "updatedAt": "2026-01-19T11:12:44.967Z",
          "media": []
        }
      ],
      "otherRoom": [
        {
          "id": 9,
          "roomNumber": 1,
          "floor": 3,
          "name": "warming pish",
          "type": "LIBRARY",
          "description": "oily woot release now in whenever over unless noisily excepting",
          "size": 22,
          "features": [
            "OPEN_PLAN",
            "OPEN_CONCEPT",
            "BALCONY",
            "BAY_WINDOW",
            "PATIO_DOORS",
            "SERVING_HATCH"
          ],
          "propertyId": 6,
          "createdAt": "2026-01-19T11:12:44.967Z",
          "updatedAt": "2026-01-19T11:12:44.967Z",
          "media": []
        },
        {
          "id": 10,
          "roomNumber": 2,
          "floor": 2,
          "name": "ack readily",
          "type": "WORKSHOP",
          "description": "pish flashy especially fooey likewise compassionate meh zowie although mostly",
          "size": 24,
          "features": [
            "OPEN_PLAN",
            "BALCONY",
            "HAS_VIEW",
            "SOUND_PROOFING",
            "ACCOUSTIC_PANELS",
            "STONE_FLOORING",
            "HARDWOOD_FLOORING"
          ],
          "propertyId": 6,
          "createdAt": "2026-01-19T11:12:44.967Z",
          "updatedAt": "2026-01-19T11:12:44.967Z",
          "media": []
        },
        {
          "id": 11,
          "roomNumber": 3,
          "floor": 3,
          "name": "yowza well-lit",
          "type": "POOL_ROOM",
          "description": "quirkily righteously apropos yum ouch duh ick ack steel generally",
          "size": 40,
          "features": [
            "BALCONY",
            "BAY_WINDOW",
            "BUILT_IN_STORAGE",
            "SERVING_HATCH",
            "ACCOUSTIC_PANELS"
          ],
          "propertyId": 6,
          "createdAt": "2026-01-19T11:12:44.967Z",
          "updatedAt": "2026-01-19T11:12:44.967Z",
          "media": []
        }
      ],
      "parking": {
        "id": 4,
        "description": "bid untimely seemingly ha though ugh fast notwithstanding familiar yuck",
        "features": [
          "DRIVEWAY",
          "ON_STREET",
          "CARPORT"
        ],
        "propertyId": 6,
        "createdAt": "2026-01-19T11:12:44.967Z",
        "updatedAt": "2026-01-19T11:12:44.967Z"
      },
      "amenities": [
        {
          "id": 73,
          "type": "EDUCATION",
          "subtype": "SCHOOL",
          "name": "Breitenberg Group School",
          "distanceM": 4870,
          "description": null,
          "location": null,
          "propertyId": 6,
          "createdAt": "2026-01-19T11:12:44.967Z"
        },
        {
          "id": 74,
          "type": "EDUCATION",
          "subtype": "SCHOOL",
          "name": "Shanahan Group School",
          "distanceM": 6369,
          "description": null,
          "location": null,
          "propertyId": 6,
          "createdAt": "2026-01-19T11:12:44.967Z"
        },
        {
          "id": 75,
          "type": "EDUCATION",
          "subtype": "SCHOOL",
          "name": "Skiles and Sons School",
          "distanceM": 4642,
          "description": null,
          "location": null,
          "propertyId": 6,
          "createdAt": "2026-01-19T11:12:44.967Z"
        },
        {
          "id": 76,
          "type": "HEALTHCARE",
          "subtype": "HOSPITAL",
          "name": "Fritsch Group Hospital",
          "distanceM": 4221,
          "description": null,
          "location": null,
          "propertyId": 6,
          "createdAt": "2026-01-19T11:12:44.967Z"
        },
        {
          "id": 77,
          "type": "HEALTHCARE",
          "subtype": "HOSPITAL",
          "name": "Sporer, Schimmel and Bernhard Hospital",
          "distanceM": 1247,
          "description": null,
          "location": null,
          "propertyId": 6,
          "createdAt": "2026-01-19T11:12:44.967Z"
        },
        {
          "id": 78,
          "type": "HEALTHCARE",
          "subtype": "HOSPITAL",
          "name": "Purdy - Rutherford Hospital",
          "distanceM": 3438,
          "description": null,
          "location": null,
          "propertyId": 6,
          "createdAt": "2026-01-19T11:12:44.967Z"
        },
        {
          "id": 79,
          "type": "TRANSPORT",
          "subtype": "TRAIN_STATION",
          "name": "Bustertown Train Station",
          "distanceM": 8301,
          "description": null,
          "location": null,
          "propertyId": 6,
          "createdAt": "2026-01-19T11:12:44.967Z"
        },
        {
          "id": 80,
          "type": "TRANSPORT",
          "subtype": "TRAIN_STATION",
          "name": "Fort Graceburgh Train Station",
          "distanceM": 5554,
          "description": null,
          "location": null,
          "propertyId": 6,
          "createdAt": "2026-01-19T11:12:44.967Z"
        },
        {
          "id": 81,
          "type": "TRANSPORT",
          "subtype": "TRAIN_STATION",
          "name": "Gutmannland Train Station",
          "distanceM": 3676,
          "description": null,
          "location": null,
          "propertyId": 6,
          "createdAt": "2026-01-19T11:12:44.967Z"
        },
        {
          "id": 82,
          "type": "TRANSPORT",
          "subtype": "BUS_STOP",
          "name": "Schaefer Falls Bus Stop",
          "distanceM": 4385,
          "description": null,
          "location": null,
          "propertyId": 6,
          "createdAt": "2026-01-19T11:12:44.967Z"
        },
        {
          "id": 83,
          "type": "TRANSPORT",
          "subtype": "BUS_STOP",
          "name": "Torphy Estates Bus Stop",
          "distanceM": 8672,
          "description": null,
          "location": null,
          "propertyId": 6,
          "createdAt": "2026-01-19T11:12:44.967Z"
        },
        {
          "id": 84,
          "type": "TRANSPORT",
          "subtype": "BUS_STOP",
          "name": "Blind Lane Bus Stop",
          "distanceM": 4914,
          "description": null,
          "location": null,
          "propertyId": 6,
          "createdAt": "2026-01-19T11:12:44.967Z"
        },
        {
          "id": 85,
          "type": "GREEN_SPACE",
          "subtype": "PARK",
          "name": "South Cletaland Park",
          "distanceM": 1163,
          "description": null,
          "location": null,
          "propertyId": 6,
          "createdAt": "2026-01-19T11:12:44.967Z"
        },
        {
          "id": 86,
          "type": "GREEN_SPACE",
          "subtype": "PARK",
          "name": "Chicopee Park",
          "distanceM": 3710,
          "description": null,
          "location": null,
          "propertyId": 6,
          "createdAt": "2026-01-19T11:12:44.967Z"
        },
        {
          "id": 87,
          "type": "GREEN_SPACE",
          "subtype": "PARK",
          "name": "Delbertchester Park",
          "distanceM": 7783,
          "description": null,
          "location": null,
          "propertyId": 6,
          "createdAt": "2026-01-19T11:12:44.967Z"
        },
        {
          "id": 88,
          "type": "SHOPPING_ENTERTAINMENT",
          "subtype": "GYM",
          "name": "Feil and Sons Gym",
          "distanceM": 2080,
          "description": null,
          "location": null,
          "propertyId": 6,
          "createdAt": "2026-01-19T11:12:44.967Z"
        },
        {
          "id": 89,
          "type": "SHOPPING_ENTERTAINMENT",
          "subtype": "GYM",
          "name": "Walker - Okuneva Gym",
          "distanceM": 5981,
          "description": null,
          "location": null,
          "propertyId": 6,
          "createdAt": "2026-01-19T11:12:44.967Z"
        },
        {
          "id": 90,
          "type": "SHOPPING_ENTERTAINMENT",
          "subtype": "GYM",
          "name": "Beatty LLC Gym",
          "distanceM": 132,
          "description": null,
          "location": null,
          "propertyId": 6,
          "createdAt": "2026-01-19T11:12:44.967Z"
        }
      ],
      "additionalFeatures": {
        "id": 6,
        "description": "aside astride next rapid up gracefully swear how below dime",
        "petFriendly": false,
        "moveInDate": "2026-03-28T02:24:48.322Z",
        "features": [
          "SHOP"
        ],
        "propertyId": 6,
        "createdAt": "2026-01-19T11:12:44.967Z",
        "updatedAt": "2026-01-19T11:12:44.967Z"
      },
      "accessibilityFeatures": {
        "id": 5,
        "description": "why coolly while assured likewise huff unnecessarily underneath ugh duh",
        "features": [],
        "propertyId": 6,
        "createdAt": "2026-01-19T11:12:44.967Z",
        "updatedAt": "2026-01-19T11:12:44.967Z"
      },
      "kitchenFeatures": [
        {
          "id": 10,
          "roomNumber": 3,
          "floor": 1,
          "name": "insert able",
          "features": [
            "MODERN",
            "ISLAND"
          ],
          "description": "coil untrue pluck bah and well-documented round printer whether amidst",
          "size": 41,
          "propertyId": 6,
          "createdAt": "2026-01-19T11:12:44.967Z",
          "updatedAt": "2026-01-19T11:12:44.967Z",
          "media": []
        }
      ],
      "reception": [
        {
          "id": 8,
          "roomNumber": 1,
          "floor": 2,
          "name": "complete throughout",
          "type": "GAMES_ROOM",
          "description": "jell fatherly while insolence frail shred unzip ack bravely tapioca",
          "size": 41,
          "features": [
            "OPEN_PLAN",
            "SERVING_HATCH"
          ],
          "propertyId": 6,
          "createdAt": "2026-01-19T11:12:44.967Z",
          "updatedAt": "2026-01-19T11:12:44.967Z",
          "media": []
        },
        {
          "id": 9,
          "roomNumber": 2,
          "floor": 3,
          "name": "stoop bleak",
          "type": "LIVING_ROOM",
          "description": "urgently courageously freely er fly separately beneath political yellowish ick",
          "size": 13,
          "features": [
            "OPEN_CONCEPT",
            "BALCONY",
            "PATIO_DOORS",
            "BUILT_IN_DESK"
          ],
          "propertyId": 6,
          "createdAt": "2026-01-19T11:12:44.967Z",
          "updatedAt": "2026-01-19T11:12:44.967Z",
          "media": []
        },
        {
          "id": 10,
          "roomNumber": 3,
          "floor": 3,
          "name": "depend apud",
          "type": "DINING_ROOM",
          "description": "starch and near noisily whether maintainer remark wisely lest ha",
          "size": 13,
          "features": [
            "BAY_WINDOW",
            "BUILT_IN_SHELVING",
            "SERVING_HATCH",
            "BAR_AREA",
            "ACCOUSTIC_PANELS"
          ],
          "propertyId": 6,
          "createdAt": "2026-01-19T11:12:44.967Z",
          "updatedAt": "2026-01-19T11:12:44.967Z",
          "media": []
        }
      ],
      "utility": {
        "id": 5,
        "description": "of when oof bend trivial mouser notwithstanding surface anenst exhausted",
        "features": [
          "SINK"
        ],
        "size": 49.88542553425006,
        "propertyId": 6,
        "createdAt": "2026-01-19T11:12:44.967Z",
        "updatedAt": "2026-01-19T11:12:44.967Z"
      },
      "outdoorSpace": {
        "id": 2,
        "description": "for given phew foodstuffs coil midst wring inscribe but winding",
        "totalArea": 612.5,
        "features": [
          "BALCONY",
          "POOL"
        ],
        "propertyId": 6,
        "createdAt": "2026-01-19T11:12:44.967Z",
        "updatedAt": "2026-01-19T11:12:44.967Z",
        "yard": [
          {
            "id": 6,
            "description": null,
            "name": "Rear Yard",
            "size": 101.27,
            "additionalDetails": false,
            "facing": "NORTH",
            "position": "REAR",
            "features": [],
            "createdAt": "2026-01-19T11:12:44.967Z",
            "updatedAt": "2026-01-19T11:12:44.967Z",
            "outdoorSpaceId": 2,
            "media": []
          }
        ],
        "garden": [
          {
            "id": 6,
            "description": "instructive chunter diagram aside what unbearably swiftly bulky limply ack",
            "name": "Front Garden",
            "size": 45.2,
            "additionalDetails": true,
            "facing": "NORTH",
            "position": "FRONT",
            "features": [
              "SHED",
              "SUMMER_HOUSE"
            ],
            "createdAt": "2026-01-19T11:12:44.967Z",
            "updatedAt": "2026-01-19T11:12:44.967Z",
            "outdoorSpaceId": 2,
            "media": []
          },
          {
            "id": 7,
            "description": "entrench spattering furthermore under lucky frankly who alongside seagull alongside",
            "name": "Rear Garden",
            "size": 108.55,
            "additionalDetails": true,
            "facing": "EAST",
            "position": "REAR",
            "features": [
              "TERRACE",
              "BALCONY",
              "PATIO",
              "SUMMER_HOUSE",
              "GARDEN_OFFICE"
            ],
            "createdAt": "2026-01-19T11:12:44.967Z",
            "updatedAt": "2026-01-19T11:12:44.967Z",
            "outdoorSpaceId": 2,
            "media": []
          }
        ],
        "land": [
          {
            "id": 4,
            "description": "ugh in fort with whale before however considering vice ick",
            "additionalDetails": true,
            "size": 357.48,
            "name": "Field",
            "separateParcel": true,
            "features": [
              "WOODLAND",
              "PADDOCK",
              "STABLES",
              "ORCHARD",
              "POND"
            ],
            "createdAt": "2026-01-19T11:12:44.967Z",
            "updatedAt": "2026-01-19T11:12:44.967Z",
            "outdoorSpaceId": 2,
            "media": []
          }
        ],
        "media": []
      },
      "energyAndUtilities": {
        "id": 6,
        "propertyId": 6,
        "description": "nephew boo fast stiff compromise surprisingly miserly what that ick",
        "epcRating": "D",
        "epcCertificateUrl": "https://recent-hubris.org/",
        "primaryHeatingType": [
          "BIOMASS"
        ],
        "secondaryHeatingType": [
          "BIOMASS",
          "UNDERFLOOR"
        ],
        "boilerType": "CONVENTIONAL",
        "hotWaterSource": "SOLAR_THERMAL",
        "renewables": [
          "SMART_METER",
          "BATTERY_STORAGE"
        ],
        "connectedUtilities": [
          "CESSPIT",
          "GAS",
          "WATER"
        ],
        "broadbandType": "FTTC",
        "fullFibreAvailable": false,
        "maxDownloadSpeedMbps": 430,
        "createdAt": "2026-01-19T11:12:44.967Z",
        "updatedAt": "2026-01-19T11:12:44.967Z"
      },
      "securityFeatures": {
        "id": 6,
        "description": "carelessly amongst gee or curiously blah mysteriously ouch progress sweetly from evil solemnly enthusiastically without",
        "features": [
          "CCTV",
          "ALARM_SYSTEM",
          "NEIGHBORHOOD_WATCH"
        ],
        "propertyId": 6,
        "createdAt": "2026-01-19T11:12:44.967Z",
        "updatedAt": "2026-01-19T11:12:44.967Z"
      },
      "storageFeatures": {
        "id": 5,
        "description": "incandescence preregister boohoo finally clinking signature kiddingly gosh daddy guard quickly joyfully finally astride abnormally eventually symbolise bestride charm gerbil",
        "features": [],
        "propertyId": 6,
        "createdAt": "2026-01-19T11:12:44.967Z",
        "updatedAt": "2026-01-19T11:12:44.967Z"
      },
      "runningCosts": {
        "id": 6,
        "description": "dearly gah next across season though priesthood debut anenst frightfully part runny coordinated generally supposing",
        "councilTaxBand": "B",
        "serviceCharges": 188.04,
        "groundRent": 491.8,
        "propertyId": 6,
        "createdAt": "2026-01-19T11:12:44.967Z",
        "updatedAt": "2026-01-19T11:12:44.967Z"
      }
    },
    "user": {
      "id": 1,
      "username": "Virify",
      "email": "admin@virify.co.uk",
      "createdAt": "2026-01-19T11:12:43.934Z"
    },
    "listingType": "buy"
  },
  {
    "id": 113,
    "price": 906.75,
    "moveInDate": "2026-12-23T14:27:06.833Z",
    "listingTier": "FEATURED",
    "listingStartDate": "2026-02-24T22:40:03.290Z",
    "listingEndDate": "2026-04-19T21:10:06.763Z",
    "viewingOptions": "vastly jot given yippee loyally gnash that but inscribe intermix",
    "verificationLevel": "FULLY_VERIFIED",
    "userId": 29,
    "propertyId": 113,
    "estateAgentId": null,
    "publishedAt": "2026-02-22T22:33:38.067Z",
    "published": true,
    "createdAt": "2026-02-24T22:40:05.057Z",
    "updatedAt": "2026-02-24T22:40:05.057Z",
    "archived": false,
    "archivedAt": null,
    "rentalListing": {
      "id": 55,
      "listingId": 113,
      "deposit": 5521.17,
      "holdingDeposit": 5869.42,
      "rentFrequency": "WEEKLY",
      "isBillsIncluded": false,
      "rentalLength": "LONG_TERM",
      "furnishedStatus": "PART_FURNISHED",
      "availabilityStatus": "LET_AGREED",
      "draftListingId": null
    },
    "saleListing": null,
    "property": {
      "id": 113,
      "description": "verve round beautifully ew oof woot thrifty service oof bashfully briskly like sans enthusiastically yet drat untidy doubtfully eek key",
      "value": 782313.26,
      "size": 295,
      "yearBuilt": "2025",
      "chainFree": true,
      "vacant": true,
      "constructionType": "STANDARD",
      "floorLevel": null,
      "totalFloors": 1,
      "numberBedrooms": 2,
      "numberBathrooms": 1,
      "numberReceptions": 1,
      "numberOtherRooms": 2,
      "numberKitchens": 1,
      "createdAt": "2026-02-24T22:36:57.474Z",
      "updatedAt": "2026-02-24T22:36:57.474Z",
      "addressId": 122,
      "userId": 1,
      "estateAgentId": null,
      "propertyTypeId": 1,
      "propertyClassificationId": 4,
      "address": {
        "id": 122,
        "number": "WINDSOR COURT",
        "flat": null,
        "name": null,
        "street": "Maes Yr Awel",
        "city": "Cardiff",
        "postcode": "CF15 8AT",
        "country": null,
        "locality": null,
        "county": null,
        "district": null,
        "fullAddress": "WINDSOR COURT, Maes Yr Awel, Cardiff, CF15 8AT",
        "lat": 51.481655,
        "lon": -3.179194,
        "createdAt": "2026-02-24T22:36:57.474Z",
        "updatedAt": "2026-02-24T22:36:57.474Z"
      },
      "media": [
        {
          "id": 1269,
          "image": "d451972a-61ee-4153-87b5-7697a4c0dc00",
          "videoTour": null,
          "floorPlan": null,
          "metadata": "{\"alt\":\"Exterior - round poor save\",\"description\":\"quietly as cake vivaciously pace\",\"roomType\":\"Exterior\",\"cloudflareImageId\":\"d451972a-61ee-4153-87b5-7697a4c0dc00\"}",
          "propertyId": 113,
          "sortOrder": 0,
          "createdAt": "2026-02-24T22:37:18.202Z",
          "updatedAt": "2026-02-24T22:37:18.202Z",
          "bedroomId": null,
          "bathroomId": null,
          "receptionId": null,
          "otherRoomId": null,
          "kitchenId": null,
          "gardenId": null,
          "outdoorSpaceId": null,
          "landId": null,
          "yardId": null
        },
        {
          "id": 1270,
          "image": "1591debc-71cc-4ffd-6ef2-f9d6ac404400",
          "videoTour": null,
          "floorPlan": null,
          "metadata": "{\"alt\":\"Garden - while regularly vol\",\"description\":\"whenever husky certify boldly geez\",\"roomType\":\"Garden\",\"cloudflareImageId\":\"1591debc-71cc-4ffd-6ef2-f9d6ac404400\"}",
          "propertyId": 113,
          "sortOrder": 0,
          "createdAt": "2026-02-24T22:37:18.202Z",
          "updatedAt": "2026-02-24T22:37:18.202Z",
          "bedroomId": null,
          "bathroomId": null,
          "receptionId": null,
          "otherRoomId": null,
          "kitchenId": null,
          "gardenId": null,
          "outdoorSpaceId": null,
          "landId": null,
          "yardId": null
        },
        {
          "id": 1271,
          "image": "8ca273d5-1c19-410c-5a6a-ae4c46626200",
          "videoTour": null,
          "floorPlan": null,
          "metadata": "{\"alt\":\"Dining Room\",\"description\":\"instruction when meanwhile yesterday mobilise\",\"roomType\":\"Dining Room\",\"cloudflareImageId\":\"8ca273d5-1c19-410c-5a6a-ae4c46626200\"}",
          "propertyId": 113,
          "sortOrder": 0,
          "createdAt": "2026-02-24T22:37:18.202Z",
          "updatedAt": "2026-02-24T22:37:18.202Z",
          "bedroomId": null,
          "bathroomId": null,
          "receptionId": null,
          "otherRoomId": null,
          "kitchenId": null,
          "gardenId": null,
          "outdoorSpaceId": null,
          "landId": null,
          "yardId": null
        },
        {
          "id": 1272,
          "image": "00263fad-70a3-41e0-83d5-5aa8b83a3500",
          "videoTour": null,
          "floorPlan": null,
          "metadata": "{\"alt\":\"Home Office\",\"description\":\"beside amidst tomorrow notarize ugh\",\"roomType\":\"Home Office\",\"cloudflareImageId\":\"00263fad-70a3-41e0-83d5-5aa8b83a3500\"}",
          "propertyId": 113,
          "sortOrder": 0,
          "createdAt": "2026-02-24T22:37:18.202Z",
          "updatedAt": "2026-02-24T22:37:18.202Z",
          "bedroomId": null,
          "bathroomId": null,
          "receptionId": null,
          "otherRoomId": null,
          "kitchenId": null,
          "gardenId": null,
          "outdoorSpaceId": null,
          "landId": null,
          "yardId": null
        },
        {
          "id": 1273,
          "image": "9ef289b1-e2cf-4e70-a1e3-1ca4beba4f00",
          "videoTour": null,
          "floorPlan": null,
          "metadata": "{\"alt\":\"Bedroom 1\",\"description\":\"rationalize consequently carefree commonly brr\",\"roomType\":\"Bedroom 1\",\"cloudflareImageId\":\"9ef289b1-e2cf-4e70-a1e3-1ca4beba4f00\"}",
          "propertyId": 113,
          "sortOrder": 0,
          "createdAt": "2026-02-24T22:37:18.202Z",
          "updatedAt": "2026-02-24T22:37:18.202Z",
          "bedroomId": 347,
          "bathroomId": null,
          "receptionId": null,
          "otherRoomId": null,
          "kitchenId": null,
          "gardenId": null,
          "outdoorSpaceId": null,
          "landId": null,
          "yardId": null
        },
        {
          "id": 1274,
          "image": "9ef289b1-e2cf-4e70-a1e3-1ca4beba4f00",
          "videoTour": null,
          "floorPlan": null,
          "metadata": "{\"alt\":\"Bedroom 2 - upright stunning huzzah\",\"description\":\"ha co-producer impartial aside wafer\",\"roomType\":\"Bedroom 2\",\"cloudflareImageId\":\"9ef289b1-e2cf-4e70-a1e3-1ca4beba4f00\"}",
          "propertyId": 113,
          "sortOrder": 0,
          "createdAt": "2026-02-24T22:37:18.202Z",
          "updatedAt": "2026-02-24T22:37:18.202Z",
          "bedroomId": 348,
          "bathroomId": null,
          "receptionId": null,
          "otherRoomId": null,
          "kitchenId": null,
          "gardenId": null,
          "outdoorSpaceId": null,
          "landId": null,
          "yardId": null
        },
        {
          "id": 1275,
          "image": "9ef289b1-e2cf-4e70-a1e3-1ca4beba4f00",
          "videoTour": null,
          "floorPlan": null,
          "metadata": "{\"alt\":\"Bedroom 2 - triangular aw fedora\",\"description\":\"grumpy ah outlying nab completion\",\"roomType\":\"Bedroom 2\",\"cloudflareImageId\":\"9ef289b1-e2cf-4e70-a1e3-1ca4beba4f00\"}",
          "propertyId": 113,
          "sortOrder": 0,
          "createdAt": "2026-02-24T22:37:18.202Z",
          "updatedAt": "2026-02-24T22:37:18.202Z",
          "bedroomId": 348,
          "bathroomId": null,
          "receptionId": null,
          "otherRoomId": null,
          "kitchenId": null,
          "gardenId": null,
          "outdoorSpaceId": null,
          "landId": null,
          "yardId": null
        },
        {
          "id": 1276,
          "image": "d181f96f-be34-4e99-2095-eb7319827900",
          "videoTour": null,
          "floorPlan": null,
          "metadata": "{\"alt\":\"Kitchen 1 - ugh defiantly below\",\"description\":\"owlishly times strong boohoo considering\",\"roomType\":\"Kitchen 1\",\"cloudflareImageId\":\"d181f96f-be34-4e99-2095-eb7319827900\"}",
          "propertyId": 113,
          "sortOrder": 0,
          "createdAt": "2026-02-24T22:37:18.202Z",
          "updatedAt": "2026-02-24T22:37:18.202Z",
          "bedroomId": null,
          "bathroomId": null,
          "receptionId": null,
          "otherRoomId": null,
          "kitchenId": 225,
          "gardenId": null,
          "outdoorSpaceId": null,
          "landId": null,
          "yardId": null
        },
        {
          "id": 1277,
          "image": "51972637-4e53-48d5-b11f-5eedb66f7000",
          "videoTour": null,
          "floorPlan": null,
          "metadata": "{\"alt\":\"Bathroom 1 - lay abaft but\",\"description\":\"attest relieve wherever spiteful heating\",\"roomType\":\"Bathroom 1\",\"cloudflareImageId\":\"51972637-4e53-48d5-b11f-5eedb66f7000\"}",
          "propertyId": 113,
          "sortOrder": 0,
          "createdAt": "2026-02-24T22:37:18.202Z",
          "updatedAt": "2026-02-24T22:37:18.202Z",
          "bedroomId": null,
          "bathroomId": 165,
          "receptionId": null,
          "otherRoomId": null,
          "kitchenId": null,
          "gardenId": null,
          "outdoorSpaceId": null,
          "landId": null,
          "yardId": null
        },
        {
          "id": 1278,
          "image": "f08471ae-a51d-4a43-9632-7a193b129500",
          "videoTour": null,
          "floorPlan": null,
          "metadata": "{\"alt\":\"Reception 1 - yippee qua yowza\",\"description\":\"amid wear lotion whenever carelessly\",\"roomType\":\"Reception 1\",\"cloudflareImageId\":\"f08471ae-a51d-4a43-9632-7a193b129500\"}",
          "propertyId": 113,
          "sortOrder": 0,
          "createdAt": "2026-02-24T22:37:18.202Z",
          "updatedAt": "2026-02-24T22:37:18.202Z",
          "bedroomId": null,
          "bathroomId": null,
          "receptionId": 231,
          "otherRoomId": null,
          "kitchenId": null,
          "gardenId": null,
          "outdoorSpaceId": null,
          "landId": null,
          "yardId": null
        },
        {
          "id": 1279,
          "image": "afe7c3a4-e948-40f9-314c-8f861d1c9300",
          "videoTour": null,
          "floorPlan": null,
          "metadata": "{\"alt\":\"Other Room 1 - anenst monstrous whoa\",\"description\":\"unto uncover famously issue calmly\",\"roomType\":\"Other Room 1\",\"cloudflareImageId\":\"afe7c3a4-e948-40f9-314c-8f861d1c9300\"}",
          "propertyId": 113,
          "sortOrder": 0,
          "createdAt": "2026-02-24T22:37:18.202Z",
          "updatedAt": "2026-02-24T22:37:18.202Z",
          "bedroomId": null,
          "bathroomId": null,
          "receptionId": null,
          "otherRoomId": 221,
          "kitchenId": null,
          "gardenId": null,
          "outdoorSpaceId": null,
          "landId": null,
          "yardId": null
        },
        {
          "id": 1280,
          "image": "afe7c3a4-e948-40f9-314c-8f861d1c9300",
          "videoTour": null,
          "floorPlan": null,
          "metadata": "{\"alt\":\"Other Room 1 - achieve and rebound\",\"description\":\"censor astride cruel seriously fooey\",\"roomType\":\"Other Room 1\",\"cloudflareImageId\":\"afe7c3a4-e948-40f9-314c-8f861d1c9300\"}",
          "propertyId": 113,
          "sortOrder": 0,
          "createdAt": "2026-02-24T22:37:18.202Z",
          "updatedAt": "2026-02-24T22:37:18.202Z",
          "bedroomId": null,
          "bathroomId": null,
          "receptionId": null,
          "otherRoomId": 221,
          "kitchenId": null,
          "gardenId": null,
          "outdoorSpaceId": null,
          "landId": null,
          "yardId": null
        },
        {
          "id": 1281,
          "image": "afe7c3a4-e948-40f9-314c-8f861d1c9300",
          "videoTour": null,
          "floorPlan": null,
          "metadata": "{\"alt\":\"Other Room 2 - um warmhearted supposing\",\"description\":\"obediently drat below wide past\",\"roomType\":\"Other Room 2\",\"cloudflareImageId\":\"afe7c3a4-e948-40f9-314c-8f861d1c9300\"}",
          "propertyId": 113,
          "sortOrder": 0,
          "createdAt": "2026-02-24T22:37:18.202Z",
          "updatedAt": "2026-02-24T22:37:18.202Z",
          "bedroomId": null,
          "bathroomId": null,
          "receptionId": null,
          "otherRoomId": 222,
          "kitchenId": null,
          "gardenId": null,
          "outdoorSpaceId": null,
          "landId": null,
          "yardId": null
        },
        {
          "id": 1282,
          "image": "55957534-6202-4033-361b-f67b7fd89000",
          "videoTour": null,
          "floorPlan": null,
          "metadata": "{\"alt\":\"Outdoor Space - given meal impure\",\"description\":\"splendid huzzah uh-huh rudely typewriter\",\"roomType\":\"Outdoor Space\",\"cloudflareImageId\":\"55957534-6202-4033-361b-f67b7fd89000\"}",
          "propertyId": 113,
          "sortOrder": 0,
          "createdAt": "2026-02-24T22:37:18.202Z",
          "updatedAt": "2026-02-24T22:37:18.202Z",
          "bedroomId": null,
          "bathroomId": null,
          "receptionId": null,
          "otherRoomId": null,
          "kitchenId": null,
          "gardenId": null,
          "outdoorSpaceId": 97,
          "landId": null,
          "yardId": null
        },
        {
          "id": 1283,
          "image": "55957534-6202-4033-361b-f67b7fd89000",
          "videoTour": null,
          "floorPlan": null,
          "metadata": "{\"alt\":\"Outdoor Space - microchip apropos woot\",\"description\":\"rekindle save swelter pillbox wherever\",\"roomType\":\"Outdoor Space\",\"cloudflareImageId\":\"55957534-6202-4033-361b-f67b7fd89000\"}",
          "propertyId": 113,
          "sortOrder": 0,
          "createdAt": "2026-02-24T22:37:18.202Z",
          "updatedAt": "2026-02-24T22:37:18.202Z",
          "bedroomId": null,
          "bathroomId": null,
          "receptionId": null,
          "otherRoomId": null,
          "kitchenId": null,
          "gardenId": null,
          "outdoorSpaceId": 97,
          "landId": null,
          "yardId": null
        },
        {
          "id": 1284,
          "image": "1591debc-71cc-4ffd-6ef2-f9d6ac404400",
          "videoTour": null,
          "floorPlan": null,
          "metadata": "{\"alt\":\"Front Garden - now via wasteful\",\"description\":\"appropriate why ornate furthermore absent\",\"roomType\":\"Front Garden\",\"cloudflareImageId\":\"1591debc-71cc-4ffd-6ef2-f9d6ac404400\"}",
          "propertyId": 113,
          "sortOrder": 0,
          "createdAt": "2026-02-24T22:37:18.202Z",
          "updatedAt": "2026-02-24T22:37:18.202Z",
          "bedroomId": null,
          "bathroomId": null,
          "receptionId": null,
          "otherRoomId": null,
          "kitchenId": null,
          "gardenId": 151,
          "outdoorSpaceId": null,
          "landId": null,
          "yardId": null
        },
        {
          "id": 1285,
          "image": "1591debc-71cc-4ffd-6ef2-f9d6ac404400",
          "videoTour": null,
          "floorPlan": null,
          "metadata": "{\"alt\":\"Rear Garden - once reel among\",\"description\":\"after oof down insert shakily\",\"roomType\":\"Rear Garden\",\"cloudflareImageId\":\"1591debc-71cc-4ffd-6ef2-f9d6ac404400\"}",
          "propertyId": 113,
          "sortOrder": 0,
          "createdAt": "2026-02-24T22:37:18.202Z",
          "updatedAt": "2026-02-24T22:37:18.202Z",
          "bedroomId": null,
          "bathroomId": null,
          "receptionId": null,
          "otherRoomId": null,
          "kitchenId": null,
          "gardenId": 152,
          "outdoorSpaceId": null,
          "landId": null,
          "yardId": null
        },
        {
          "id": 1286,
          "image": "1591debc-71cc-4ffd-6ef2-f9d6ac404400",
          "videoTour": null,
          "floorPlan": null,
          "metadata": "{\"alt\":\"Woodland Area - inside pants however\",\"description\":\"rotating mechanic hm habit given\",\"roomType\":\"Woodland Area\",\"cloudflareImageId\":\"1591debc-71cc-4ffd-6ef2-f9d6ac404400\"}",
          "propertyId": 113,
          "sortOrder": 0,
          "createdAt": "2026-02-24T22:37:18.202Z",
          "updatedAt": "2026-02-24T22:37:18.202Z",
          "bedroomId": null,
          "bathroomId": null,
          "receptionId": null,
          "otherRoomId": null,
          "kitchenId": null,
          "gardenId": null,
          "outdoorSpaceId": null,
          "landId": 113,
          "yardId": null
        },
        {
          "id": 1287,
          "image": "55957534-6202-4033-361b-f67b7fd89000",
          "videoTour": null,
          "floorPlan": null,
          "metadata": "{\"alt\":\"Woodland Area - keel ugh before\",\"description\":\"plus oh ick before christen\",\"roomType\":\"Woodland Area\",\"cloudflareImageId\":\"55957534-6202-4033-361b-f67b7fd89000\"}",
          "propertyId": 113,
          "sortOrder": 0,
          "createdAt": "2026-02-24T22:37:18.202Z",
          "updatedAt": "2026-02-24T22:37:18.202Z",
          "bedroomId": null,
          "bathroomId": null,
          "receptionId": null,
          "otherRoomId": null,
          "kitchenId": null,
          "gardenId": null,
          "outdoorSpaceId": null,
          "landId": 113,
          "yardId": null
        },
        {
          "id": 1288,
          "image": "55957534-6202-4033-361b-f67b7fd89000",
          "videoTour": null,
          "floorPlan": null,
          "metadata": "{\"alt\":\"Paddock - behind that shush\",\"description\":\"meh thick geez angrily typeface\",\"roomType\":\"Paddock\",\"cloudflareImageId\":\"55957534-6202-4033-361b-f67b7fd89000\"}",
          "propertyId": 113,
          "sortOrder": 0,
          "createdAt": "2026-02-24T22:37:18.202Z",
          "updatedAt": "2026-02-24T22:37:18.202Z",
          "bedroomId": null,
          "bathroomId": null,
          "receptionId": null,
          "otherRoomId": null,
          "kitchenId": null,
          "gardenId": null,
          "outdoorSpaceId": null,
          "landId": 114,
          "yardId": null
        }
      ],
      "type": {
        "id": 1,
        "name": "House",
        "defaultSelected": false
      },
      "classification": {
        "id": 4,
        "name": "End of Terrace",
        "categoryId": 1
      },
      "bedroomFeatures": [
        {
          "id": 347,
          "roomNumber": 1,
          "name": "Child's Bedroom",
          "bed": [
            "DOUBLE"
          ],
          "floor": 1,
          "description": "vice first past catalyst till ick ostrich willing habit where",
          "features": [
            "BUILT_IN_STORAGE",
            "WALK_IN_WARDROBE",
            "BALCONY",
            "HAS_VIEW"
          ],
          "size": 14,
          "propertyId": 113,
          "createdAt": "2026-02-24T22:36:57.474Z",
          "updatedAt": "2026-02-24T22:36:57.474Z",
          "media": [
            {
              "id": 1273,
              "image": "9ef289b1-e2cf-4e70-a1e3-1ca4beba4f00",
              "videoTour": null,
              "floorPlan": null,
              "metadata": "{\"alt\":\"Bedroom 1\",\"description\":\"rationalize consequently carefree commonly brr\",\"roomType\":\"Bedroom 1\",\"cloudflareImageId\":\"9ef289b1-e2cf-4e70-a1e3-1ca4beba4f00\"}",
              "propertyId": 113,
              "sortOrder": 0,
              "createdAt": "2026-02-24T22:37:18.202Z",
              "updatedAt": "2026-02-24T22:37:18.202Z",
              "bedroomId": 347,
              "bathroomId": null,
              "receptionId": null,
              "otherRoomId": null,
              "kitchenId": null,
              "gardenId": null,
              "outdoorSpaceId": null,
              "landId": null,
              "yardId": null
            }
          ]
        },
        {
          "id": 348,
          "roomNumber": 2,
          "name": "Spare Bedroom",
          "bed": [
            "SINGLE"
          ],
          "floor": 1,
          "description": "aboard drat cinder whenever considering waft punctually restructure lender mmm",
          "features": [
            "BAY_WINDOW"
          ],
          "size": 10,
          "propertyId": 113,
          "createdAt": "2026-02-24T22:36:57.474Z",
          "updatedAt": "2026-02-24T22:36:57.474Z",
          "media": [
            {
              "id": 1274,
              "image": "9ef289b1-e2cf-4e70-a1e3-1ca4beba4f00",
              "videoTour": null,
              "floorPlan": null,
              "metadata": "{\"alt\":\"Bedroom 2 - upright stunning huzzah\",\"description\":\"ha co-producer impartial aside wafer\",\"roomType\":\"Bedroom 2\",\"cloudflareImageId\":\"9ef289b1-e2cf-4e70-a1e3-1ca4beba4f00\"}",
              "propertyId": 113,
              "sortOrder": 0,
              "createdAt": "2026-02-24T22:37:18.202Z",
              "updatedAt": "2026-02-24T22:37:18.202Z",
              "bedroomId": 348,
              "bathroomId": null,
              "receptionId": null,
              "otherRoomId": null,
              "kitchenId": null,
              "gardenId": null,
              "outdoorSpaceId": null,
              "landId": null,
              "yardId": null
            },
            {
              "id": 1275,
              "image": "9ef289b1-e2cf-4e70-a1e3-1ca4beba4f00",
              "videoTour": null,
              "floorPlan": null,
              "metadata": "{\"alt\":\"Bedroom 2 - triangular aw fedora\",\"description\":\"grumpy ah outlying nab completion\",\"roomType\":\"Bedroom 2\",\"cloudflareImageId\":\"9ef289b1-e2cf-4e70-a1e3-1ca4beba4f00\"}",
              "propertyId": 113,
              "sortOrder": 0,
              "createdAt": "2026-02-24T22:37:18.202Z",
              "updatedAt": "2026-02-24T22:37:18.202Z",
              "bedroomId": 348,
              "bathroomId": null,
              "receptionId": null,
              "otherRoomId": null,
              "kitchenId": null,
              "gardenId": null,
              "outdoorSpaceId": null,
              "landId": null,
              "yardId": null
            }
          ]
        }
      ],
      "bathroomFeatures": [
        {
          "id": 165,
          "roomNumber": 1,
          "floor": 0,
          "name": "En Suite Bathroom",
          "features": [
            "TOILET",
            "BATHTUB"
          ],
          "description": "upsell clamor scowl soap roadway meanwhile chase fooey vista crossly",
          "size": 39,
          "propertyId": 113,
          "createdAt": "2026-02-24T22:36:57.474Z",
          "updatedAt": "2026-02-24T22:36:57.474Z",
          "media": [
            {
              "id": 1277,
              "image": "51972637-4e53-48d5-b11f-5eedb66f7000",
              "videoTour": null,
              "floorPlan": null,
              "metadata": "{\"alt\":\"Bathroom 1 - lay abaft but\",\"description\":\"attest relieve wherever spiteful heating\",\"roomType\":\"Bathroom 1\",\"cloudflareImageId\":\"51972637-4e53-48d5-b11f-5eedb66f7000\"}",
              "propertyId": 113,
              "sortOrder": 0,
              "createdAt": "2026-02-24T22:37:18.202Z",
              "updatedAt": "2026-02-24T22:37:18.202Z",
              "bedroomId": null,
              "bathroomId": 165,
              "receptionId": null,
              "otherRoomId": null,
              "kitchenId": null,
              "gardenId": null,
              "outdoorSpaceId": null,
              "landId": null,
              "yardId": null
            }
          ]
        }
      ],
      "otherRoom": [
        {
          "id": 221,
          "roomNumber": 1,
          "floor": 0,
          "name": "er meanwhile",
          "type": "OFFICE",
          "description": "aw impure whoa royal but past woot easily than cheetah",
          "size": 18,
          "features": [
            "OPEN_PLAN",
            "BALCONY",
            "SOUND_PROOFING",
            "ACCOUSTIC_PANELS",
            "STONE_FLOORING",
            "BUILT_IN_DESK",
            "FIREPLACE"
          ],
          "propertyId": 113,
          "createdAt": "2026-02-24T22:36:57.474Z",
          "updatedAt": "2026-02-24T22:36:57.474Z",
          "media": [
            {
              "id": 1279,
              "image": "afe7c3a4-e948-40f9-314c-8f861d1c9300",
              "videoTour": null,
              "floorPlan": null,
              "metadata": "{\"alt\":\"Other Room 1 - anenst monstrous whoa\",\"description\":\"unto uncover famously issue calmly\",\"roomType\":\"Other Room 1\",\"cloudflareImageId\":\"afe7c3a4-e948-40f9-314c-8f861d1c9300\"}",
              "propertyId": 113,
              "sortOrder": 0,
              "createdAt": "2026-02-24T22:37:18.202Z",
              "updatedAt": "2026-02-24T22:37:18.202Z",
              "bedroomId": null,
              "bathroomId": null,
              "receptionId": null,
              "otherRoomId": 221,
              "kitchenId": null,
              "gardenId": null,
              "outdoorSpaceId": null,
              "landId": null,
              "yardId": null
            },
            {
              "id": 1280,
              "image": "afe7c3a4-e948-40f9-314c-8f861d1c9300",
              "videoTour": null,
              "floorPlan": null,
              "metadata": "{\"alt\":\"Other Room 1 - achieve and rebound\",\"description\":\"censor astride cruel seriously fooey\",\"roomType\":\"Other Room 1\",\"cloudflareImageId\":\"afe7c3a4-e948-40f9-314c-8f861d1c9300\"}",
              "propertyId": 113,
              "sortOrder": 0,
              "createdAt": "2026-02-24T22:37:18.202Z",
              "updatedAt": "2026-02-24T22:37:18.202Z",
              "bedroomId": null,
              "bathroomId": null,
              "receptionId": null,
              "otherRoomId": 221,
              "kitchenId": null,
              "gardenId": null,
              "outdoorSpaceId": null,
              "landId": null,
              "yardId": null
            }
          ]
        },
        {
          "id": 222,
          "roomNumber": 2,
          "floor": 0,
          "name": "and reconstitute",
          "type": "POOL_ROOM",
          "description": "whereas total anxiously though preclude fishery preside blah bog yahoo",
          "size": 41,
          "features": [
            "BALCONY",
            "BUILT_IN_STORAGE",
            "SERVING_HATCH",
            "BAR_AREA",
            "HARDWOOD_FLOORING",
            "BUILT_IN_DESK"
          ],
          "propertyId": 113,
          "createdAt": "2026-02-24T22:36:57.474Z",
          "updatedAt": "2026-02-24T22:36:57.474Z",
          "media": [
            {
              "id": 1281,
              "image": "afe7c3a4-e948-40f9-314c-8f861d1c9300",
              "videoTour": null,
              "floorPlan": null,
              "metadata": "{\"alt\":\"Other Room 2 - um warmhearted supposing\",\"description\":\"obediently drat below wide past\",\"roomType\":\"Other Room 2\",\"cloudflareImageId\":\"afe7c3a4-e948-40f9-314c-8f861d1c9300\"}",
              "propertyId": 113,
              "sortOrder": 0,
              "createdAt": "2026-02-24T22:37:18.202Z",
              "updatedAt": "2026-02-24T22:37:18.202Z",
              "bedroomId": null,
              "bathroomId": null,
              "receptionId": null,
              "otherRoomId": 222,
              "kitchenId": null,
              "gardenId": null,
              "outdoorSpaceId": null,
              "landId": null,
              "yardId": null
            }
          ]
        }
      ],
      "parking": {
        "id": 113,
        "description": "blind delete soon ick notwithstanding marathon yowza entrench ick aw",
        "features": [
          "GARAGE",
          "DRIVEWAY",
          "ON_STREET"
        ],
        "propertyId": 113,
        "createdAt": "2026-02-24T22:36:57.474Z",
        "updatedAt": "2026-02-24T22:36:57.474Z"
      },
      "amenities": [
        {
          "id": 2017,
          "type": "EDUCATION",
          "subtype": "SCHOOL",
          "name": "Bashirian, Funk and Breitenberg School",
          "distanceM": 8412,
          "description": null,
          "location": null,
          "propertyId": 113,
          "createdAt": "2026-02-24T22:36:57.474Z"
        },
        {
          "id": 2018,
          "type": "EDUCATION",
          "subtype": "SCHOOL",
          "name": "Reichel, Klocko and Strosin School",
          "distanceM": 4774,
          "description": null,
          "location": null,
          "propertyId": 113,
          "createdAt": "2026-02-24T22:36:57.474Z"
        },
        {
          "id": 2019,
          "type": "EDUCATION",
          "subtype": "SCHOOL",
          "name": "Bogan - Erdman School",
          "distanceM": 6441,
          "description": null,
          "location": null,
          "propertyId": 113,
          "createdAt": "2026-02-24T22:36:57.474Z"
        },
        {
          "id": 2020,
          "type": "HEALTHCARE",
          "subtype": "HOSPITAL",
          "name": "Feest, Parisian and Cummings Hospital",
          "distanceM": 7711,
          "description": null,
          "location": null,
          "propertyId": 113,
          "createdAt": "2026-02-24T22:36:57.474Z"
        },
        {
          "id": 2021,
          "type": "HEALTHCARE",
          "subtype": "HOSPITAL",
          "name": "Schmeler and Sons Hospital",
          "distanceM": 7443,
          "description": null,
          "location": null,
          "propertyId": 113,
          "createdAt": "2026-02-24T22:36:57.474Z"
        },
        {
          "id": 2022,
          "type": "HEALTHCARE",
          "subtype": "HOSPITAL",
          "name": "Pouros and Sons Hospital",
          "distanceM": 7046,
          "description": null,
          "location": null,
          "propertyId": 113,
          "createdAt": "2026-02-24T22:36:57.474Z"
        },
        {
          "id": 2023,
          "type": "TRANSPORT",
          "subtype": "TRAIN_STATION",
          "name": "Wehnerbury Train Station",
          "distanceM": 7470,
          "description": null,
          "location": null,
          "propertyId": 113,
          "createdAt": "2026-02-24T22:36:57.474Z"
        },
        {
          "id": 2024,
          "type": "TRANSPORT",
          "subtype": "TRAIN_STATION",
          "name": "Hayesville Train Station",
          "distanceM": 8204,
          "description": null,
          "location": null,
          "propertyId": 113,
          "createdAt": "2026-02-24T22:36:57.474Z"
        },
        {
          "id": 2025,
          "type": "TRANSPORT",
          "subtype": "TRAIN_STATION",
          "name": "Port Maribelmouth Train Station",
          "distanceM": 1811,
          "description": null,
          "location": null,
          "propertyId": 113,
          "createdAt": "2026-02-24T22:36:57.474Z"
        },
        {
          "id": 2026,
          "type": "TRANSPORT",
          "subtype": "BUS_STOP",
          "name": "Purdy Freeway Bus Stop",
          "distanceM": 1502,
          "description": null,
          "location": null,
          "propertyId": 113,
          "createdAt": "2026-02-24T22:36:57.474Z"
        },
        {
          "id": 2027,
          "type": "TRANSPORT",
          "subtype": "BUS_STOP",
          "name": "Bode Track Bus Stop",
          "distanceM": 2262,
          "description": null,
          "location": null,
          "propertyId": 113,
          "createdAt": "2026-02-24T22:36:57.474Z"
        },
        {
          "id": 2028,
          "type": "TRANSPORT",
          "subtype": "BUS_STOP",
          "name": "Florine Mission Bus Stop",
          "distanceM": 3747,
          "description": null,
          "location": null,
          "propertyId": 113,
          "createdAt": "2026-02-24T22:36:57.474Z"
        },
        {
          "id": 2029,
          "type": "GREEN_SPACE",
          "subtype": "PARK",
          "name": "East Rorystad Park",
          "distanceM": 7003,
          "description": null,
          "location": null,
          "propertyId": 113,
          "createdAt": "2026-02-24T22:36:57.474Z"
        },
        {
          "id": 2030,
          "type": "GREEN_SPACE",
          "subtype": "PARK",
          "name": "Lake Kacie Park",
          "distanceM": 6574,
          "description": null,
          "location": null,
          "propertyId": 113,
          "createdAt": "2026-02-24T22:36:57.474Z"
        },
        {
          "id": 2031,
          "type": "GREEN_SPACE",
          "subtype": "PARK",
          "name": "Novi Park",
          "distanceM": 5317,
          "description": null,
          "location": null,
          "propertyId": 113,
          "createdAt": "2026-02-24T22:36:57.474Z"
        },
        {
          "id": 2032,
          "type": "SHOPPING_ENTERTAINMENT",
          "subtype": "GYM",
          "name": "Cruickshank, Kiehn and Zulauf Gym",
          "distanceM": 8661,
          "description": null,
          "location": null,
          "propertyId": 113,
          "createdAt": "2026-02-24T22:36:57.474Z"
        },
        {
          "id": 2033,
          "type": "SHOPPING_ENTERTAINMENT",
          "subtype": "GYM",
          "name": "Borer Inc Gym",
          "distanceM": 7020,
          "description": null,
          "location": null,
          "propertyId": 113,
          "createdAt": "2026-02-24T22:36:57.474Z"
        },
        {
          "id": 2034,
          "type": "SHOPPING_ENTERTAINMENT",
          "subtype": "GYM",
          "name": "Cummings, Leuschke and Boyer Gym",
          "distanceM": 6277,
          "description": null,
          "location": null,
          "propertyId": 113,
          "createdAt": "2026-02-24T22:36:57.474Z"
        }
      ],
      "additionalFeatures": {
        "id": 113,
        "description": "incidentally advanced vestment boastfully eek through fooey inside dimly apropos",
        "petFriendly": false,
        "moveInDate": "2026-12-15T20:55:11.926Z",
        "features": [],
        "propertyId": 113,
        "createdAt": "2026-02-24T22:36:57.474Z",
        "updatedAt": "2026-02-24T22:36:57.474Z"
      },
      "accessibilityFeatures": {
        "id": 113,
        "description": "so yowza curse under though uh-huh hastily sit phooey extroverted",
        "features": [
          "WHEELCHAIR_FRIENDLY",
          "WIDE_DOORWAYS",
          "HANDRAILS",
          "STAIRS"
        ],
        "propertyId": 113,
        "createdAt": "2026-02-24T22:36:57.474Z",
        "updatedAt": "2026-02-24T22:36:57.474Z"
      },
      "kitchenFeatures": [
        {
          "id": 225,
          "roomNumber": 1,
          "floor": 1,
          "name": "mesh acceptable",
          "features": [
            "MODERN",
            "OPEN_PLAN",
            "WHITE_GOODS",
            "ISLAND",
            "UTILITY_ACCESS",
            "PANTRY"
          ],
          "description": "how tighten dead puzzled patiently apud acclaimed collaboration gosh meanwhile",
          "size": 41,
          "propertyId": 113,
          "createdAt": "2026-02-24T22:36:57.474Z",
          "updatedAt": "2026-02-24T22:36:57.474Z",
          "media": [
            {
              "id": 1276,
              "image": "d181f96f-be34-4e99-2095-eb7319827900",
              "videoTour": null,
              "floorPlan": null,
              "metadata": "{\"alt\":\"Kitchen 1 - ugh defiantly below\",\"description\":\"owlishly times strong boohoo considering\",\"roomType\":\"Kitchen 1\",\"cloudflareImageId\":\"d181f96f-be34-4e99-2095-eb7319827900\"}",
              "propertyId": 113,
              "sortOrder": 0,
              "createdAt": "2026-02-24T22:37:18.202Z",
              "updatedAt": "2026-02-24T22:37:18.202Z",
              "bedroomId": null,
              "bathroomId": null,
              "receptionId": null,
              "otherRoomId": null,
              "kitchenId": 225,
              "gardenId": null,
              "outdoorSpaceId": null,
              "landId": null,
              "yardId": null
            }
          ]
        }
      ],
      "reception": [
        {
          "id": 231,
          "roomNumber": 1,
          "floor": 1,
          "name": "barring pantyhose",
          "type": "HOME_CINEMA",
          "description": "reflecting known till daintily pike than however boo effector when",
          "size": 42,
          "features": [
            "OPEN_PLAN",
            "OPEN_CONCEPT",
            "BALCONY",
            "BAY_WINDOW",
            "SOUND_PROOFING",
            "BUILT_IN_DESK"
          ],
          "propertyId": 113,
          "createdAt": "2026-02-24T22:36:57.474Z",
          "updatedAt": "2026-02-24T22:36:57.474Z",
          "media": [
            {
              "id": 1278,
              "image": "f08471ae-a51d-4a43-9632-7a193b129500",
              "videoTour": null,
              "floorPlan": null,
              "metadata": "{\"alt\":\"Reception 1 - yippee qua yowza\",\"description\":\"amid wear lotion whenever carelessly\",\"roomType\":\"Reception 1\",\"cloudflareImageId\":\"f08471ae-a51d-4a43-9632-7a193b129500\"}",
              "propertyId": 113,
              "sortOrder": 0,
              "createdAt": "2026-02-24T22:37:18.202Z",
              "updatedAt": "2026-02-24T22:37:18.202Z",
              "bedroomId": null,
              "bathroomId": null,
              "receptionId": 231,
              "otherRoomId": null,
              "kitchenId": null,
              "gardenId": null,
              "outdoorSpaceId": null,
              "landId": null,
              "yardId": null
            }
          ]
        }
      ],
      "utility": {
        "id": 113,
        "description": "till ack tensely spherical towards joyfully of smog plain oh",
        "features": [
          "STORAGE"
        ],
        "size": 18.62774687229135,
        "propertyId": 113,
        "createdAt": "2026-02-24T22:36:57.474Z",
        "updatedAt": "2026-02-24T22:36:57.474Z"
      },
      "outdoorSpace": {
        "id": 97,
        "description": "although impish deduct summarise fully and uh-huh enchanted humble whoa",
        "totalArea": 660.29,
        "features": [
          "SUN_TERRACE",
          "TERRACE",
          "SEPARATE_PARCEL",
          "GARDEN_OFFICE",
          "POOL"
        ],
        "propertyId": 113,
        "createdAt": "2026-02-24T22:36:57.474Z",
        "updatedAt": "2026-02-24T22:36:57.474Z",
        "yard": [],
        "garden": [
          {
            "id": 151,
            "description": null,
            "name": "Front Garden",
            "size": 99.43,
            "additionalDetails": false,
            "facing": "SOUTH",
            "position": "FRONT",
            "features": [],
            "createdAt": "2026-02-24T22:36:57.474Z",
            "updatedAt": "2026-02-24T22:36:57.474Z",
            "outdoorSpaceId": 97,
            "media": [
              {
                "id": 1284,
                "image": "1591debc-71cc-4ffd-6ef2-f9d6ac404400",
                "videoTour": null,
                "floorPlan": null,
                "metadata": "{\"alt\":\"Front Garden - now via wasteful\",\"description\":\"appropriate why ornate furthermore absent\",\"roomType\":\"Front Garden\",\"cloudflareImageId\":\"1591debc-71cc-4ffd-6ef2-f9d6ac404400\"}",
                "propertyId": 113,
                "sortOrder": 0,
                "createdAt": "2026-02-24T22:37:18.202Z",
                "updatedAt": "2026-02-24T22:37:18.202Z",
                "bedroomId": null,
                "bathroomId": null,
                "receptionId": null,
                "otherRoomId": null,
                "kitchenId": null,
                "gardenId": 151,
                "outdoorSpaceId": null,
                "landId": null,
                "yardId": null
              }
            ]
          },
          {
            "id": 152,
            "description": "sock hello until present unzip evil king fuel fork celebrated",
            "name": "Rear Garden",
            "size": 127.3,
            "additionalDetails": true,
            "facing": "WEST",
            "position": "REAR",
            "features": [
              "BALCONY",
              "PATIO",
              "SHED",
              "GARDEN_OFFICE"
            ],
            "createdAt": "2026-02-24T22:36:57.474Z",
            "updatedAt": "2026-02-24T22:36:57.474Z",
            "outdoorSpaceId": 97,
            "media": [
              {
                "id": 1285,
                "image": "1591debc-71cc-4ffd-6ef2-f9d6ac404400",
                "videoTour": null,
                "floorPlan": null,
                "metadata": "{\"alt\":\"Rear Garden - once reel among\",\"description\":\"after oof down insert shakily\",\"roomType\":\"Rear Garden\",\"cloudflareImageId\":\"1591debc-71cc-4ffd-6ef2-f9d6ac404400\"}",
                "propertyId": 113,
                "sortOrder": 0,
                "createdAt": "2026-02-24T22:37:18.202Z",
                "updatedAt": "2026-02-24T22:37:18.202Z",
                "bedroomId": null,
                "bathroomId": null,
                "receptionId": null,
                "otherRoomId": null,
                "kitchenId": null,
                "gardenId": 152,
                "outdoorSpaceId": null,
                "landId": null,
                "yardId": null
              }
            ]
          }
        ],
        "land": [
          {
            "id": 113,
            "description": null,
            "additionalDetails": false,
            "size": 131.45,
            "name": "Woodland Area",
            "separateParcel": false,
            "features": [],
            "createdAt": "2026-02-24T22:36:57.474Z",
            "updatedAt": "2026-02-24T22:36:57.474Z",
            "outdoorSpaceId": 97,
            "media": [
              {
                "id": 1286,
                "image": "1591debc-71cc-4ffd-6ef2-f9d6ac404400",
                "videoTour": null,
                "floorPlan": null,
                "metadata": "{\"alt\":\"Woodland Area - inside pants however\",\"description\":\"rotating mechanic hm habit given\",\"roomType\":\"Woodland Area\",\"cloudflareImageId\":\"1591debc-71cc-4ffd-6ef2-f9d6ac404400\"}",
                "propertyId": 113,
                "sortOrder": 0,
                "createdAt": "2026-02-24T22:37:18.202Z",
                "updatedAt": "2026-02-24T22:37:18.202Z",
                "bedroomId": null,
                "bathroomId": null,
                "receptionId": null,
                "otherRoomId": null,
                "kitchenId": null,
                "gardenId": null,
                "outdoorSpaceId": null,
                "landId": 113,
                "yardId": null
              },
              {
                "id": 1287,
                "image": "55957534-6202-4033-361b-f67b7fd89000",
                "videoTour": null,
                "floorPlan": null,
                "metadata": "{\"alt\":\"Woodland Area - keel ugh before\",\"description\":\"plus oh ick before christen\",\"roomType\":\"Woodland Area\",\"cloudflareImageId\":\"55957534-6202-4033-361b-f67b7fd89000\"}",
                "propertyId": 113,
                "sortOrder": 0,
                "createdAt": "2026-02-24T22:37:18.202Z",
                "updatedAt": "2026-02-24T22:37:18.202Z",
                "bedroomId": null,
                "bathroomId": null,
                "receptionId": null,
                "otherRoomId": null,
                "kitchenId": null,
                "gardenId": null,
                "outdoorSpaceId": null,
                "landId": 113,
                "yardId": null
              }
            ]
          },
          {
            "id": 114,
            "description": "own next stealthily yippee garage feather capitalize phooey quickly wetly",
            "additionalDetails": true,
            "size": 302.11,
            "name": "Paddock",
            "separateParcel": true,
            "features": [
              "WOODLAND",
              "PADDOCK",
              "TENNIS_COURT"
            ],
            "createdAt": "2026-02-24T22:36:57.474Z",
            "updatedAt": "2026-02-24T22:36:57.474Z",
            "outdoorSpaceId": 97,
            "media": [
              {
                "id": 1288,
                "image": "55957534-6202-4033-361b-f67b7fd89000",
                "videoTour": null,
                "floorPlan": null,
                "metadata": "{\"alt\":\"Paddock - behind that shush\",\"description\":\"meh thick geez angrily typeface\",\"roomType\":\"Paddock\",\"cloudflareImageId\":\"55957534-6202-4033-361b-f67b7fd89000\"}",
                "propertyId": 113,
                "sortOrder": 0,
                "createdAt": "2026-02-24T22:37:18.202Z",
                "updatedAt": "2026-02-24T22:37:18.202Z",
                "bedroomId": null,
                "bathroomId": null,
                "receptionId": null,
                "otherRoomId": null,
                "kitchenId": null,
                "gardenId": null,
                "outdoorSpaceId": null,
                "landId": 114,
                "yardId": null
              }
            ]
          }
        ],
        "media": [
          {
            "id": 1282,
            "image": "55957534-6202-4033-361b-f67b7fd89000",
            "videoTour": null,
            "floorPlan": null,
            "metadata": "{\"alt\":\"Outdoor Space - given meal impure\",\"description\":\"splendid huzzah uh-huh rudely typewriter\",\"roomType\":\"Outdoor Space\",\"cloudflareImageId\":\"55957534-6202-4033-361b-f67b7fd89000\"}",
            "propertyId": 113,
            "sortOrder": 0,
            "createdAt": "2026-02-24T22:37:18.202Z",
            "updatedAt": "2026-02-24T22:37:18.202Z",
            "bedroomId": null,
            "bathroomId": null,
            "receptionId": null,
            "otherRoomId": null,
            "kitchenId": null,
            "gardenId": null,
            "outdoorSpaceId": 97,
            "landId": null,
            "yardId": null
          },
          {
            "id": 1283,
            "image": "55957534-6202-4033-361b-f67b7fd89000",
            "videoTour": null,
            "floorPlan": null,
            "metadata": "{\"alt\":\"Outdoor Space - microchip apropos woot\",\"description\":\"rekindle save swelter pillbox wherever\",\"roomType\":\"Outdoor Space\",\"cloudflareImageId\":\"55957534-6202-4033-361b-f67b7fd89000\"}",
            "propertyId": 113,
            "sortOrder": 0,
            "createdAt": "2026-02-24T22:37:18.202Z",
            "updatedAt": "2026-02-24T22:37:18.202Z",
            "bedroomId": null,
            "bathroomId": null,
            "receptionId": null,
            "otherRoomId": null,
            "kitchenId": null,
            "gardenId": null,
            "outdoorSpaceId": 97,
            "landId": null,
            "yardId": null
          }
        ]
      },
      "energyAndUtilities": {
        "id": 113,
        "propertyId": 113,
        "description": "publication boohoo yippee brr butter yowza up unto eek step",
        "epcRating": "E",
        "epcCertificateUrl": "https://stupendous-cemetery.com",
        "primaryHeatingType": [
          "HEAT_PUMP"
        ],
        "secondaryHeatingType": [
          "OIL"
        ],
        "boilerType": "COMBI",
        "hotWaterSource": "OTHER",
        "renewables": [
          "EV_CHARGING"
        ],
        "connectedUtilities": [
          "SEPTIC_TANK",
          "CESSPIT",
          "DRAINAGE"
        ],
        "broadbandType": "MOBILE",
        "fullFibreAvailable": true,
        "maxDownloadSpeedMbps": 464,
        "createdAt": "2026-02-24T22:36:57.474Z",
        "updatedAt": "2026-02-24T22:36:57.474Z"
      },
      "securityFeatures": {
        "id": 113,
        "description": "while astride coincide behind unless eek knavishly absent covenant accentuate whereas yowza eek appropriate reiterate",
        "features": [
          "GATED_COMMUNITY",
          "SECURITY"
        ],
        "propertyId": 113,
        "createdAt": "2026-02-24T22:36:57.474Z",
        "updatedAt": "2026-02-24T22:36:57.474Z"
      },
      "storageFeatures": {
        "id": 113,
        "description": "how blah ick in writ ownership informal supposing farmer animated steeple afford quicker fiercely though unsung though how winding selfishly",
        "features": [
          "ATTIC",
          "UNDER_STAIRS_STORAGE"
        ],
        "propertyId": 113,
        "createdAt": "2026-02-24T22:36:57.474Z",
        "updatedAt": "2026-02-24T22:36:57.474Z"
      },
      "runningCosts": {
        "id": 113,
        "description": "space sometimes shred insecure modulo outside institute terrorise under behind gosh summarise below oh oblong",
        "councilTaxBand": "D",
        "serviceCharges": 211.35,
        "groundRent": 281.6,
        "propertyId": 113,
        "createdAt": "2026-02-24T22:36:57.474Z",
        "updatedAt": "2026-02-24T22:36:57.474Z"
      }
    },
    "user": {
      "id": 29,
      "username": "Jesse21_24",
      "email": "24_Angie93@hotmail.com",
      "createdAt": "2026-02-24T22:39:53.601Z"
    },
    "listingType": "rent"
  },
  {
    "id": 2404,
    "price": 1165.99,
    "moveInDate": "2026-11-24T12:00:04.805Z",
    "listingTier": "FEATURED",
    "listingStartDate": "2026-02-24T22:41:57.711Z",
    "listingEndDate": "2026-05-18T15:03:44.548Z",
    "viewingOptions": "likewise dwell sandbar toothbrush above shudder retention daintily boohoo maintainer",
    "verificationLevel": "FULLY_VERIFIED",
    "userId": 603,
    "propertyId": 2404,
    "estateAgentId": null,
    "publishedAt": "2026-02-19T04:10:20.774Z",
    "published": true,
    "createdAt": "2026-02-24T22:41:58.764Z",
    "updatedAt": "2026-02-24T22:41:58.764Z",
    "archived": false,
    "archivedAt": null,
    "rentalListing": {
      "id": 1204,
      "listingId": 2404,
      "deposit": 6775.37,
      "holdingDeposit": 6445.71,
      "rentFrequency": "WEEKLY",
      "isBillsIncluded": true,
      "rentalLength": "LONG_TERM",
      "furnishedStatus": "PART_FURNISHED",
      "availabilityStatus": "LET",
      "draftListingId": null
    },
    "saleListing": null,
    "property": {
      "id": 2404,
      "description": "shoulder healthily if marksman lavish kookily divert sarcastic notwithstanding absent institute neck shampoo smoothly equally likewise uh-huh hmph overplay aboard",
      "value": 940791.46,
      "size": 113,
      "yearBuilt": "2025",
      "chainFree": true,
      "vacant": false,
      "constructionType": "NON_STANDARD",
      "floorLevel": null,
      "totalFloors": 2,
      "numberBedrooms": 2,
      "numberBathrooms": 1,
      "numberReceptions": 3,
      "numberOtherRooms": 3,
      "numberKitchens": 3,
      "createdAt": "2026-02-24T22:38:22.225Z",
      "updatedAt": "2026-02-24T22:38:22.225Z",
      "addressId": 2413,
      "userId": 1,
      "estateAgentId": null,
      "propertyTypeId": 1,
      "propertyClassificationId": 4,
      "address": {
        "id": 2413,
        "number": "RIMINI HOUSE",
        "flat": null,
        "name": null,
        "street": "Ffordd Garthorne",
        "city": "Cardiff",
        "postcode": "CF10 4DH",
        "country": null,
        "locality": null,
        "county": null,
        "district": null,
        "fullAddress": "RIMINI HOUSE, Ffordd Garthorne, Cardiff, CF10 4DH",
        "lat": 51.481655,
        "lon": -3.179194,
        "createdAt": "2026-02-24T22:38:22.225Z",
        "updatedAt": "2026-02-24T22:38:22.225Z"
      },
      "media": [
        {
          "id": 27976,
          "image": "d0f1451c-5944-431d-8b40-583622460f00",
          "videoTour": null,
          "floorPlan": null,
          "metadata": "{\"alt\":\"Exterior - which athwart unto\",\"description\":\"warlike gut woot next whether\",\"roomType\":\"Exterior\",\"cloudflareImageId\":\"d0f1451c-5944-431d-8b40-583622460f00\"}",
          "propertyId": 2404,
          "sortOrder": 0,
          "createdAt": "2026-02-24T22:38:42.966Z",
          "updatedAt": "2026-02-24T22:38:42.966Z",
          "bedroomId": null,
          "bathroomId": null,
          "receptionId": null,
          "otherRoomId": null,
          "kitchenId": null,
          "gardenId": null,
          "outdoorSpaceId": null,
          "landId": null,
          "yardId": null
        },
        {
          "id": 27977,
          "image": "1591debc-71cc-4ffd-6ef2-f9d6ac404400",
          "videoTour": null,
          "floorPlan": null,
          "metadata": "{\"alt\":\"Garden - how frank when\",\"description\":\"yippee mindless um swine recede\",\"roomType\":\"Garden\",\"cloudflareImageId\":\"1591debc-71cc-4ffd-6ef2-f9d6ac404400\"}",
          "propertyId": 2404,
          "sortOrder": 0,
          "createdAt": "2026-02-24T22:38:42.966Z",
          "updatedAt": "2026-02-24T22:38:42.966Z",
          "bedroomId": null,
          "bathroomId": null,
          "receptionId": null,
          "otherRoomId": null,
          "kitchenId": null,
          "gardenId": null,
          "outdoorSpaceId": null,
          "landId": null,
          "yardId": null
        },
        {
          "id": 27978,
          "image": "0ba57463-d707-4914-8370-eeaad9efb700",
          "videoTour": null,
          "floorPlan": null,
          "metadata": "{\"alt\":\"Dining Room\",\"description\":\"splay likewise forager given repeatedly\",\"roomType\":\"Dining Room\",\"cloudflareImageId\":\"0ba57463-d707-4914-8370-eeaad9efb700\"}",
          "propertyId": 2404,
          "sortOrder": 0,
          "createdAt": "2026-02-24T22:38:42.966Z",
          "updatedAt": "2026-02-24T22:38:42.966Z",
          "bedroomId": null,
          "bathroomId": null,
          "receptionId": null,
          "otherRoomId": null,
          "kitchenId": null,
          "gardenId": null,
          "outdoorSpaceId": null,
          "landId": null,
          "yardId": null
        },
        {
          "id": 27979,
          "image": "b0bbd0f9-05be-427d-8835-cff29cb19c00",
          "videoTour": null,
          "floorPlan": null,
          "metadata": "{\"alt\":\"Home Office\",\"description\":\"indeed into designation silt afore\",\"roomType\":\"Home Office\",\"cloudflareImageId\":\"b0bbd0f9-05be-427d-8835-cff29cb19c00\"}",
          "propertyId": 2404,
          "sortOrder": 0,
          "createdAt": "2026-02-24T22:38:42.966Z",
          "updatedAt": "2026-02-24T22:38:42.966Z",
          "bedroomId": null,
          "bathroomId": null,
          "receptionId": null,
          "otherRoomId": null,
          "kitchenId": null,
          "gardenId": null,
          "outdoorSpaceId": null,
          "landId": null,
          "yardId": null
        },
        {
          "id": 27980,
          "image": "e589761d-9b78-4f8f-a5d0-c81dbe97e700",
          "videoTour": null,
          "floorPlan": null,
          "metadata": "{\"alt\":\"Bedroom 1\",\"description\":\"an tedious hold thorn gosh\",\"roomType\":\"Bedroom 1\",\"cloudflareImageId\":\"e589761d-9b78-4f8f-a5d0-c81dbe97e700\"}",
          "propertyId": 2404,
          "sortOrder": 0,
          "createdAt": "2026-02-24T22:38:42.966Z",
          "updatedAt": "2026-02-24T22:38:42.966Z",
          "bedroomId": 7203,
          "bathroomId": null,
          "receptionId": null,
          "otherRoomId": null,
          "kitchenId": null,
          "gardenId": null,
          "outdoorSpaceId": null,
          "landId": null,
          "yardId": null
        },
        {
          "id": 27981,
          "image": "e589761d-9b78-4f8f-a5d0-c81dbe97e700",
          "videoTour": null,
          "floorPlan": null,
          "metadata": "{\"alt\":\"Bedroom 2 - fussy octave once\",\"description\":\"mortar well-to-do between inconsequential solidly\",\"roomType\":\"Bedroom 2\",\"cloudflareImageId\":\"e589761d-9b78-4f8f-a5d0-c81dbe97e700\"}",
          "propertyId": 2404,
          "sortOrder": 0,
          "createdAt": "2026-02-24T22:38:42.966Z",
          "updatedAt": "2026-02-24T22:38:42.966Z",
          "bedroomId": 7204,
          "bathroomId": null,
          "receptionId": null,
          "otherRoomId": null,
          "kitchenId": null,
          "gardenId": null,
          "outdoorSpaceId": null,
          "landId": null,
          "yardId": null
        },
        {
          "id": 27982,
          "image": "d181f96f-be34-4e99-2095-eb7319827900",
          "videoTour": null,
          "floorPlan": null,
          "metadata": "{\"alt\":\"Kitchen 2 - overtrain mortally quickly\",\"description\":\"jive overcooked not designation engender\",\"roomType\":\"Kitchen 2\",\"cloudflareImageId\":\"d181f96f-be34-4e99-2095-eb7319827900\"}",
          "propertyId": 2404,
          "sortOrder": 0,
          "createdAt": "2026-02-24T22:38:42.966Z",
          "updatedAt": "2026-02-24T22:38:42.966Z",
          "bedroomId": null,
          "bathroomId": null,
          "receptionId": null,
          "otherRoomId": null,
          "kitchenId": 4813,
          "gardenId": null,
          "outdoorSpaceId": null,
          "landId": null,
          "yardId": null
        },
        {
          "id": 27983,
          "image": "77d357a1-9439-4510-82e2-c0717b853100",
          "videoTour": null,
          "floorPlan": null,
          "metadata": "{\"alt\":\"Kitchen 1 - considering qua facilitate\",\"description\":\"thankfully humble yowza plus than\",\"roomType\":\"Kitchen 1\",\"cloudflareImageId\":\"77d357a1-9439-4510-82e2-c0717b853100\"}",
          "propertyId": 2404,
          "sortOrder": 0,
          "createdAt": "2026-02-24T22:38:42.966Z",
          "updatedAt": "2026-02-24T22:38:42.966Z",
          "bedroomId": null,
          "bathroomId": null,
          "receptionId": null,
          "otherRoomId": null,
          "kitchenId": 4814,
          "gardenId": null,
          "outdoorSpaceId": null,
          "landId": null,
          "yardId": null
        },
        {
          "id": 27984,
          "image": "89c3c9ff-68cb-4359-0610-346ba6bbd800",
          "videoTour": null,
          "floorPlan": null,
          "metadata": "{\"alt\":\"Kitchen 3 - onto if considering\",\"description\":\"graceful woot gadzooks hmph yippee\",\"roomType\":\"Kitchen 3\",\"cloudflareImageId\":\"89c3c9ff-68cb-4359-0610-346ba6bbd800\"}",
          "propertyId": 2404,
          "sortOrder": 0,
          "createdAt": "2026-02-24T22:38:42.966Z",
          "updatedAt": "2026-02-24T22:38:42.966Z",
          "bedroomId": null,
          "bathroomId": null,
          "receptionId": null,
          "otherRoomId": null,
          "kitchenId": 4815,
          "gardenId": null,
          "outdoorSpaceId": null,
          "landId": null,
          "yardId": null
        },
        {
          "id": 27985,
          "image": "5a85c20c-7c37-44c6-ab91-1b38b29a7a00",
          "videoTour": null,
          "floorPlan": null,
          "metadata": "{\"alt\":\"Bathroom 1 - shocked typewriter when\",\"description\":\"nearly within psst abaft puff\",\"roomType\":\"Bathroom 1\",\"cloudflareImageId\":\"5a85c20c-7c37-44c6-ab91-1b38b29a7a00\"}",
          "propertyId": 2404,
          "sortOrder": 0,
          "createdAt": "2026-02-24T22:38:42.966Z",
          "updatedAt": "2026-02-24T22:38:42.966Z",
          "bedroomId": null,
          "bathroomId": 3591,
          "receptionId": null,
          "otherRoomId": null,
          "kitchenId": null,
          "gardenId": null,
          "outdoorSpaceId": null,
          "landId": null,
          "yardId": null
        },
        {
          "id": 27986,
          "image": "f7552b9d-fcaa-4688-cfc6-e7f66910fe00",
          "videoTour": null,
          "floorPlan": null,
          "metadata": "{\"alt\":\"Reception 1 - eek jagged density\",\"description\":\"understated request appliance fen hmph\",\"roomType\":\"Reception 1\",\"cloudflareImageId\":\"f7552b9d-fcaa-4688-cfc6-e7f66910fe00\"}",
          "propertyId": 2404,
          "sortOrder": 0,
          "createdAt": "2026-02-24T22:38:42.966Z",
          "updatedAt": "2026-02-24T22:38:42.966Z",
          "bedroomId": null,
          "bathroomId": null,
          "receptionId": 4789,
          "otherRoomId": null,
          "kitchenId": null,
          "gardenId": null,
          "outdoorSpaceId": null,
          "landId": null,
          "yardId": null
        },
        {
          "id": 27987,
          "image": "f08471ae-a51d-4a43-9632-7a193b129500",
          "videoTour": null,
          "floorPlan": null,
          "metadata": "{\"alt\":\"Reception 2 - split close astride\",\"description\":\"instead acidic transcend furthermore glimmer\",\"roomType\":\"Reception 2\",\"cloudflareImageId\":\"f08471ae-a51d-4a43-9632-7a193b129500\"}",
          "propertyId": 2404,
          "sortOrder": 0,
          "createdAt": "2026-02-24T22:38:42.966Z",
          "updatedAt": "2026-02-24T22:38:42.966Z",
          "bedroomId": null,
          "bathroomId": null,
          "receptionId": 4790,
          "otherRoomId": null,
          "kitchenId": null,
          "gardenId": null,
          "outdoorSpaceId": null,
          "landId": null,
          "yardId": null
        },
        {
          "id": 27988,
          "image": "f7552b9d-fcaa-4688-cfc6-e7f66910fe00",
          "videoTour": null,
          "floorPlan": null,
          "metadata": "{\"alt\":\"Reception 3 - yippee responsible bungalow\",\"description\":\"palate chunder kiddingly now flash\",\"roomType\":\"Reception 3\",\"cloudflareImageId\":\"f7552b9d-fcaa-4688-cfc6-e7f66910fe00\"}",
          "propertyId": 2404,
          "sortOrder": 0,
          "createdAt": "2026-02-24T22:38:42.966Z",
          "updatedAt": "2026-02-24T22:38:42.966Z",
          "bedroomId": null,
          "bathroomId": null,
          "receptionId": 4791,
          "otherRoomId": null,
          "kitchenId": null,
          "gardenId": null,
          "outdoorSpaceId": null,
          "landId": null,
          "yardId": null
        },
        {
          "id": 27989,
          "image": "f08471ae-a51d-4a43-9632-7a193b129500",
          "videoTour": null,
          "floorPlan": null,
          "metadata": "{\"alt\":\"Reception 3 - finally catch responsible\",\"description\":\"secret augment nor lumpy brightly\",\"roomType\":\"Reception 3\",\"cloudflareImageId\":\"f08471ae-a51d-4a43-9632-7a193b129500\"}",
          "propertyId": 2404,
          "sortOrder": 0,
          "createdAt": "2026-02-24T22:38:42.966Z",
          "updatedAt": "2026-02-24T22:38:42.966Z",
          "bedroomId": null,
          "bathroomId": null,
          "receptionId": 4791,
          "otherRoomId": null,
          "kitchenId": null,
          "gardenId": null,
          "outdoorSpaceId": null,
          "landId": null,
          "yardId": null
        },
        {
          "id": 27990,
          "image": "afe7c3a4-e948-40f9-314c-8f861d1c9300",
          "videoTour": null,
          "floorPlan": null,
          "metadata": "{\"alt\":\"Other Room 1 - regarding wildly duffel\",\"description\":\"failing whoever toward plugin angelic\",\"roomType\":\"Other Room 1\",\"cloudflareImageId\":\"afe7c3a4-e948-40f9-314c-8f861d1c9300\"}",
          "propertyId": 2404,
          "sortOrder": 0,
          "createdAt": "2026-02-24T22:38:42.966Z",
          "updatedAt": "2026-02-24T22:38:42.966Z",
          "bedroomId": null,
          "bathroomId": null,
          "receptionId": null,
          "otherRoomId": 4783,
          "kitchenId": null,
          "gardenId": null,
          "outdoorSpaceId": null,
          "landId": null,
          "yardId": null
        },
        {
          "id": 27991,
          "image": "b0bbd0f9-05be-427d-8835-cff29cb19c00",
          "videoTour": null,
          "floorPlan": null,
          "metadata": "{\"alt\":\"Other Room 1 - hm psst atrium\",\"description\":\"psst monumental unethically save abaft\",\"roomType\":\"Other Room 1\",\"cloudflareImageId\":\"b0bbd0f9-05be-427d-8835-cff29cb19c00\"}",
          "propertyId": 2404,
          "sortOrder": 0,
          "createdAt": "2026-02-24T22:38:42.966Z",
          "updatedAt": "2026-02-24T22:38:42.966Z",
          "bedroomId": null,
          "bathroomId": null,
          "receptionId": null,
          "otherRoomId": 4783,
          "kitchenId": null,
          "gardenId": null,
          "outdoorSpaceId": null,
          "landId": null,
          "yardId": null
        },
        {
          "id": 27992,
          "image": "b0bbd0f9-05be-427d-8835-cff29cb19c00",
          "videoTour": null,
          "floorPlan": null,
          "metadata": "{\"alt\":\"Other Room 2 - loudly until heating\",\"description\":\"why representation times uselessly who\",\"roomType\":\"Other Room 2\",\"cloudflareImageId\":\"b0bbd0f9-05be-427d-8835-cff29cb19c00\"}",
          "propertyId": 2404,
          "sortOrder": 0,
          "createdAt": "2026-02-24T22:38:42.966Z",
          "updatedAt": "2026-02-24T22:38:42.966Z",
          "bedroomId": null,
          "bathroomId": null,
          "receptionId": null,
          "otherRoomId": 4784,
          "kitchenId": null,
          "gardenId": null,
          "outdoorSpaceId": null,
          "landId": null,
          "yardId": null
        },
        {
          "id": 27993,
          "image": "baa60ea5-5a77-42b5-c954-840afa6c0300",
          "videoTour": null,
          "floorPlan": null,
          "metadata": "{\"alt\":\"Other Room 3 - boo whenever or\",\"description\":\"foretell smog since beside barring\",\"roomType\":\"Other Room 3\",\"cloudflareImageId\":\"baa60ea5-5a77-42b5-c954-840afa6c0300\"}",
          "propertyId": 2404,
          "sortOrder": 0,
          "createdAt": "2026-02-24T22:38:42.966Z",
          "updatedAt": "2026-02-24T22:38:42.966Z",
          "bedroomId": null,
          "bathroomId": null,
          "receptionId": null,
          "otherRoomId": 4785,
          "kitchenId": null,
          "gardenId": null,
          "outdoorSpaceId": null,
          "landId": null,
          "yardId": null
        },
        {
          "id": 27994,
          "image": "55957534-6202-4033-361b-f67b7fd89000",
          "videoTour": null,
          "floorPlan": null,
          "metadata": "{\"alt\":\"Outdoor Space - correctly athwart satisfy\",\"description\":\"major against rejigger obediently shallow\",\"roomType\":\"Outdoor Space\",\"cloudflareImageId\":\"55957534-6202-4033-361b-f67b7fd89000\"}",
          "propertyId": 2404,
          "sortOrder": 0,
          "createdAt": "2026-02-24T22:38:42.966Z",
          "updatedAt": "2026-02-24T22:38:42.966Z",
          "bedroomId": null,
          "bathroomId": null,
          "receptionId": null,
          "otherRoomId": null,
          "kitchenId": null,
          "gardenId": null,
          "outdoorSpaceId": 1927,
          "landId": null,
          "yardId": null
        },
        {
          "id": 27995,
          "image": "55957534-6202-4033-361b-f67b7fd89000",
          "videoTour": null,
          "floorPlan": null,
          "metadata": "{\"alt\":\"Outdoor Space - westernise develop expert\",\"description\":\"slight ring descendant equate regularly\",\"roomType\":\"Outdoor Space\",\"cloudflareImageId\":\"55957534-6202-4033-361b-f67b7fd89000\"}",
          "propertyId": 2404,
          "sortOrder": 0,
          "createdAt": "2026-02-24T22:38:42.966Z",
          "updatedAt": "2026-02-24T22:38:42.966Z",
          "bedroomId": null,
          "bathroomId": null,
          "receptionId": null,
          "otherRoomId": null,
          "kitchenId": null,
          "gardenId": null,
          "outdoorSpaceId": 1927,
          "landId": null,
          "yardId": null
        }
      ],
      "type": {
        "id": 1,
        "name": "House",
        "defaultSelected": false
      },
      "classification": {
        "id": 4,
        "name": "End of Terrace",
        "categoryId": 1
      },
      "bedroomFeatures": [
        {
          "id": 7203,
          "roomNumber": 1,
          "name": "Child's Bedroom",
          "bed": [
            "SINGLE"
          ],
          "floor": 1,
          "description": "terribly unrealistic accidentally ha acidly gadzooks whereas birdcage now gadzooks",
          "features": [
            "BAY_WINDOW",
            "PATIO_DOORS"
          ],
          "size": 11,
          "propertyId": 2404,
          "createdAt": "2026-02-24T22:38:22.225Z",
          "updatedAt": "2026-02-24T22:38:22.225Z",
          "media": [
            {
              "id": 27980,
              "image": "e589761d-9b78-4f8f-a5d0-c81dbe97e700",
              "videoTour": null,
              "floorPlan": null,
              "metadata": "{\"alt\":\"Bedroom 1\",\"description\":\"an tedious hold thorn gosh\",\"roomType\":\"Bedroom 1\",\"cloudflareImageId\":\"e589761d-9b78-4f8f-a5d0-c81dbe97e700\"}",
              "propertyId": 2404,
              "sortOrder": 0,
              "createdAt": "2026-02-24T22:38:42.966Z",
              "updatedAt": "2026-02-24T22:38:42.966Z",
              "bedroomId": 7203,
              "bathroomId": null,
              "receptionId": null,
              "otherRoomId": null,
              "kitchenId": null,
              "gardenId": null,
              "outdoorSpaceId": null,
              "landId": null,
              "yardId": null
            }
          ]
        },
        {
          "id": 7204,
          "roomNumber": 2,
          "name": "Nursery",
          "bed": [
            "DOUBLE"
          ],
          "floor": 1,
          "description": "the of modulo deliberately quizzically duffel that towards boohoo now",
          "features": [
            "EN_SUITE"
          ],
          "size": 21,
          "propertyId": 2404,
          "createdAt": "2026-02-24T22:38:22.225Z",
          "updatedAt": "2026-02-24T22:38:22.225Z",
          "media": [
            {
              "id": 27981,
              "image": "e589761d-9b78-4f8f-a5d0-c81dbe97e700",
              "videoTour": null,
              "floorPlan": null,
              "metadata": "{\"alt\":\"Bedroom 2 - fussy octave once\",\"description\":\"mortar well-to-do between inconsequential solidly\",\"roomType\":\"Bedroom 2\",\"cloudflareImageId\":\"e589761d-9b78-4f8f-a5d0-c81dbe97e700\"}",
              "propertyId": 2404,
              "sortOrder": 0,
              "createdAt": "2026-02-24T22:38:42.966Z",
              "updatedAt": "2026-02-24T22:38:42.966Z",
              "bedroomId": 7204,
              "bathroomId": null,
              "receptionId": null,
              "otherRoomId": null,
              "kitchenId": null,
              "gardenId": null,
              "outdoorSpaceId": null,
              "landId": null,
              "yardId": null
            }
          ]
        }
      ],
      "bathroomFeatures": [
        {
          "id": 3591,
          "roomNumber": 1,
          "floor": 0,
          "name": "Powder Room",
          "features": [
            "TOILET",
            "BATHTUB",
            "WALK_IN_SHOWER"
          ],
          "description": "accessorise parallel yearn gloom sneaky alive given anenst spellcheck psst",
          "size": 47,
          "propertyId": 2404,
          "createdAt": "2026-02-24T22:38:22.225Z",
          "updatedAt": "2026-02-24T22:38:22.225Z",
          "media": [
            {
              "id": 27985,
              "image": "5a85c20c-7c37-44c6-ab91-1b38b29a7a00",
              "videoTour": null,
              "floorPlan": null,
              "metadata": "{\"alt\":\"Bathroom 1 - shocked typewriter when\",\"description\":\"nearly within psst abaft puff\",\"roomType\":\"Bathroom 1\",\"cloudflareImageId\":\"5a85c20c-7c37-44c6-ab91-1b38b29a7a00\"}",
              "propertyId": 2404,
              "sortOrder": 0,
              "createdAt": "2026-02-24T22:38:42.966Z",
              "updatedAt": "2026-02-24T22:38:42.966Z",
              "bedroomId": null,
              "bathroomId": 3591,
              "receptionId": null,
              "otherRoomId": null,
              "kitchenId": null,
              "gardenId": null,
              "outdoorSpaceId": null,
              "landId": null,
              "yardId": null
            }
          ]
        }
      ],
      "otherRoom": [
        {
          "id": 4783,
          "roomNumber": 1,
          "floor": 0,
          "name": "prudent afore",
          "type": "WINE_CELLAR",
          "description": "which instead natural row doodle brr sharply within ick which",
          "size": 23,
          "features": [
            "OPEN_PLAN",
            "OPEN_CONCEPT",
            "BUILT_IN_SHELVING",
            "HAS_VIEW",
            "ACCOUSTIC_PANELS",
            "HARDWOOD_FLOORING"
          ],
          "propertyId": 2404,
          "createdAt": "2026-02-24T22:38:22.225Z",
          "updatedAt": "2026-02-24T22:38:22.225Z",
          "media": [
            {
              "id": 27990,
              "image": "afe7c3a4-e948-40f9-314c-8f861d1c9300",
              "videoTour": null,
              "floorPlan": null,
              "metadata": "{\"alt\":\"Other Room 1 - regarding wildly duffel\",\"description\":\"failing whoever toward plugin angelic\",\"roomType\":\"Other Room 1\",\"cloudflareImageId\":\"afe7c3a4-e948-40f9-314c-8f861d1c9300\"}",
              "propertyId": 2404,
              "sortOrder": 0,
              "createdAt": "2026-02-24T22:38:42.966Z",
              "updatedAt": "2026-02-24T22:38:42.966Z",
              "bedroomId": null,
              "bathroomId": null,
              "receptionId": null,
              "otherRoomId": 4783,
              "kitchenId": null,
              "gardenId": null,
              "outdoorSpaceId": null,
              "landId": null,
              "yardId": null
            },
            {
              "id": 27991,
              "image": "b0bbd0f9-05be-427d-8835-cff29cb19c00",
              "videoTour": null,
              "floorPlan": null,
              "metadata": "{\"alt\":\"Other Room 1 - hm psst atrium\",\"description\":\"psst monumental unethically save abaft\",\"roomType\":\"Other Room 1\",\"cloudflareImageId\":\"b0bbd0f9-05be-427d-8835-cff29cb19c00\"}",
              "propertyId": 2404,
              "sortOrder": 0,
              "createdAt": "2026-02-24T22:38:42.966Z",
              "updatedAt": "2026-02-24T22:38:42.966Z",
              "bedroomId": null,
              "bathroomId": null,
              "receptionId": null,
              "otherRoomId": 4783,
              "kitchenId": null,
              "gardenId": null,
              "outdoorSpaceId": null,
              "landId": null,
              "yardId": null
            }
          ]
        },
        {
          "id": 4784,
          "roomNumber": 2,
          "floor": 1,
          "name": "murky when",
          "type": "WORKSHOP",
          "description": "bah culture alive so stormy comb ugh hence consign uh-huh",
          "size": 19,
          "features": [
            "BAY_WINDOW",
            "HAS_VIEW",
            "BUILT_IN_STORAGE",
            "SOUND_PROOFING",
            "HARDWOOD_FLOORING"
          ],
          "propertyId": 2404,
          "createdAt": "2026-02-24T22:38:22.225Z",
          "updatedAt": "2026-02-24T22:38:22.225Z",
          "media": [
            {
              "id": 27992,
              "image": "b0bbd0f9-05be-427d-8835-cff29cb19c00",
              "videoTour": null,
              "floorPlan": null,
              "metadata": "{\"alt\":\"Other Room 2 - loudly until heating\",\"description\":\"why representation times uselessly who\",\"roomType\":\"Other Room 2\",\"cloudflareImageId\":\"b0bbd0f9-05be-427d-8835-cff29cb19c00\"}",
              "propertyId": 2404,
              "sortOrder": 0,
              "createdAt": "2026-02-24T22:38:42.966Z",
              "updatedAt": "2026-02-24T22:38:42.966Z",
              "bedroomId": null,
              "bathroomId": null,
              "receptionId": null,
              "otherRoomId": 4784,
              "kitchenId": null,
              "gardenId": null,
              "outdoorSpaceId": null,
              "landId": null,
              "yardId": null
            }
          ]
        },
        {
          "id": 4785,
          "roomNumber": 3,
          "floor": 0,
          "name": "midst cleaner",
          "type": "STUDY",
          "description": "excluding baritone and print stained infinite late except yum lest",
          "size": 40,
          "features": [
            "BUILT_IN_SHELVING",
            "HAS_VIEW",
            "PATIO_DOORS",
            "BUILT_IN_STORAGE",
            "SERVING_HATCH",
            "ACCOUSTIC_PANELS",
            "FIREPLACE"
          ],
          "propertyId": 2404,
          "createdAt": "2026-02-24T22:38:22.225Z",
          "updatedAt": "2026-02-24T22:38:22.225Z",
          "media": [
            {
              "id": 27993,
              "image": "baa60ea5-5a77-42b5-c954-840afa6c0300",
              "videoTour": null,
              "floorPlan": null,
              "metadata": "{\"alt\":\"Other Room 3 - boo whenever or\",\"description\":\"foretell smog since beside barring\",\"roomType\":\"Other Room 3\",\"cloudflareImageId\":\"baa60ea5-5a77-42b5-c954-840afa6c0300\"}",
              "propertyId": 2404,
              "sortOrder": 0,
              "createdAt": "2026-02-24T22:38:42.966Z",
              "updatedAt": "2026-02-24T22:38:42.966Z",
              "bedroomId": null,
              "bathroomId": null,
              "receptionId": null,
              "otherRoomId": 4785,
              "kitchenId": null,
              "gardenId": null,
              "outdoorSpaceId": null,
              "landId": null,
              "yardId": null
            }
          ]
        }
      ],
      "parking": {
        "id": 2404,
        "description": "seriously rich soon across vicinity oof whether ugh via psst",
        "features": [
          "DRIVEWAY",
          "PERMIT_PARKING",
          "ON_STREET",
          "NO_PARKING",
          "CARPORT",
          "EV_CHARGING"
        ],
        "propertyId": 2404,
        "createdAt": "2026-02-24T22:38:22.225Z",
        "updatedAt": "2026-02-24T22:38:22.225Z"
      },
      "amenities": [
        {
          "id": 43255,
          "type": "EDUCATION",
          "subtype": "SCHOOL",
          "name": "DuBuque - Green School",
          "distanceM": 8026,
          "description": null,
          "location": null,
          "propertyId": 2404,
          "createdAt": "2026-02-24T22:38:22.225Z"
        },
        {
          "id": 43256,
          "type": "EDUCATION",
          "subtype": "SCHOOL",
          "name": "Grady, Mohr and Metz School",
          "distanceM": 1734,
          "description": null,
          "location": null,
          "propertyId": 2404,
          "createdAt": "2026-02-24T22:38:22.225Z"
        },
        {
          "id": 43257,
          "type": "EDUCATION",
          "subtype": "SCHOOL",
          "name": "Swaniawski, Legros and Trantow School",
          "distanceM": 4757,
          "description": null,
          "location": null,
          "propertyId": 2404,
          "createdAt": "2026-02-24T22:38:22.225Z"
        },
        {
          "id": 43258,
          "type": "HEALTHCARE",
          "subtype": "HOSPITAL",
          "name": "Howell and Sons Hospital",
          "distanceM": 7352,
          "description": null,
          "location": null,
          "propertyId": 2404,
          "createdAt": "2026-02-24T22:38:22.225Z"
        },
        {
          "id": 43259,
          "type": "HEALTHCARE",
          "subtype": "HOSPITAL",
          "name": "Pagac LLC Hospital",
          "distanceM": 7441,
          "description": null,
          "location": null,
          "propertyId": 2404,
          "createdAt": "2026-02-24T22:38:22.225Z"
        },
        {
          "id": 43260,
          "type": "HEALTHCARE",
          "subtype": "HOSPITAL",
          "name": "Lowe - Kovacek Hospital",
          "distanceM": 7676,
          "description": null,
          "location": null,
          "propertyId": 2404,
          "createdAt": "2026-02-24T22:38:22.225Z"
        },
        {
          "id": 43261,
          "type": "TRANSPORT",
          "subtype": "TRAIN_STATION",
          "name": "Estefaniaboro Train Station",
          "distanceM": 6075,
          "description": null,
          "location": null,
          "propertyId": 2404,
          "createdAt": "2026-02-24T22:38:22.225Z"
        },
        {
          "id": 43262,
          "type": "TRANSPORT",
          "subtype": "TRAIN_STATION",
          "name": "Rodriguezport Train Station",
          "distanceM": 2324,
          "description": null,
          "location": null,
          "propertyId": 2404,
          "createdAt": "2026-02-24T22:38:22.225Z"
        },
        {
          "id": 43263,
          "type": "TRANSPORT",
          "subtype": "TRAIN_STATION",
          "name": "Rowlett Train Station",
          "distanceM": 7780,
          "description": null,
          "location": null,
          "propertyId": 2404,
          "createdAt": "2026-02-24T22:38:22.225Z"
        },
        {
          "id": 43264,
          "type": "TRANSPORT",
          "subtype": "BUS_STOP",
          "name": "Walton Cliff Bus Stop",
          "distanceM": 1891,
          "description": null,
          "location": null,
          "propertyId": 2404,
          "createdAt": "2026-02-24T22:38:22.225Z"
        },
        {
          "id": 43265,
          "type": "TRANSPORT",
          "subtype": "BUS_STOP",
          "name": "N Oak Street Bus Stop",
          "distanceM": 8970,
          "description": null,
          "location": null,
          "propertyId": 2404,
          "createdAt": "2026-02-24T22:38:22.225Z"
        },
        {
          "id": 43266,
          "type": "TRANSPORT",
          "subtype": "BUS_STOP",
          "name": "Bayer Gateway Bus Stop",
          "distanceM": 1383,
          "description": null,
          "location": null,
          "propertyId": 2404,
          "createdAt": "2026-02-24T22:38:22.225Z"
        },
        {
          "id": 43267,
          "type": "GREEN_SPACE",
          "subtype": "PARK",
          "name": "Louveniaport Park",
          "distanceM": 5473,
          "description": null,
          "location": null,
          "propertyId": 2404,
          "createdAt": "2026-02-24T22:38:22.225Z"
        },
        {
          "id": 43268,
          "type": "GREEN_SPACE",
          "subtype": "PARK",
          "name": "Roryburgh Park",
          "distanceM": 8345,
          "description": null,
          "location": null,
          "propertyId": 2404,
          "createdAt": "2026-02-24T22:38:22.225Z"
        },
        {
          "id": 43269,
          "type": "GREEN_SPACE",
          "subtype": "PARK",
          "name": "Ryanberg Park",
          "distanceM": 5439,
          "description": null,
          "location": null,
          "propertyId": 2404,
          "createdAt": "2026-02-24T22:38:22.225Z"
        },
        {
          "id": 43270,
          "type": "SHOPPING_ENTERTAINMENT",
          "subtype": "GYM",
          "name": "Hamill LLC Gym",
          "distanceM": 7224,
          "description": null,
          "location": null,
          "propertyId": 2404,
          "createdAt": "2026-02-24T22:38:22.225Z"
        },
        {
          "id": 43271,
          "type": "SHOPPING_ENTERTAINMENT",
          "subtype": "GYM",
          "name": "Ernser, Aufderhar and Ledner Gym",
          "distanceM": 4876,
          "description": null,
          "location": null,
          "propertyId": 2404,
          "createdAt": "2026-02-24T22:38:22.225Z"
        },
        {
          "id": 43272,
          "type": "SHOPPING_ENTERTAINMENT",
          "subtype": "GYM",
          "name": "Goodwin LLC Gym",
          "distanceM": 7302,
          "description": null,
          "location": null,
          "propertyId": 2404,
          "createdAt": "2026-02-24T22:38:22.225Z"
        }
      ],
      "additionalFeatures": {
        "id": 2404,
        "description": "summer turbulent frenetically beautifully overcoat concrete slather cross-contamination psst incidentally",
        "petFriendly": true,
        "moveInDate": "2026-08-23T20:54:40.026Z",
        "features": [
          "INTERNET"
        ],
        "propertyId": 2404,
        "createdAt": "2026-02-24T22:38:22.225Z",
        "updatedAt": "2026-02-24T22:38:22.225Z"
      },
      "accessibilityFeatures": {
        "id": 2404,
        "description": "until ride once obnoxiously instead unfurl tackle worriedly feminize apt",
        "features": [
          "HANDRAILS",
          "ELEVATOR",
          "ACCESSIBLE_PARKING"
        ],
        "propertyId": 2404,
        "createdAt": "2026-02-24T22:38:22.225Z",
        "updatedAt": "2026-02-24T22:38:22.225Z"
      },
      "kitchenFeatures": [
        {
          "id": 4813,
          "roomNumber": 2,
          "floor": 2,
          "name": "considering ouch",
          "features": [
            "BREAKFAST_BAR",
            "ISLAND",
            "UTILITY_ACCESS",
            "PANTRY"
          ],
          "description": "cleverly rosin ick countess whine wherever fairly behind tennis tremendously",
          "size": 28,
          "propertyId": 2404,
          "createdAt": "2026-02-24T22:38:22.225Z",
          "updatedAt": "2026-02-24T22:38:22.225Z",
          "media": [
            {
              "id": 27982,
              "image": "d181f96f-be34-4e99-2095-eb7319827900",
              "videoTour": null,
              "floorPlan": null,
              "metadata": "{\"alt\":\"Kitchen 2 - overtrain mortally quickly\",\"description\":\"jive overcooked not designation engender\",\"roomType\":\"Kitchen 2\",\"cloudflareImageId\":\"d181f96f-be34-4e99-2095-eb7319827900\"}",
              "propertyId": 2404,
              "sortOrder": 0,
              "createdAt": "2026-02-24T22:38:42.966Z",
              "updatedAt": "2026-02-24T22:38:42.966Z",
              "bedroomId": null,
              "bathroomId": null,
              "receptionId": null,
              "otherRoomId": null,
              "kitchenId": 4813,
              "gardenId": null,
              "outdoorSpaceId": null,
              "landId": null,
              "yardId": null
            }
          ]
        },
        {
          "id": 4814,
          "roomNumber": 1,
          "floor": 2,
          "name": "custody ad",
          "features": [
            "OPEN_PLAN",
            "ISLAND",
            "UTILITY_ACCESS",
            "PANTRY"
          ],
          "description": "furthermore drat whenever obediently sugary lest which complicated owlishly oof",
          "size": 17,
          "propertyId": 2404,
          "createdAt": "2026-02-24T22:38:22.225Z",
          "updatedAt": "2026-02-24T22:38:22.225Z",
          "media": [
            {
              "id": 27983,
              "image": "77d357a1-9439-4510-82e2-c0717b853100",
              "videoTour": null,
              "floorPlan": null,
              "metadata": "{\"alt\":\"Kitchen 1 - considering qua facilitate\",\"description\":\"thankfully humble yowza plus than\",\"roomType\":\"Kitchen 1\",\"cloudflareImageId\":\"77d357a1-9439-4510-82e2-c0717b853100\"}",
              "propertyId": 2404,
              "sortOrder": 0,
              "createdAt": "2026-02-24T22:38:42.966Z",
              "updatedAt": "2026-02-24T22:38:42.966Z",
              "bedroomId": null,
              "bathroomId": null,
              "receptionId": null,
              "otherRoomId": null,
              "kitchenId": 4814,
              "gardenId": null,
              "outdoorSpaceId": null,
              "landId": null,
              "yardId": null
            }
          ]
        },
        {
          "id": 4815,
          "roomNumber": 3,
          "floor": 1,
          "name": "polite enroll",
          "features": [
            "MODERN",
            "OPEN_PLAN",
            "WHITE_GOODS",
            "BREAKFAST_BAR",
            "ISLAND",
            "PANTRY"
          ],
          "description": "leading amongst yesterday across kindly incidentally tribe dereference help fixed",
          "size": 10,
          "propertyId": 2404,
          "createdAt": "2026-02-24T22:38:22.225Z",
          "updatedAt": "2026-02-24T22:38:22.225Z",
          "media": [
            {
              "id": 27984,
              "image": "89c3c9ff-68cb-4359-0610-346ba6bbd800",
              "videoTour": null,
              "floorPlan": null,
              "metadata": "{\"alt\":\"Kitchen 3 - onto if considering\",\"description\":\"graceful woot gadzooks hmph yippee\",\"roomType\":\"Kitchen 3\",\"cloudflareImageId\":\"89c3c9ff-68cb-4359-0610-346ba6bbd800\"}",
              "propertyId": 2404,
              "sortOrder": 0,
              "createdAt": "2026-02-24T22:38:42.966Z",
              "updatedAt": "2026-02-24T22:38:42.966Z",
              "bedroomId": null,
              "bathroomId": null,
              "receptionId": null,
              "otherRoomId": null,
              "kitchenId": 4815,
              "gardenId": null,
              "outdoorSpaceId": null,
              "landId": null,
              "yardId": null
            }
          ]
        }
      ],
      "reception": [
        {
          "id": 4789,
          "roomNumber": 1,
          "floor": 1,
          "name": "youthfully rebel",
          "type": "LIVING_ROOM",
          "description": "decongestant though between swine oddly above institutionalize filter entwine haze",
          "size": 17,
          "features": [
            "HAS_VIEW",
            "BUILT_IN_STORAGE",
            "SOUND_PROOFING",
            "STONE_FLOORING",
            "HARDWOOD_FLOORING",
            "BUILT_IN_DESK",
            "CONSERVATORY"
          ],
          "propertyId": 2404,
          "createdAt": "2026-02-24T22:38:22.225Z",
          "updatedAt": "2026-02-24T22:38:22.225Z",
          "media": [
            {
              "id": 27986,
              "image": "f7552b9d-fcaa-4688-cfc6-e7f66910fe00",
              "videoTour": null,
              "floorPlan": null,
              "metadata": "{\"alt\":\"Reception 1 - eek jagged density\",\"description\":\"understated request appliance fen hmph\",\"roomType\":\"Reception 1\",\"cloudflareImageId\":\"f7552b9d-fcaa-4688-cfc6-e7f66910fe00\"}",
              "propertyId": 2404,
              "sortOrder": 0,
              "createdAt": "2026-02-24T22:38:42.966Z",
              "updatedAt": "2026-02-24T22:38:42.966Z",
              "bedroomId": null,
              "bathroomId": null,
              "receptionId": 4789,
              "otherRoomId": null,
              "kitchenId": null,
              "gardenId": null,
              "outdoorSpaceId": null,
              "landId": null,
              "yardId": null
            }
          ]
        },
        {
          "id": 4790,
          "roomNumber": 2,
          "floor": 1,
          "name": "fathom colorless",
          "type": "FAMILY_ROOM",
          "description": "considering valentine though corny yuck doing solidly behest which flat",
          "size": 41,
          "features": [
            "OPEN_PLAN",
            "OPEN_CONCEPT",
            "FIREPLACE",
            "BUILT_IN_SHELVING",
            "SERVING_HATCH"
          ],
          "propertyId": 2404,
          "createdAt": "2026-02-24T22:38:22.225Z",
          "updatedAt": "2026-02-24T22:38:22.225Z",
          "media": [
            {
              "id": 27987,
              "image": "f08471ae-a51d-4a43-9632-7a193b129500",
              "videoTour": null,
              "floorPlan": null,
              "metadata": "{\"alt\":\"Reception 2 - split close astride\",\"description\":\"instead acidic transcend furthermore glimmer\",\"roomType\":\"Reception 2\",\"cloudflareImageId\":\"f08471ae-a51d-4a43-9632-7a193b129500\"}",
              "propertyId": 2404,
              "sortOrder": 0,
              "createdAt": "2026-02-24T22:38:42.966Z",
              "updatedAt": "2026-02-24T22:38:42.966Z",
              "bedroomId": null,
              "bathroomId": null,
              "receptionId": 4790,
              "otherRoomId": null,
              "kitchenId": null,
              "gardenId": null,
              "outdoorSpaceId": null,
              "landId": null,
              "yardId": null
            }
          ]
        },
        {
          "id": 4791,
          "roomNumber": 3,
          "floor": 2,
          "name": "regarding certainly",
          "type": "FAMILY_ROOM",
          "description": "underachieve neatly ad option when design e-mail excepting laughter rectangular",
          "size": 29,
          "features": [
            "OPEN_PLAN",
            "BAY_WINDOW",
            "BUILT_IN_SHELVING",
            "HAS_VIEW",
            "PATIO_DOORS",
            "ACCOUSTIC_PANELS",
            "STONE_FLOORING",
            "HARDWOOD_FLOORING"
          ],
          "propertyId": 2404,
          "createdAt": "2026-02-24T22:38:22.225Z",
          "updatedAt": "2026-02-24T22:38:22.225Z",
          "media": [
            {
              "id": 27988,
              "image": "f7552b9d-fcaa-4688-cfc6-e7f66910fe00",
              "videoTour": null,
              "floorPlan": null,
              "metadata": "{\"alt\":\"Reception 3 - yippee responsible bungalow\",\"description\":\"palate chunder kiddingly now flash\",\"roomType\":\"Reception 3\",\"cloudflareImageId\":\"f7552b9d-fcaa-4688-cfc6-e7f66910fe00\"}",
              "propertyId": 2404,
              "sortOrder": 0,
              "createdAt": "2026-02-24T22:38:42.966Z",
              "updatedAt": "2026-02-24T22:38:42.966Z",
              "bedroomId": null,
              "bathroomId": null,
              "receptionId": 4791,
              "otherRoomId": null,
              "kitchenId": null,
              "gardenId": null,
              "outdoorSpaceId": null,
              "landId": null,
              "yardId": null
            },
            {
              "id": 27989,
              "image": "f08471ae-a51d-4a43-9632-7a193b129500",
              "videoTour": null,
              "floorPlan": null,
              "metadata": "{\"alt\":\"Reception 3 - finally catch responsible\",\"description\":\"secret augment nor lumpy brightly\",\"roomType\":\"Reception 3\",\"cloudflareImageId\":\"f08471ae-a51d-4a43-9632-7a193b129500\"}",
              "propertyId": 2404,
              "sortOrder": 0,
              "createdAt": "2026-02-24T22:38:42.966Z",
              "updatedAt": "2026-02-24T22:38:42.966Z",
              "bedroomId": null,
              "bathroomId": null,
              "receptionId": 4791,
              "otherRoomId": null,
              "kitchenId": null,
              "gardenId": null,
              "outdoorSpaceId": null,
              "landId": null,
              "yardId": null
            }
          ]
        }
      ],
      "utility": {
        "id": 2404,
        "description": "why nightlife um honesty juggernaut cheerfully even viability mmm desecrate",
        "features": [
          "SINK"
        ],
        "size": 46.39531002667482,
        "propertyId": 2404,
        "createdAt": "2026-02-24T22:38:22.225Z",
        "updatedAt": "2026-02-24T22:38:22.225Z"
      },
      "outdoorSpace": {
        "id": 1927,
        "description": "underneath within kookily excellent thankfully yet ack that lost boastfully",
        "totalArea": 785.16,
        "features": [
          "BALCONY",
          "PATIO",
          "GARDEN_OFFICE"
        ],
        "propertyId": 2404,
        "createdAt": "2026-02-24T22:38:22.225Z",
        "updatedAt": "2026-02-24T22:38:22.225Z",
        "yard": [],
        "garden": [
          {
            "id": 2940,
            "description": null,
            "name": "Rear Garden",
            "size": 123.94,
            "additionalDetails": false,
            "facing": "NORTH",
            "position": "REAR",
            "features": [],
            "createdAt": "2026-02-24T22:38:22.225Z",
            "updatedAt": "2026-02-24T22:38:22.225Z",
            "outdoorSpaceId": 1927,
            "media": []
          },
          {
            "id": 2941,
            "description": "since international butter chiffonier tarragon halt whose issue gastropod vanish",
            "name": "Side Garden",
            "size": 65.47,
            "additionalDetails": true,
            "facing": "EAST",
            "position": "SIDE",
            "features": [
              "TERRACE"
            ],
            "createdAt": "2026-02-24T22:38:22.225Z",
            "updatedAt": "2026-02-24T22:38:22.225Z",
            "outdoorSpaceId": 1927,
            "media": []
          }
        ],
        "land": [
          {
            "id": 2336,
            "description": null,
            "additionalDetails": false,
            "size": 177.03,
            "name": "Orchard",
            "separateParcel": false,
            "features": [],
            "createdAt": "2026-02-24T22:38:22.225Z",
            "updatedAt": "2026-02-24T22:38:22.225Z",
            "outdoorSpaceId": 1927,
            "media": []
          },
          {
            "id": 2337,
            "description": "excepting hunger eek treble louse and testing beautifully unimpressively enormously",
            "additionalDetails": true,
            "size": 418.72,
            "name": "Woodland Area",
            "separateParcel": false,
            "features": [
              "STABLES",
              "POND"
            ],
            "createdAt": "2026-02-24T22:38:22.225Z",
            "updatedAt": "2026-02-24T22:38:22.225Z",
            "outdoorSpaceId": 1927,
            "media": []
          }
        ],
        "media": [
          {
            "id": 27994,
            "image": "55957534-6202-4033-361b-f67b7fd89000",
            "videoTour": null,
            "floorPlan": null,
            "metadata": "{\"alt\":\"Outdoor Space - correctly athwart satisfy\",\"description\":\"major against rejigger obediently shallow\",\"roomType\":\"Outdoor Space\",\"cloudflareImageId\":\"55957534-6202-4033-361b-f67b7fd89000\"}",
            "propertyId": 2404,
            "sortOrder": 0,
            "createdAt": "2026-02-24T22:38:42.966Z",
            "updatedAt": "2026-02-24T22:38:42.966Z",
            "bedroomId": null,
            "bathroomId": null,
            "receptionId": null,
            "otherRoomId": null,
            "kitchenId": null,
            "gardenId": null,
            "outdoorSpaceId": 1927,
            "landId": null,
            "yardId": null
          },
          {
            "id": 27995,
            "image": "55957534-6202-4033-361b-f67b7fd89000",
            "videoTour": null,
            "floorPlan": null,
            "metadata": "{\"alt\":\"Outdoor Space - westernise develop expert\",\"description\":\"slight ring descendant equate regularly\",\"roomType\":\"Outdoor Space\",\"cloudflareImageId\":\"55957534-6202-4033-361b-f67b7fd89000\"}",
            "propertyId": 2404,
            "sortOrder": 0,
            "createdAt": "2026-02-24T22:38:42.966Z",
            "updatedAt": "2026-02-24T22:38:42.966Z",
            "bedroomId": null,
            "bathroomId": null,
            "receptionId": null,
            "otherRoomId": null,
            "kitchenId": null,
            "gardenId": null,
            "outdoorSpaceId": 1927,
            "landId": null,
            "yardId": null
          }
        ]
      },
      "energyAndUtilities": {
        "id": 2404,
        "propertyId": 2404,
        "description": "under harangue devil gah aw furlough uh-huh cake yippee bravely",
        "epcRating": "G",
        "epcCertificateUrl": "https://illustrious-mortise.info",
        "primaryHeatingType": [
          "BIOMASS",
          "OIL",
          "OTHER"
        ],
        "secondaryHeatingType": [
          "HEAT_PUMP",
          "BIOMASS"
        ],
        "boilerType": "COMBI",
        "hotWaterSource": "SOLAR_THERMAL",
        "renewables": [
          "EV_CHARGING",
          "BATTERY_STORAGE"
        ],
        "connectedUtilities": [
          "CESSPIT",
          "WATER"
        ],
        "broadbandType": "ADSL",
        "fullFibreAvailable": true,
        "maxDownloadSpeedMbps": 504,
        "createdAt": "2026-02-24T22:38:22.225Z",
        "updatedAt": "2026-02-24T22:38:22.225Z"
      },
      "securityFeatures": {
        "id": 2404,
        "description": "cheetah furthermore rewrite where dismal daintily illusion brace mindless innocently smoothly seriously gifted pomelo trench",
        "features": [
          "CCTV",
          "NEIGHBORHOOD_WATCH",
          "INTERCOM_SYSTEM",
          "RECEPTION"
        ],
        "propertyId": 2404,
        "createdAt": "2026-02-24T22:38:22.225Z",
        "updatedAt": "2026-02-24T22:38:22.225Z"
      },
      "storageFeatures": {
        "id": 2404,
        "description": "inwardly hmph considering what or scale um staid um yuck mid spherical bare boo portly about entrench unfinished fundraising blah",
        "features": [
          "ATTIC",
          "BASEMENT"
        ],
        "propertyId": 2404,
        "createdAt": "2026-02-24T22:38:22.225Z",
        "updatedAt": "2026-02-24T22:38:22.225Z"
      },
      "runningCosts": {
        "id": 2404,
        "description": "and huzzah pfft given whoever painfully brochure worthy corrupt academics pish off glaring brr fortunately",
        "councilTaxBand": "B",
        "serviceCharges": 185.51,
        "groundRent": 210.93,
        "propertyId": 2404,
        "createdAt": "2026-02-24T22:38:22.225Z",
        "updatedAt": "2026-02-24T22:38:22.225Z"
      }
    },
    "user": {
      "id": 603,
      "username": "Neoma46_608",
      "email": "608_Ashtyn.Goldner12@yahoo.com",
      "createdAt": "2026-02-24T22:39:53.613Z"
    },
    "listingType": "rent"
  }
]

async function sleep(DELAY = 1000) {
  await new Promise((resolve) => {
    setTimeout(resolve, DELAY)
  })
}

export default defineEventHandler(async (event) => {
  const { format } = getQuery(event)

  if (format === 'true') {
    try {
      return data.map(formatSearchResults)
    }
    catch ({ message }) {
      return { error: message }
    }
  }

  await sleep()

  return data
})