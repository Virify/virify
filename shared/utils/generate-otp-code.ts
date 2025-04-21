import { getRandomValues } from 'uncrypto'

type OtpCode = `${number}`
export type { OtpCode }
export default function generateOtpCode(len:number = 6): OtpCode {
  const [randomNumber] = getRandomValues(new Uint32Array(1))

  return String(randomNumber).slice(0, len).padStart(len, '0') as OtpCode
}