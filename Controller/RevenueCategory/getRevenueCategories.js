const { RevenueCategory } = require("../../Model");

const getRevenueCategories = async (req, res) => {
  try {
    const { tenant } = req.query;

    const whereClause = {};
    if (tenant) whereClause.tenant = tenant;

    const categories = await RevenueCategory.findAll({
      where: whereClause,
      order: [["name", "ASC"]],
    });

    return res.status(200).json({
      message: "Revenue category list",
      data: categories,
    });
  } catch (error) {
    console.error("Error fetching revenue categories:", error);
    return res.status(500).json({
      message: "Something went wrong",
      data: error.message,
    });
  }
};

module.exports = { getRevenueCategories };




