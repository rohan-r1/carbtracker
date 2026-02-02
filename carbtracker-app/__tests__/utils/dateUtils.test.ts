/**
 * Tests for date utilities
 * These tests reproduce the timestamp bugs and verify the fixes
 */

import { parseISOTimestamp, formatTimeAgo, formatTime, formatDate } from '../../utils/dateUtils';

describe('dateUtils', () => {
  describe('parseISOTimestamp', () => {
    it('should parse ISO 8601 timestamp with Z suffix', () => {
      const dateString = '2026-02-01T12:30:00Z';
      const timestamp = parseISOTimestamp(dateString);

      // Should parse to a valid timestamp
      expect(timestamp).toBeGreaterThan(0);
      // toISOString() adds milliseconds, so check it starts with the date
      expect(new Date(timestamp).toISOString()).toContain('2026-02-01T12:30:00');
    });

    it('should parse ISO 8601 timestamp without Z suffix', () => {
      const dateString = '2026-02-01T12:30:00';
      const timestamp = parseISOTimestamp(dateString);

      // Should add Z suffix and parse as UTC
      expect(timestamp).toBeGreaterThan(0);
      expect(new Date(timestamp).toISOString()).toContain('2026-02-01T12:30:00');
    });

    it('should handle timestamps from backend consistently', () => {
      const withZ = '2026-02-01T12:30:00Z';
      const withoutZ = '2026-02-01T12:30:00';

      // Should produce the same timestamp
      expect(parseISOTimestamp(withZ)).toBe(parseISOTimestamp(withoutZ));
    });
  });

  describe('formatTimeAgo', () => {
    beforeEach(() => {
      // Mock Date.now() to return a fixed timestamp
      jest.spyOn(Date, 'now').mockReturnValue(new Date('2026-02-01T12:30:00Z').getTime());
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('should format recent time as "Just now"', () => {
      const dateString = '2026-02-01T12:29:45Z'; // 15 seconds ago
      expect(formatTimeAgo(dateString)).toBe('Just now');
    });

    it('should format minutes ago correctly', () => {
      const dateString = '2026-02-01T12:25:00Z'; // 5 minutes ago
      expect(formatTimeAgo(dateString)).toBe('5m ago');
    });

    it('should format hours ago correctly', () => {
      const dateString = '2026-02-01T10:30:00Z'; // 2 hours ago
      expect(formatTimeAgo(dateString)).toBe('2h ago');
    });

    it('should format days ago correctly', () => {
      const dateString = '2026-01-30T12:30:00Z'; // 2 days ago
      expect(formatTimeAgo(dateString)).toBe('2d ago');
    });

    it('should handle negative diff (future timestamp) as "Just now"', () => {
      const dateString = '2026-02-01T13:30:00Z'; // 1 hour in future
      expect(formatTimeAgo(dateString)).toBe('Just now');
    });

    it('should NOT return negative minutes (reproduces bug)', () => {
      const dateString = '2026-02-01T20:30:00Z'; // 8 hours in future (timezone issue)
      const result = formatTimeAgo(dateString);

      // Should handle gracefully, not return "-480m ago"
      expect(result).not.toMatch(/-\d+m ago/);
      expect(result).toBe('Just now');
    });
  });

  describe('formatTime', () => {
    it('should format time as 12-hour format', () => {
      const dateString = '2026-02-01T12:30:00Z';
      const result = formatTime(dateString);

      // Should be in format like "12:30 PM" or "12:30 pm" (depending on locale)
      expect(result).toMatch(/\d{1,2}:\d{2}\s?(AM|PM|am|pm)/);
    });

    it('should handle morning times', () => {
      const dateString = '2026-02-01T08:15:00Z';
      const result = formatTime(dateString);

      // Just verify format is correct, not specific time (timezone dependent)
      expect(result).toMatch(/\d{1,2}:\d{2}\s?(AM|PM|am|pm)/);
    });

    it('should handle afternoon times', () => {
      const dateString = '2026-02-01T15:45:00Z';
      const result = formatTime(dateString);

      // Just verify format is correct, not specific time (timezone dependent)
      expect(result).toMatch(/\d{1,2}:\d{2}\s?(AM|PM|am|pm)/);
    });
  });

  describe('formatDate', () => {
    it('should format date with weekday and month', () => {
      const dateString = '2026-02-01T12:30:00Z';
      const result = formatDate(dateString);

      // Should be in format like "Sunday, Feb 1"
      expect(result).toMatch(/\w+,\s\w+\s\d+/);
    });

    it('should include weekday name', () => {
      const dateString = '2026-02-01T12:30:00Z'; // Sunday
      const result = formatDate(dateString);

      expect(result).toContain('Sunday');
    });

    it('should include month name', () => {
      const dateString = '2026-02-01T12:30:00Z';
      const result = formatDate(dateString);

      expect(result).toContain('Feb');
    });
  });
});
