import type { Mode } from "@/utils/types";
import { createContext, useContext } from "react";

export const KanjiPageContext = createContext<{ mode: Mode }>({
  mode: "create",
});

export const useKanjiPageContext = () => useContext(KanjiPageContext);
