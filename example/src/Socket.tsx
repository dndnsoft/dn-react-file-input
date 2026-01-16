import {
  base64Uploader,
  FileInputController,
  FileInputSocket,
  FilePreview,
} from "dn-react-file-input";
import { useRef } from "react";

export default function App() {
  const controllerRef = useRef<FileInputController<{
    src: string;
    alt: string;
  }> | null>(null);

  return (
    <div>
      <div className="app">
        <FileInputSocket
          ref={controllerRef}
          className={"file-input-socket"}
          uploader={async (file) => {
            await new Promise((resolve) => setTimeout(resolve, 2000));

            return base64Uploader(file);
          }}
          defaultValue={[
            {
              width: 100,
              height: 100,
              type: "image/png",
              file: {
                src: "https://picsum.photos/100/100",
                alt: "Placeholder Image",
              },
            },
          ]}
          overlay={(isDragOver) => (
            <div
              className={
                "file-input-overlay" + (isDragOver ? " drag-over" : "")
              }
            >
              파일을 여기로 끌어다 놓거나 클릭해서 업로드하세요.
            </div>
          )}
        >
          {(snapshot) => {
            return (
              <>
                <FilePreview snapshot={snapshot} />
                <div
                  className="preview-remove-button"
                  onClick={(e) => {
                    e.stopPropagation();

                    controllerRef.current?.remove(snapshot);
                  }}
                >
                  X
                </div>
              </>
            );
          }}
        </FileInputSocket>
      </div>
    </div>
  );
}
