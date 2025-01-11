import {configureLocalization} from '@lit/localize';

export const {getLocale, setLocale} = configureLocalization({
  sourceLocale: 'en-EN',
  targetLocales: ['tr-TR'],
  loadLocale: (locale) => import(`./generated/locales/${locale}.js`),
});
