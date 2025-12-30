const { Expense, ExpenseCategory } = require("../../Model");

const getExpenses = async (req, res) => {
  try {
    const { tenant, month, year } = req.query;

    const whereClause = {};
    if (tenant) whereClause.tenant = tenant;
    if (month) whereClause.month = month;
    if (year) whereClause.year = parseInt(year);

    const expenses = await Expense.findAll({
      where: whereClause,
      include: [
        {
          model: ExpenseCategory,
          as: "category",
        },
      ],
      order: [["id", "DESC"]],
    });

    return res.status(200).json({
      message: "Expense list",
      data: expenses,
    });
  } catch (error) {
    console.error("Error fetching expenses:", error);
    return res.status(500).json({
      message: "Something went wrong",
      data: error.message,
    });
  }
};

module.exports = { getExpenses };




