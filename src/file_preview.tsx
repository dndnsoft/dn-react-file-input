import React from "react";
import type { FileSnapshot } from "./controller";

type FilePreviewProps = {
  snapshot: FileSnapshot<{ src: string; alt: string }>;
  loading?: React.ReactNode;
  fallback?: React.ReactNode;
  img?: (
    snapshot: FileSnapshot<{ src: string; alt: string }>
  ) => React.ReactNode;
  video?: (
    snapshot: FileSnapshot<{ src: string; alt: string }>
  ) => React.ReactNode;
};

export function FilePreview({
  snapshot,
  loading,
  fallback,
  img,
  video,
}: FilePreviewProps) {
  if (snapshot.isLoading) {
    if (loading) {
      return <>{loading}</>;
    }

    return <div>Uploading...</div>;
  }

  if (snapshot.type?.startsWith("image/")) {
    if (img) {
      return img(snapshot);
    }

    return <img src={snapshot.file.src} alt={snapshot.file.alt} />;
  }

  if (snapshot.type?.startsWith("video/")) {
    if (video) {
      return video(snapshot);
    }

    return (
      <video src={snapshot.file.src} controls poster={snapshot?.thumbnail} />
    );
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  return <div>{snapshot.file.alt}</div>;
}

export const createFilePreview = (
  options: Pick<FilePreviewProps, "img" | "video" | "loading" | "fallback">
) => {
  return function CustomFilePreview(props: FilePreviewProps) {
    return <FilePreview {...options} {...props} />;
  };
};
