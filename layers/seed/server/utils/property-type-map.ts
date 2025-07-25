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
//                 1 | House                 |                 3 | End of Terrace
//                 1 | House                 |                 4 | Detached
//                 1 | House                 |                 5 | Mansion
//                 2 | Cottage               |                 6 | Terraced
//                 2 | Cottage               |                 7 | Detached
//                 2 | Cottage               |                 8 | Semi-detached
//                 2 | Cottage               |                 9 | End of Terrace
//                 3 | Bungalow              |                10 | Terraced
//                 3 | Bungalow              |                11 | Semi-detached
//                 3 | Bungalow              |                12 | End of Terrace
//                 3 | Bungalow              |                13 | Detached
//                 4 | Flat                  |                14 | Converted
//                 4 | Flat                  |                15 | Studio
//                 4 | Flat                  |                16 | Maisonette
//                 4 | Flat                  |                17 | High-rise
//                 4 | Flat                  |                18 | Within a Complex
//                 4 | Flat                  |                19 | Penthouse
//                 5 | Land                  |                20 | Residential
//                 5 | Land                  |                21 | Commercial
//                 5 | Land                  |                22 | Agricultural
//                 5 | Land                  |                23 | Development Plot
//                 5 | Land                  |                24 | Development Potential
//                 6 | Farms                 |                25 | Non-working Farmhouse
//                 6 | Farms                 |                26 | Working Farm
//                 6 | Farms                 |                27 | Small Holding
//                 7 | Specialty             |                28 | Shared Ownership
//                 7 | Specialty             |                29 | Retirement Home
//                 7 | Specialty             |                30 | New Build Home
//                 8 | Student Accommodation |                31 | Flat
//                 8 | Student Accommodation |                32 | House
//                 8 | Student Accommodation |                33 | House-share