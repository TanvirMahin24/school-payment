const { syncStudents } = require("../../Services/syncStudents");

const syncAllStudents = async (req, res) => {
  try {
    // Sync all students (no updatedSince filter)
    const result = await syncStudents();

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


