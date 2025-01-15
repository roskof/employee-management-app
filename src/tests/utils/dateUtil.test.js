import {expect, test} from 'vitest';
import {formatDate} from '@/utils/dateUtil';

test('formats date correctly', () => {
  const date = '2024-01-15';
  expect(formatDate(date)).toBe('15.01.2024');
});

test('pads single digit day and month with zeros', () => {
  const date = '2024-01-05';
  expect(formatDate(date)).toBe('05.01.2024');

  const date2 = '2024-09-07';
  expect(formatDate(date2)).toBe('07.09.2024');
});

test('handles different month values', () => {
  const dates = [
    {input: '2024-01-15', expected: '15.01.2024'},
    {input: '2024-12-15', expected: '15.12.2024'},
    {input: '2024-06-15', expected: '15.06.2024'},
  ];

  dates.forEach(({input, expected}) => {
    expect(formatDate(input)).toBe(expected);
  });
});

test('handles different year values', () => {
  const dates = [
    {input: '2024-01-15', expected: '15.01.2024'},
    {input: '2025-01-15', expected: '15.01.2025'},
    {input: '1999-01-15', expected: '15.01.1999'},
  ];

  dates.forEach(({input, expected}) => {
    expect(formatDate(input)).toBe(expected);
  });
});

test('handles date object input', () => {
  const date = new Date('2024-01-15');
  expect(formatDate(date)).toBe('15.01.2024');
});
