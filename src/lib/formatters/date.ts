import { format, formatDistance, formatRelative, isValid, parseISO } from 'date-fns';

/**
 * Format a date to a readable string
 * @param date - Date string, Date object, or timestamp
 * @param formatStr - Format string (default: 'MMM dd, yyyy')
 * @returns Formatted date string
 */
export function formatDate(date: string | Date | number, formatStr: string = 'MMM dd, yyyy'): string {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : new Date(date);
    if (!isValid(dateObj)) return 'Invalid date';
    return format(dateObj, formatStr);
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid date';
  }
}

/**
 * Format a date to relative time (e.g., "2 hours ago")
 * @param date - Date string, Date object, or timestamp
 * @returns Relative time string
 */
export function formatRelativeTime(date: string | Date | number): string {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : new Date(date);
    if (!isValid(dateObj)) return 'Invalid date';
    return formatDistance(dateObj, new Date(), { addSuffix: true });
  } catch (error) {
    console.error('Error formatting relative time:', error);
    return 'Invalid date';
  }
}

/**
 * Format a date relative to now (e.g., "yesterday at 3:00 PM")
 * @param date - Date string, Date object, or timestamp
 * @returns Relative date string
 */
export function formatRelativeDate(date: string | Date | number): string {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : new Date(date);
    if (!isValid(dateObj)) return 'Invalid date';
    return formatRelative(dateObj, new Date());
  } catch (error) {
    console.error('Error formatting relative date:', error);
    return 'Invalid date';
  }
}

/**
 * Format a date to time only (e.g., "3:45 PM")
 * @param date - Date string, Date object, or timestamp
 * @returns Time string
 */
export function formatTime(date: string | Date | number): string {
  return formatDate(date, 'h:mm a');
}

/**
 * Format a date to full datetime (e.g., "Jan 15, 2024 at 3:45 PM")
 * @param date - Date string, Date object, or timestamp
 * @returns Full datetime string
 */
export function formatDateTime(date: string | Date | number): string {
  return formatDate(date, 'MMM dd, yyyy \\at h:mm a');
}

/**
 * Check if a date is today
 * @param date - Date string, Date object, or timestamp
 * @returns True if date is today
 */
export function isToday(date: string | Date | number): boolean {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : new Date(date);
    const today = new Date();
    return (
      dateObj.getDate() === today.getDate() &&
      dateObj.getMonth() === today.getMonth() &&
      dateObj.getFullYear() === today.getFullYear()
    );
  } catch (error) {
    return false;
  }
}