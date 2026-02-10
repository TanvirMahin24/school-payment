const { Expense, Revenue, Payment, Grade } = require("../../Model");
const { Op, Sequelize } = require("sequelize");

// Helper function to get month index
function getMonthIndex(monthName) {
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  return months.indexOf(monthName);
}

const getGradeBreakdown = async (req, res) => {
  try {
    const { tenant, startMonth, startYear, endMonth, endYear } = req.query;

    if (!tenant) {
      return res.status(400).json({
        message: "Tenant is required",
      });
    }

    // Build date range filter
    const dateFilter = [];
    if (startMonth && startYear && endMonth && endYear) {
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

    // Get all grades for the tenant
    const grades = await Grade.findAll({
      where: {
        tenant,
        del: false,
      },
    });

    // Build payment where clause
    const paymentWhere = { tenant };
    if (dateFilter.length > 0) {
      paymentWhere[Op.or] = dateFilter.map((d) => ({
        month: d.month,
        year: d.year,
      }));
    }

    // Build expense/revenue where clause (not filtered by grade)
    const expenseRevenueWhere = { tenant };
    if (dateFilter.length > 0) {
      expenseRevenueWhere[Op.or] = dateFilter.map((d) => ({
        month: d.month,
        year: d.year,
      }));
    }

    // Get total expenses and revenues (not grade-specific)
    const expenses = await Expense.findAll({
      where: expenseRevenueWhere,
      attributes: [
        [Sequelize.fn("SUM", Sequelize.col("amount")), "total"],
      ],
      raw: true,
    });

    const revenues = await Revenue.findAll({
      where: expenseRevenueWhere,
      attributes: [
        [Sequelize.fn("SUM", Sequelize.col("amount")), "total"],
      ],
      raw: true,
    });

    const totalExpense = parseFloat(expenses[0]?.total || 0);
    const totalRevenue = parseFloat(revenues[0]?.total || 0);

    // Get payments grouped by grade - separate amount, extra_amount, and exam_fee
    const payments = await Payment.findAll({
      where: paymentWhere,
      attributes: [
        "gradePrimaryId",
        [Sequelize.fn("SUM", Sequelize.col("amount")), "payment"],
        [Sequelize.fn("SUM", Sequelize.col("extra_amount")), "extraPayment"],
        [Sequelize.fn("SUM", Sequelize.col("exam_fee")), "examPayment"],
      ],
      group: ["gradePrimaryId"],
      raw: true,
    });

    // Create maps for payments by grade
    const paymentMap = new Map();
    const extraPaymentMap = new Map();
    const examPaymentMap = new Map();
    payments.forEach((p) => {
      if (p.gradePrimaryId) {
        paymentMap.set(p.gradePrimaryId, parseFloat(p.payment || 0));
        extraPaymentMap.set(p.gradePrimaryId, parseFloat(p.extraPayment || 0));
        examPaymentMap.set(p.gradePrimaryId, parseFloat(p.examPayment || 0));
      }
    });

    // Build result array
    const result = grades.map((grade) => {
      const payment = paymentMap.get(grade.primaryId) || 0;
      const extraPayment = extraPaymentMap.get(grade.primaryId) || 0;
      const examPayment = examPaymentMap.get(grade.primaryId) || 0;
      const totalPayment = payment + extraPayment;
      const totalRevenueForGrade = totalPayment + totalRevenue; // Revenue is shared across all grades
      const expenseForGrade = (totalExpense / grades.length); // Distribute expense equally (or you can change this logic)
      const profit = totalRevenueForGrade - expenseForGrade;

      return {
        gradeId: grade.primaryId,
        gradeName: grade.name,
        revenue: totalRevenue,
        payment: payment,
        extraPayment: extraPayment,
        examPayment: examPayment,
        expense: expenseForGrade,
        totalRevenue: totalRevenueForGrade,
        profit: profit,
      };
    });

    // Sort by grade name
    result.sort((a, b) => a.gradeName.localeCompare(b.gradeName));

    return res.status(200).json({
      message: "Grade breakdown retrieved successfully",
      data: result,
    });
  } catch (error) {
    console.error("Error fetching grade breakdown:", error);
    return res.status(500).json({
      message: "Something went wrong",
      data: error.message,
    });
  }
};

module.exports = { getGradeBreakdown };

