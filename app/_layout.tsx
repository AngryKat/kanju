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
import { BottomNavbar } from "@/components/bottom-navbar";
import { initSettings } from "@/utils/settings-async-storage";
import { initDecks } from "@/utils/decks-async-storage";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

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

  useEffect(() => {
    const init = async () => {
      await initKanjis();
      await initSettings();
      await initDecks();
    };
    init();
  }, [initKanjis, initSettings]);

  if (!loaded) {
    return null;
  }

  return (
    <GestureHandlerRootView>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen
            name="index"
            options={{
              title: "Kanji",
            }}
          />
          <Stack.Screen
            name="add-kanji"
            options={{
              title: "Add new kanji",
            }}
          />
          <Stack.Screen
            name="dictionary"
            options={{
              title: "Dictionary",
            }}
          />
          <Stack.Screen
            name="settings"
            options={{
              title: "Settings",
            }}
          />
          <Stack.Screen
            name="[kanjiId]/index"
            options={{
              title: "",
            }}
          />
          <Stack.Screen
            name="[kanjiId]/edit"
            options={{
              title: "",
            }}
          />
          <Stack.Screen
            name="add-deck"
            options={{
              title: "",
            }}
          />
          <Stack.Screen
            name="decks"
            options={{
              title: "",
            }}
          />
          <Stack.Screen
            name="select-deck-kanjis"
            options={{
              title: "",
            }}
          />
          <Stack.Screen name="+not-found" />
        </Stack>
        <BottomNavbar />
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
