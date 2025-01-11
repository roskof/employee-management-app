import {expect, test, beforeEach, vi} from 'vitest';
import {EmployeeList} from '@/components/employee-list';

let testElement;
const TEST_ELEMENT_NAME = 'test-employee-list-' + Math.random().toString(36).substr(2, 9);

// Mock formatDate utility
vi.mock('@/utils/dateUtil.js', () => ({
  formatDate: (date) => date,
}));

beforeEach(() => {
  // Register with a unique name to avoid conflicts
  if (!customElements.get(TEST_ELEMENT_NAME)) {
    customElements.define(TEST_ELEMENT_NAME, class extends EmployeeList {});
  }
  // Reset mocks
  vi.clearAllMocks();
});

test('initializes with default properties', () => {
  testElement = document.createElement(TEST_ELEMENT_NAME);
  expect(testElement.employees).toEqual([]);
  expect(testElement.selectedEmployees).toEqual([]);
});

test('renders no employees message when empty', async () => {
  testElement = document.createElement(TEST_ELEMENT_NAME);
  document.body.appendChild(testElement);
  await testElement.updateComplete;

  const noEmployeesDiv = testElement.shadowRoot.querySelector('.no-employees');
  expect(noEmployeesDiv).toBeTruthy();
  expect(noEmployeesDiv.textContent).toBe('No employees found');

  document.body.removeChild(testElement);
});

test('renders employee list correctly', async () => {
  testElement = document.createElement(TEST_ELEMENT_NAME);
  testElement.employees = [
    {
      id: 1,
      firstName: 'Gürkan',
      lastName: 'Çintesun',
      email: 'gurkancintesun@hotmail.com',
      phone: '+905321234567',
      birthDate: '1990-01-01',
      employmentDate: '2020-01-01',
      department: 'Tech',
      position: 'Senior',
    },
  ];

  document.body.appendChild(testElement);
  await testElement.updateComplete;

  const employeeItem = testElement.shadowRoot.querySelector('.employee-item');
  expect(employeeItem).toBeTruthy();
  expect(employeeItem.textContent).toContain('Gürkan Çintesun');
  expect(employeeItem.textContent).toContain('Senior - Tech');

  document.body.removeChild(testElement);
});

test('handles row selection', async () => {
  testElement = document.createElement(TEST_ELEMENT_NAME);
  const employee = {
    id: 1,
    firstName: 'Gürkan',
    lastName: 'Çintesun',
    email: 'gurkancintesun@hotmail.com',
    phone: '+905321234567',
    birthDate: '1990-01-01',
    employmentDate: '2020-01-01',
    department: 'Tech',
    position: 'Senior',
  };
  testElement.employees = [employee];

  document.body.appendChild(testElement);
  await testElement.updateComplete;

  const selectionSpy = vi.fn();
  testElement.addEventListener('selection-change', selectionSpy);

  const employeeItem = testElement.shadowRoot.querySelector('.employee-item');
  employeeItem.click();

  expect(testElement.selectedEmployees).toEqual([1]);
  expect(selectionSpy).toHaveBeenCalledWith(
    expect.objectContaining({
      detail: {selected: [1]},
    })
  );

  // Click again to deselect
  employeeItem.click();
  expect(testElement.selectedEmployees).toEqual([]);

  document.body.removeChild(testElement);
});

test('handles edit action', async () => {
  testElement = document.createElement(TEST_ELEMENT_NAME);
  testElement.employees = [
    {
      id: 1,
      firstName: 'Gürkan',
      lastName: 'Çintesun',
      email: 'gurkancintesun@hotmail.com',
      phone: '+905321234567',
      birthDate: '1990-01-01',
      employmentDate: '2020-01-01',
      department: 'Tech',
      position: 'Senior',
    },
  ];

  document.body.appendChild(testElement);
  await testElement.updateComplete;

  const editSpy = vi.fn();
  testElement.addEventListener('edit-employee', editSpy);

  const editButton = testElement.shadowRoot.querySelector('.edit-btn');
  editButton.click();

  expect(editSpy).toHaveBeenCalledWith(
    expect.objectContaining({
      detail: {employeeId: 1},
    })
  );

  document.body.removeChild(testElement);
});

test('handles delete action', async () => {
  testElement = document.createElement(TEST_ELEMENT_NAME);
  testElement.employees = [
    {
      id: 1,
      firstName: 'Gürkan',
      lastName: 'Çintesun',
      email: 'gurkancintesun@hotmail.com',
      phone: '+905321234567',
      birthDate: '1990-01-01',
      employmentDate: '2020-01-01',
      department: 'Tech',
      position: 'Senior',
    },
  ];

  document.body.appendChild(testElement);
  await testElement.updateComplete;

  const deleteSpy = vi.fn();
  testElement.addEventListener('delete-employee', deleteSpy);

  const deleteButton = testElement.shadowRoot.querySelector('.delete-btn');
  deleteButton.click();

  expect(deleteSpy).toHaveBeenCalledWith(
    expect.objectContaining({
      detail: {employeeId: 1},
    })
  );

  document.body.removeChild(testElement);
});

test('applies selected class to selected employee', async () => {
  testElement = document.createElement(TEST_ELEMENT_NAME);
  testElement.employees = [
    {
      id: 1,
      firstName: 'Gürkan',
      lastName: 'Çintesun',
      email: 'gurkancintesun@hotmail.com',
      phone: '+905321234567',
      birthDate: '1990-01-01',
      employmentDate: '2020-01-01',
      department: 'Tech',
      position: 'Senior',
    },
  ];
  testElement.selectedEmployees = [1];

  document.body.appendChild(testElement);
  await testElement.updateComplete;

  const employeeItem = testElement.shadowRoot.querySelector('.employee-item');
  expect(employeeItem.classList.contains('selected')).toBe(true);

  document.body.removeChild(testElement);
});
