import { describe, it, expect } from 'vitest';
import {
  isValidPostcode,
  formatPostcode,
  validateAndFormatPostcode,
  safeValidateAndFormatPostcode,
  UK_POSTCODE_REGEX,
} from '../../../shared/utils/postcode';

describe('postcode utilities', () => {
  describe('UK_POSTCODE_REGEX', () => {
    it('should be case insensitive', () => {
      expect(UK_POSTCODE_REGEX.test('CF10 1AA')).toBe(true);
      expect(UK_POSTCODE_REGEX.test('cf10 1aa')).toBe(true);
      expect(UK_POSTCODE_REGEX.test('Cf10 1Aa')).toBe(true);
    });

    it('should accept postcodes with or without spaces', () => {
      expect(UK_POSTCODE_REGEX.test('CF10 1AA')).toBe(true);
      expect(UK_POSTCODE_REGEX.test('CF101AA')).toBe(true);
    });
  });

  describe('isValidPostcode', () => {
    describe('standard UK mainland postcodes', () => {
      it('should validate single letter area codes', () => {
        expect(isValidPostcode('M1 1AE')).toBe(true);
        expect(isValidPostcode('m11ae')).toBe(true);
        expect(isValidPostcode('B33 8TH')).toBe(true);
      });

      it('should validate two letter area codes', () => {
        expect(isValidPostcode('CF10 1AA')).toBe(true);
        expect(isValidPostcode('cf101aa')).toBe(true);
        expect(isValidPostcode('CR2 6XH')).toBe(true);
      });

      it('should validate postcodes with optional sub-district letter', () => {
        expect(isValidPostcode('W1A 0AX')).toBe(true);
        expect(isValidPostcode('EC1A 1BB')).toBe(true);
        expect(isValidPostcode('w1a0ax')).toBe(true);
      });

      it('should validate all standard formats', () => {
        const validPostcodes = [
          'SW1A 1AA', // Buckingham Palace
          'EC1A 1BB', // City of London
          'W1A 0AX', // BBC
          'M1 1AE',
          'B33 8TH',
          'CR2 6XH',
          'DN55 1PT',
          'GU16 7HF',
          'PO16 7GZ',
        ];

        validPostcodes.forEach(postcode => {
          expect(isValidPostcode(postcode)).toBe(true);
        });
      });
    });

    describe('special UK postcodes', () => {
      it('should validate GIR 0AA (Girobank)', () => {
        expect(isValidPostcode('GIR 0AA')).toBe(true);
        expect(isValidPostcode('gir0aa')).toBe(true);
        expect(isValidPostcode('GIR0AA')).toBe(true);
      });

      it('should validate Santa postcode', () => {
        expect(isValidPostcode('SAN TA1')).toBe(true);
        expect(isValidPostcode('SANTA1')).toBe(true);
      });

      it('should validate Guernsey', () => {
        expect(isValidPostcode('GE CX')).toBe(true);
        expect(isValidPostcode('GECX')).toBe(true);
      });
    });

    describe('British Forces Post Office (BFPO)', () => {
      it('should validate BFPO postcodes', () => {
        expect(isValidPostcode('BFPO 1')).toBe(true);
        expect(isValidPostcode('BFPO 1234')).toBe(true);
        expect(isValidPostcode('bfpo1')).toBe(true);
        expect(isValidPostcode('BFPO1234')).toBe(true);
      });

      it('should reject BFPO with invalid numbers', () => {
        expect(isValidPostcode('BFPO 12345')).toBe(false); // Too many digits
        expect(isValidPostcode('BFPO')).toBe(false); // No number
      });
    });

    describe('overseas territories', () => {
      it('should validate Cayman Islands (KY)', () => {
        expect(isValidPostcode('KY1-1234')).toBe(true);
        expect(isValidPostcode('KY11234')).toBe(true);
        expect(isValidPostcode('KY2 1234')).toBe(false); // Wrong format
      });

      it('should validate Montserrat (MSR)', () => {
        expect(isValidPostcode('MSR 1234')).toBe(true);
        expect(isValidPostcode('MSR1234')).toBe(true);
      });

      it('should validate British Virgin Islands (VG)', () => {
        expect(isValidPostcode('VG 1234')).toBe(true);
        expect(isValidPostcode('VG1234')).toBe(true);
      });

      it('should validate Anguilla (AI)', () => {
        expect(isValidPostcode('AI-2640')).toBe(true);
        expect(isValidPostcode('AI2640')).toBe(true);
      });

      it('should validate other territories', () => {
        const territories = [
          'ASCN 1ZZ', // Ascension Island
          'STHL 1ZZ', // Saint Helena
          'TDCU 1ZZ', // Tristan da Cunha
          'BBND 1ZZ', // British Indian Ocean Territory
          'BIQQ 1ZZ', // British Antarctic Territory
          'FIQQ 1ZZ', // Falkland Islands
          'SIQQ 1ZZ', // South Georgia
          'PCRN 1ZZ', // Pitcairn Islands
          'TKCA 1ZZ', // Turks and Caicos
        ];

        territories.forEach(postcode => {
          expect(isValidPostcode(postcode)).toBe(true);
        });
      });
    });

    describe('invalid postcodes', () => {
      it('should reject incomplete postcodes', () => {
        expect(isValidPostcode('CF10')).toBe(false); // Missing inward code
        expect(isValidPostcode('CF10 1')).toBe(false); // Incomplete inward
        expect(isValidPostcode('1AA')).toBe(false); // Missing area
      });

      it('should reject malformed postcodes', () => {
        expect(isValidPostcode('CF10 1AAA')).toBe(false); // Too many chars
        expect(isValidPostcode('CFG 1AA')).toBe(false); // 3 letter area
        expect(isValidPostcode('CF123 1AA')).toBe(false); // 3 digit district
      });

      it('should reject empty or whitespace', () => {
        expect(isValidPostcode('')).toBe(false);
        expect(isValidPostcode('   ')).toBe(false);
      });

      it('should reject random strings', () => {
        expect(isValidPostcode('INVALID')).toBe(false);
        expect(isValidPostcode('12345')).toBe(false);
        expect(isValidPostcode('ABC DEF')).toBe(false);
      });
    });
  });

  describe('formatPostcode', () => {
    describe('standard postcodes', () => {
      it('should format lowercase without spaces', () => {
        expect(formatPostcode('cf101aa')).toBe('CF10 1AA');
        expect(formatPostcode('m11ae')).toBe('M1 1AE');
        expect(formatPostcode('b338th')).toBe('B33 8TH');
      });

      it('should format uppercase without spaces', () => {
        expect(formatPostcode('CF101AA')).toBe('CF10 1AA');
        expect(formatPostcode('EC1A1BB')).toBe('EC1A 1BB');
      });

      it('should preserve already formatted postcodes', () => {
        expect(formatPostcode('CF10 1AA')).toBe('CF10 1AA');
        expect(formatPostcode('W1A 0AX')).toBe('W1A 0AX');
      });

      it('should handle mixed case', () => {
        expect(formatPostcode('Cf10 1Aa')).toBe('CF10 1AA');
        expect(formatPostcode('w1A0aX')).toBe('W1A 0AX');
      });

      it('should remove multiple spaces', () => {
        expect(formatPostcode('CF10  1AA')).toBe('CF10 1AA');
        expect(formatPostcode('  CF10 1AA  ')).toBe('CF10 1AA');
      });
    });

    describe('special postcodes', () => {
      it('should format GIR 0AA', () => {
        expect(formatPostcode('GIR0AA')).toBe('GIR 0AA');
        expect(formatPostcode('gir0aa')).toBe('GIR 0AA');
        expect(formatPostcode('GIR 0AA')).toBe('GIR 0AA');
      });

      it('should format BFPO postcodes', () => {
        expect(formatPostcode('BFPO1')).toBe('BFPO 1');
        expect(formatPostcode('bfpo1234')).toBe('BFPO 1234');
        expect(formatPostcode('BFPO 1234')).toBe('BFPO 1234');
      });
    });

    describe('overseas territories', () => {
      it('should format with hyphens for specific territories', () => {
        expect(formatPostcode('KY11234')).toBe('KY1-1234');
        expect(formatPostcode('MSR1234')).toBe('MSR-1234');
        expect(formatPostcode('VG1234')).toBe('VG-1234');
        expect(formatPostcode('AI2640')).toBe('AI-2640');
      });

      it('should preserve existing hyphen format', () => {
        expect(formatPostcode('KY1-1234')).toBe('KY1-1234');
        expect(formatPostcode('AI-2640')).toBe('AI-2640');
      });

      it('should format standard overseas territories', () => {
        expect(formatPostcode('ASCN1ZZ')).toBe('ASCN 1ZZ');
        expect(formatPostcode('STHL1ZZ')).toBe('STHL 1ZZ');
      });
    });
  });

  describe('validateAndFormatPostcode', () => {
    it('should validate and format valid postcodes', () => {
      expect(validateAndFormatPostcode('cf101aa')).toBe('CF10 1AA');
      expect(validateAndFormatPostcode('M11AE')).toBe('M1 1AE');
      expect(validateAndFormatPostcode('GIR0AA')).toBe('GIR 0AA');
    });

    it('should throw error for invalid postcodes', () => {
      expect(() => validateAndFormatPostcode('INVALID')).toThrow();
      expect(() => validateAndFormatPostcode('CF10')).toThrow();
      expect(() => validateAndFormatPostcode('')).toThrow();
    });
  });

  describe('safeValidateAndFormatPostcode', () => {
    it('should return formatted postcode for valid input', () => {
      expect(safeValidateAndFormatPostcode('cf101aa')).toBe('CF10 1AA');
      expect(safeValidateAndFormatPostcode('M11AE')).toBe('M1 1AE');
      expect(safeValidateAndFormatPostcode('GIR0AA')).toBe('GIR 0AA');
    });

    it('should return null for invalid input', () => {
      expect(safeValidateAndFormatPostcode('INVALID')).toBe(null);
      expect(safeValidateAndFormatPostcode('CF10')).toBe(null);
      expect(safeValidateAndFormatPostcode('')).toBe(null);
      expect(safeValidateAndFormatPostcode('12345')).toBe(null);
    });

    it('should handle edge cases gracefully', () => {
      expect(safeValidateAndFormatPostcode('   ')).toBe(null);
      expect(safeValidateAndFormatPostcode('CF10  1AA')).toBe('CF10 1AA');
    });
  });

  describe('real-world examples', () => {
    it('should handle famous UK addresses', () => {
      const famousAddresses = [
        { input: 'SW1A1AA', expected: 'SW1A 1AA' }, // Buckingham Palace
        { input: 'sw1a2aa', expected: 'SW1A 2AA' }, // 10 Downing Street
        { input: 'EC4M7JH', expected: 'EC4M 7JH' }, // St Paul's Cathedral
        { input: 'WC2N5DU', expected: 'WC2N 5DU' }, // Trafalgar Square
        { input: 'NW14NR', expected: 'NW1 4NR' }, // Lord's Cricket Ground
      ];

      famousAddresses.forEach(({ input, expected }) => {
        expect(validateAndFormatPostcode(input)).toBe(expected);
      });
    });
  });
});
