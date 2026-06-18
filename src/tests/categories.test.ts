/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { describe, test, expect } from 'vitest';
import { resolveCategoryStyle } from '../utils';
import { ResourceCategory } from '../types';

const mockCategories: ResourceCategory[] = [
  {
    id: "cat-1",
    name: "Mathematics",
    bgClass: "bg-amber-50",
    textClass: "text-amber-700",
    borderClass: "border-amber-200"
  },
  {
    id: "cat-2",
    name: "Computer Science",
    bgClass: "bg-sky-50",
    textClass: "text-sky-700",
    borderClass: "border-sky-200"
  }
];

describe('Category Style Resolution Tests', () => {

  test('should find category style by ID and combine classes correctly', () => {
    const result = resolveCategoryStyle("cat-1", mockCategories);
    expect(result.displayName).toBe("Mathematics");
    expect(result.badgeClass).toBe("bg-amber-50 text-amber-700 border-amber-200");
  });

  test('should find category style by Name and combine classes correctly', () => {
    const result = resolveCategoryStyle("Computer Science", mockCategories);
    expect(result.displayName).toBe("Computer Science");
    expect(result.badgeClass).toBe("bg-sky-50 text-sky-700 border-sky-200");
  });

  test('should fallback gracefully to clean slate classes when category is not found', () => {
    const result = resolveCategoryStyle("Physics", mockCategories);
    expect(result.displayName).toBe("Physics");
    expect(result.badgeClass).toBe("bg-slate-50 text-slate-600 border-slate-200");
  });

  test('should handle empty or malformed categories array', () => {
    const result = resolveCategoryStyle("Mathematics", []);
    expect(result.displayName).toBe("Mathematics");
    expect(result.badgeClass).toBe("bg-slate-50 text-slate-600 border-slate-200");
  });

});
