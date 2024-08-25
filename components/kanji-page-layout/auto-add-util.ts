import { editKanji, getKanjiById } from "@/utils/kanji-async-storage";
import { changeSetting, getSetting } from "@/utils/settings-async-storage";
import { Kanji } from "@/utils/types";
import { router } from "expo-router";
import { Alert } from "react-native";

const showAlertSetDefault = () => {
  Alert.alert("", "Set as default behavior?", [
    {
      text: "Cancel",
      onPress: () => {
        router.navigate("/");
        return;
      },
      style: "cancel",
    },
    {
      text: "Ok",
      onPress: async () => {
        await changeSetting("autoDictionaryEntryAdd", true);
        router.navigate("/");
        return;
      },
    },
  ]);
};

export const autoAdd = (kanji: Kanji) => {
  kanji.dictionary.forEach(async (entry) => {
    const kanjis = entry.word
      .split("")
      .filter(
        (char) =>
          /[\u4e00-\u9faf]|[\u3400-\u4dbf]/.test(char) && char !== kanji.kanji
      );
    const kanjisFromStorage = (
      await Promise.all(kanjis.map((kan) => getKanjiById(kan)))
    ).filter((kan) => kan?.dictionary.every(({ word }) => word !== entry.word));
    if (kanjisFromStorage.length === 0) {
      router.navigate("/");
      return;
    }

    const autoDictionaryEntryAdd = getSetting("autoDictionaryEntryAdd");
    // omit cases when autoDictionaryEntryAdd.value is undefined
    if (autoDictionaryEntryAdd.value === false) {
      router.navigate("/");
      return;
    }

    kanjisFromStorage.forEach(async (kan) => {
      const message = `The word ${entry.word} has kanji ${kan.kanji}. Do you want to add ${entry.word} as entry in ${kan.kanji} dictionary?`;
      // omit cases when autoDictionaryEntryAdd.value is undefined
      if (autoDictionaryEntryAdd.value === true) {
        await editKanji(kan.id, {
          dictionary: [...kan.dictionary, entry],
        });
      } else
        Alert.alert("", message, [
          {
            text: "Cancel",
            onPress: () => {
              router.navigate("/");
              return;
            },
            style: "cancel",
          },
          {
            text: "Ok",
            onPress: async () => {
              await editKanji(kan.id, {
                dictionary: [...kan.dictionary, entry],
              });
              if (autoDictionaryEntryAdd.value === undefined)
                showAlertSetDefault();
            },
          },
        ]);
    });
  });
};
