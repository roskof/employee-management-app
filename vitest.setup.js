import {vi} from 'vitest';

// Mock the @lit/localize functions
vi.mock('@lit/localize', () => ({
  msg: (str) => str,
  str: (strings, ...values) =>
    strings.reduce((result, str, i) => result + str + (values[i] || ''), ''),
  updateWhenLocaleChanges: vi.fn(),
}));

// Mock the fa-icon component
customElements.define(
  'fa-icon',
  class extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({mode: 'open'});
    }
  }
);

// Mock the update-delete-modal component
customElements.define(
  'update-delete-modal',
  class extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({mode: 'open'});
    }
  }
);

// Mock the language-selection component
customElements.define(
  'language-selection',
  class extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({mode: 'open'});
    }
  }
);
