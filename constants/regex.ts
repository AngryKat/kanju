export const kanji_regex = /[\u4E00-\u9FAF]$/; // rare and common kanjis
export const hiragana_katakana_regex =
  /^[\u3040-\u309F\u30A0-\u30FF\s,;\u3000\u3001\u3002]+$/;
export const readings_dividers_regex = /[\s,;\u3000\u3001\u3002]+/; // u3000 is a special white space u3001 is a "、" u3002 is a "。"
