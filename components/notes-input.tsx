import { TextInput, View } from "react-native";

export function NotesInput({ onInputChange, value, readOnly = false }: { readOnly: boolean, onInputChange: (value: string) => void, value: string}) {
  return (
    <View
      style={{
        padding: 12,
        paddingBottom: 4,
        height: 100,
        backgroundColor: "#303030",
        borderRadius: 12,
        marginTop: 28,
      }}
    >
      <TextInput
        style={{ color: "whitesmoke" }}
        multiline
        placeholder="Notes..."
        onChangeText={onInputChange}
        value={value}
        readOnly={readOnly}
      />
    </View>
  );
}
