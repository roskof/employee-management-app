import {LitElement, html} from 'lit';
import {employeeStore} from '@/store/app-store';
import {Router} from '@vaadin/router';
import {styles} from './employee-form.styles';
import {msg, str, updateWhenLocaleChanges} from '@lit/localize';

export class EmployeeForm extends LitElement {
  static properties = {
    employee: {type: Object},
    isEdit: {type: Boolean},
    showModal: {type: Boolean},
    modalMessage: {type: String},
    errors: {type: Object},
  };

  constructor() {
    super();
    this.employee = {
      firstName: '',
      lastName: '',
      employmentDate: '',
      birthDate: '',
      phone: '',
      email: '',
      department: '',
      position: '',
    };
    this.isEdit = false;
    this.showModal = false;
    this.modalMessage = '';
    this.errors = {};
    updateWhenLocaleChanges(this);
  }

  static styles = styles;

  validateForm() {
    const errors = {};
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    const phoneRegex = /^\+90[0-9]{10}$/;

    if (!this.employee.firstName.trim()) {
      errors.firstName = msg('First Name is required');
    } else if (this.employee.firstName.length < 2) {
      errors.firstName = msg('First Name must be at least 2 characters');
    }

    if (!this.employee.lastName.trim()) {
      errors.lastName = msg('Last Name is required');
    } else if (this.employee.lastName.length < 2) {
      errors.lastName = msg('Last Name must be at least 2 characters');
    }

    const currentDate = new Date();
    const employmentDate = new Date(this.employee.employmentDate);

    if (!this.employee.employmentDate) {
      errors.employmentDate = msg('Employment Date is required');
    } else if (employmentDate > currentDate) {
      errors.employmentDate = msg('Employment Date cannot be in the future');
    }

    const birthDate = new Date(this.employee.birthDate);
    const minAge = 18;
    const maxAge = 65;

    if (!this.employee.birthDate) {
      errors.birthDate = msg('Birth Date is required');
    } else {
      const age = currentDate.getFullYear() - birthDate.getFullYear();
      if (age < minAge || age > maxAge) {
        errors.birthDate = msg(str`Age must be between ${minAge} and ${maxAge} years`);
      }
      if (birthDate > employmentDate) {
        errors.birthDate = msg('Birth Date must be before Employment Date');
      }
    }

    if (!this.employee.email) {
      errors.email = msg('Email is required');
    } else if (!emailRegex.test(this.employee.email)) {
      errors.email = msg('Please enter a valid email address');
    } else {
      const existingEmployee = employeeStore
        .getState()
        .employee_list.find(
          (emp) => emp.email === this.employee.email && emp.id !== this.employee.id
        );
      if (existingEmployee) {
        errors.email = msg('This email is already registered');
      }
    }

    if (!this.employee.phone) {
      errors.phone = msg('Phone number is required');
    } else if (!phoneRegex.test(this.employee.phone)) {
      errors.phone = msg('Phone number must be in format: +905XXXXXXXXX');
    } else {
      const existingEmployee = employeeStore
        .getState()
        .employee_list.find(
          (emp) => emp.phone === this.employee.phone && emp.id !== this.employee.id
        );
      if (existingEmployee) {
        errors.phone = msg('This phone number is already registered');
      }
    }

    if (!this.employee.department) {
      errors.department = msg('Department is required');
    }

    if (!this.employee.position) {
      errors.position = msg('Position is required');
    }

    this.errors = errors;
    return Object.keys(errors).length === 0;
  }

  openUpdateModal() {
    if (this.validateForm()) {
      this.showModal = true;
      this.modalMessage = msg('updated');
    }
  }

  closeUpdateModal() {
    this.showModal = false;
    this.handleCancel();
  }

  confirmUpdate() {
    employeeStore.getState().editEmployee(this.employee);
    this.closeUpdateModal();
    this.handleCancel();
  }

  updateField(field, event) {
    this.employee = {...this.employee, [field]: event.target.value};
    this.errors = {...this.errors, [field]: ''};
  }

  handleCancel() {
    Router.go('/');
  }

  handleSave() {
    if (this.validateForm()) {
      employeeStore.getState().addEmployee(this.employee);
      this.handleCancel();
    }
  }

  render() {
    return html`
      <div class="form-container">
        <div class="form-group">
          <h2>${this.isEdit ? msg('Edit Employee') : msg('Add New Employee')}</h2>
        </div>
        <div class="form-group">
          <label>${msg('First Name')}:</label>
          <input
            type="text"
            .value=${this.employee.firstName ?? ''}
            @input=${(e) => this.updateField('firstName', e)}
            required
            placeholder=${msg('Please enter first name...')} />
          ${this.errors.firstName ? html`<div class="error">* ${this.errors.firstName}</div>` : ''}
        </div>
        <div class="form-group">
          <label>${msg('Last Name')}:</label>
          <input
            type="text"
            .value=${this.employee.lastName ?? ''}
            @input=${(e) => this.updateField('lastName', e)}
            required
            placeholder=${msg('Please enter last name...')} />
          ${this.errors.lastName ? html`<div class="error">* ${this.errors.lastName}</div>` : ''}
        </div>
        <div class="form-group">
          <label>${msg('Date of Employment')}:</label>
          <input
            type="date"
            .value=${this.employee.employmentDate}
            @input=${(e) => this.updateField('employmentDate', e)}
            required
            placeholder=${msg('Please enter employment date...')} />
          ${this.errors.employmentDate
            ? html`<div class="error">* ${this.errors.employmentDate}</div>`
            : ''}
        </div>

        <div class="form-group">
          <label>${msg('Date of Birth')}:</label>
          <input
            type="date"
            .value=${this.employee.birthDate}
            @input=${(e) => this.updateField('birthDate', e)}
            required
            placeholder=${msg('Please enter birth date...')} />
          ${this.errors.birthDate ? html`<div class="error">* ${this.errors.birthDate}</div>` : ''}
        </div>

        <div class="form-group">
          <label>${msg('Email')}:</label>
          <input
            type="email"
            .value=${this.employee.email ?? ''}
            @input=${(e) => this.updateField('email', e)}
            required
            placeholder=${msg('Please enter email (gurkancintesun@hotmail.com etc.)...')} />
          ${this.errors.email ? html`<div class="error">* ${this.errors.email}</div>` : ''}
        </div>
        <div class="form-group">
          <label>${msg('Phone')}:</label>
          <input
            type="tel"
            .value=${this.employee.phone ?? ''}
            @input=${(e) => this.updateField('phone', e)}
            required
            placeholder=${msg('Please enter phone number (+(90) 532 123 45 67 etc.)...')} />
          ${this.errors.phone ? html`<div class="error">* ${this.errors.phone}</div>` : ''}
        </div>
        <div class="form-group">
          <label>${msg('Department')}:</label>
          <select
            .value=${this.employee.department}
            @change=${(e) => this.updateField('department', e)}
            required>
            <option>${msg('Analytics')}</option>
            <option>${msg('Tech')}</option>
          </select>
          ${this.errors.department
            ? html`<div class="error">* ${this.errors.department}</div>`
            : ''}
        </div>
        <div class="form-group">
          <label>${msg('Position')}:</label>
          <select
            .value=${this.employee.position}
            @change=${(e) => this.updateField('position', e)}
            required>
            <option>${msg('Junior')}</option>
            <option>${msg('Medior')}</option>
            <option>${msg('Senior')}</option>
          </select>
          ${this.errors.position ? html`<div class="error">* ${this.errors.position}</div>` : ''}
        </div>

        <div class="form-actions">
          <button @click=${this.isEdit ? this.openUpdateModal : this.handleSave}>
            ${this.isEdit ? msg('Update') : msg('Add')}
          </button>
          <button class="cancel-button" @click=${this.closeUpdateModal}>${msg('Cancel')}</button>
        </div>

        ${this.showModal
          ? html`
              <update-delete-modal
                .employee="${this.employee}"
                .msg="${this.modalMessage}"
                @cancel="${this.closeUpdateModal}"
                @confirm="${this.confirmUpdate}"></update-delete-modal>
            `
          : ''}
      </div>
    `;
  }
}
