import {expect, test, beforeEach, vi} from 'vitest';
import {FaIcon} from '@/components/custom-icon';

let testElement;
const TEST_ELEMENT_NAME = 'test-fa-icon-' + Math.random().toString(36).substr(2, 9);

beforeEach(() => {
  // Register with a unique name to avoid conflicts
  if (!customElements.get(TEST_ELEMENT_NAME)) {
    customElements.define(TEST_ELEMENT_NAME, class extends FaIcon {});
  }
  // Reset mocks
  vi.clearAllMocks();
});

test('initializes with default properties', () => {
  testElement = document.createElement(TEST_ELEMENT_NAME);
  expect(testElement.icon).toBe('gear');
  expect(testElement.color).toBe('currentColor');
  expect(testElement.size).toBe('1rem');
  expect(testElement.font_weight).toBe(900);
});

test('renders icon with correct properties', async () => {
  testElement = document.createElement(TEST_ELEMENT_NAME);
  testElement.icon = 'fa-solid fa-user';
  testElement.color = '#ff0000';
  testElement.size = '2rem';
  testElement.font_weight = 700;

  document.body.appendChild(testElement);
  await testElement.updateComplete;

  const iconElement = testElement.shadowRoot.querySelector('.icon');
  expect(iconElement.classList.contains('fa-solid')).toBe(true);
  expect(iconElement.classList.contains('fa-user')).toBe(true);
  expect(iconElement.style.color).toBe('rgb(255, 0, 0)');
  expect(iconElement.style.fontSize).toBe('2rem');
  expect(iconElement.style.fontWeight).toBe('700');

  document.body.removeChild(testElement);
});

test('loads FontAwesome stylesheet', async () => {
  testElement = document.createElement(TEST_ELEMENT_NAME);
  document.body.appendChild(testElement);
  await testElement.updateComplete;

  const linkElement = document.querySelector('link[href*="fontawesome-free"]');
  expect(linkElement).toBeTruthy();
  expect(linkElement.rel).toBe('stylesheet');

  document.body.removeChild(testElement);
});

test('emits clicked event when clicking icon', async () => {
  testElement = document.createElement(TEST_ELEMENT_NAME);
  document.body.appendChild(testElement);
  await testElement.updateComplete;

  const clickSpy = vi.fn();
  testElement.addEventListener('clicked', clickSpy);

  const iconElement = testElement.shadowRoot.querySelector('.icon');
  iconElement.click();

  expect(clickSpy).toHaveBeenCalledWith(
    expect.objectContaining({
      detail: expect.objectContaining({
        originalEvent: expect.any(Event),
      }),
    })
  );

  document.body.removeChild(testElement);
});

test('does not load duplicate FontAwesome stylesheet', async () => {
  // Create first instance
  const firstElement = document.createElement(TEST_ELEMENT_NAME);
  document.body.appendChild(firstElement);
  await firstElement.updateComplete;

  // Create second instance
  const secondElement = document.createElement(TEST_ELEMENT_NAME);
  document.body.appendChild(secondElement);
  await secondElement.updateComplete;

  const linkElements = document.querySelectorAll('link[href*="fontawesome-free"]');
  expect(linkElements.length).toBe(1);

  document.body.removeChild(firstElement);
  document.body.removeChild(secondElement);
});

test('maintains accessibility attributes', async () => {
  testElement = document.createElement(TEST_ELEMENT_NAME);
  document.body.appendChild(testElement);
  await testElement.updateComplete;

  const iconElement = testElement.shadowRoot.querySelector('.icon');
  expect(iconElement.getAttribute('aria-hidden')).toBe('true');

  document.body.removeChild(testElement);
});
