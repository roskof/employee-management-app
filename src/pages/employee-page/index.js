import {LitElement, html} from 'lit';
import {Router} from '@vaadin/router';
import {employeeStore} from '@/store/app-store.js';
import {styles} from './employee-page.styles';
import {updateWhenLocaleChanges} from '@lit/localize';

export class EmployeePage extends LitElement {
  static properties = {
    employees: {type: Array},
    currentPage: {type: Number},
    itemsPerPage: {type: Number},
    selectedEmployees: {type: Array},
    viewMode: {type: String},
    selectedEmployeeId: {type: String},
  };

  static styles = styles;

  constructor() {
    super();
    this.initialProperties();
    updateWhenLocaleChanges(this);
  }

  initialProperties() {
    this.employees = employeeStore.getState().employee_list;
    this.currentPage = 1;
    this.itemsPerPage = 10;
    this.selectedEmployees = [];
    this.selectedEmployeeId = '';
    this.viewMode = employeeStore.getState().viewMode;
    this.showModal = false;
    this.modalMessage = '';
    this.handleStoreUpdate = this.handleStoreUpdate.bind(this);
  }

  connectedCallback() {
    super.connectedCallback();
    this.employees = employeeStore.getState().employee_list;
    employeeStore.subscribe(this.handleStoreUpdate);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
  }

  handleStoreUpdate(state) {
    this.employees = state.employee_list;
    this.viewMode = state.viewMode;
  }

  get totalPages() {
    return Math.ceil(this.employees?.length / this.itemsPerPage);
  }

  handleNavigation = {
    _handleAddEmployee: () => Router.go('/add'),
    _handleEditEmployee: (e) => {
      const {employeeId} = e.detail;
      Router.go(`/edit/${employeeId}`);
    },
    _handleDeleteEmployee: (e) => {
      const {employeeId} = e.detail;
      employeeStore.getState().removeEmployee(employeeId);
    },
    _handlePageChange: (e) => (this.currentPage = e.detail.page),
    _handleSelectionChange: (e) => (this.selectedEmployees = e.detail.selected),
    _handleViewModeChange: (mode) => {
      employeeStore.getState().changeViewMode(mode);
    },
    _handleSearchEmployee: (e) => {
      const searchQuery = e.detail.searchQuery;

      const allEmployees = employeeStore.getState().employee_list;

      if (searchQuery.trim().length === 0) {
        this.employees = allEmployees;
        return;
      }

      this.employees = allEmployees.filter(
        (emp) =>
          emp.firstName.toLowerCase().includes(searchQuery.trim().toLowerCase()) ||
          emp.lastName.toLowerCase().includes(searchQuery.trim().toLowerCase())
      );
      this.currentPage = 1;
    },
  };

  handleModalActions = {
    openDelete: (e) => {
      console.log('openDelete e=>', e);
      this.selectedEmployeeId = e.detail.employeeId;
      this.showModal = true;
      this.modalMessage = 'deleted';
    },
    close: () => {
      this.selectedEmployeeId = '';
      this.showModal = false;
    },
    confirm: (e) => {
      console.log('confirm e==>', e);
      employeeStore.getState().removeEmployee(this.selectedEmployeeId);
      if (this.totalPages < this.currentPage) {
        this.currentPage--;
      }
      this.handleModalActions.close();
    },
  };

  _getPaginatedEmployees() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.employees.slice(start, end);
  }

  _renderViewMode() {
    return this.viewMode === 'table-view'
      ? html`<employee-table
          .employees=${this._getPaginatedEmployees()}
          .selectedEmployees=${this.selectedEmployees}
          @selection-change=${this.handleNavigation._handleSelectionChange}
          @delete-employee=${this.handleModalActions.openDelete}
          @edit-employee=${this.handleNavigation._handleEditEmployee}>
        </employee-table>`
      : html`<employee-list
          .employees=${this._getPaginatedEmployees()}
          .selectedEmployees=${this.selectedEmployees}
          @selection-change=${this.handleNavigation._handleSelectionChange}
          @delete-employee=${this.handleModalActions.openDelete}
          @edit-employee=${this.handleNavigation._handleEditEmployee}>
        </employee-list>`;
  }

  render() {
    return html`
      <div class="container">
        <app-header
          @add-employee=${this.handleNavigation._handleAddEmployee}
          @search-employee=${this.handleNavigation._handleSearchEmployee}>
        </app-header>

        <div class="content-wrapper">
          <div class="title-bar">
            <h1>Employee List</h1>
            <div class="view-options">
              <button
                class=${this.viewMode === 'list-view' ? 'active' : ''}
                @click=${() => this.handleNavigation._handleViewModeChange('list-view')}>
                <fa-icon icon="fa-solid fa-bars" size="1.5rem"></fa-icon>
              </button>
              <button
                class=${this.viewMode === 'table-view' ? 'active' : ''}
                @click=${() => this.handleNavigation._handleViewModeChange('table-view')}>
                <fa-icon icon="fa-solid fa-table-cells" size="1.5rem"></fa-icon>
              </button>
            </div>
          </div>

          <div class="view-content">${this._renderViewMode()}</div>

          <app-pagination
            .currentPage=${this.currentPage}
            .totalPages=${this.totalPages}
            @page-change=${this.handleNavigation._handlePageChange}>
          </app-pagination>
        </div>

        ${this.showModal
          ? html`
              <update-delete-modal
                .employee=${this.employees.find((e) => e.id === this.selectedEmployeeId)}
                .msg=${this.modalMessage}
                @cancel=${this.handleModalActions.close}
                @confirm=${this.handleModalActions.confirm}>
              </update-delete-modal>
            `
          : ''}
      </div>
    `;
  }
}
