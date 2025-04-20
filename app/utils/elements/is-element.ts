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