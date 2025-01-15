import {createStore} from 'zustand/vanilla';
import {persist} from 'zustand/middleware';

export const employeeStore = createStore(
  persist(
    (set, get) => ({
      employee_list: [],
      viewMode: 'table-view',
      changeViewMode: (mode) => {
        set({viewMode: mode});
      },
      addEmployee: (employee) => {
        set({
          employee_list: [
            ...get().employee_list,
            {
              id: crypto.randomUUID(),
              ...employee,
            },
          ],
        });
      },
      editEmployee: (employee) => {
        set({
          employee_list: get().employee_list.map((emp) =>
            emp.id === employee.id ? {...employee} : emp
          ),
        });
      },
      removeEmployee: (id) => {
        set({
          employee_list: get().employee_list.filter((emp) => emp.id !== id),
        });
      },
    }),
    {
      name: 'employee_list',
    }
  )
);
