const { syncStudents } = require("../../Services/syncStudents");
const { syncSchoolStudents } = require("../../Services/syncSchoolStudents");
const { syncCoachingStudents } = require("../../Services/syncCoachingStudents");

const syncAllStudents = async (req, res) => {
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

    // Use appropriate sync service based on tenant
    let result;
    if (tenant === "school") {
      // Sync all students (no updatedSince filter)
      result = await syncSchoolStudents();
    } else if (tenant === "coaching") {
      // Sync all students (no updatedSince filter)
      result = await syncCoachingStudents();
    } else {
      // Sync all students (no updatedSince filter)
      result = await syncStudents();
    }

    if (result.success) {
      return res.status(200).json({
        success: true,
        message: "All students synced successfully",
        data: result.stats,
      });
    } else {
      return res.status(500).json({
        success: false,
        message: "Failed to sync students",
        error: result.error,
      });
    }
  } catch (error) {
    console.error("Error in syncAllStudents controller:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
};

module.exports = { syncAllStudents };






