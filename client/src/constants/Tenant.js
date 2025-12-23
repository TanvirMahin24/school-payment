/**
 * Tenant Constants
 * Centralized mapping for all tenants in the system
 */

export const TENANTS = {
  COACHING: "coaching",
  PRIMARY: "primary",
};

export const TENANT_LABELS = {
  [TENANTS.COACHING]: "Coaching",
  [TENANTS.PRIMARY]: "Primary",
};

export const TENANT_LIST = [
  { value: TENANTS.COACHING, label: TENANT_LABELS[TENANTS.COACHING] },
  { value: TENANTS.PRIMARY, label: TENANT_LABELS[TENANTS.PRIMARY] },
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

/**
 * Check if tenant is valid
 * @param {string} tenant - Tenant value to validate
 * @returns {boolean} True if tenant is valid
 */
export const isValidTenant = (tenant) => {
  return Object.values(TENANTS).includes(tenant);
};
