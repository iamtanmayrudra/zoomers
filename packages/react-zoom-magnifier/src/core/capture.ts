/**
 * html2canvas is an optional peer dependency, loaded lazily (dynamic import) so apps
 * that never use the screenshot feature don't pay for it in their main bundle.
 */
export async function captureElementAsPngDataUrl(element: HTMLElement): Promise<string> {
  let html2canvas: typeof import("html2canvas").default;
  try {
    ({ default: html2canvas } = await import("html2canvas"));
  } catch {
    throw new Error(
      "react-zoom-magnifier: capturing a screenshot requires the optional peer dependency " +
        '"html2canvas". Install it with `npm install html2canvas`.',
    );
  }

  const canvas = await html2canvas(element, {
    backgroundColor: null,
    useCORS: true,
    logging: false,
  });

  return canvas.toDataURL("image/png");
}

export function downloadDataUrl(dataUrl: string, filename: string): void {
  const link = document.createElement("a");
  link.href = dataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
}
