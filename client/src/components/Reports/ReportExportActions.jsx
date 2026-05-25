import React, { useState } from "react";
import { Button } from "react-bootstrap";
import { useReactToPrint } from "react-to-print";
import { toast } from "react-toastify";
import { exportReportToPdf } from "../../utils/exportReportToPdf";

const PRINT_PAGE_STYLE = `
  @page { margin: 5mm; size: A4; }
  body { margin: 0 !important; padding: 0 !important; }
  html { margin: 0 !important; padding: 0 !important; }
`;

const ReportExportActions = ({ contentRef, fileName, hasData }) => {
  const [isDownloading, setIsDownloading] = useState(false);

  const handlePrint = useReactToPrint({
    content: () => contentRef.current,
    documentTitle: fileName,
    pageStyle: PRINT_PAGE_STYLE,
  });

  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      await exportReportToPdf(contentRef.current, fileName);
    } catch (error) {
      toast.error(error.message || "Failed to download the report PDF");
    } finally {
      setIsDownloading(false);
    }
  };

  if (!hasData) return null;

  return (
    <div className="d-flex justify-content-end mb-3 no-print">
      <div className="d-flex gap-2">
        <Button variant="outline-secondary" onClick={handlePrint}>
          Print / PDF
        </Button>
        <Button
          variant="outline-primary"
          onClick={handleDownload}
          disabled={isDownloading}
        >
          {isDownloading ? "Downloading..." : "Download"}
        </Button>
      </div>
    </div>
  );
};

export default ReportExportActions;
