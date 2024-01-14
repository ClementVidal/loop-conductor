import { Conductor } from "@loop-conductor/common";
import { useCallback, useEffect } from "react";
import { useMidiToolkit } from "./useMidiToolkit";

export function useSyncConductor(args: {
  conductor?: Conductor;
  midiOutputName?: string;
}): () => void {
  const { conductor, midiOutputName } = args;
  const { sendLoadConductor } = useMidiToolkit();

  useEffect(() => {
    const id = setTimeout(() => {
      if (!midiOutputName || !conductor) {
        return;
      }
      console.log("Syncing conductor");
      sendLoadConductor({
        conductor,
        outputName: midiOutputName,
      });
    }, 500);

    return () => clearTimeout(id);
  }, [conductor, sendLoadConductor]);

  return useCallback(() => {
    if (!midiOutputName || !conductor) {
      return;
    }
    console.log("Syncing conductor");
    sendLoadConductor({
      conductor,
      outputName: midiOutputName,
    });
  }, [conductor, sendLoadConductor, midiOutputName]);
}
