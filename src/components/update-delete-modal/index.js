import {LitElement, html} from 'lit';
import {styles} from './update-delete-modal.styles';
import {msg, str, updateWhenLocaleChanges} from '@lit/localize';

export class UpdateDeleteModal extends LitElement {
  static properties = {
    employee: {type: Object},
    msg: {type: String},
  };

  static styles = styles;

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
    this.msg = '';
    updateWhenLocaleChanges(this);
  }

  render() {
    return html`
      <div class="modal">
        <div class="modal-header">
          <h3>${msg('Are you sure?')}</h3>
          <button class="cross" @click="${this._cancel}" aria-label=${msg('Close modal')}>
            <fa-icon icon="fa-solid fa-xmark"></fa-icon>
          </button>
        </div>
        <div class="modal-body">
          ${msg(
            str`Selected Employee record of ${this.employee?.firstName} ${this.employee?.lastName} will be ${this.msg}`
          )}
        </div>
        <div class="modal-footer">
          <button class="btn proceed" @click="${this._confirm}">${msg('Proceed')}</button>
          <button class="btn cancel" @click="${this._cancel}">${msg('Cancel')}</button>
        </div>
      </div>
    `;
  }

  _confirm() {
    this.dispatchEvent(new CustomEvent('confirm'));
  }

  _cancel() {
    this.dispatchEvent(new CustomEvent('cancel'));
  }
}
