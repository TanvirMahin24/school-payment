import React from "react";
import { getTenantInstitutionName } from "../../constants/Tenant";

const ReportPrintHeader = ({ title, subtitle, tenant, details }) => (
  <div className="mb-3">
    {tenant && (
      <p className="mb-1 fw-semibold">{getTenantInstitutionName(tenant)}</p>
    )}
    <h5 className="mb-1">{title}</h5>
    {subtitle && <p className="mb-1 text-muted">{subtitle}</p>}
    {details && <p className="mb-0 text-muted">{details}</p>}
  </div>
);

export default ReportPrintHeader;
