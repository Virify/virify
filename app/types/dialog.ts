import type { Component } from 'vue'

type DialogStateReturn = string | { returnValue?: unknown }

interface DialogState extends Record<string, unknown> {
  component?: Component
  onClose?: (arg0: DialogStateReturn) => void
  className?: string
  wrapperClassName?: string
  props?: Record<string, unknown>
  // Whether clicking the backdrop should close the dialog. When `false`, backdrop clicks won't close it.
  backdropClose?: boolean
}

export type { DialogState, DialogStateReturn }
