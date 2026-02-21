const { Expense, ExpenseCategory } = require("../../Model");
const { Sequelize } = require("sequelize");

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const getYearlyExpenseReport = async (req, res) => {
  try {
    const { tenant, year } = req.query;

    if (!tenant || !year) {
      return res.status(400).json({
        message: "Tenant and year are required",
      });
    }

    const yearInt = parseInt(year);

    const categories = await ExpenseCategory.findAll({
      where: { tenant },
      order: [["name", "ASC"]],
      attributes: ["id", "name"],
    });

    const expenses = await Expense.findAll({
      where: { tenant, year: yearInt },
      attributes: [
        "month",
        "categoryId",
        [Sequelize.fn("SUM", Sequelize.col("amount")), "total"],
      ],
      group: ["month", "categoryId"],
      raw: true,
    });

    const expenseMap = new Map();
    expenses.forEach((e) => {
      const key = `${e.month}_${e.categoryId}`;
      expenseMap.set(key, parseFloat(e.total || 0));
    });

    const categoryYearlyTotals = {};
    categories.forEach((c) => {
      categoryYearlyTotals[c.id] = 0;
    });

    const monthlyData = MONTHS.map((month) => {
      const categoryTotals = {};
      let rowTotal = 0;

      categories.forEach((cat) => {
        const val = expenseMap.get(`${month}_${cat.id}`) || 0;
        categoryTotals[cat.id] = val;
        rowTotal += val;
        categoryYearlyTotals[cat.id] = (categoryYearlyTotals[cat.id] || 0) + val;
      });

      return {
        month,
        categoryTotals,
        total: rowTotal,
      };
    });

    const grandTotal = Object.values(categoryYearlyTotals).reduce((a, b) => a + b, 0);

    return res.status(200).json({
      message: "Yearly expense report retrieved successfully",
      data: {
        categories: categories.map((c) => ({ id: c.id, name: c.name })),
        monthlyData,
        categoryYearlyTotals,
        grandTotal,
      },
    });
  } catch (error) {
    console.error("Error fetching yearly expense report:", error);
    return res.status(500).json({
      message: "Something went wrong",
      data: error.message,
    });
  }
};

module.exports = { getYearlyExpenseReport };
