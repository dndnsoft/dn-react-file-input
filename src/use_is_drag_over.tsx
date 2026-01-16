import { useEffect, useState, type RefObject } from "react";
import type { FileInputController } from "./controller";

export function useIsDragOver<TFile>(
  ref: RefObject<FileInputController<TFile> | null>
) {
  const [isDragOver, setIsDragOver] = useState<boolean>(false);

  useEffect(() => {
    const controller = ref.current;

    if (!controller) {
      return;
    }

    const unsubscribe = controller.subscribe(() => {
      setIsDragOver(controller.isDragOver);
    });

    return () => {
      unsubscribe();
    };
  }, [ref]);

  return isDragOver;
}
