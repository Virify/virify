import type { Component, ComponentPropsOptions } from 'vue'

type DialogStateReturn = string | { returnValue?: unknown }

interface DialogState extends Record<string, unknown> {
  component?: Component
  onClose?: (arg0: DialogStateReturn) => void
  className?: string
  wrapperClassName?: string
  props?: ComponentPropsOptions
}

export type { DialogState, DialogStateReturn }
