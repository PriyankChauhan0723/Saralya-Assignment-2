import { describe, it, expect } from 'vitest';
import {
  formatIndianNumber,
  formatIndianCurrency,
  formatExactRupees
} from '../src/domain/indianNumber.ts';

describe('Indian Numbering Utility Suite', () => {
  it('should correctly format standard Indian comma grouping', () => {
    expect(formatIndianNumber(0)).toBe('0');
    expect(formatIndianNumber(500)).toBe('500');
    expect(formatIndianNumber(1200)).toBe('1,200');
    expect(formatIndianNumber(25000)).toBe('25,000');
    expect(formatIndianNumber(100000)).toBe('1,00,000');
    expect(formatIndianNumber(1234567)).toBe('12,34,567');
    expect(formatIndianNumber(10000000)).toBe('1,00,00,000');
  });

  it('should handle negative numbers in Indian comma grouping', () => {
    expect(formatIndianNumber(-45000)).toBe('-45,000');
    expect(formatIndianNumber(-1250000)).toBe('-12,50,000');
  });

  it('should format compact Indian currency in Lakhs (L) and Crores (Cr)', () => {
    expect(formatIndianCurrency(1234567, { compact: true, decimals: 2 })).toBe('₹12.35 L');
    expect(formatIndianCurrency(15000000, { compact: true, decimals: 2 })).toBe('₹1.50 Cr');
    expect(formatIndianCurrency(633520000, { compact: true, decimals: 2 })).toBe('₹63.35 Cr');
    expect(formatIndianCurrency(45000, { compact: true })).toBe('₹45.0 k');
    expect(formatIndianCurrency(5400, { compact: true })).toBe('₹5,400');
    expect(formatIndianCurrency(850, { compact: true })).toBe('₹850');
  });

  it('should format exact Rupee values with decimal places', () => {
    expect(formatExactRupees(1234567.89)).toBe('₹12,34,567.89');
    expect(formatExactRupees(0)).toBe('₹0.00');
  });
});
