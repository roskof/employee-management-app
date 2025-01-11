import {LitElement, html} from 'lit';
import {formatDate} from '@/utils/dateUtil.js';
import {styles} from './employee-list.styles';
import {msg, updateWhenLocaleChanges} from '@lit/localize';

export class EmployeeList extends LitElement {
  static properties = {
    employees: {type: Array},
    selectedEmployees: {type: Array},
  };

  static styles = styles;

  constructor() {
    super();
    this.employees = [];
    this.selectedEmployees = [];
    updateWhenLocaleChanges(this);
  }

  _updateSelection(newSelected) {
    this.selectedEmployees = newSelected;
    this.dispatchEvent(
      new CustomEvent('selection-change', {
        detail: {selected: newSelected},
      })
    );
  }

  _handleRowClick(employeeId) {
    const isSelected = this.selectedEmployees.includes(employeeId);
    const newSelected = isSelected
      ? this.selectedEmployees.filter((id) => id !== employeeId)
      : [employeeId];

    this._updateSelection(newSelected);
  }

  _handleActionClick(employeeId) {
    this._updateSelection([employeeId]);
  }

  _handleEdit(employeeId) {
    this.dispatchEvent(
      new CustomEvent('edit-employee', {
        detail: {employeeId},
      })
    );
  }

  _handleDelete(employeeId) {
    this.dispatchEvent(
      new CustomEvent('delete-employee', {
        detail: {employeeId},
      })
    );
  }

  renderEmployeeItem(employee) {
    return html`
      <div
        class="employee-item ${this.selectedEmployees.includes(employee.id) ? 'selected' : ''}"
        @click=${() => this._handleRowClick(employee.id)}>
        <div class="employee-details">
          <div><strong>${employee.firstName} ${employee.lastName}</strong></div>
          <div>${employee.position} - ${employee.department}</div>
          <div>${msg('Email')}: ${employee.email} | ${msg('Phone')}: ${employee.phone}</div>
          <div>
            ${msg('Date of Birth')}: ${formatDate(employee.birthDate)} |
            ${msg('Date of Employment')}: ${formatDate(employee.employmentDate)}
          </div>
        </div>
        <div class="employee-actions">
          <button
            class="edit-btn"
            @click=${(e) => {
              e.stopPropagation();
              this._handleActionClick(employee.id);
              this._handleEdit(employee.id);
            }}
            aria-label=${msg('Edit employee')}>
            <fa-icon icon="fa-regular fa-pen-to-square"></fa-icon>
          </button>
          <button
            class="delete-btn"
            @click=${(e) => {
              e.stopPropagation();
              this._handleActionClick(employee.id);
              this._handleDelete(employee.id);
            }}
            aria-label=${msg('Delete employee')}>
            <fa-icon icon="fa-solid fa-trash"></fa-icon>
          </button>
        </div>
      </div>
    `;
  }

  render() {
    return html`
      <div class="employee-list">
        ${this.employees.length === 0
          ? html`<div class="no-employees">${msg('No employees found')}</div>`
          : this.employees.map((emp) => this.renderEmployeeItem(emp))}
      </div>
    `;
  }
}
