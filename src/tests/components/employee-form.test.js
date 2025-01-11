import {expect, test, beforeEach, vi} from 'vitest';
import {EmployeeForm} from '@/components/employee-form';
import {employeeStore} from '@/store/app-store';

let testElement;
const TEST_ELEMENT_NAME = 'test-employee-form-' + Math.random().toString(36).substr(2, 9);

// Mock Router
vi.mock('@vaadin/router', () => ({
  Router: {
    go: vi.fn(),
  },
}));

// Mock employee store
vi.mock('@/store/app-store', () => ({
  employeeStore: {
    getState: vi.fn(() => ({
      employee_list: [],
      addEmployee: vi.fn(),
      editEmployee: vi.fn(),
    })),
  },
}));

beforeEach(() => {
  // Register with a unique name to avoid conflicts
  if (!customElements.get(TEST_ELEMENT_NAME)) {
    customElements.define(TEST_ELEMENT_NAME, class extends EmployeeForm {});
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
  expect(testElement.isEdit).toBe(false);
  expect(testElement.showModal).toBe(false);
  expect(testElement.modalMessage).toBe('');
  expect(testElement.errors).toEqual({});
});

test('validates required fields', async () => {
  testElement = document.createElement(TEST_ELEMENT_NAME);
  document.body.appendChild(testElement);
  await testElement.updateComplete;

  testElement.handleSave();

  expect(Object.keys(testElement.errors)).toContain('firstName');
  expect(Object.keys(testElement.errors)).toContain('lastName');
  expect(Object.keys(testElement.errors)).toContain('email');
  expect(Object.keys(testElement.errors)).toContain('phone');

  document.body.removeChild(testElement);
});

test('validates email format', async () => {
  testElement = document.createElement(TEST_ELEMENT_NAME);
  document.body.appendChild(testElement);
  await testElement.updateComplete;

  testElement.employee = {
    ...testElement.employee,
    email: 'invalid-email',
  };

  testElement.validateForm();
  expect(testElement.errors.email).toBeTruthy();

  testElement.employee.email = 'valid@email.com';
  testElement.validateForm();
  expect(testElement.errors.email).toBeFalsy();

  document.body.removeChild(testElement);
});

test('validates phone number format', async () => {
  testElement = document.createElement(TEST_ELEMENT_NAME);
  document.body.appendChild(testElement);
  await testElement.updateComplete;

  testElement.employee = {
    ...testElement.employee,
    phone: '12345',
  };

  testElement.validateForm();
  expect(testElement.errors.phone).toBeTruthy();

  testElement.employee.phone = '+905321234567';
  testElement.validateForm();
  expect(testElement.errors.phone).toBeFalsy();

  document.body.removeChild(testElement);
});

test('validates birth date age restrictions', async () => {
  testElement = document.createElement(TEST_ELEMENT_NAME);
  document.body.appendChild(testElement);
  await testElement.updateComplete;

  const today = new Date();
  const tooYoung = new Date(today.getFullYear() - 17, today.getMonth(), today.getDate());
  const validAge = new Date(today.getFullYear() - 30, today.getMonth(), today.getDate());

  testElement.employee = {
    ...testElement.employee,
    birthDate: tooYoung.toISOString().split('T')[0],
  };

  testElement.validateForm();
  expect(testElement.errors.birthDate).toBeTruthy();

  testElement.employee.birthDate = validAge.toISOString().split('T')[0];
  testElement.validateForm();
  expect(testElement.errors.birthDate).toBeFalsy();

  document.body.removeChild(testElement);
});

test('validates employment date', async () => {
  testElement = document.createElement(TEST_ELEMENT_NAME);
  document.body.appendChild(testElement);
  await testElement.updateComplete;

  const future = new Date();
  future.setFullYear(future.getFullYear() + 1);

  testElement.employee = {
    ...testElement.employee,
    employmentDate: future.toISOString().split('T')[0],
  };

  testElement.validateForm();
  expect(testElement.errors.employmentDate).toBeTruthy();

  const past = new Date();
  past.setFullYear(past.getFullYear() - 1);
  testElement.employee.employmentDate = past.toISOString().split('T')[0];
  testElement.validateForm();
  expect(testElement.errors.employmentDate).toBeFalsy();

  document.body.removeChild(testElement);
});

test('handles field updates', async () => {
  testElement = document.createElement(TEST_ELEMENT_NAME);
  document.body.appendChild(testElement);
  await testElement.updateComplete;

  const event = {target: {value: 'Gürkan'}};
  testElement.updateField('firstName', event);

  expect(testElement.employee.firstName).toBe('Gürkan');
  expect(testElement.errors.firstName).toBe('');

  document.body.removeChild(testElement);
});

test('checks for duplicate email', async () => {
  const existingEmployee = {
    id: 1,
    email: 'existing@example.com',
  };

  employeeStore.getState = vi.fn(() => ({
    employee_list: [existingEmployee],
  }));

  testElement = document.createElement(TEST_ELEMENT_NAME);
  document.body.appendChild(testElement);
  await testElement.updateComplete;

  testElement.employee = {
    ...testElement.employee,
    email: 'existing@example.com',
  };

  testElement.validateForm();
  expect(testElement.errors.email).toBeTruthy();

  document.body.removeChild(testElement);
});

test('checks for duplicate phone', async () => {
  const existingEmployee = {
    id: 1,
    phone: '+905321234567',
  };

  employeeStore.getState = vi.fn(() => ({
    employee_list: [existingEmployee],
  }));

  testElement = document.createElement(TEST_ELEMENT_NAME);
  document.body.appendChild(testElement);
  await testElement.updateComplete;

  testElement.employee = {
    ...testElement.employee,
    phone: '+905321234567',
  };

  testElement.validateForm();
  expect(testElement.errors.phone).toBeTruthy();

  document.body.removeChild(testElement);
});
