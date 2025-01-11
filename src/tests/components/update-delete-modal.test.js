import {expect, test, beforeEach, vi} from 'vitest';
import {UpdateDeleteModal} from '@/components/update-delete-modal';

let testElement;
const TEST_ELEMENT_NAME = 'test-update-delete-modal-' + Math.random().toString(36).substr(2, 9);

beforeEach(() => {
  // Register with a unique name to avoid conflicts
  if (!customElements.get(TEST_ELEMENT_NAME)) {
    customElements.define(TEST_ELEMENT_NAME, class extends UpdateDeleteModal {});
  }
  // Reset mocks
  vi.clearAllMocks();
});

test('initializes with default properties', () => {
  testElement = document.createElement(TEST_ELEMENT_NAME);
  expect(testElement.employee).toEqual({
    firstName: '',
    lastName: '',
    employmentDate: '',
    birthDate: '',
    phone: '',
    email: '',
    department: '',
    position: '',
  });
  expect(testElement.msg).toBe('');
});

test('renders modal with employee details', async () => {
  testElement = document.createElement(TEST_ELEMENT_NAME);
  testElement.employee = {
    firstName: 'Gürkan',
    lastName: 'Çintesun',
  };
  testElement.msg = 'updated';

  document.body.appendChild(testElement);
  await testElement.updateComplete;

  const modalBody = testElement.shadowRoot.querySelector('.modal-body');
  expect(modalBody.textContent).toContain('Gürkan');
  expect(modalBody.textContent).toContain('Çintesun');
  expect(modalBody.textContent).toContain('updated');

  document.body.removeChild(testElement);
});

test('emits confirm event when clicking proceed button', async () => {
  testElement = document.createElement(TEST_ELEMENT_NAME);
  document.body.appendChild(testElement);
  await testElement.updateComplete;

  const confirmSpy = vi.fn();
  testElement.addEventListener('confirm', confirmSpy);

  const proceedButton = testElement.shadowRoot.querySelector('.proceed');
  proceedButton.click();

  expect(confirmSpy).toHaveBeenCalled();

  document.body.removeChild(testElement);
});

test('emits cancel event when clicking cancel button', async () => {
  testElement = document.createElement(TEST_ELEMENT_NAME);
  document.body.appendChild(testElement);
  await testElement.updateComplete;

  const cancelSpy = vi.fn();
  testElement.addEventListener('cancel', cancelSpy);

  const cancelButton = testElement.shadowRoot.querySelector('.cancel');
  cancelButton.click();

  expect(cancelSpy).toHaveBeenCalled();

  document.body.removeChild(testElement);
});

test('emits cancel event when clicking cross button', async () => {
  testElement = document.createElement(TEST_ELEMENT_NAME);
  document.body.appendChild(testElement);
  await testElement.updateComplete;

  const cancelSpy = vi.fn();
  testElement.addEventListener('cancel', cancelSpy);

  const crossButton = testElement.shadowRoot.querySelector('.cross');
  crossButton.click();

  expect(cancelSpy).toHaveBeenCalled();

  document.body.removeChild(testElement);
});

test('renders correct button text', async () => {
  testElement = document.createElement(TEST_ELEMENT_NAME);
  document.body.appendChild(testElement);
  await testElement.updateComplete;

  const proceedButton = testElement.shadowRoot.querySelector('.proceed');
  const cancelButton = testElement.shadowRoot.querySelector('.cancel');

  expect(proceedButton.textContent.trim()).toBe('Proceed');
  expect(cancelButton.textContent.trim()).toBe('Cancel');

  document.body.removeChild(testElement);
});

test('maintains accessibility attributes', async () => {
  testElement = document.createElement(TEST_ELEMENT_NAME);
  document.body.appendChild(testElement);
  await testElement.updateComplete;

  const closeButton = testElement.shadowRoot.querySelector('.cross');
  expect(closeButton.getAttribute('aria-label')).toBe('Close modal');

  document.body.removeChild(testElement);
});
