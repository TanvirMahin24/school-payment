const { ExpenseCategory } = require("../../Model");

const getExpenseCategories = async (req, res) => {
  try {
    const { tenant } = req.query;

    const whereClause = {};
    if (tenant) whereClause.tenant = tenant;

    const categories = await ExpenseCategory.findAll({
      where: whereClause,
      order: [["name", "ASC"]],
    });

    return res.status(200).json({
      message: "Expense category list",
      data: categories,
    });
  } catch (error) {
    console.error("Error fetching expense categories:", error);
    return res.status(500).json({
      message: "Something went wrong",
      data: error.message,
    });
  }
};

module.exports = { getExpenseCategories };




