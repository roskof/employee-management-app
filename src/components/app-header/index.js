import {LitElement, html} from 'lit';
import {styles} from './app-header.styles';
import {msg, updateWhenLocaleChanges} from '@lit/localize';

export class AppHeader extends LitElement {
  static styles = styles;

  static properties = {
    currentPageName: {type: String},
    additionalLinks: {type: Array},
    showSearch: {type: Boolean},
  };

  constructor() {
    super();
    this.showSearch = false;
    updateWhenLocaleChanges(this);
  }

  _toggleSearch(e) {
    e.preventDefault();
    this.showSearch = !this.showSearch;
  }

  _handleSearch(e) {
    const searchQuery = e.target.value;
    this.dispatchEvent(
      new CustomEvent('search-employee', {
        detail: {searchQuery},
        bubbles: true,
        composed: true,
      })
    );
  }

  render() {
    return html`
      <header class="header">
        <div class="left-section">
          <img src="/ing_logo.jpg" alt=${msg('ING Logo')} class="logo" />
          <span class="title">ING</span>
        </div>

        <div class="right-section">
          <a class="employees-link" @click=${this._toggleSearch}>
            <fa-icon icon="fa-solid fa-user"></fa-icon>
            ${msg('Employees')}
          </a>
          <div class="search-container ${this.showSearch ? 'active' : ''}">
            <input
              type="text"
              class="search-input"
              placeholder=${msg('Search employees...')}
              @input=${this._handleSearch}
              @keyup=${this._handleSearch} />
          </div>
          <a href="/add" class="add-new-btn">
            <fa-icon icon="fa-solid fa-plus"></fa-icon>
            ${msg('Add New')}
          </a>

          <language-selection></language-selection>
        </div>
      </header>
    `;
  }
}
