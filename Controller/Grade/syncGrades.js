const { syncGrades } = require("../../Services/syncGrades");

const syncGradesController = async (req, res) => {
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
      const { syncSchoolGrades } = require("../../Services/syncSchoolGrades");
      result = await syncSchoolGrades(tenant);
    } else if (tenant === "coaching") {
      const { syncCoachingGrades } = require("../../Services/syncCoachingGrades");
      result = await syncCoachingGrades(tenant);
    } else {
      result = await syncGrades(tenant);
    }

    if (result.success) {
      return res.status(200).json({
        success: true,
        message: "Grades, shifts, and batches synced successfully",
        data: result.stats,
      });
    } else {
      return res.status(500).json({
        success: false,
        message: "Failed to sync grades",
        error: result.error,
      });
    }
  } catch (error) {
    console.error("Error in syncGrades controller:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
};

module.exports = { syncGradesController };

