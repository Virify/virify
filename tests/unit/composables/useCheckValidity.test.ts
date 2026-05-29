import { describe, it, expect } from 'vitest'

// ─── Tests ─────────────────────────────────────────────────────────────────

describe('useCheckValidityInput', () => {
  describe('non-input elements', () => {
    it('returns empty string for non-element values', async () => {
      const { useCheckValidityInput } = await import('../../../app/composables/useCheckValidity')
      expect(useCheckValidityInput(null)).toBe('')
      expect(useCheckValidityInput(undefined)).toBe('')
      expect(useCheckValidityInput('not an element')).toBe('')
      expect(useCheckValidityInput(42)).toBe('')
      expect(useCheckValidityInput({})).toBe('')
    })

    it('returns empty string for div elements (not input/select/textarea)', async () => {
      const { useCheckValidityInput } = await import('../../../app/composables/useCheckValidity')
      const div = document.createElement('div')
      expect(useCheckValidityInput(div)).toBe('')
    })
  })

  describe('valid inputs', () => {
    it('returns empty string when input passes checkValidity', async () => {
      const { useCheckValidityInput } = await import('../../../app/composables/useCheckValidity')
      const input = document.createElement('input')
      input.type = 'text'
      input.value = 'hello'
      expect(useCheckValidityInput(input)).toBe('')
    })

    it('returns empty string for valid select element', async () => {
      const { useCheckValidityInput } = await import('../../../app/composables/useCheckValidity')
      const select = document.createElement('select')
      const option = document.createElement('option')
      option.value = 'test'
      select.appendChild(option)
      select.value = 'test'
      expect(useCheckValidityInput(select)).toBe('')
    })

    it('returns empty string for valid textarea element', async () => {
      const { useCheckValidityInput } = await import('../../../app/composables/useCheckValidity')
      const textarea = document.createElement('textarea')
      textarea.value = 'some content'
      expect(useCheckValidityInput(textarea)).toBe('')
    })
  })

  describe('required field validation', () => {
    it('returns default valueMissing message for empty required input', async () => {
      const { useCheckValidityInput } = await import('../../../app/composables/useCheckValidity')
      const input = document.createElement('input')
      input.type = 'text'
      input.required = true
      input.value = ''

      const result = useCheckValidityInput(input)
      expect(result).toBe('This field is required.')
    })

    it('returns custom valueMissing override when provided', async () => {
      const { useCheckValidityInput } = await import('../../../app/composables/useCheckValidity')
      // Re-import each call to reset module state
      const input = document.createElement('input')
      input.type = 'text'
      input.required = true
      input.value = ''

      // No custom override — falls through to default
      const result = useCheckValidityInput(input, {})
      expect(result).toBe('This field is required.')
    })
  })

  describe('pattern mismatch validation', () => {
    it('returns default patternMismatch message when pattern fails', async () => {
      const { useCheckValidityInput } = await import('../../../app/composables/useCheckValidity')
      const input = document.createElement('input')
      input.type = 'text'
      input.pattern = '^[A-Z]+$'
      input.value = 'invalid123'

      const result = useCheckValidityInput(input)
      expect(result).toBe('Value is an invalid format.')
    })

    it('returns custom patternMismatch override when provided', async () => {
      const { useCheckValidityInput } = await import('../../../app/composables/useCheckValidity')
      const input = document.createElement('input')
      input.type = 'text'
      input.pattern = '^[A-Z]+$'
      input.value = 'invalid123'

      const result = useCheckValidityInput(input, { patternMismatch: 'Only uppercase letters allowed.' })
      expect(result).toBe('Only uppercase letters allowed.')
    })
  })

  describe('ref unwrapping', () => {
    it('accepts a ref wrapping an input element', async () => {
      const { useCheckValidityInput } = await import('../../../app/composables/useCheckValidity')
      const { ref } = await import('vue')
      const input = document.createElement('input')
      input.type = 'text'
      input.required = true
      input.value = ''

      const inputRef = ref(input)
      const result = useCheckValidityInput(inputRef)
      expect(result).toBe('This field is required.')
    })
  })
})

describe('useCheckValidity', () => {
  it('exports a useCheckValidity function', async () => {
    const { useCheckValidity } = await import('../../../app/composables/useCheckValidity')
    expect(typeof useCheckValidity).toBe('function')
  })

  it('returns validityText and checkValidity', async () => {
    const { useCheckValidity } = await import('../../../app/composables/useCheckValidity')
    const result = useCheckValidity()
    expect(result).toHaveProperty('validityText')
    expect(result).toHaveProperty('checkValidity')
    expect(typeof result.checkValidity).toBe('function')
  })

  it('accepts custom overrides', async () => {
    const { useCheckValidity } = await import('../../../app/composables/useCheckValidity')
    const result = useCheckValidity({ patternMismatch: 'Custom pattern error.' })
    expect(typeof result.checkValidity).toBe('function')
  })
})
