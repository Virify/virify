import type { FormError } from '#ui/types'

export interface ModerationField {
  name: string
  value: string | null | undefined
}

/**
 * Reusable composable for running content moderation on explicit form fields.
 *
 * Usage:
 *   const { moderateFields, isModerating } = useModerateFields()
 *
 *   // In a submit handler, before saving:
 *   const passed = await moderateFields(
 *     [{ name: 'property.description', value: state.property.description }],
 *     formRef
 *   )
 *   if (!passed) return
 */
export function useModerateFields() {
  const { checkText, isChecking: isModerating } = useModeration()
  const toast = useToast()

  /**
   * Check a list of named fields for inappropriate content.
   *
   * @param fields  - Explicit list of { name, value } pairs to check. Empty / null values are skipped.
   * @param formRef - Optional UForm ref. If provided, failing fields get inline errors set on it.
   * @returns       `true` if all fields pass, `false` if any were flagged (saves should be blocked).
   */
  async function moderateFields(
    fields: ModerationField[],
    formRef?: Ref<{ setErrors: (errors: FormError[]) => void } | null>
  ): Promise<boolean> {
    const filtered = fields.filter((f) => (f.value ?? '').trim().length > 0) as Array<{
      name: string
      value: string
    }>

    if (filtered.length === 0) return true

    // Clear previous moderation errors
    formRef?.value?.setErrors([])

    const results = await Promise.all(
      filtered.map(async (f) => ({ name: f.name, ...(await checkText(f.value)) }))
    )

    const failed = results.filter((r) => !r.safe)

    if (failed.length > 0) {
      formRef?.value?.setErrors(
        failed.map((r) => ({
          name: r.name,
          message: 'This field contains inappropriate content. Please revise.',
        }))
      )
      toast.add({
        title: 'Content flagged',
        description: 'One or more fields contain inappropriate content. Please revise before saving.',
        color: 'error',
        icon: 'i-lucide-shield-x',
        duration: 5000,
      })
      return false
    }

    return true
  }

  return { moderateFields, isModerating }
}
