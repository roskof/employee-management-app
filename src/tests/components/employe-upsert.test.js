import {expect, test, beforeEach, vi} from 'vitest';
import {EmployeeUpsert} from '@/components/employe-upsert';
import {employeeStore} from '@/store/app-store';

let testElement;
const TEST_ELEMENT_NAME = 'test-employee-upsert-' + Math.random().toString(36).substr(2, 9);

// Mock employee store
vi.mock('@/store/app-store', () => ({
  employeeStore: {
    getState: vi.fn(() => ({
      employee_list: [
        {
          id: '123',
          firstName: 'Gürkan',
          lastName: 'Çintesun',
          email: 'gurkancintesun@hotmail.com',
          phone: '+905321234567',
          birthDate: '1990-01-01',
          employmentDate: '2020-01-01',
          department: 'Tech',
          position: 'Senior',
        },
      ],
    })),
  },
}));

beforeEach(() => {
  // Register with a unique name to avoid conflicts
  if (!customElements.get(TEST_ELEMENT_NAME)) {
    customElements.define(
      TEST_ELEMENT_NAME,
      class extends EmployeeUpsert {
        // Override the connectedCallback to use a mock pathname
        connectedCallback() {
          super.connectedCallback();
          const path = this._mockPathname || '/';

          if (path.includes('edit')) {
            this.isEdit = true;
            this.employeeId = path.split('edit/')[1];
            const employeeState = employeeStore.getState();
            this.employee = employeeState.employee_list.find((emp) => emp.id === this.employeeId);
          }
        }

        // Add method to set mock pathname
        setMockPathname(pathname) {
          this._mockPathname = pathname;
        }
      }
    );
  }

  // Reset mocks
  vi.clearAllMocks();
});

test('initializes with default properties', () => {
  testElement = document.createElement(TEST_ELEMENT_NAME);
  expect(testElement.employee).toEqual({});
  expect(testElement.isEdit).toBe(false);
  expect(testElement.employeeId).toBeUndefined();
});

test('handles create mode correctly', async () => {
  testElement = document.createElement(TEST_ELEMENT_NAME);
  testElement.setMockPathname('/create');
  document.body.appendChild(testElement);
  await testElement.updateComplete;

  const employeeForm = testElement.shadowRoot.querySelector('employee-form');
  expect(employeeForm).toBeTruthy();
  expect(employeeForm.isEdit).toBe(false);
  expect(employeeForm.employee).toEqual({});

  document.body.removeChild(testElement);
});

test('handles edit mode correctly', async () => {
  testElement = document.createElement(TEST_ELEMENT_NAME);
  testElement.setMockPathname('/edit/123');
  document.body.appendChild(testElement);
  await testElement.updateComplete;

  expect(testElement.isEdit).toBe(true);
  expect(testElement.employeeId).toBe('123');
  expect(employeeStore.getState).toHaveBeenCalled();

  const employeeForm = testElement.shadowRoot.querySelector('employee-form');
  expect(employeeForm).toBeTruthy();
  expect(employeeForm.isEdit).toBe(true);
  expect(employeeForm.employee).toEqual(
    expect.objectContaining({
      id: '123',
      firstName: 'Gürkan',
      lastName: 'Çintesun',
    })
  );

  document.body.removeChild(testElement);
});

test('finds correct employee in edit mode', async () => {
  testElement = document.createElement(TEST_ELEMENT_NAME);
  testElement.setMockPathname('/edit/123');
  document.body.appendChild(testElement);
  await testElement.updateComplete;

  expect(testElement.employee).toEqual(
    expect.objectContaining({
      id: '123',
      firstName: 'Gürkan',
      lastName: 'Çintesun',
      email: 'gurkancintesun@hotmail.com',
    })
  );

  document.body.removeChild(testElement);
});

test('handles non-existent employee ID', async () => {
  testElement = document.createElement(TEST_ELEMENT_NAME);
  testElement.setMockPathname('/edit/non-existent');
  document.body.appendChild(testElement);
  await testElement.updateComplete;

  expect(testElement.employee).toBeUndefined();

  document.body.removeChild(testElement);
});
