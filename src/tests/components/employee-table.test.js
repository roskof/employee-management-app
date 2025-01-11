import {expect, test, beforeEach, vi} from 'vitest';
import {EmployeeTable} from '@/components/employee-table';

let testElement;
const TEST_ELEMENT_NAME = 'test-employee-table-' + Math.random().toString(36).substr(2, 9);

// Mock formatDate utility
vi.mock('@/utils/dateUtil.js', () => ({
  formatDate: (date) => date,
}));

beforeEach(() => {
  // Register with a unique name to avoid conflicts
  if (!customElements.get(TEST_ELEMENT_NAME)) {
    customElements.define(TEST_ELEMENT_NAME, class extends EmployeeTable {});
  }
  // Reset mocks
  vi.clearAllMocks();
});

test('initializes with default properties', () => {
  testElement = document.createElement(TEST_ELEMENT_NAME);
  expect(testElement.employees).toEqual([]);
  expect(testElement.selectedEmployees).toEqual([]);
  expect(testElement.selectAll).toBe(false);
  expect(testElement.showModal).toBe(false);
  expect(testElement.modalMessage).toBe('');
});

test('renders empty table message', async () => {
  testElement = document.createElement(TEST_ELEMENT_NAME);
  document.body.appendChild(testElement);
  await testElement.updateComplete;

  const emptyMessage = testElement.shadowRoot.querySelector('tbody tr td');
  expect(emptyMessage.getAttribute('colspan')).toBe('10');
  expect(emptyMessage.textContent).toBe('No employees found');

  document.body.removeChild(testElement);
});

test('renders employee data correctly', async () => {
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

  const row = testElement.shadowRoot.querySelector('tbody tr');
  const cells = row.querySelectorAll('td');

  expect(cells[1].textContent).toBe('Gürkan');
  expect(cells[2].textContent).toBe('Çintesun');
  expect(cells[5].textContent).toBe('+905321234567');
  expect(cells[6].textContent).toBe('gurkancintesun@hotmail.com');
  expect(cells[7].textContent).toBe('Tech');
  expect(cells[8].textContent).toBe('Senior');

  document.body.removeChild(testElement);
});

test('handles select all checkbox', async () => {
  testElement = document.createElement(TEST_ELEMENT_NAME);
  testElement.employees = [
    {id: 1, firstName: 'Gürkan', lastName: 'Çintesun'},
    {id: 2, firstName: 'Jane', lastName: 'Smith'},
  ];

  document.body.appendChild(testElement);
  await testElement.updateComplete;

  const selectionSpy = vi.fn();
  testElement.addEventListener('selection-change', selectionSpy);

  const selectAllCheckbox = testElement.shadowRoot.querySelector('thead input[type="checkbox"]');
  selectAllCheckbox.checked = true;
  selectAllCheckbox.dispatchEvent(new Event('change'));

  expect(testElement.selectAll).toBe(true);
  expect(testElement.selectedEmployees).toEqual([1, 2]);
  expect(selectionSpy).toHaveBeenCalledWith(
    expect.objectContaining({
      detail: {selected: [1, 2]},
    })
  );

  // Unselect all
  selectAllCheckbox.checked = false;
  selectAllCheckbox.dispatchEvent(new Event('change'));

  expect(testElement.selectAll).toBe(false);
  expect(testElement.selectedEmployees).toEqual([]);

  document.body.removeChild(testElement);
});

test('handles row selection', async () => {
  testElement = document.createElement(TEST_ELEMENT_NAME);
  testElement.employees = [
    {id: 1, firstName: 'Gürkan', lastName: 'Çintesun'},
    {id: 2, firstName: 'Jane', lastName: 'Smith'},
  ];

  document.body.appendChild(testElement);
  await testElement.updateComplete;

  const selectionSpy = vi.fn();
  testElement.addEventListener('selection-change', selectionSpy);

  const firstRow = testElement.shadowRoot.querySelector('tbody tr');
  firstRow.click();

  expect(testElement.selectedEmployees).toEqual([1]);
  expect(firstRow.classList.contains('selected-row')).toBe(false);
  expect(selectionSpy).toHaveBeenCalledWith(
    expect.objectContaining({
      detail: {selected: [1]},
    })
  );

  // Click again to deselect
  firstRow.click();
  expect(testElement.selectedEmployees).toEqual([]);
  expect(firstRow.classList.contains('selected-row')).toBe(false);

  document.body.removeChild(testElement);
});

test('handles edit action', async () => {
  testElement = document.createElement(TEST_ELEMENT_NAME);
  testElement.employees = [
    {
      id: 1,
      firstName: 'Gürkan',
      lastName: 'Çintesun',
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
  expect(testElement.selectedEmployees).toEqual([1]);

  document.body.removeChild(testElement);
});

test('handles delete action', async () => {
  testElement = document.createElement(TEST_ELEMENT_NAME);
  testElement.employees = [
    {
      id: 1,
      firstName: 'Gürkan',
      lastName: 'Çintesun',
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
  expect(testElement.selectedEmployees).toEqual([1]);

  document.body.removeChild(testElement);
});

test('prevents event propagation on checkbox click', async () => {
  testElement = document.createElement(TEST_ELEMENT_NAME);
  testElement.employees = [
    {
      id: 1,
      firstName: 'Gürkan',
      lastName: 'Çintesun',
    },
  ];

  document.body.appendChild(testElement);
  await testElement.updateComplete;

  const checkbox = testElement.shadowRoot.querySelector('tbody input[type="checkbox"]');
  const event = new Event('change', {bubbles: true});
  const stopPropagationSpy = vi.spyOn(event, 'stopPropagation');

  checkbox.dispatchEvent(event);

  expect(stopPropagationSpy).toHaveBeenCalled();

  document.body.removeChild(testElement);
});
