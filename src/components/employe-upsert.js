import {LitElement, html} from 'lit';
import {employeeStore} from '@/store/app-store';
import {updateWhenLocaleChanges} from '@lit/localize';

export class EmployeeUpsert extends LitElement {
  static properties = {
    employeeId: {type: String},
    employee: {type: Object},
    isEdit: {type: Boolean},
  };

  constructor() {
    super();
    this.employee = {};
    this.isEdit = false;
    updateWhenLocaleChanges(this);
  }

  connectedCallback() {
    super.connectedCallback();
    const path = document.location.pathname;

    if (path.includes('edit')) {
      this.isEdit = true;
      this.employeeId = path.split('edit/')[1];
      const employeeState = employeeStore.getState();
      this.employee = employeeState.employee_list.find((emp) => emp.id === this.employeeId);
    }
  }

  render() {
    return html`
      <employee-form .employee=${this.employee} .isEdit=${this.isEdit}> </employee-form>
    `;
  }
}
