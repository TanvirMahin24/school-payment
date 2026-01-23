const { Expense, Revenue, Payment } = require("../../Model");
const { Op, Sequelize } = require("sequelize");

const getMonthlyStats = async (req, res) => {
  try {
    const { tenant } = req.query;

    if (!tenant) {
      return res.status(400).json({
        message: "Tenant is required",
      });
    }

    // Get last 12 months
    const now = new Date();
    const months = [];
    for (let i = 11; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push({
        month: date.toLocaleString("default", { month: "long" }),
        year: date.getFullYear(),
        monthIndex: date.getMonth(),
      });
    }

    // Build where clause for expenses
    const expenseConditions = months.map((m) => ({
      month: m.month,
      year: m.year,
    }));

    // Fetch expenses for last 12 months
    const expenses = await Expense.findAll({
      where: {
        tenant,
        [Op.or]: expenseConditions,
      },
      attributes: [
        "month",
        "year",
        [Sequelize.fn("SUM", Sequelize.col("amount")), "total"],
      ],
      group: ["month", "year"],
      raw: true,
    });

    // Fetch revenues for last 12 months
    const revenues = await Revenue.findAll({
      where: {
        tenant,
        [Op.or]: expenseConditions,
      },
      attributes: [
        "month",
        "year",
        [Sequelize.fn("SUM", Sequelize.col("amount")), "total"],
      ],
      group: ["month", "year"],
      raw: true,
    });

    // Fetch payments for last 12 months - separate amount and extra_amount
    const payments = await Payment.findAll({
      where: {
        tenant,
        [Op.or]: expenseConditions,
      },
      attributes: [
        "month",
        "year",
        [Sequelize.fn("SUM", Sequelize.col("amount")), "payment"],
        [Sequelize.fn("SUM", Sequelize.col("extra_amount")), "extraPayment"],
      ],
      group: ["month", "year"],
      raw: true,
    });

    // Create a map for quick lookup
    const expenseMap = new Map();
    expenses.forEach((e) => {
      const key = `${e.month}_${e.year}`;
      expenseMap.set(key, parseFloat(e.total || 0));
    });

    const revenueMap = new Map();
    revenues.forEach((r) => {
      const key = `${r.month}_${r.year}`;
      revenueMap.set(key, parseFloat(r.total || 0));
    });

    const paymentMap = new Map();
    const extraPaymentMap = new Map();
    payments.forEach((p) => {
      const key = `${p.month}_${p.year}`;
      paymentMap.set(key, parseFloat(p.payment || 0));
      extraPaymentMap.set(key, parseFloat(p.extraPayment || 0));
    });

    // Build result array
    const result = months.map((m) => {
      const key = `${m.month}_${m.year}`;
      const expense = expenseMap.get(key) || 0;
      const revenue = revenueMap.get(key) || 0;
      const payment = paymentMap.get(key) || 0;
      const extraPayment = extraPaymentMap.get(key) || 0;
      const totalPayment = payment + extraPayment;
      const totalRevenue = revenue + totalPayment;
      const profit = totalRevenue - expense;

      return {
        month: m.month,
        year: m.year,
        monthLabel: `${m.month} ${m.year}`,
        expense,
        revenue,
        payment,
        extraPayment,
        totalRevenue,
        profit,
      };
    });

    return res.status(200).json({
      message: "Monthly stats retrieved successfully",
      data: result,
    });
  } catch (error) {
    console.error("Error fetching monthly stats:", error);
    return res.status(500).json({
      message: "Something went wrong",
      data: error.message,
    });
  }
};

module.exports = { getMonthlyStats };

