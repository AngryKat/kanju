import { Ionicons } from "@expo/vector-icons";
import {
  Link,
  router,
  Stack,
  useNavigation,
  usePathname,
  useSegments,
} from "expo-router";
import {
  useEffect,
  useState,
  useLayoutEffect,
  ComponentProps,
  ReactNode,
} from "react";

const TABS = ["/", "dictionary"];

import { SafeAreaView, Text, Pressable, View } from "react-native";

const Tab = ({
  href,
  iconName,
  title,
  icon,
}: {
  href: string;
  iconName?: ComponentProps<typeof Ionicons>["name"];
  icon?: ReactNode;
  title: string;
}) => {
  const segments = useSegments();
  const [isActive, setIsActive] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsActive(href !== "/" ? pathname.includes(href) : pathname === href);
  }, [pathname, href]);

  const handlePress = () => {
    if (segments[0] === href) return;
    if (router.canDismiss()) {
      router.dismissAll();
    }
    router.replace(href);
  };
  return (
    <Pressable onPress={handlePress}>
      <Text
        style={{
          color: isActive ? "#eb9234" : "#cecece",
          textAlign: "center",
        }}
      >
        {iconName ? <Ionicons name={iconName} size={24} /> : icon}
        {"\n"}
        <Text>{title}</Text>
      </Text>
    </Pressable>
  );
};

export function BottomNavbar() {
  return (
    <SafeAreaView
      style={{
        backgroundColor: "black",
      }}
    >
      <View
        style={{
          paddingTop: 18,
          flexDirection: "row",
          justifyContent: "space-around",
        }}
      >
        <Tab
          href="/"
          icon={<Text style={{ fontSize: 20 }}>漢字</Text>}
          title="Kanjis"
        />
        <Tab
          href="dictionary"
          iconName="book-sharp"
          // icon={<Text style={{ fontSize: 20 }}>辞書</Text>}
          title="Dictionary"
        />
        <Tab
          href="decks"
          iconName="albums-sharp"
          // icon={<Text style={{ fontSize: 20 }}>辞書</Text>}
          title="Decks"
        />
        <Tab
          href="settings"
          iconName="settings-sharp"
          // icon={<Text style={{ fontSize: 20 }}>辞書</Text>}
          title="Settings"
        />
      </View>
    </SafeAreaView>
  );
}
