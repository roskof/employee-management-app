import {expect, test, beforeEach, vi} from 'vitest';
import {EmployeePage} from '@/pages/employee-page';
import {Router} from '@vaadin/router';

let testElement;
const TEST_ELEMENT_NAME = 'test-employee-page-' + Math.random().toString(36).substr(2, 9);

// Mock Router
vi.mock('@vaadin/router', () => ({
  Router: {
    go: vi.fn(),
  },
}));

// Mock store functions
const mockRemoveEmployee = vi.fn();
const mockChangeViewMode = vi.fn();

// Mock employee store
vi.mock('@/store/app-store', () => ({
  employeeStore: {
    getState: vi.fn(() => ({
      employee_list: [
        {
          id: '1',
          firstName: 'Gürkan',
          lastName: 'Çintesun',
          email: 'gurkancintesun@hotmail.com',
          department: 'Tech',
          position: 'Senior',
        },
        {
          id: '2',
          firstName: 'Jane',
          lastName: 'Smith',
          email: 'jane@example.com',
          department: 'HR',
          position: 'Manager',
        },
      ],
      viewMode: 'table-view',
      removeEmployee: mockRemoveEmployee,
      changeViewMode: mockChangeViewMode,
    })),
    subscribe: vi.fn(),
  },
}));

beforeEach(() => {
  // Register with a unique name to avoid conflicts
  if (!customElements.get(TEST_ELEMENT_NAME)) {
    customElements.define(TEST_ELEMENT_NAME, class extends EmployeePage {});
  }
  // Reset mocks
  vi.clearAllMocks();
});

test('initializes with default properties', () => {
  testElement = document.createElement(TEST_ELEMENT_NAME);
  expect(testElement.currentPage).toBe(1);
  expect(testElement.itemsPerPage).toBe(10);
  expect(testElement.selectedEmployees).toEqual([]);
  expect(testElement.selectedEmployeeId).toBe('');
  expect(testElement.viewMode).toBe('table-view');
  expect(testElement.showModal).toBe(false);
  expect(testElement.modalMessage).toBe('');
});

test('subscribes to store updates on connect', async () => {
  testElement = document.createElement(TEST_ELEMENT_NAME);
  document.body.appendChild(testElement);
  await testElement.updateComplete;

  const {employeeStore} = await import('@/store/app-store');
  expect(employeeStore.subscribe).toHaveBeenCalled();

  document.body.removeChild(testElement);
});

test('handles add employee navigation', async () => {
  testElement = document.createElement(TEST_ELEMENT_NAME);
  document.body.appendChild(testElement);
  await testElement.updateComplete;

  const header = testElement.shadowRoot.querySelector('app-header');
  header.dispatchEvent(new CustomEvent('add-employee'));

  expect(Router.go).toHaveBeenCalledWith('/add');

  document.body.removeChild(testElement);
});

test('handles edit employee navigation', async () => {
  testElement = document.createElement(TEST_ELEMENT_NAME);
  document.body.appendChild(testElement);
  await testElement.updateComplete;

  const employeeTable = testElement.shadowRoot.querySelector('employee-table');
  employeeTable.dispatchEvent(
    new CustomEvent('edit-employee', {
      detail: {employeeId: '1'},
    })
  );

  expect(Router.go).toHaveBeenCalledWith('/edit/1');

  document.body.removeChild(testElement);
});

test('handles delete employee', async () => {
  testElement = document.createElement(TEST_ELEMENT_NAME);
  document.body.appendChild(testElement);
  await testElement.updateComplete;

  const employeeTable = testElement.shadowRoot.querySelector('employee-table');
  employeeTable.dispatchEvent(
    new CustomEvent('delete-employee', {
      detail: {employeeId: '1'},
    })
  );

  expect(testElement.showModal).toBe(true);
  expect(testElement.modalMessage).toBe('deleted');
  expect(testElement.selectedEmployeeId).toBe('1');

  document.body.removeChild(testElement);
});

test('handles page change', async () => {
  testElement = document.createElement(TEST_ELEMENT_NAME);
  document.body.appendChild(testElement);
  await testElement.updateComplete;

  const pagination = testElement.shadowRoot.querySelector('app-pagination');
  pagination.dispatchEvent(
    new CustomEvent('page-change', {
      detail: {page: 2},
    })
  );

  expect(testElement.currentPage).toBe(2);

  document.body.removeChild(testElement);
});

test('handles view mode change', async () => {
  testElement = document.createElement(TEST_ELEMENT_NAME);
  document.body.appendChild(testElement);
  await testElement.updateComplete;

  const listViewButton = testElement.shadowRoot.querySelector('.view-options button');
  listViewButton.click();

  expect(mockChangeViewMode).toHaveBeenCalledWith('list-view');

  document.body.removeChild(testElement);
});

test('handles employee search', async () => {
  testElement = document.createElement(TEST_ELEMENT_NAME);
  document.body.appendChild(testElement);
  await testElement.updateComplete;

  const header = testElement.shadowRoot.querySelector('app-header');
  header.dispatchEvent(
    new CustomEvent('search-employee', {
      detail: {searchQuery: 'Gürkan'},
    })
  );

  expect(testElement.employees.length).toBe(1);
  expect(testElement.employees[0].firstName).toBe('Gürkan');
  expect(testElement.currentPage).toBe(1);

  document.body.removeChild(testElement);
});

test('handles modal confirmation', async () => {
  testElement = document.createElement(TEST_ELEMENT_NAME);
  testElement.selectedEmployeeId = '1';
  testElement.showModal = true;
  document.body.appendChild(testElement);
  await testElement.updateComplete;

  const modal = testElement.shadowRoot.querySelector('update-delete-modal');
  modal.dispatchEvent(new CustomEvent('confirm'));

  expect(mockRemoveEmployee).toHaveBeenCalledWith('1');
  expect(testElement.showModal).toBe(false);
  expect(testElement.selectedEmployeeId).toBe('');

  document.body.removeChild(testElement);
});

test('handles modal cancellation', async () => {
  testElement = document.createElement(TEST_ELEMENT_NAME);
  testElement.selectedEmployeeId = '1';
  testElement.showModal = true;
  document.body.appendChild(testElement);
  await testElement.updateComplete;

  const modal = testElement.shadowRoot.querySelector('update-delete-modal');
  modal.dispatchEvent(new CustomEvent('cancel'));

  expect(testElement.showModal).toBe(false);
  expect(testElement.selectedEmployeeId).toBe('');

  document.body.removeChild(testElement);
});

test('calculates total pages correctly', () => {
  testElement = document.createElement(TEST_ELEMENT_NAME);
  testElement.employees = Array(25).fill({});
  testElement.itemsPerPage = 10;

  expect(testElement.totalPages).toBe(3);
});

test('paginates employees correctly', () => {
  testElement = document.createElement(TEST_ELEMENT_NAME);
  testElement.employees = Array(25).fill({});
  testElement.itemsPerPage = 10;
  testElement.currentPage = 2;

  const paginatedEmployees = testElement._getPaginatedEmployees();
  expect(paginatedEmployees.length).toBe(10);
});

test('renders correct view mode component', async () => {
  testElement = document.createElement(TEST_ELEMENT_NAME);
  document.body.appendChild(testElement);
  await testElement.updateComplete;

  expect(testElement.shadowRoot.querySelector('employee-table')).toBeTruthy();

  testElement.viewMode = 'list-view';
  await testElement.updateComplete;

  expect(testElement.shadowRoot.querySelector('employee-list')).toBeTruthy();

  document.body.removeChild(testElement);
});
