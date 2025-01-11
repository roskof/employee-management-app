import {LitElement, html, css} from 'lit';

export class FaIcon extends LitElement {
  static properties = {
    icon: {type: String},
    color: {type: String},
    size: {type: String},
    font_weight: {type: String},
  };

  static styles = css`
    :host {
      display: inline-block;
    }

    .icon {
      cursor: pointer;
      transition: opacity 0.2s ease;
    }
  `;

  constructor() {
    super();
    this.icon = 'gear';
    this.color = 'currentColor';
    this.size = '1rem';
    this.font_weight = 900;
  }

  connectedCallback() {
    super.connectedCallback();
    this._loadFontAwesome();
  }

  _loadFontAwesome() {
    const href = `https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.2.1/css/all.min.css`;

    if (!document.querySelector(`link[href="${href}"]`)) {
      const linkFontAwesome = document.createElement('link');
      linkFontAwesome.rel = 'stylesheet';
      linkFontAwesome.href = href;
      document.head.append(linkFontAwesome);
    }
  }

  render() {
    return html`
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.2.1/css/all.min.css" />
      <i
        class="${this.icon} icon"
        style="color: ${this.color}; font-size: ${this.size};font-weight: ${this.font_weight};"
        aria-hidden="true"
        @click=${this._handleClick}></i>
    `;
  }

  _handleClick(e) {
    this.dispatchEvent(
      new CustomEvent('clicked', {
        bubbles: true,
        composed: true,
        detail: {originalEvent: e},
      })
    );
  }
}
