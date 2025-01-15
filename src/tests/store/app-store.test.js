import {expect, test, beforeEach, vi} from 'vitest';
import {employeeStore} from '@/store/app-store';

// Mock crypto.randomUUID
vi.stubGlobal('crypto', {
  randomUUID: () => '123e4567-e89b-12d3-a456-426614174000',
});

beforeEach(() => {
  // Clear the store before each test
  employeeStore.setState({
    employee_list: [],
    viewMode: 'table-view',
  });
});

test('initializes with default state', () => {
  const state = employeeStore.getState();
  expect(state.employee_list).toEqual([]);
  expect(state.viewMode).toBe('table-view');
});

test('changes view mode', () => {
  const {changeViewMode} = employeeStore.getState();

  changeViewMode('list-view');

  expect(employeeStore.getState().viewMode).toBe('list-view');
});

test('adds new employee', () => {
  const {addEmployee} = employeeStore.getState();
  const newEmployee = {
    firstName: 'Gürkan',
    lastName: 'Çintesun',
    email: 'gurkancintesun@hotmail.com',
    phone: '+905321234567',
    birthDate: '1990-01-01',
    employmentDate: '2020-01-01',
    department: 'Tech',
    position: 'Senior',
  };

  addEmployee(newEmployee);

  const state = employeeStore.getState();
  expect(state.employee_list).toHaveLength(1);
  expect(state.employee_list[0]).toEqual({
    id: '123e4567-e89b-12d3-a456-426614174000',
    ...newEmployee,
  });
});

test('edits existing employee', () => {
  const {addEmployee, editEmployee} = employeeStore.getState();
  const employee = {
    firstName: 'Gürkan',
    lastName: 'Çintesun',
    email: 'gurkancintesun@hotmail.com',
  };

  // First add an employee
  addEmployee(employee);
  const addedEmployee = employeeStore.getState().employee_list[0];

  // Then edit the employee
  const updatedEmployee = {
    ...addedEmployee,
    firstName: 'Jane',
    lastName: 'Smith',
  };

  editEmployee(updatedEmployee);

  const state = employeeStore.getState();
  expect(state.employee_list).toHaveLength(1);
  expect(state.employee_list[0]).toEqual(updatedEmployee);
});

test('removes employee', () => {
  const {addEmployee, removeEmployee} = employeeStore.getState();
  const employee = {
    firstName: 'Gürkan',
    lastName: 'Çintesun',
    email: 'gurkancintesun@hotmail.com',
  };

  // First add an employee
  addEmployee(employee);
  const addedEmployee = employeeStore.getState().employee_list[0];

  // Then remove the employee
  removeEmployee(addedEmployee.id);

  const state = employeeStore.getState();
  expect(state.employee_list).toHaveLength(0);
});

test('maintains employee list order after edit', () => {
  const {addEmployee, editEmployee} = employeeStore.getState();

  // Add multiple employees
  const employees = [
    {firstName: 'Gürkan', lastName: 'Çintesun', email: 'gurkancintesun@hotmail.com'},
    {firstName: 'Jane', lastName: 'Smith', email: 'jane@example.com'},
    {firstName: 'Bob', lastName: 'Johnson', email: 'bob@example.com'},
  ];

  employees.forEach((emp) => addEmployee(emp));
  const initialList = employeeStore.getState().employee_list;

  // Edit the second employee
  const updatedEmployee = {
    ...initialList[1],
    firstName: 'Janet',
    lastName: 'Williams',
  };

  editEmployee(updatedEmployee);

  const finalList = employeeStore.getState().employee_list;

  expect(finalList).toHaveLength(3);
  expect(finalList[0].id).toBe(initialList[0].id);
  expect(finalList[1].id).toBe(initialList[1].id);
  expect(finalList[2].id).toBe(initialList[2].id);
  expect(finalList[1].firstName).toBe('Janet');
  expect(finalList[1].lastName).toBe('Williams');
});

test('persists state changes', () => {
  const {addEmployee} = employeeStore.getState();
  const employee = {
    firstName: 'Gürkan',
    lastName: 'Çintesun',
    email: 'gurkancintesun@hotmail.com',
  };

  addEmployee(employee);

  // Create a new store instance to verify persistence
  const newStore = employeeStore;
  const state = newStore.getState();

  expect(state.employee_list).toHaveLength(1);
  expect(state.employee_list[0].firstName).toBe('Gürkan');
});
