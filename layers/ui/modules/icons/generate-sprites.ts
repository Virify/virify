import { mkdirSync, existsSync, writeFileSync } from 'node:fs'
import { join } from 'pathe'
import { isNonEmptyURL } from 'ufo'
import { consola } from 'consola'
import { searchForSVGs, type FoundSVGs } from './svgs/search-for-svgs';
import { generateSpriteAsString } from './svgs/generate-sprite-as-string'
import { isPopulatedString } from './utils/is-string'
import { measurePerformance } from './runners/measure-performance';
import {
  filterNonExistentDirectories
} from './filesystem/filter-non-existent-directories';

/**
 *  Generate SVG sprites
 * 
 */
export function generateSprites(input: string[], output: string) {
  consola.start('Generating sprites')

  const timeElapsed = measurePerformance(() => {
    // Remove inputs for directories that do not exist
    const validInputs = filterNonExistentDirectories(input)

    // Ensure output folder exists
    if (!existsSync(output)) mkdirSync(output)

    // Get key for all matching SVGs
    const groupedSvgPaths: FoundSVGs = {}

    // Loop through all valid inputs, collect and group SVG paths
    validInputs.forEach(async dir => {
      searchForSVGs(dir, groupedSvgPaths, 'icon')
    })

    // Convert groupedSvgPaths to array to loop through
    const svgArray = Object.entries(groupedSvgPaths)

    // Loop through all SVGs and construct sprites
    for (const [groupName, filePaths] of svgArray) {
      try {
        const sprite = generateSpriteAsString(filePaths)

        // Create output file name
        const outputFileName = join(output, groupName + '.svg')

        // If no name can be created for any reason, abort
        if (!(isNonEmptyURL(outputFileName))) {
          throw new Error('Unable to create output file name')
        }

        // Ensure sprint content actually exists
        if (!isPopulatedString(sprite)) {
          throw new Error('No content exists for sprite')
        }

        // Create SVG sprite
        writeFileSync(outputFileName, sprite)
      }
      catch (error) {
        consola.error(error)
      }
    }
  })

  consola.success(`Sprites generated in ${Math.ceil(timeElapsed)}ms`)
}