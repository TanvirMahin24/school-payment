const { syncStudents } = require("../../Services/syncStudents");

const syncRecentStudents = async (req, res) => {
  try {
    // Calculate date for last 48 hours
    const updatedSince = new Date(Date.now() - 48 * 60 * 60 * 1000);

    // Sync students updated in last 48 hours
    const result = await syncStudents(updatedSince);

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






