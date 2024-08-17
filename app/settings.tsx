import { Card } from "@/components/card";
import {
  changeSetting,
  getSettings,
} from "@/utils/settings-async-storage";
import { Settings } from "@/utils/types";
import { useCallback, useEffect, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  Switch,
  Text,
} from "react-native";

const SwitchInput = ({
  initValue,
  onChange,
  title,
}: {
  initValue: any;
  onChange: (value: boolean) => void;
  title: string;
}) => {
  const [value, setValue] = useState<any>(initValue);
  const handleChange = (value: boolean) => {
    onChange(value);
    setValue(value);
  };

  return (
    <Card
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 24,
      }}
    >
      <Text
        style={{
          fontSize: 16,
          color: "#f0f0f0",
        }}
      >
        {title}
      </Text>
      <Switch value={value} onValueChange={handleChange} />
    </Card>
  );
};

export default function DictionaryPage() {
  const [settings, setSettings] = useState<Settings>();
  const updateSettings = useCallback(async () => {
    try {
      const data = await getSettings();
      setSettings(data);
    } catch (e) {
      console.error(e);
    }
  }, []);
  useEffect(() => {
    updateSettings();
  }, [updateSettings]);

  const handleChangeSetting =
    (settingKey: keyof Settings) => async (value: any) => {
      await changeSetting(settingKey, value);
    };

  return (
    <SafeAreaView>
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 14,
          paddingVertical: 24,
        }}
      >
        {settings &&
          Object.keys(settings).map((settingKey) => {
            const { value, title } = settings[settingKey as keyof Settings];
            return (
              <SwitchInput
                key={settingKey}
                initValue={value}
                title={title}
                onChange={handleChangeSetting(settingKey as keyof Settings)}
              />
            );
          })}
      </ScrollView>
    </SafeAreaView>
  );
}
