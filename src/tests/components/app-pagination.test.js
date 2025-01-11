import {expect, test, beforeEach, vi} from 'vitest';
import {AppPagination} from '../../components/app-pagination';

let testElement;
const TEST_ELEMENT_NAME = 'test-app-pagination-' + Math.random().toString(36).substr(2, 9);

beforeEach(() => {
  // Register with a unique name to avoid conflicts
  if (!customElements.get(TEST_ELEMENT_NAME)) {
    customElements.define(TEST_ELEMENT_NAME, class extends AppPagination {});
  }
});

test('initializes with default properties', () => {
  testElement = document.createElement(TEST_ELEMENT_NAME);
  expect(testElement.currentPage).toBe(1);
  expect(testElement.totalPages).toBe(1);
});

test('renders correct number of page buttons', async () => {
  testElement = document.createElement(TEST_ELEMENT_NAME);
  testElement.currentPage = 3;
  testElement.totalPages = 10;
  document.body.appendChild(testElement);
  await testElement.updateComplete;

  const buttons = testElement.shadowRoot.querySelectorAll('button:not([disabled])');

  expect(buttons.length).toBe(6);

  document.body.removeChild(testElement);
});

test('handles page click events', async () => {
  testElement = document.createElement(TEST_ELEMENT_NAME);
  testElement.currentPage = 3;
  testElement.totalPages = 5;
  document.body.appendChild(testElement);
  await testElement.updateComplete;

  const pageChangeSpy = vi.fn();
  testElement.addEventListener('page-change', pageChangeSpy);

  const pageButton = testElement.shadowRoot.querySelector('button:not(.active)');
  pageButton.click();

  expect(pageChangeSpy).toHaveBeenCalledWith(
    expect.objectContaining({
      detail: expect.objectContaining({page: expect.any(Number)}),
    })
  );

  document.body.removeChild(testElement);
});

test('disables previous button on first page', async () => {
  testElement = document.createElement(TEST_ELEMENT_NAME);
  testElement.currentPage = 1;
  testElement.totalPages = 5;
  document.body.appendChild(testElement);
  await testElement.updateComplete;

  const prevButton = testElement.shadowRoot.querySelector('button');
  expect(prevButton.disabled).toBe(true);

  document.body.removeChild(testElement);
});

test('disables next button on last page', async () => {
  testElement = document.createElement(TEST_ELEMENT_NAME);
  testElement.currentPage = 5;
  testElement.totalPages = 5;
  document.body.appendChild(testElement);
  await testElement.updateComplete;

  const buttons = testElement.shadowRoot.querySelectorAll('button');
  const nextButton = buttons[buttons.length - 1];
  expect(nextButton.disabled).toBe(true);

  document.body.removeChild(testElement);
});

test('shows ellipsis correctly', async () => {
  testElement = document.createElement(TEST_ELEMENT_NAME);
  testElement.currentPage = 5;
  testElement.totalPages = 10;
  document.body.appendChild(testElement);
  await testElement.updateComplete;

  const ellipsis = testElement.shadowRoot.querySelectorAll('.ellipsis');
  expect(ellipsis.length).toBe(2); // Should show both start and end ellipsis

  document.body.removeChild(testElement);
});

test('highlights current page button', async () => {
  testElement = document.createElement(TEST_ELEMENT_NAME);
  testElement.currentPage = 3;
  testElement.totalPages = 5;
  document.body.appendChild(testElement);
  await testElement.updateComplete;

  const activeButton = testElement.shadowRoot.querySelector('button.active');
  expect(activeButton.textContent.trim()).toBe('3');

  document.body.removeChild(testElement);
});

test('does not emit event when clicking current page', async () => {
  testElement = document.createElement(TEST_ELEMENT_NAME);
  testElement.currentPage = 3;
  testElement.totalPages = 5;
  document.body.appendChild(testElement);
  await testElement.updateComplete;

  const pageChangeSpy = vi.fn();
  testElement.addEventListener('page-change', pageChangeSpy);

  const activeButton = testElement.shadowRoot.querySelector('button.active');
  activeButton.click();

  expect(pageChangeSpy).not.toHaveBeenCalled();

  document.body.removeChild(testElement);
});
