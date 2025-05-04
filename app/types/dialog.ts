import type { Component } from 'vue'

type DialogStateReturn = string | { returnValue?: unknown }

interface DialogState extends Record<string, unknown> {
  component?: Component
  onClose?: (arg0: DialogStateReturn) => void
  className?: string
  wrapperClassName?: string
  props?: Record<string, unknown>
}

export type { DialogState, DialogStateReturn }
