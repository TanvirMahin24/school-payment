const { Expense, Revenue, Payment } = require("../../Model");
const { Op, Sequelize } = require("sequelize");

const getFilteredStats = async (req, res) => {
  try {
    const { tenant, gradeId, shiftId, batchId, startMonth, startYear, endMonth, endYear } = req.query;

    if (!tenant) {
      return res.status(400).json({
        message: "Tenant is required",
      });
    }

    // Build where clause for payments
    const paymentWhere = { tenant };
    if (gradeId) paymentWhere.gradePrimaryId = parseInt(gradeId);
    if (shiftId) paymentWhere.shiftPrimaryId = parseInt(shiftId);
    if (batchId) paymentWhere.batchPrimaryId = parseInt(batchId);

    // Build date range filter
    const dateFilter = [];
    if (startMonth && startYear && endMonth && endYear) {
      // Get all months between start and end
      const start = new Date(parseInt(startYear), getMonthIndex(startMonth), 1);
      const end = new Date(parseInt(endYear), getMonthIndex(endMonth), 1);
      
      const current = new Date(start);
      while (current <= end) {
        dateFilter.push({
          month: current.toLocaleString("default", { month: "long" }),
          year: current.getFullYear(),
        });
        current.setMonth(current.getMonth() + 1);
      }
    }

    if (dateFilter.length > 0) {
      paymentWhere[Op.or] = dateFilter.map((d) => ({
        month: d.month,
        year: d.year,
      }));
    }

    // Fetch expenses (not filtered by grade/shift/batch, but by date if provided)
    const expenseWhere = { tenant };
    if (dateFilter.length > 0) {
      expenseWhere[Op.or] = dateFilter.map((d) => ({
        month: d.month,
        year: d.year,
      }));
    }

    const expenses = await Expense.findAll({
      where: expenseWhere,
      attributes: [
        "month",
        "year",
        [Sequelize.fn("SUM", Sequelize.col("amount")), "total"],
      ],
      group: ["month", "year"],
      raw: true,
    });

    // Fetch revenues (not filtered by grade/shift/batch, but by date if provided)
    const revenueWhere = { tenant };
    if (dateFilter.length > 0) {
      revenueWhere[Op.or] = dateFilter.map((d) => ({
        month: d.month,
        year: d.year,
      }));
    }

    const revenues = await Revenue.findAll({
      where: revenueWhere,
      attributes: [
        "month",
        "year",
        [Sequelize.fn("SUM", Sequelize.col("amount")), "total"],
      ],
      group: ["month", "year"],
      raw: true,
    });

    // Fetch payments - separate amount, extra_amount, and exam_fee
    const payments = await Payment.findAll({
      where: paymentWhere,
      attributes: [
        "month",
        "year",
        [Sequelize.fn("SUM", Sequelize.col("amount")), "payment"],
        [Sequelize.fn("SUM", Sequelize.col("extra_amount")), "extraPayment"],
        [Sequelize.fn("SUM", Sequelize.col("exam_fee")), "examPayment"],
      ],
      group: ["month", "year"],
      raw: true,
    });

    // Create maps for quick lookup
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
    const examPaymentMap = new Map();
    payments.forEach((p) => {
      const key = `${p.month}_${p.year}`;
      paymentMap.set(key, parseFloat(p.payment || 0));
      extraPaymentMap.set(key, parseFloat(p.extraPayment || 0));
      examPaymentMap.set(key, parseFloat(p.examPayment || 0));
    });

    // Get unique month-year combinations
    const allMonths = new Set();
    expenses.forEach((e) => allMonths.add(`${e.month}_${e.year}`));
    revenues.forEach((r) => allMonths.add(`${r.month}_${r.year}`));
    payments.forEach((p) => allMonths.add(`${p.month}_${p.year}`));

    // Build result array
    const result = Array.from(allMonths)
      .map((key) => {
        const [month, year] = key.split("_");
        const expense = expenseMap.get(key) || 0;
        const revenue = revenueMap.get(key) || 0;
        const payment = paymentMap.get(key) || 0;
        const extraPayment = extraPaymentMap.get(key) || 0;
        const examPayment = examPaymentMap.get(key) || 0;
        const totalPayment = payment + extraPayment + examPayment;
        const totalRevenue = revenue + totalPayment;
        const profit = totalRevenue - expense;

        return {
          month,
          year: parseInt(year),
          monthLabel: `${month} ${year}`,
          expense,
          revenue,
          payment,
          extraPayment,
          examPayment,
          totalRevenue,
          profit,
        };
      })
      .sort((a, b) => {
        if (a.year !== b.year) return a.year - b.year;
        return getMonthIndex(a.month) - getMonthIndex(b.month);
      });

    return res.status(200).json({
      message: "Filtered stats retrieved successfully",
      data: result,
    });
  } catch (error) {
    console.error("Error fetching filtered stats:", error);
    return res.status(500).json({
      message: "Something went wrong",
      data: error.message,
    });
  }
};

// Helper function to get month index
function getMonthIndex(monthName) {
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  return months.indexOf(monthName);
}

module.exports = { getFilteredStats };

