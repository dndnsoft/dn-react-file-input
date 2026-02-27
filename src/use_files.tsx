import { useEffect, useLayoutEffect, useState, type RefObject } from "react";
import type { FileInputController, FileSnapshot } from "./controller";

export function useFiles<TFile>(
    ref: RefObject<FileInputController<TFile> | null>,
) {
    const [snapshots, setFileSnapshot] = useState<FileSnapshot<TFile>[]>([]);

    useLayoutEffect(() => {
        const controller = ref.current;

        if (controller && controller.snapshots.length > 0) {
            setFileSnapshot(controller.snapshots);
        }
    }, []);

    useEffect(() => {
        const controller = ref.current;

        if (controller && controller.snapshots.length > 0) {
            setFileSnapshot(controller.snapshots);
        }
    }, []);

    useEffect(() => {
        const controller = ref.current;

        if (!controller) {
            return;
        }

        const unsubscribe = controller.subscribe(() => {
            setFileSnapshot(controller.snapshots || []);
        });

        return () => {
            unsubscribe();
        };
    }, [ref]);

    return snapshots;
}
