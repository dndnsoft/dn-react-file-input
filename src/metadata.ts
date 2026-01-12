export type GenerateMetadataOptions = {};

export function generateSizeMetadata(blob: Blob | File) {
  return new Promise<{ width?: number; height?: number; thumbnail?: string }>(
    (resolve) => {
      if (blob.type.startsWith("image/")) {
        const img = new Image();

        img.src = URL.createObjectURL(blob);

        img.onload = () => {
          const canvas = document.createElement("canvas");

          const context = canvas.getContext("2d")!;

          canvas.width = img.width;

          canvas.height = img.height;

          context.drawImage(img, 0, 0);

          const thumbnail = canvas.toDataURL("image/png", 0.7);

          resolve({
            width: img.width,
            height: img.height,
            thumbnail,
          });
        };

        img.onerror = () => resolve({});

        return;
      }

      if (blob.type.startsWith("video/")) {
        const video = document.createElement("video");

        video.onloadeddata = () => {
          video.addEventListener("timeupdate", () => {
            const canvas = document.createElement("canvas");

            canvas.width = video.videoWidth;

            canvas.height = video.videoHeight;

            const context = canvas.getContext("2d")!;

            context.drawImage(video, 0, 0, canvas.width, canvas.height);

            const thumbnail = canvas.toDataURL("image/png", 0.7);

            resolve({
              width: video.videoWidth,
              height: video.videoHeight,
              thumbnail,
            });

            return;
          });

          video.currentTime = Math.min(1, video.duration / 2);
        };

        video.onerror = () => resolve({});

        video.src = URL.createObjectURL(blob);

        return;
      }

      resolve({});
    }
  );
}
