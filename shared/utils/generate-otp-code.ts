import { getRandomValues } from 'uncrypto'
type OtpCode = `${number}`
export type { OtpCode }

/**
 * Generates a random OTP code.
 * 
 * @param len - Length of the OTP code. Default is 6.
 * @returns OptCode - A string representing the OTP code.
 */
export default function generateOtpCode(len:number = 6): OtpCode {
  const [randomNumber] = getRandomValues(new Uint32Array(1))

  return String(randomNumber).slice(0, len).padStart(len, '0') as OtpCode
}