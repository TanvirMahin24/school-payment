const { Revenue, RevenueCategory } = require("../../Model");

const getRevenues = async (req, res) => {
  try {
    const { tenant, month, year } = req.query;

    const whereClause = {};
    if (tenant) whereClause.tenant = tenant;
    if (month) whereClause.month = month;
    if (year) whereClause.year = parseInt(year);

    const revenues = await Revenue.findAll({
      where: whereClause,
      include: [
        {
          model: RevenueCategory,
          as: "category",
        },
      ],
      order: [["id", "DESC"]],
    });

    return res.status(200).json({
      message: "Revenue list",
      data: revenues,
    });
  } catch (error) {
    console.error("Error fetching revenues:", error);
    return res.status(500).json({
      message: "Something went wrong",
      data: error.message,
    });
  }
};

module.exports = { getRevenues };


