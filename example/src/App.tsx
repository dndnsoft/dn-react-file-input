import {
  base64Uploader,
  FileInputArea,
  useFileInputController,
  useFiles,
  useIsDragOver,
} from "dn-react-file-input";

export default function App() {
  const controller = useFileInputController({
    uploader: async (file) => {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      return base64Uploader(file);
    },
    defaultValue: [
      {
        width: 100,
        height: 100,
        file: {
          src: "https://picsum.photos/100/100",
          alt: "Placeholder Image",
        },
      },
    ],
  });

  const files = useFiles({ controller });

  const isDragOver = useIsDragOver({ controller });

  return (
    <div>
      <div className="preview-list">
        {files.length > 0
          ? files.map((snapshot) => {
              return (
                <div key={snapshot.uniqueKey} className="preview-container">
                  {snapshot.isLoading ? (
                    <>
                      {snapshot.thumbnail && (
                        <img
                          className="preview-image"
                          src={snapshot.thumbnail}
                          alt={snapshot.name}
                        />
                      )}
                      <div className="preview-loading">Uploading...</div>
                    </>
                  ) : (
                    <img
                      className="preview-image"
                      src={snapshot.file.src}
                      alt={snapshot.file.alt}
                    />
                  )}
                  <button
                    className="preview-remove-button"
                    onClick={() => {
                      controller.remove(snapshot);
                    }}
                  >
                    X
                  </button>
                </div>
              );
            })
          : null}
      </div>
      <div className="app">
        <FileInputArea
          controller={controller}
          className={"file-input-area" + (isDragOver ? " drag-over" : "")}
        >
          파일을 여기로 끌어다 놓거나 클릭해서 업로드하세요.
        </FileInputArea>
      </div>
    </div>
  );
}
