/**
 * Tenant Constants
 * Centralized mapping for all tenants in the system
 */

export const TENANTS = {
  COACHING: "coaching",
  PRIMARY: "primary",
  SCHOOL: "school",
};

export const TENANT_LABELS = {
  [TENANTS.COACHING]: "Coaching",
  [TENANTS.PRIMARY]: "Primary",
  [TENANTS.SCHOOL]: "School",
};

export const TENANT_INSTITUTION_NAMES = {
  [TENANTS.PRIMARY]: "Notun Kuri English Version School",
  [TENANTS.COACHING]: "Notun Kuri Coaching Center",
  [TENANTS.SCHOOL]: "Notun Kuri Residential School",
};

export const TENANT_LIST = [
  { value: TENANTS.COACHING, label: TENANT_LABELS[TENANTS.COACHING] },
  { value: TENANTS.PRIMARY, label: TENANT_LABELS[TENANTS.PRIMARY] },
  { value: TENANTS.SCHOOL, label: TENANT_LABELS[TENANTS.SCHOOL] },
];

export const DEFAULT_TENANT = TENANTS.COACHING;

export const getAllowedTenantList = (permissions) => {
  if (!permissions) return TENANT_LIST;
  return TENANT_LIST.filter((tenant) => permissions[tenant.value] === true);
};

export const getDefaultAllowedTenant = (permissions) => {
  return getAllowedTenantList(permissions)[0]?.value || null;
};

export const canViewSchoolPrimaryReport = (permissions) => {
  return permissions?.can_view_combined_school_primary_report === true;
};

/**
 * Get tenant label by value
 * @param {string} tenant - Tenant value
 * @returns {string} Tenant label
 */
export const getTenantLabel = (tenant) => {
  return TENANT_LABELS[tenant] || tenant;
};

export const getTenantInstitutionName = (tenant) => {
  return TENANT_INSTITUTION_NAMES[tenant] || tenant;
};

/**
 * Check if tenant is valid
 * @param {string} tenant - Tenant value to validate
 * @returns {boolean} True if tenant is valid
 */
export const isValidTenant = (tenant) => {
  return Object.values(TENANTS).includes(tenant);
};
