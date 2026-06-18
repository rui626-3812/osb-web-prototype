/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ResourceCategory } from './types';

/**
 * Timezone-safe local date parser to prevent UTC offset shifting (month, day off by 1)
 */
export function parseLocalDateString(dateStr: string): Date {
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    const y = parseInt(parts[0], 10);
    const m = parseInt(parts[1], 10) - 1; // 0-indexed month
    const d = parseInt(parts[2], 10);
    return new Date(y, m, d, 12, 0, 0); // safe mid-day setting
  }
  return new Date(dateStr);
}

/**
 * Formats a local date string YYYY-MM-DD to a beautiful human-readable format
 */
export function formatLocalDate(dateStr: string, locales = 'en-US'): string {
  const date = parseLocalDateString(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  return date.toLocaleDateString(locales, {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });
}

/**
 * Extract active initials from a direct name string
 */
export function getInitials(name: string): string {
  if (!name || typeof name !== 'string') return '';
  const clean = name.trim();
  const parts = clean.split(/\s+/);
  if (parts.length === 1) {
    return parts[0].substring(0, 2).toUpperCase();
  }
  const first = parts[0]?.[0] || '';
  const last = parts[parts.length - 1]?.[0] || '';
  return (first + last).toUpperCase();
}

/**
 * Checks if a given YYYY-MM-DD date is today or in the future relative to a reference date
 */
export function isUpcoming(eventDateStr: string, referenceDate: Date = new Date()): boolean {
  const eventDate = parseLocalDateString(eventDateStr);
  if (isNaN(eventDate.getTime())) return false;
  
  // Strip times for date-only comparison
  const refDateOnly = new Date(referenceDate.getFullYear(), referenceDate.getMonth(), referenceDate.getDate(), 0, 0, 0);
  const eventDateOnly = new Date(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate(), 0, 0, 0);
  
  return eventDateOnly.getTime() >= refDateOnly.getTime();
}

/**
 * Validates whether a string matches YYYY-MM-DD format with valid numbers
 */
export function validateEventDate(dateStr: string): boolean {
  if (!dateStr || typeof dateStr !== 'string') return false;
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(dateStr)) return false;
  
  const parts = dateStr.split('-');
  const y = parseInt(parts[0], 10);
  const m = parseInt(parts[1], 10);
  const d = parseInt(parts[2], 10);
  
  if (isNaN(y) || isNaN(m) || isNaN(d)) return false;
  if (m < 1 || m > 12) return false;
  if (d < 1 || d > 31) return false;
  
  return true;
}

/**
 * Resolves Tailwind classes and display names for customized dynamic categories
 */
export function resolveCategoryStyle(category: string, categories: ResourceCategory[]): { badgeClass: string; displayName: string } {
  const catConfig = categories.find((c) => c.id === category || c.name === category);
  if (catConfig) {
    return {
      badgeClass: `${catConfig.bgClass} ${catConfig.textClass} ${catConfig.borderClass}`,
      displayName: catConfig.name
    };
  }
  return {
    badgeClass: "bg-slate-50 text-slate-600 border-slate-200",
    displayName: category
  };
}

