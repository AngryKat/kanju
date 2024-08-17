import AsyncStorage from "@react-native-async-storage/async-storage";
import type { Settings } from "./types";

let settings: Settings;

const DEFAULT_SETTINGS: Settings = {
  autoDictionaryEntryAdd: {
    title: 'Auto dictionary entry add',
    value: undefined
  }
}

export async function initSettings() {
  try {
    const storage = await AsyncStorage.getItem("settings");
    settings = JSON.parse(storage ?? '{}');
    if (Object.keys(settings).length === 0) settings = DEFAULT_SETTINGS
  } catch (e) {
    console.error("Could not init settings. ", e);
  }
}

export function getSettings() {
  if (!settings) throw new Error("Settings are not initialized");
  return settings;
}

export async function changeSetting(settingKey: keyof Settings, newValue: any) {
  settings[settingKey].value = newValue;
  await AsyncStorage.setItem("settings", JSON.stringify(settings));
}

export function getSetting(settingKey: keyof Settings) {
  return settings[settingKey]
}
