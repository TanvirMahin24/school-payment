const TENANTS = ["coaching", "primary", "school"];

const getUserValue = (user, key) => {
  if (!user) return undefined;
  if (user[key] !== undefined) return user[key];
  if (user.dataValues && user.dataValues[key] !== undefined) return user.dataValues[key];
  return undefined;
};

const serializeUserPermissions = (user) => ({
  school: getUserValue(user, "school") !== false,
  coaching: getUserValue(user, "coaching") !== false,
  primary: getUserValue(user, "primary") !== false,
  can_view_combined_school_primary_report:
    getUserValue(user, "can_view_combined_school_primary_report") !== false,
});

const getAllowedTenants = (user) => {
  const permissions = serializeUserPermissions(user);
  return TENANTS.filter((tenant) => permissions[tenant]);
};

const isValidTenant = (tenant) => TENANTS.includes(tenant);

const canAccessTenant = (user, tenant) => {
  if (!tenant || !isValidTenant(tenant)) return false;
  return serializeUserPermissions(user)[tenant] === true;
};

const extractTenantsFromRequest = (req) => {
  const tenants = [];

  if (req.query?.tenant) tenants.push(req.query.tenant);
  if (req.body?.tenant) tenants.push(req.body.tenant);

  if (Array.isArray(req.body?.payments)) {
    req.body.payments.forEach((payment) => {
      if (payment?.tenant) tenants.push(payment.tenant);
      if (payment?.meta?.tenant) tenants.push(payment.meta.tenant);
    });
  }

  return [...new Set(tenants.filter(Boolean))];
};

const requireTenantAccess = (req, res, next) => {
  if (
    Array.isArray(req.body?.payments) &&
    req.body.payments.some((payment) => !payment?.tenant)
  ) {
    return res.status(400).json({ message: "Tenant is required" });
  }

  const tenants = extractTenantsFromRequest(req);

  if (tenants.length === 0) {
    return res.status(400).json({ message: "Tenant is required" });
  }

  const invalidTenant = tenants.find((tenant) => !isValidTenant(tenant));
  if (invalidTenant) {
    return res.status(400).json({ message: "Invalid tenant" });
  }

  const deniedTenant = tenants.find((tenant) => !canAccessTenant(req.user, tenant));
  if (deniedTenant) {
    return res.status(403).json({
      message: `You do not have permission to access ${deniedTenant} tenant`,
    });
  }

  return next();
};

const requireCombinedSchoolPrimaryReportAccess = (req, res, next) => {
  if (!serializeUserPermissions(req.user).can_view_combined_school_primary_report) {
    return res.status(403).json({
      message: "You do not have permission to access this report",
    });
  }

  return next();
};

module.exports = {
  TENANTS,
  serializeUserPermissions,
  getAllowedTenants,
  canAccessTenant,
  requireTenantAccess,
  requireCombinedSchoolPrimaryReportAccess,
};
