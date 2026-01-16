import { base64Uploader } from "./base64_uploader";
import { generateSizeMetadata } from "./metadata";

export type FileSnapshot<TFile> = {
  uniqueKey: string;
  aspectRatio: number | undefined;
  isLoading: boolean;
  size: number | undefined;
  type: string | undefined;
  name: string | undefined;
  width: number | undefined;
  height: number | undefined;
  thumbnail: string | undefined;
  file: TFile;
};

export type FileUploader<TFile> = (
  file: File
) => Awaited<TFile> | Promise<Awaited<TFile>>;

export type FileInputSubscriber = () => void;

export type FileInputControllerOptions<TFile> = {
  uploader?: FileUploader<TFile>;
  defaultValue?: {
    size?: number;
    width?: number;
    height?: number;
    type?: string;
    name?: string;
    thumbnail?: string;
    file: TFile;
  }[];
};

export class FileInputController<TFile> {
  protected _isDragOver = false;

  get isDragOver() {
    return this._isDragOver;
  }

  set isDragOver(value: boolean) {
    const isUpdated = this._isDragOver !== value;

    this._isDragOver = value;

    if (isUpdated) {
      this.notify();
    }
  }

  protected _snapshots: FileSnapshot<TFile>[] = [];

  get snapshots() {
    return [...this._snapshots];
  }

  set snapshots(value: FileSnapshot<TFile>[]) {
    this._snapshots = value;
    this.notify();
  }

  get uploadedFiles() {
    return this._snapshots
      .filter((snapshot) => !snapshot.isLoading)
      .map((snapshot) => snapshot.file);
  }

  protected subscribers: FileInputSubscriber[] = [];

  protected uploader: FileUploader<TFile>;

  constructor({
    uploader,
    defaultValue,
  }: FileInputControllerOptions<TFile> = {}) {
    this.uploader = uploader || (base64Uploader as FileUploader<TFile>);

    this._snapshots =
      defaultValue?.map(
        ({ width, height, size, type, name, file, thumbnail }) => ({
          uniqueKey: crypto.randomUUID(),
          aspectRatio: width && height ? width / height : undefined,
          isLoading: false,
          name,
          size,
          type,
          width,
          height,
          thumbnail,
          file,
        })
      ) || [];
  }

  subscribe(subscriber: () => void) {
    this.subscribers.push(subscriber);

    return () => {
      const index = this.subscribers.indexOf(subscriber);
      if (index !== -1) {
        this.subscribers.splice(index, 1);
      }
    };
  }

  async upload(files: File[]): Promise<void> {
    for (const file of files) {
      const { type, name, size } = file;

      const { width, height, thumbnail } = await generateSizeMetadata(file);

      const aspectRatio = width && height ? width / height : undefined;

      const uniqueKey = crypto.randomUUID();

      const snapshot1 = {
        uniqueKey,
        isLoading: true,
        size,
        type,
        name,
        width,
        height,
        aspectRatio,
        thumbnail,
        file: {} as TFile,
      };

      this.snapshots = [...this.snapshots, snapshot1];

      const uploadedFile = await this.uploader(file);

      const snapshot2 = {
        uniqueKey,
        isLoading: false,
        size,
        type,
        name,
        width,
        height,
        aspectRatio,
        thumbnail,
        file: uploadedFile,
      };

      this.snapshots = this.snapshots.map((snapshot) =>
        snapshot.uniqueKey === uniqueKey ? snapshot2 : snapshot
      );
    }
  }

  remove(snapshot: FileSnapshot<TFile>) {
    this.snapshots = this.snapshots.filter(
      (s) => s.uniqueKey !== snapshot.uniqueKey
    );
  }

  notify() {
    for (const subscriber of this.subscribers) {
      subscriber();
    }
  }
}
