import { useEffect, useState } from "react";
import type { FileInputController } from "./controller";

export function useIsDragOver<TFile>({
  controller,
}: {
  controller: FileInputController<TFile>;
}) {
  const [isDragOver, setIsDragOver] = useState<boolean>(controller.isDragOver);

  useEffect(() => {
    const unsubscribe = controller.subscribe(() => {
      setIsDragOver(controller.isDragOver);
    });

    return () => {
      unsubscribe();
    };
  }, [controller]);

  return isDragOver;
}
