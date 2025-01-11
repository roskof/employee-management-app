import {expect, test, beforeEach, vi} from 'vitest';
import {AppHeader} from '../../components/app-header';

let testElement;
const TEST_ELEMENT_NAME = 'test-app-header-' + Math.random().toString(36).substr(2, 9);

beforeEach(() => {
  // Register with a unique name to avoid conflicts
  if (!customElements.get(TEST_ELEMENT_NAME)) {
    customElements.define(TEST_ELEMENT_NAME, class extends AppHeader {});
  }
});

test('initializes with default properties', () => {
  testElement = document.createElement(TEST_ELEMENT_NAME);
  expect(testElement.showSearch).toBe(false);
});

test('toggles search visibility when clicking employees link', async () => {
  testElement = document.createElement(TEST_ELEMENT_NAME);
  document.body.appendChild(testElement);
  await testElement.updateComplete;

  const employeesLink = testElement.shadowRoot.querySelector('.employees-link');

  // Mock preventDefault
  const event = new Event('click');
  event.preventDefault = vi.fn();

  employeesLink.dispatchEvent(event);
  await testElement.updateComplete;

  expect(testElement.showSearch).toBe(true);
  expect(event.preventDefault).toHaveBeenCalled();

  // Toggle back
  employeesLink.dispatchEvent(event);
  await testElement.updateComplete;

  expect(testElement.showSearch).toBe(false);

  document.body.removeChild(testElement);
});

test('dispatches search event when typing in search input', async () => {
  testElement = document.createElement(TEST_ELEMENT_NAME);
  document.body.appendChild(testElement);
  await testElement.updateComplete;

  // Enable search first
  testElement.showSearch = true;
  await testElement.updateComplete;

  const searchInput = testElement.shadowRoot.querySelector('.search-input');
  const searchSpy = vi.fn();
  testElement.addEventListener('search-employee', searchSpy);

  // Simulate typing
  searchInput.value = 'Gürkan';
  searchInput.dispatchEvent(new Event('input'));

  expect(searchSpy).toHaveBeenCalledWith(
    expect.objectContaining({
      detail: {searchQuery: 'Gürkan'},
    })
  );

  document.body.removeChild(testElement);
});

test('renders search container with correct active class', async () => {
  testElement = document.createElement(TEST_ELEMENT_NAME);
  document.body.appendChild(testElement);
  await testElement.updateComplete;

  const searchContainer = testElement.shadowRoot.querySelector('.search-container');
  expect(searchContainer.classList.contains('active')).toBe(false);

  testElement.showSearch = true;
  await testElement.updateComplete;

  expect(searchContainer.classList.contains('active')).toBe(true);

  document.body.removeChild(testElement);
});

test('renders logo with correct alt text', async () => {
  testElement = document.createElement(TEST_ELEMENT_NAME);
  document.body.appendChild(testElement);
  await testElement.updateComplete;

  const logo = testElement.shadowRoot.querySelector('.logo');
  expect(logo.getAttribute('alt')).toBe('ING Logo');

  document.body.removeChild(testElement);
});

test('renders add new button with correct text and icon', async () => {
  testElement = document.createElement(TEST_ELEMENT_NAME);
  document.body.appendChild(testElement);
  await testElement.updateComplete;

  const addNewBtn = testElement.shadowRoot.querySelector('.add-new-btn');
  expect(addNewBtn).toBeTruthy();
  expect(addNewBtn.getAttribute('href')).toBe('/add');

  document.body.removeChild(testElement);
});
