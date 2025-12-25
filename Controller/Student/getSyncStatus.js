const Sequelize = require("sequelize");
const { Student } = require("../../Model");

const getSyncStatus = async (req, res) => {
  try {
    const { tenant } = req.query;

    // If tenant is provided, get status for that tenant only
    if (tenant) {
      const lastSync = await Student.findOne({
        where: {
          tenant: tenant,
        },
        attributes: [
          [Sequelize.fn("MAX", Sequelize.col("updatedAt")), "lastSyncTime"],
        ],
        raw: true,
      });

      return res.status(200).json({
        success: true,
        data: {
          tenant: tenant,
          lastSyncTime: lastSync?.lastSyncTime || null,
        },
      });
    }

    // Otherwise, get status for all tenants
    const tenants = ["primary", "coaching"]; // Support for future coaching tenant
    const statusMap = {};

    for (const t of tenants) {
      const lastSync = await Student.findOne({
        where: {
          tenant: t,
        },
        attributes: [
          [Sequelize.fn("MAX", Sequelize.col("updatedAt")), "lastSyncTime"],
        ],
        raw: true,
      });

      statusMap[t] = {
        lastSyncTime: lastSync?.lastSyncTime || null,
      };
    }

    return res.status(200).json({
      success: true,
      data: statusMap,
    });
  } catch (error) {
    console.error("Error in getSyncStatus controller:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
};

module.exports = { getSyncStatus };
