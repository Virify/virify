import {guideCategory} from './guideCategory'
import {guide} from './guideType'
import {privacyType} from './privacyType'
import {termsType} from './termsType'
import {cookieType} from './cookieType'
import {waitingListPageType} from './waitingListPageType'
import {contactPageType} from './contactPageType'
import {iconType} from './iconType'
import {featureSectionType} from './featureSectionType'
import {faqType} from './faqType'
import {supportPageType} from './supportPageType'
import {acceptableUseType} from './acceptableUseType'
import {generalPageType} from './generalPageType'
import {pageSectionType} from './pageSectionType'
import {pageFaq} from './faqSectionType'
import {pageGuidesGridType} from './pageGuidesGridType'
import {pageCategoryType} from './generalPageCategoryType'

export const schemaTypes = [
  // Reusable types
  iconType,
  featureSectionType,
  faqType,
  // Documents
  guideCategory,
  guide,
  privacyType,
  termsType,
  cookieType,
  waitingListPageType,
  contactPageType,
  supportPageType,
  acceptableUseType,
  pageSectionType,
  generalPageType,
  pageFaq,
  pageGuidesGridType,
  pageCategoryType,
]
