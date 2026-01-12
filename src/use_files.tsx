import { useEffect, useState } from "react";
import type { FileInputController, FileSnapshot } from "./controller";

export function useFiles<TFile>({
  controller,
}: {
  controller: FileInputController<TFile>;
}) {
  const [snapshots, setFileSnapshot] = useState<FileSnapshot<TFile>[]>(
    controller.snapshots
  );

  useEffect(() => {
    const unsubscribe = controller.subscribe(() => {
      setFileSnapshot(controller.snapshots);
    });

    return () => {
      unsubscribe();
    };
  }, [controller]);

  return snapshots;
}
