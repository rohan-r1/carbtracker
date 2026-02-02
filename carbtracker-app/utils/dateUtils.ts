/**
 * Date utilities for consistent timestamp handling across the app.
 * All functions handle UTC timestamps from the backend.
 */

/**
 * Parse ISO 8601 timestamp string to Unix timestamp (milliseconds).
 * Ensures explicit UTC interpretation by adding 'Z' suffix if missing.
 */
export function parseISOTimestamp(dateString: string): number {
  // Ensure 'Z' suffix for explicit UTC
  const normalized = dateString.endsWith('Z') ? dateString : dateString + 'Z';
  return new Date(normalized).getTime();
}

/**
 * Format timestamp as relative time (e.g., "5m ago", "2h ago", "3d ago")
 */
export function formatTimeAgo(dateString: string): string {
  const now = Date.now();
  const timestamp = parseISOTimestamp(dateString);
  const diff = now - timestamp;

  // Handle negative diffs (clock skew/timezone issues)
  if (diff < 0) return 'Just now';

  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

/**
 * Format timestamp as time (e.g., "12:45 PM")
 */
export function formatTime(dateString: string): string {
  const timestamp = parseISOTimestamp(dateString);
  const date = new Date(timestamp);

  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

/**
 * Format timestamp as date (e.g., "Monday, Feb 1")
 */
export function formatDate(dateString: string): string {
  const timestamp = parseISOTimestamp(dateString);
  const date = new Date(timestamp);

  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });
}
