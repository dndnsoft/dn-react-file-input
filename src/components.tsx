import React, {
  useImperativeHandle,
  useMemo,
  useRef,
  type DetailedHTMLProps,
  type InputHTMLAttributes,
  type Ref,
} from "react";
import {
  FileInputController,
  type FileInputControllerOptions,
} from "./controller";

export type FileInputComponentProps<TFile> = Omit<
  DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>,
  | "ref"
  | "onClick"
  | "onDrag"
  | "onDragStart"
  | "onDragOver"
  | "onDragEnter"
  | "onDragEnd"
  | "onDragExit"
  | "onDragLeave"
  | "onDrop"
  | "ref"
  | "defaultValue"
> & {
  ref: Ref<FileInputController<TFile> | null>;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onDrag?: (e: React.DragEvent<HTMLButtonElement>) => void;
  onDragStart?: (e: React.DragEvent<HTMLButtonElement>) => void;
  onDragOver?: (e: React.DragEvent<HTMLButtonElement>) => void;
  onDragEnter?: (e: React.DragEvent<HTMLButtonElement>) => void;
  onDragEnd?: (e: React.DragEvent<HTMLButtonElement>) => void;
  onDragExit?: (e: React.DragEvent<HTMLButtonElement>) => void;
  onDragLeave?: (e: React.DragEvent<HTMLButtonElement>) => void;
  onDrop?: (e: React.DragEvent<HTMLButtonElement>) => void;
} & FileInputControllerOptions<TFile>;

export function FileInputButton<TFile>({
  ref,
  id,
  className,
  children,
  onClick,
  onDrag,
  onDragStart,
  onDragOver,
  onDragEnter,
  onDragEnd,
  onDragExit,
  onDragLeave,
  onChange,
  onDrop,
  uploader,
  defaultValue,
  ...props
}: FileInputComponentProps<TFile>) {
  const controller = useMemo(
    () => new FileInputController<TFile>({ uploader, defaultValue }),
    []
  );

  useImperativeHandle(ref, () => controller, []);

  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <button
        type="button"
        id={id}
        className={className}
        onClick={(e) => {
          inputRef.current?.click();

          onClick?.(e);
        }}
        onDrag={onDrag}
        onDragStart={onDragStart}
        onDragOver={onDragOver}
        onDragEnter={onDragEnter}
        onDragEnd={onDragEnd}
        onDragExit={onDragExit}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
      >
        {children}
      </button>
      <input
        {...props}
        ref={inputRef}
        type="file"
        style={{ display: "none" }}
        onChange={async (e) => {
          const files = e.target.files;

          if (files) {
            await controller.upload(Array.from(files));
          }

          await onChange?.(e);

          e.target.value = "";
        }}
      />
    </>
  );
}

export function FileInputArea<TFile>({
  ref,
  ...props
}: FileInputComponentProps<TFile>) {
  const controllerRef = useRef<FileInputController<TFile>>(null);

  useImperativeHandle(ref, () => controllerRef.current!, []);

  const onDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const controller = controllerRef.current!;

    controller.isDragOver = true;
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const controller = controllerRef.current!;

    controller.isDragOver = true;
  };

  const onDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const controller = controllerRef.current!;

    controller.isDragOver = false;
  };

  const onDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const controller = controllerRef.current!;

    controller.isDragOver = false;

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const files = Array.from(e.dataTransfer.files);

      await controller.upload(files);

      e.dataTransfer.clearData();
    }
  };

  return (
    <FileInputButton
      {...props}
      ref={controllerRef}
      onDragEnter={onDragEnter}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    />
  );
}
