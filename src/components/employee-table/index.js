import {LitElement, html} from 'lit';
import {formatDate} from '@/utils/dateUtil.js';
import {styles} from './employee-table.styles.js';
import {msg, str, updateWhenLocaleChanges} from '@lit/localize';

export class EmployeeTable extends LitElement {
  static properties = {
    employees: {type: Array},
    selectedEmployees: {type: Array},
    selectAll: {type: Boolean, state: true},
    showModal: {type: Boolean, state: true},
    modalMessage: {type: String, state: true},
  };

  static styles = styles;

  constructor() {
    super();
    this.employees = [];
    this.selectedEmployees = [];
    this.selectAll = false;
    this.showModal = false;
    this.modalMessage = '';
    updateWhenLocaleChanges(this);
  }

  _handleSelectAll(e) {
    const checked = e.target.checked;
    this.selectAll = checked;
    const newSelected = checked ? this.employees.map((emp) => emp.id) : [];
    this._updateSelection(newSelected);
  }

  _updateSelection(newSelected) {
    this.selectedEmployees = newSelected;
    this.dispatchEvent(
      new CustomEvent('selection-change', {
        detail: {selected: newSelected},
      })
    );
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

  _handleRowClick(employeeId) {
    const isSelected = this.selectedEmployees.includes(employeeId);
    const newSelected = isSelected
      ? this.selectedEmployees.filter((id) => id !== employeeId)
      : [employeeId];

    this._updateSelection(newSelected);

    this.selectAll = newSelected.length === this.employees.length;
  }

  _handleActionClick(employeeId) {
    this.selectAll = false;
    this._updateSelection([employeeId]);
  }

  renderTableHeader() {
    return html`
      <thead>
        <tr>
          <th><input type="checkbox" aria-label=${msg('Select all employees')} /></th>
          <th>${msg('First Name')}</th>
          <th>${msg('Last Name')}</th>
          <th>${msg('Date of Employment')}</th>
          <th>${msg('Date of Birth')}</th>
          <th>${msg('Phone')}</th>
          <th>${msg('Email')}</th>
          <th>${msg('Department')}</th>
          <th>${msg('Position')}</th>
          <th>${msg('Actions')}</th>
        </tr>
      </thead>
    `;
  }

  render() {
    return html`
      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>
                <div class="checkbox-wrapper">
                  <input
                    type="checkbox"
                    .checked=${this.selectAll}
                    @change=${this._handleSelectAll}
                    aria-label=${msg('Select all employees')} />
                </div>
              </th>
              <th>${msg('First Name')}</th>
              <th>${msg('Last Name')}</th>
              <th>${msg('Date of Employment')}</th>
              <th>${msg('Date of Birth')}</th>
              <th>${msg('Phone')}</th>
              <th>${msg('Email')}</th>
              <th>${msg('Department')}</th>
              <th>${msg('Position')}</th>
              <th>${msg('Actions')}</th>
            </tr>
          </thead>
          <tbody>
            ${this.employees.length === 0
              ? html`<tr>
                  <td colspan="10">${msg('No employees found')}</td>
                </tr>`
              : this.employees.map(
                  (emp) => html`
                    <tr
                      class="${this.selectedEmployees.includes(emp.id) ? 'selected-row' : ''}"
                      @click=${() => this._handleRowClick(emp.id)}>
                      <td>
                        <div class="checkbox-wrapper">
                          <input
                            type="checkbox"
                            .checked=${this.selectedEmployees.includes(emp.id)}
                            @change=${(e) => e.stopPropagation()}
                            aria-label=${msg(str`Select ${emp.firstName} ${emp.lastName}`)} />
                        </div>
                      </td>
                      <td>${emp.firstName}</td>
                      <td>${emp.lastName}</td>
                      <td>${formatDate(emp.employmentDate)}</td>
                      <td>${formatDate(emp.birthDate)}</td>
                      <td>${emp.phone}</td>
                      <td>${emp.email}</td>
                      <td>${emp.department}</td>
                      <td>${emp.position}</td>
                      <td>
                        <button
                          class="edit-btn"
                          @click=${(e) => {
                            e.stopPropagation();
                            this._handleActionClick(emp.id);
                            this._handleEdit(emp.id);
                          }}
                          aria-label=${msg(str`Edit ${emp.firstName} ${emp.lastName}`)}>
                          <fa-icon icon="fa-regular fa-pen-to-square"></fa-icon>
                        </button>
                        <button
                          class="delete-btn"
                          @click=${(e) => {
                            e.stopPropagation();
                            this._handleActionClick(emp.id);
                            this._handleDelete(emp.id);
                          }}
                          aria-label=${msg(str`Delete ${emp.firstName} ${emp.lastName}`)}>
                          <fa-icon icon="fa-solid fa-trash"></fa-icon>
                        </button>
                      </td>
                    </tr>
                  `
                )}
          </tbody>
        </table>
      </div>
    `;
  }
}
