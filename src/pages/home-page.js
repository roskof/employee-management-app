import {LitElement, html, css} from 'lit';
import {Router} from '@vaadin/router';
import {updateWhenLocaleChanges} from '@lit/localize';

export class Home extends LitElement {
  static styles = css`
    :host {
      display: block;
      font-family: Arial, sans-serif;
      color: #333;
    }

    .outlet {
      padding: 20px;
      background-color: #f0f0f0;
      height: 100%;
    }
  `;

  firstUpdated() {
    const router = new Router(this.renderRoot.querySelector('.outlet'));
    router.setRoutes([
      {path: '/', component: 'employee-page'},
      {path: '/add', component: 'employee-upsert'},
      {path: '/edit/:id', component: 'employee-upsert'},
    ]);
  }

  constructor() {
    super();
    updateWhenLocaleChanges(this);
  }

  render() {
    return html` <div class="outlet"></div> `;
  }
}
