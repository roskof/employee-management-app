import {LitElement, html} from 'lit';
import {getLocale, setLocale} from '@/localization';
import {updateWhenLocaleChanges} from '@lit/localize';
import {styles} from './language-select.styles';

export class LanguageSelect extends LitElement {
  static styles = styles;

  static properties = {
    selectedLanguage: {type: String},
  };

  constructor() {
    super();
    this.selectedLanguage = 'en-EN';
    this.languages = [
      {
        code: 'en-EN',
        flag: 'https://flagcdn.com/w40/gb.png',
        flagCode: 'gb',
      },
      {
        code: 'tr-TR',
        flag: 'https://flagcdn.com/w40/tr.png',
        flagCode: 'tr',
      },
    ];
  }

  switchLanguage(languageCode) {
    setLocale(languageCode);
    this.selectedLanguage = languageCode;
    updateWhenLocaleChanges(this);
  }

  render() {
    const currentLanguage = this.languages.find((lang) => lang.code === getLocale());

    return html`
      <div class="container">
        <div class="language-flag" aria-label="Select language">
          <img
            src="${currentLanguage?.flag}"
            alt="${currentLanguage?.flagCode.toUpperCase()}"
            class="flag-img" />
        </div>
        <div class="dropdown" role="listbox">
          ${this.languages.map(
            (lang) => html`
              <div
                class="dropdown-item"
                role="option"
                aria-selected=${lang.code === this.selectedLanguage}
                @click=${() => this.switchLanguage(lang.code)}>
                <img src="${lang.flag}" alt="${lang.flagCode.toUpperCase()}" class="flag-img" />
              </div>
            `
          )}
        </div>
      </div>
    `;
  }
}
