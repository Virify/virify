interface ErrorBoxListitem {
  type: string,
  message: string
}

interface ErrorBox {
  title?: string
  message?: string
  list?: ErrorBoxListitem[]
}

type ErrorBoxProp = Error | string | ErrorBox

export type { ErrorBoxProp }