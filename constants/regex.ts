export const regex_kanji = /[\u4E00-\u9FAF]$/; // rare and common kanjis
export const regex_kanji_global = /[一-龯]/g; // rare and common kanjis
export const regex_hiragana_katakana =
  /^[\u3040-\u309F\u30A0-\u30FF\s,;\u3000\u3001\u3002]+$/;
export const regex_readings_dividers = /[\s,;\u3000\u3001\u3002]+/; // u3000 is a special white space u3001 is a "、" u3002 is a "。"
