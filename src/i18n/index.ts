import { ref } from 'vue';
// @ts-ignore
import { createI18n } from "vue-i18n";
import {
  // Languages
  enUS, dateEnUS, //EN  English
  zhTW, dateZhTW, //TW  Chinese (Traditional)
  zhCN, dateZhCN, //CN  Chinese (Simplified)
  plPL, datePlPL, //PL  Polish (Poland)
  ruRU, dateRuRU, //RU  Russian
  deDE, dateDeDE, //DE  German
  frFR, dateFrFR, //FR  French
  trTR, dateTrTR, //TR  Turkish
  thTH, dateThTH, //TH  Thai (Thailand)
  ptBR, datePtBR, //BR Portuguese (Brazil)
  jaJP, dateJaJP, //JP Japanese
  esAR, dateEsAR, //ES Spanish (Argentina)
  itIT, dateItIT, //IT Italiano
  ukUA, dateUkUA, //UK Ukrainian
  koKR, dateKoKR, //KR Korean (South Korea)
  nlNL, dateNlNL, //NL Dutch (Netherlands)
} from 'naive-ui';
import type { NLocale, NDateLocale } from 'naive-ui';

/**
 * ASUSWRT Supported Language List
 * @type {[string]}
 */
type langList =
'EN' | 'TW' | 'CN' | 'CZ' | 'PL' | 'RU' | 'DE' | 'FR' | 'TR' | 'TH' |
'MS' | 'NO' | 'FI' | 'DA' | 'SV' | 'BR' | 'JP' | 'ES' | 'IT' | 'UK' |
'HU' | 'RO' | 'KR' | 'NL' | 'SL';

const uiLocaleList: Partial<{ [Lang in langList]: NLocale }> = {
  'EN': enUS, 'TW': zhTW, 'CN': zhCN, 'PL': plPL, 'RU': ruRU,
  'DE': deDE, 'FR': frFR, 'TR': trTR, 'TH': thTH, 'BR': ptBR,
  'JP': jaJP, 'ES': esAR, 'IT': itIT, 'UK': ukUA, 'KR': koKR,
  'NL': nlNL
}

const uiDateLocaleList: Partial<{ [Lang in langList]: NDateLocale }> = {
  'EN': dateEnUS, 'TW': dateZhTW, 'CN': dateZhCN, 'PL': datePlPL,
  'RU': dateRuRU, 'DE': dateDeDE, 'FR': dateFrFR, 'TR': dateTrTR,
  'TH': dateThTH, 'BR': datePtBR, 'JP': dateJaJP, 'ES': dateEsAR,
  'IT': dateItIT, 'UK': dateUkUA, 'KR': dateKoKR, 'NL': dateNlNL
}

export const uiLocale= ref<NLocale | null | undefined>(null);
export const uiDateLocale = ref<NDateLocale | null | undefined>(null);

async function getAsusWRTLocale() {
  if (import.meta.env.DEV) {
    uiLocale.value = uiLocaleList.EN;
    uiDateLocale.value = uiDateLocaleList.EN;
    return 'EN';
  } else {
    return 'EN';
  }
}

const i18n = createI18n({
  legacy: false,
  locale: await getAsusWRTLocale(),
  fallbackLocale: 'EN',
  messages: {
    'EN': {}, 'TW': {}, 'CN': {}, 'CZ': {},
    'PL': {}, 'RU': {}, 'DE': {}, 'FR': {},
    'TH': {}, 'MS': {}, 'NO': {}, 'FI': {},
    'DA': {}, 'SV': {}, 'BR': {}, 'JP': {},
    'ES': {}, 'IT': {}, 'UK': {}, 'HU': {},
    'RO': {}, 'KR': {}, 'NL': {}, 'SL': {}
  }
});

export default i18n;