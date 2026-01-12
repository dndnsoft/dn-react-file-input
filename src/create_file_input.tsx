import {
  useFileInputController,
  type FileInputControllerOptions,
} from "./controller";

export function createFileInput<TFile>(
  options: FileInputControllerOptions<TFile> = {}
) {
  function useController() {
    return useFileInputController(options);
  }

  return {
    useController,
  };
}
