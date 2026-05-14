import { Decimal } from '@prisma/client/runtime/client'

declare module '@prisma/client/runtime/client' {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface Decimal {
    toJSON(): string
  }
}

Decimal.prototype.toJSON = function (this: Decimal) {
  return this.toString()
}
