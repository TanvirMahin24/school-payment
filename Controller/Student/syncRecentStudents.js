const { syncStudents } = require("../../Services/syncStudents");
const { syncSchoolStudents } = require("../../Services/syncSchoolStudents");
const { syncCoachingStudents } = require("../../Services/syncCoachingStudents");

const syncRecentStudents = async (req, res) => {
  try {
    const { tenant } = req.body;

    // Validate tenant parameter
    if (!tenant) {
      return res.status(400).json({
        success: false,
        message: "Tenant parameter is required",
      });
    }

    // Validate tenant value
    const validTenants = ["primary", "coaching", "school"];
    if (!validTenants.includes(tenant)) {
      return res.status(400).json({
        success: false,
        message: `Invalid tenant. Must be one of: ${validTenants.join(", ")}`,
      });
    }

    // Calculate date for last 48 hours
    const updatedSince = new Date(Date.now() - 48 * 60 * 60 * 1000);

    // Use appropriate sync service based on tenant
    let result;
    if (tenant === "school") {
      // Sync students updated in last 48 hours
      result = await syncSchoolStudents(updatedSince);
    } else if (tenant === "coaching") {
      // Sync students updated in last 48 hours
      result = await syncCoachingStudents(updatedSince);
    } else {
      // Sync students updated in last 48 hours
      result = await syncStudents(updatedSince);
    }

    if (result.success) {
      return res.status(200).json({
        success: true,
        message: "Recent students synced successfully",
        data: result.stats,
      });
    } else {
      return res.status(500).json({
        success: false,
        message: "Failed to sync recent students",
        error: result.error,
      });
    }
  } catch (error) {
    console.error("Error in syncRecentStudents controller:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
};

module.exports = { syncRecentStudents };






