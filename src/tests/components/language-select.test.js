import {expect, test, beforeEach, vi} from 'vitest';
import {LanguageSelect} from '@/components/language-select';

let testElement;
const TEST_ELEMENT_NAME = 'test-language-select-' + Math.random().toString(36).substr(2, 9);

// Mock localization functions
vi.mock('@/localization', () => ({
  getLocale: vi.fn(() => 'en-EN'),
  setLocale: vi.fn(),
}));

beforeEach(() => {
  // Register with a unique name to avoid conflicts
  if (!customElements.get(TEST_ELEMENT_NAME)) {
    customElements.define(TEST_ELEMENT_NAME, class extends LanguageSelect {});
  }
  // Reset mocks
  vi.clearAllMocks();
});

test('initializes with default properties', () => {
  testElement = document.createElement(TEST_ELEMENT_NAME);
  expect(testElement.selectedLanguage).toBe('en-EN');
  expect(testElement.languages).toEqual([
    {
      code: 'en-EN',
      flag: 'https://flagcdn.com/w40/gb.png',
      flagCode: 'gb',
    },
    {
      code: 'tr-TR',
      flag: 'https://flagcdn.com/w40/tr.png',
      flagCode: 'tr',
    },
  ]);
});

test('renders current language flag', async () => {
  testElement = document.createElement(TEST_ELEMENT_NAME);
  document.body.appendChild(testElement);
  await testElement.updateComplete;

  const flagImg = testElement.shadowRoot.querySelector('.language-flag img');
  expect(flagImg.src).toBe('https://flagcdn.com/w40/gb.png');
  expect(flagImg.alt).toBe('GB');

  document.body.removeChild(testElement);
});

test('renders dropdown with all languages', async () => {
  testElement = document.createElement(TEST_ELEMENT_NAME);
  document.body.appendChild(testElement);
  await testElement.updateComplete;

  const dropdownItems = testElement.shadowRoot.querySelectorAll('.dropdown-item');
  expect(dropdownItems.length).toBe(2);

  const flags = Array.from(dropdownItems).map((item) => item.querySelector('img'));
  expect(flags[0].src).toBe('https://flagcdn.com/w40/gb.png');
  expect(flags[1].src).toBe('https://flagcdn.com/w40/tr.png');

  document.body.removeChild(testElement);
});

test('handles language switch', async () => {
  testElement = document.createElement(TEST_ELEMENT_NAME);
  document.body.appendChild(testElement);
  await testElement.updateComplete;

  const turkishOption = testElement.shadowRoot.querySelectorAll('.dropdown-item')[1];
  turkishOption.click();

  expect(testElement.selectedLanguage).toBe('tr-TR');
  const {setLocale} = await import('@/localization');
  expect(setLocale).toHaveBeenCalledWith('tr-TR');

  document.body.removeChild(testElement);
});

test('marks current language as selected in dropdown', async () => {
  testElement = document.createElement(TEST_ELEMENT_NAME);
  document.body.appendChild(testElement);
  await testElement.updateComplete;

  const dropdownItems = testElement.shadowRoot.querySelectorAll('.dropdown-item');
  expect(dropdownItems[0].getAttribute('aria-selected')).toBe('true');
  expect(dropdownItems[1].getAttribute('aria-selected')).toBe('false');

  document.body.removeChild(testElement);
});

test('updates UI when switching language', async () => {
  testElement = document.createElement(TEST_ELEMENT_NAME);
  document.body.appendChild(testElement);
  await testElement.updateComplete;

  const turkishOption = testElement.shadowRoot.querySelectorAll('.dropdown-item')[1];
  turkishOption.click();
  await testElement.updateComplete;

  const dropdownItems = testElement.shadowRoot.querySelectorAll('.dropdown-item');
  expect(dropdownItems[0].getAttribute('aria-selected')).toBe('false');
  expect(dropdownItems[1].getAttribute('aria-selected')).toBe('true');

  document.body.removeChild(testElement);
});

test('maintains accessibility attributes', async () => {
  testElement = document.createElement(TEST_ELEMENT_NAME);
  document.body.appendChild(testElement);
  await testElement.updateComplete;

  const container = testElement.shadowRoot.querySelector('.language-flag');
  expect(container.getAttribute('aria-label')).toBe('Select language');

  const dropdown = testElement.shadowRoot.querySelector('.dropdown');
  expect(dropdown.getAttribute('role')).toBe('listbox');

  const options = testElement.shadowRoot.querySelectorAll('.dropdown-item');
  options.forEach((option) => {
    expect(option.getAttribute('role')).toBe('option');
    expect(option.hasAttribute('aria-selected')).toBe(true);
  });

  document.body.removeChild(testElement);
});
