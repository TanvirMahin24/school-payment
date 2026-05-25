import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

const A4_WIDTH_MM = 210;
const A4_HEIGHT_MM = 297;

export const exportReportToPdf = async (element, fileName) => {
  if (!element) {
    throw new Error("Report content is not available for download yet.");
  }

  const canvas = await html2canvas(element, {
    scale: window.devicePixelRatio > 1 ? 2 : window.devicePixelRatio || 1,
    useCORS: true,
    backgroundColor: "#ffffff",
    logging: false,
  });

  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
    compress: true,
  });

  const imageData = canvas.toDataURL("image/png");
  const pageWidth = A4_WIDTH_MM;
  const pageHeight = A4_HEIGHT_MM;
  const imageWidth = pageWidth;
  const imageHeight = (canvas.height * imageWidth) / canvas.width;

  if (imageHeight <= pageHeight) {
    pdf.addImage(imageData, "PNG", 0, 0, imageWidth, imageHeight, undefined, "FAST");
  } else {
    const pageHeightPx = (pageHeight * canvas.width) / pageWidth;
    let renderedHeightPx = 0;
    let pageIndex = 0;

    while (renderedHeightPx < canvas.height) {
      if (pageIndex > 0) {
        pdf.addPage();
      }

      const remainingHeightPx = canvas.height - renderedHeightPx;
      const currentPageHeightPx = Math.min(pageHeightPx, remainingHeightPx);

      const pageCanvas = document.createElement("canvas");
      pageCanvas.width = canvas.width;
      pageCanvas.height = currentPageHeightPx;

      const context = pageCanvas.getContext("2d");
      if (!context) {
        throw new Error("Could not prepare PDF page for download.");
      }

      context.fillStyle = "#ffffff";
      context.fillRect(0, 0, pageCanvas.width, pageCanvas.height);
      context.drawImage(
        canvas,
        0,
        renderedHeightPx,
        canvas.width,
        currentPageHeightPx,
        0,
        0,
        pageCanvas.width,
        pageCanvas.height
      );

      const pageImageHeight = (currentPageHeightPx * imageWidth) / canvas.width;
      pdf.addImage(
        pageCanvas.toDataURL("image/png"),
        "PNG",
        0,
        0,
        imageWidth,
        pageImageHeight,
        undefined,
        "FAST"
      );

      renderedHeightPx += currentPageHeightPx;
      pageIndex += 1;
    }
  }

  pdf.save(fileName.endsWith(".pdf") ? fileName : `${fileName}.pdf`);
};
