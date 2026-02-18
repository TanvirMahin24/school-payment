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
