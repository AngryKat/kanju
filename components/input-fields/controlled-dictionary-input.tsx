import React from "react";
import { Animated, View, Pressable, Text, StyleSheet } from "react-native";
import { Card } from "../ui/card";
import {
  ControlledTextInput,
  ControlledTextInputHandleChange,
} from "./controlled-text-input";
import { useWatch } from "react-hook-form";
import { Swipeable } from "react-native-gesture-handler";
import { KanjiLinksList } from "../kanji-links";

const renderRightActions =
  (onRemove: () => void) => (progress: any, dragX: any) => {
    const opacity = dragX.interpolate({
      inputRange: [-65, 0],
      outputRange: [1, 0],
      extrapolate: "clamp",
    });
    return (
      <Animated.View
        style={[
          {
            marginBottom: 10,
            marginLeft: 8,
            opacity,
          },
        ]}
      >
        <Pressable
          onPress={onRemove}
          style={{
            flex: 1,
            backgroundColor: "red",
            padding: 14,
            borderRadius: 15,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text
            style={{
              color: "whitesmoke",
            }}
          >
            Delete
          </Text>
        </Pressable>
      </Animated.View>
    );
  };

interface Props {
  readOnly?: boolean;
  name: string;
  onRemove: () => void;
}

export function ControlledDictionaryInput({ name, onRemove, readOnly }: Props) {
  const kanji = useWatch({ name: "kanji" });

  const handleWordChange =
    (onChange: ControlledTextInputHandleChange) => (value: string) => {
      if (!value.includes(kanji)) return;
      onChange(value);
    };
  return (
    <Swipeable renderRightActions={renderRightActions(onRemove)}>
      <Card>
        <View
          style={{
            flexDirection: "row",
            gap: 10,
          }}
        >
          <View>
            <ControlledTextInput
              textInputProps={{
                placeholder: "Reading",
                style: [
                  styles.readingTextInput,
                  !readOnly && styles.inputBottomBorder,
                ],
                readOnly,
              }}
              name={`${name}.reading`}
            />
            <ControlledTextInput
              textInputProps={{
                style: [
                  styles.wordTextInput,
                  !readOnly && styles.inputBottomBorder,
                ],
                placeholder: kanji,
                readOnly,
              }}
              name={`${name}.word`}
              handleChange={handleWordChange}
            />
          </View>
          <View style={{ flex: 1 }}>
            <ControlledTextInput
              textInputProps={{
                style: [
                  styles.meaningTextInput,
                  styles[readOnly ? "verticalBorder" : "fullBorder"],
                ],
                placeholder: "Meaning...",
                multiline: true,
                readOnly,
              }}
              name={`${name}.meaning`}
            />
          </View>
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: 'center'
          }}
        >
          <Text style={{ color: "whitesmoke" }}>Kanjis mentioned:</Text>
          <KanjiLinksList entryName={name} />
        </View>
      </Card>
    </Swipeable>
  );
}

const styles = StyleSheet.create({
  inputBottomBorder: {
    borderBottomWidth: 1,
    borderBottomColor: "#404040",
  },
  meaningTextInput: {
    flex: 1,
    padding: 8,
    color: "whitesmoke",
    paddingLeft: 12,
  },
  readingTextInput: {
    alignSelf: "center",
    color: "lightgray",
    paddingHorizontal: 8,
    borderRadius: 5,
    fontSize: 12,

    paddingBottom: 4,
  },
  wordTextInput: {
    alignSelf: "center",
    color: "whitesmoke",
    paddingHorizontal: 12,
    borderRadius: 5,
    fontSize: 32,

    paddingVertical: 4,
  },
  actionButton: {
    paddingBottom: 8,
  },
  actionButtonsContainer: {
    flexDirection: "row",
    marginLeft: "auto",
    gap: 8,
  },
  verticalBorder: {
    borderLeftWidth: 1,
    borderLeftColor: "#505050",
  },
  fullBorder: {
    borderWidth: 1,
    borderColor: "#404040",
    borderRadius: 8,
  },
});
