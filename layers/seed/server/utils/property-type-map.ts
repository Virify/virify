// This file contains a mapping of property types to their respective classifications.
export const typeToClassificationMap: Record<number, number[]> = {
  1: [1, 2, 3, 4, 5],
  2: [6, 7, 8, 9],
  3: [10, 11, 12, 13],
  4: [14, 15, 16, 17, 18, 19],
  5: [20, 21, 22, 23, 24],
  6: [25, 26, 27],
  7: [28, 29, 30], 
  8: [31, 32, 33],
};

// property_type_id |  property_type_name   | classification_id |  classification_name
// ------------------+-----------------------+-------------------+-----------------------
//                 1 | House                 |                 1 | Terraced
//                 1 | House                 |                 2 | Semi-detached
//                 1 | House                 |                 3 | End of terrace
//                 1 | House                 |                 4 | Detached
//                 1 | House                 |                 5 | Mansion
//                 2 | Cottage               |                 6 | Terraced
//                 2 | Cottage               |                 7 | Detached
//                 2 | Cottage               |                 8 | Semi-detached
//                 2 | Cottage               |                 9 | End of terrace
//                 3 | Bungalow              |                10 | Terraced
//                 3 | Bungalow              |                11 | Semi-detached
//                 3 | Bungalow              |                12 | End of terrace
//                 3 | Bungalow              |                13 | Detached
//                 4 | Flat                  |                14 | Converted flat
//                 4 | Flat                  |                15 | Studio flat
//                 4 | Flat                  |                16 | Maisonette
//                 4 | Flat                  |                17 | High-rise
//                 4 | Flat                  |                18 | Within a complex
//                 4 | Flat                  |                19 | Penthouse
//                 5 | Land                  |                20 | Residential Land
//                 5 | Land                  |                21 | Commercial Land
//                 5 | Land                  |                22 | Agricultural Land
//                 5 | Land                  |                23 | Development plot
//                 5 | Land                  |                24 | Development potential
//                 6 | Farms                 |                25 | Non-working Farmhouse
//                 6 | Farms                 |                26 | Working Farm
//                 6 | Farms                 |                27 | Small Holding
//                 7 | Specialty             |                28 | Shared Ownership
//                 7 | Specialty             |                29 | Retirement Homes
//                 7 | Specialty             |                30 | New Build Homes
//                 8 | Student Accommodation |                31 | Flat
//                 8 | Student Accommodation |                32 | House
//                 8 | Student Accommodation |                33 | House-share