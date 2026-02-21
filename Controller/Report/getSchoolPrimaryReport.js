const { Expense, Revenue, Payment } = require("../../Model");
const { Sequelize, Op } = require("sequelize");

const TENANTS = ["school", "primary"];

const getSchoolPrimaryReport = async (req, res) => {
  try {
    const { month, year } = req.query;

    if (!month || !year) {
      return res.status(400).json({
        message: "Month and year are required",
      });
    }

    const monthStr = String(month);
    const yearInt = parseInt(year);

    const result = {
      school: { income: 0, expense: 0, revenue: 0 },
      primary: { income: 0, expense: 0, revenue: 0 },
      combinedPaymentCount: 0,
    };

    for (const tenant of TENANTS) {
      const paymentRows = await Payment.findAll({
        where: { tenant, month: monthStr, year: yearInt },
        attributes: [
          [Sequelize.literal("SUM(amount + COALESCE(extra_amount, 0) + COALESCE(exam_fee, 0))"), "total"],
        ],
        raw: true,
      });
      result[tenant].income = parseFloat(paymentRows[0]?.total || 0);

      const expenseRows = await Expense.findAll({
        where: { tenant, month: monthStr, year: yearInt },
        attributes: [[Sequelize.fn("SUM", Sequelize.col("amount")), "total"]],
        raw: true,
      });
      result[tenant].expense = parseFloat(expenseRows[0]?.total || 0);

      const revenueRows = await Revenue.findAll({
        where: { tenant, month: monthStr, year: yearInt },
        attributes: [[Sequelize.fn("SUM", Sequelize.col("amount")), "total"]],
        raw: true,
      });
      result[tenant].revenue = parseFloat(revenueRows[0]?.total || 0);
    }

    const countRows = await Payment.findAll({
      where: {
        tenant: { [Op.in]: TENANTS },
        month: monthStr,
        year: yearInt,
      },
      attributes: [[Sequelize.fn("COUNT", Sequelize.col("id")), "count"]],
      raw: true,
    });
    result.combinedPaymentCount = parseInt(countRows[0]?.count || 0, 10);

    return res.status(200).json({
      message: "School and Primary report retrieved successfully",
      data: result,
    });
  } catch (error) {
    console.error("Error fetching school primary report:", error);
    return res.status(500).json({
      message: "Something went wrong",
      data: error.message,
    });
  }
};

module.exports = { getSchoolPrimaryReport };
