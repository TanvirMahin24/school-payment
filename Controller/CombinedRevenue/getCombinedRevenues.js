const { CombinedRevenue } = require("../../Model");

const getCombinedRevenues = async (req, res) => {
  try {
    const { month, year } = req.query;

    const whereClause = {};
    if (month) whereClause.month = month;
    if (year) whereClause.year = parseInt(year);

    const combinedRevenues = await CombinedRevenue.findAll({
      where: whereClause,
      order: [["id", "DESC"]],
    });

    return res.status(200).json({
      message: "Combined revenue list",
      data: combinedRevenues,
    });
  } catch (error) {
    console.error("Error fetching combined revenues:", error);
    return res.status(500).json({
      message: "Something went wrong",
      data: error.message,
    });
  }
};

module.exports = { getCombinedRevenues };
