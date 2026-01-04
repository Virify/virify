/**
 *  Check if an input is a HTML element
 *
 */
export function isElement(elem: unknown): elem is HTMLElement {
  return !!elem && elem instanceof HTMLElement
}

/**
 *  Check if an input is a HTML input element
 *
 */
export function isInputElement(elem: unknown): elem is HTMLInputElement {
  return isElement(elem) && elem instanceof HTMLInputElement
}

/**
 *  Check if an input is a HTML select element
 *
 */
export function isSelectElement(elem: unknown): elem is HTMLSelectElement {
  return isElement(elem) && elem instanceof HTMLSelectElement
}

/**
 *  Check if an input is a HTML textarea element
 *
 */
export function isTextAreaElement(elem: unknown): elem is HTMLTextAreaElement {
  return isElement(elem) && elem instanceof HTMLTextAreaElement
}

/**
 *  Check if an input is a HTML form control element (input, select, or textarea)
 *
 */
export function isFormControlElement(elem: unknown): elem is HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement {
  return isInputElement(elem) || isSelectElement(elem) || isTextAreaElement(elem)
}

/**
 *  Check if an input is a HTML form element
 *
 */
export function isFormElement(elem: unknown): elem is HTMLFormElement {
  return isElement(elem) && elem instanceof HTMLFormElement
}