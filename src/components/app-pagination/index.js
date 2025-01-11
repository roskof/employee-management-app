import {LitElement, html} from 'lit';
import {styles} from './app-pagination.styles';

export class AppPagination extends LitElement {
  static properties = {
    currentPage: {type: Number},
    totalPages: {type: Number},
  };

  static styles = styles;

  constructor() {
    super();
    this.currentPage = 1;
    this.totalPages = 1;
  }

  _handlePageClick(page) {
    if (page !== this.currentPage) {
      this.dispatchEvent(
        new CustomEvent('page-change', {
          detail: {page},
        })
      );
    }
  }

  _renderPageNumbers() {
    const pages = [];
    const showEllipsisStart = this.currentPage > 3;
    const showEllipsisEnd = this.currentPage < this.totalPages - 2;

    if (showEllipsisStart) {
      pages.push(1);
      pages.push('...');
    }

    for (
      let i = Math.max(1, this.currentPage - 1);
      i <= Math.min(this.totalPages, this.currentPage + 1);
      i++
    ) {
      pages.push(i);
    }

    if (showEllipsisEnd) {
      pages.push('...');
      pages.push(this.totalPages);
    }

    return pages.map((page) => {
      if (page === '...') {
        return html`<span class="ellipsis">...</span>`;
      }
      return html`
        <button
          class=${page === this.currentPage ? 'active' : ''}
          @click=${() => this._handlePageClick(page)}>
          ${page}
        </button>
      `;
    });
  }

  render() {
    return html`
      <div class="pagination">
        <button
          @click=${() => this._handlePageClick(this.currentPage - 1)}
          ?disabled=${this.currentPage === 1}>
          <fa-icon icon="fa-solid fa-angle-left"></fa-icon>
        </button>
        ${this._renderPageNumbers()}
        <button
          @click=${() => this._handlePageClick(this.currentPage + 1)}
          ?disabled=${this.currentPage === this.totalPages}>
          <fa-icon icon="fa-solid fa-angle-right"></fa-icon>
        </button>
      </div>
    `;
  }
}
