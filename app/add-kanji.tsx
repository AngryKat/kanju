import {
  Image,
  StyleSheet,
  Platform,
  View,
  ScrollView,
  SafeAreaView,
} from "react-native";

import { HelloWave } from "@/components/HelloWave";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { KanjiCard } from "@/components/kanji-card";
import { AddCard } from "@/components/add-card";
import { AddKanjiScreen } from "@/screens/add-kanji";

export default function AddKanjiPage() {
  return (
    <AddKanjiScreen />
  );
}

