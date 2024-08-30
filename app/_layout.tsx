import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/useColorScheme";
import { initKanjis } from "@/utils/kanji-async-storage";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { initSettings } from "@/utils/settings-async-storage";
import { initDecks } from "@/utils/decks-async-storage";
import {
  initDictionaryEntries,
  transformDataForEntries,
} from "@/utils/dictionary-entry-async-storage";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();
const init = async () => {
  try {
    await Promise.all([initKanjis(), initDecks(), initDictionaryEntries()]);
    await transformDataForEntries();
    //  await AsyncStorage.clear()
  } catch (e) {
    console.error(e);
  }
};
init();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <GestureHandlerRootView>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen
            name="(tabs)"
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen name="+not-found" />
        </Stack>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
