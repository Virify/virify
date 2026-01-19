import {defineType, Template} from 'sanity'
import {supportFaqItems} from '../../../../app/utils/faq/support-faq'
import {nonSupportFaqItems} from '../../../../app/utils/faq/non-support-faq'

// Create templates for each FAQ item
export const supportFaqTemplates: Template[] = supportFaqItems.map((faq, index) => ({
  id: `support-faq-${index + 1}`,
  title: `Support FAQ: ${faq.question.substring(0, 40)}...`,
  schemaType: 'faq',
  value: {
    question: faq.question,
    answer: faq.answer,
    active: faq.active,
  },
}))

export const nonSupportFaqTemplates: Template[] = nonSupportFaqItems.map((faq, index) => ({
  id: `non-support-faq-${index + 1}`,
  title: `Can't Help: ${faq.question.substring(0, 40)}...`,
  schemaType: 'faq',
  value: {
    question: faq.question,
    answer: faq.answer,
    active: faq.active || false,
  },
}))

// Export all FAQ templates
export const faqTemplates = [...supportFaqTemplates, ...nonSupportFaqTemplates]
