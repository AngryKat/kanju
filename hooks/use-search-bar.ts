import { useNavigation } from "expo-router";
import { useEffect, useLayoutEffect, useState } from "react";
import type { SearchBarProps } from "react-native-screens";

export const useSearchBar = <T>(
  data: T[],
  byKeys: string[],
  placeholder = "Пошук...",
  inputType?: SearchBarProps["inputType"]
) => {
  const navigation = useNavigation();
  const [searchText, onChangeSearch] = useState("");
  const [filteredData, setFilteredData] = useState<T[]>(() => data);

  // Helper function to get the value at a nested path
  const getValueAtPath = (obj: T, path: string) => {
    const value = path
      .split(".")
      .reduce((acc, key) => acc && acc[key], obj as any);
    if (Array.isArray(value) && value.length === 0) return "";
    if (Array.isArray(value)) return value[0];
    return value;
  };

  useEffect(() => {
    if (searchText === "") {
      return setFilteredData(data);
    }

    const filtered = data?.filter((item) => {
      if (typeof item === "string") {
        return item === searchText;
      }
      return byKeys.reduce((acc: boolean, key: string) => {
        return (
          acc ||
          (getValueAtPath(item, key) as string)
            .toLowerCase()
            .includes(searchText.toLowerCase())
        );
      }, false);
    });

    setFilteredData(filtered);
  }, [searchText, data]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerSearchBarOptions: {
        placeholder,
        hideWhenScrolling: false,
        cancelButtonText: "Скасувати",
        inputType,
        onChangeText: (event: { nativeEvent: { text: string } }) =>
          onChangeSearch(event.nativeEvent.text),
      },
    });
  }, []);

  return filteredData;
};
