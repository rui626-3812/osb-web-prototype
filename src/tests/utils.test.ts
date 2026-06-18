/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { describe, test, expect } from 'vitest';
import {
  parseLocalDateString,
  formatLocalDate,
  getInitials,
  isUpcoming,
  validateEventDate
} from '../utils';

describe('Utility Helpers Unit Test Suite', () => {
  
  describe('parseLocalDateString()', () => {
    test('should parse YYYY-MM-DD correctly to midday 12:00:00 to prevent UTC shifts', () => {
      const dateStr = '2026-06-18';
      const parsed = parseLocalDateString(dateStr);
      expect(parsed).toBeInstanceOf(Date);
      expect(parsed.getFullYear()).toBe(2026);
      expect(parsed.getMonth()).toBe(5); // 0-indexed for June
      expect(parsed.getDate()).toBe(18);
      expect(parsed.getHours()).toBe(12);
    });

    test('should fallback to default Date constructor behavior for malformed or other strings', () => {
      const fallbackStr = '2026/06/18';
      const parsed = parseLocalDateString(fallbackStr);
      expect(parsed).toBeInstanceOf(Date);
    });
  });

  describe('formatLocalDate()', () => {
    test('should format YYYY-MM-DD correctly to long Month Day, Year format', () => {
      const formatted = formatLocalDate('2026-06-18', 'en-US');
      expect(formatted).toBe('June 18, 2026');
    });

    test('should return input string if year-month-day cannot be parsed properly', () => {
      const formatted = formatLocalDate('invalid-date');
      expect(formatted).toBe('invalid-date');
    });
  });

  describe('getInitials()', () => {
    test('should return initials of first and last name in uppercase', () => {
      expect(getInitials('Dr. Arthur Pendelton')).toBe('DP');
      expect(getInitials('Beatrice Chen')).toBe('BC');
      expect(getInitials('cyrus vance')).toBe('CV');
    });

    test('should handle single name properly and return first 2 letters uppercase', () => {
      expect(getInitials('Ethan')).toBe('ET');
      expect(getInitials('x')).toBe('X');
    });

    test('should handle multi-space strings and empty inputs gracefully', () => {
      expect(getInitials('   Henry    Cavil   ')).toBe('HC');
      expect(getInitials('')).toBe('');
      // @ts-ignore
      expect(getInitials(null)).toBe('');
    });
  });

  describe('isUpcoming()', () => {
    test('should identify future dates correctly', () => {
      const reference = new Date(2026, 5, 18); // June 18, 2026
      expect(isUpcoming('2026-06-19', reference)).toBe(true);
      expect(isUpcoming('2026-07-01', reference)).toBe(true);
    });

    test('should identify same-day as upcoming', () => {
      const reference = new Date(2026, 5, 18); // June 18, 2026
      expect(isUpcoming('2026-06-18', reference)).toBe(true);
    });

    test('should identify past dates as not upcoming', () => {
      const reference = new Date(2026, 5, 18); // June 18, 2026
      expect(isUpcoming('2026-06-17', reference)).toBe(false);
      expect(isUpcoming('2025-12-31', reference)).toBe(false);
    });

    test('should return false for invalid formats', () => {
      expect(isUpcoming('not-a-date')).toBe(false);
    });
  });

  describe('validateEventDate()', () => {
    test('should return true for valid YYYY-MM-DD formats', () => {
      expect(validateEventDate('2026-06-18')).toBe(true);
      expect(validateEventDate('1999-12-31')).toBe(true);
    });

    test('should return false for invalid formatting style or text', () => {
      expect(validateEventDate('2026-6-18')).toBe(false);
      expect(validateEventDate('18-06-2026')).toBe(false);
      expect(validateEventDate('2026/06/18')).toBe(false);
      expect(validateEventDate('yesterday')).toBe(false);
      // @ts-ignore
      expect(validateEventDate(undefined)).toBe(false);
    });

    test('should validate year, month, day bounds correctly', () => {
      expect(validateEventDate('2026-13-18')).toBe(false); // month 13 out of bounds
      expect(validateEventDate('2026-00-18')).toBe(false); // month 0 out of bounds
      expect(validateEventDate('2026-06-32')).toBe(false); // day 32 out of bounds
      expect(validateEventDate('2026-06-00')).toBe(false); // day 0 out of bounds
    });
  });

});
