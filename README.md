# React File Input

The goal of this package is to provide a simple and reusable file input component for React applications. It supports drag-and-drop functionality, pending states for each file, custom upload handlers and more.

## Example

```tsx
import { FileInputButton } from "dn-react-file-input";

export default function App() {
  return (
    <div>
      <FileInputButton>Upload File</FileInputButton>
    </div>
  );
}
```

## How to add a drag and drop area

```tsx
import { FileInputArea } from "dn-react-file-input";

export default function App() {
  return (
    <div>
      <FileInputArea>
        Drag and drop files here or click to upload.
      </FileInputArea>
    </div>
  );
}
```

## How to get the list of files

```tsx
import {
  useFiles,
  useFileInputController,
  FileInputArea,
} from "dn-react-file-input";

export default function App() {
  const controller = useFileInputController();

  const files = useFiles({ controller });

  return (
    <div>
      <FileInputArea controller={controller}>
        Drag and drop files here or click to upload.
      </FileInputArea>
      <ul>
        {files.map((snapshot) => (
          <li key={snapshot.uniqueKey}>
            {snapshot.name} {snapshot.isLoading ? "Loading..." : "Loaded"}
          </li>
        ))}
      </ul>
    </div>
  );
}
```
