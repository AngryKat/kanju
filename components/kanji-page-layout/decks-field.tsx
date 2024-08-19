import { Text } from "react-native";
import { DecksInput } from "../decks-input";

interface Props {
  decks: string[];
  onInputChange: (updatedData: string[]) => void;
  readOnly?: boolean;
}
export function DecksField({
  decks,
  onInputChange,
  readOnly = false,
}: Props) {
  if (!readOnly) {
    return (
      <>
        <Text
          style={{
            color: "whitesmoke",
            textAlign: "center",
            fontSize: 20,
            fontWeight: 600,
            marginBottom: 18,
            marginTop: 24,
          }}
        >
          Decks
        </Text>
        <DecksInput
          initDecks={decks}
          onUpdate={onInputChange}
        />
      </>
    );
  }
  return (
    <>
      {decks.length > 0 && (
        <>
          <Text
            style={{
              color: "whitesmoke",
              textAlign: "center",
              fontSize: 20,
              fontWeight: 600,
              marginBottom: 18,
              marginTop: 24,
            }}
          >
            Dictionary
          </Text>
        </>
      )}
    </>
  );
}
