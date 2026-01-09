import { useRef, useState } from "react";
import { createFileInput, type InferSnapshot } from "dn-react-file-input";

const FileInput = createFileInput({
  uploader: (file) => {
    const base64 = new Promise<string>((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        resolve(reader.result as string);
      };
      reader.onerror = (error) => {
        reject(error);
      };
      reader.readAsDataURL(file);
    });

    return {
      src: base64.then((data) => data),
      alt: file.name,
    };
  },
});

export default function App() {
  const [fileSnapshot, setFileSnapshot] =
    useState<InferSnapshot<FileInput> | null>(null);

  const ref = useRef<HTMLInputElement>(null);

  return (
    <div>
      {fileSnapshot ? (
        <div
          className="preview-container"
          style={{ aspectRatio: fileSnapshot.aspectRatio }}
        >
          {fileSnapshot.isLoading ? (
            <div className="preview-loading">Loading...</div>
          ) : (
            <img
              className="preview-image"
              src={fileSnapshot.file.src}
              alt={fileSnapshot.file.alt}
            />
          )}
        </div>
      ) : null}
      <div className="app">
        <FileInput.Button
          ref={ref}
          onUpload={(file) => {
            setFileSnapshot(file.src);
          }}
        >
          파일을 여기로 끌어다 놓거나 클릭해서 업로드하세요.
        </FileInput.Button>
      </div>
    </div>
  );
}
