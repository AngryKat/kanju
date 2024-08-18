import { useNavigation } from "expo-router";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
// Helper function to get the value at a nested path
const getValueAtPath = <T>(obj: T, path: string) => {
  const value = path
    .split(".")
    .reduce((acc, key) => acc && acc[key], obj as any);
  if (Array.isArray(value) && value.length === 0) return "";
  if (Array.isArray(value)) return value[0];
  return value;
};
export const useSearchBar = <T>(
  data: T[],
  byKeys: string[],
  placeholder = "Пошук...",
) => {
  const navigation = useNavigation();
  const [searchText, onChangeSearch] = useState("");
  const [filteredData, setFilteredData] = useState<T[]>(data);
  const filterKeys = useRef(byKeys)

  useEffect(() => {
    if (searchText === "") {
      return setFilteredData(data);
    }

    const filtered = data?.filter((item) => {
      if (typeof item === "string") {
        return item === searchText;
      }
      return filterKeys.current.reduce((acc: boolean, key: string) => {
        return (
          acc ||
          (getValueAtPath(item, key) as string)
            .toLowerCase()
            .includes(searchText.toLowerCase())
        );
      }, false);
    });

    setFilteredData(filtered);
  }, [searchText, data, filterKeys.current]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerSearchBarOptions: {
        placeholder,
        hideWhenScrolling: false,
        onChangeText: (event: { nativeEvent: { text: string } }) =>
          onChangeSearch(event.nativeEvent.text),
      },
    });
  }, [navigation]);

  return filteredData;
};
