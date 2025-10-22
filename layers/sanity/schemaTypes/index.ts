import {guideCategory} from './guideCategory'
import {guide} from './guideType'
import {privacyType} from './privacyType'
import {termsType} from './termsType'
import {cookieType} from './cookieType'
import {waitingListPageType} from './waitingListPageType'
import {contactPageType} from './contactPageType'
import {iconType} from './iconType'
import {featureSectionType} from './featureSectionType'

export const schemaTypes = [
  // Reusable types
  iconType,
  featureSectionType,
  
  // Documents
  guideCategory,
  guide,
  privacyType,
  termsType,
  cookieType,
  waitingListPageType,
  contactPageType,
]
