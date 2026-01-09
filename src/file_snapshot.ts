export type FileSnapshot<T> = {
  aspectRatio: number | undefined;
  isLoading: boolean;
  file: T;
};
