import {expect, test, beforeEach, vi} from 'vitest';
import {Home} from '@/pages/home-page';
import {Router} from '@vaadin/router';

let testElement;
const TEST_ELEMENT_NAME = 'test-home-' + Math.random().toString(36).substr(2, 9);

// Mock Router
vi.mock('@vaadin/router', () => ({
  Router: class MockRouter {
    constructor(outlet) {
      this.outlet = outlet;
      this.setRoutes = vi.fn();
    }
  },
}));

beforeEach(() => {
  // Register with a unique name to avoid conflicts
  if (!customElements.get(TEST_ELEMENT_NAME)) {
    customElements.define(TEST_ELEMENT_NAME, class extends Home {});
  }
  // Reset mocks
  vi.clearAllMocks();
});

test('initializes router on first update', async () => {
  testElement = document.createElement(TEST_ELEMENT_NAME);
  document.body.appendChild(testElement);
  await testElement.updateComplete;

  const outlet = testElement.shadowRoot.querySelector('.outlet');
  expect(outlet).toBeTruthy();

  const router = new Router(outlet);
  expect(router.outlet).toBe(outlet);

  document.body.removeChild(testElement);
});

test('renders outlet container', async () => {
  testElement = document.createElement(TEST_ELEMENT_NAME);
  document.body.appendChild(testElement);
  await testElement.updateComplete;

  const outlet = testElement.shadowRoot.querySelector('.outlet');
  expect(outlet).toBeTruthy();
  expect(outlet.tagName.toLowerCase()).toBe('div');

  document.body.removeChild(testElement);
});

test('maintains single outlet instance', async () => {
  testElement = document.createElement(TEST_ELEMENT_NAME);
  document.body.appendChild(testElement);
  await testElement.updateComplete;

  const outlets = testElement.shadowRoot.querySelectorAll('.outlet');
  expect(outlets.length).toBe(1);

  document.body.removeChild(testElement);
});
