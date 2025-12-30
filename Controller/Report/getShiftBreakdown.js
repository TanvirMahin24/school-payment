const { Expense, Revenue, Payment, Grade, Shift } = require("../../Model");
const { Op, Sequelize } = require("sequelize");

// Helper function to get month index
function getMonthIndex(monthName) {
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  return months.indexOf(monthName);
}

const getShiftBreakdown = async (req, res) => {
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

    // Get all grades
    const grades = await Grade.findAll({
      where: {
        tenant,
        del: false,
      },
    });

    // Get all shifts for these grades
    const shifts = await Shift.findAll({
      where: {
        tenant,
        del: false,
      },
    });

    // Group shifts by grade
    const shiftsByGrade = new Map();
    shifts.forEach((shift) => {
      if (shift.gradeTenant === tenant) {
        if (!shiftsByGrade.has(shift.gradePrimaryId)) {
          shiftsByGrade.set(shift.gradePrimaryId, []);
        }
        shiftsByGrade.get(shift.gradePrimaryId).push(shift);
      }
    });

    // Build payment where clause
    const paymentWhere = { tenant };
    if (dateFilter.length > 0) {
      paymentWhere[Op.or] = dateFilter.map((d) => ({
        month: d.month,
        year: d.year,
      }));
    }

    // Build expense/revenue where clause
    const expenseRevenueWhere = { tenant };
    if (dateFilter.length > 0) {
      expenseRevenueWhere[Op.or] = dateFilter.map((d) => ({
        month: d.month,
        year: d.year,
      }));
    }

    // Get total expenses and revenues
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

    // Get payments grouped by grade and shift
    const payments = await Payment.findAll({
      where: paymentWhere,
      attributes: [
        "gradePrimaryId",
        "shiftPrimaryId",
        [Sequelize.fn("SUM", Sequelize.col("total_amount")), "total"],
      ],
      group: ["gradePrimaryId", "shiftPrimaryId"],
      raw: true,
    });

    // Create a map for payments by grade-shift
    const paymentMap = new Map();
    payments.forEach((p) => {
      if (p.gradePrimaryId && p.shiftPrimaryId) {
        const key = `${p.gradePrimaryId}_${p.shiftPrimaryId}`;
        paymentMap.set(key, parseFloat(p.total || 0));
      }
    });

    // Count total shifts for expense distribution
    let totalShifts = 0;
    grades.forEach((grade) => {
      const gradeShifts = shiftsByGrade.get(grade.primaryId) || [];
      totalShifts += gradeShifts.length;
    });

    // Build result array
    const result = [];
    grades.forEach((grade) => {
      const gradeShifts = shiftsByGrade.get(grade.primaryId) || [];
      gradeShifts.forEach((shift) => {
        const key = `${grade.primaryId}_${shift.primaryId}`;
        const payment = paymentMap.get(key) || 0;
        const totalRevenueForShift = payment + (totalRevenue / totalShifts); // Distribute revenue
        const expenseForShift = totalExpense / totalShifts; // Distribute expense equally
        const profit = totalRevenueForShift - expenseForShift;

        result.push({
          gradeId: grade.primaryId,
          gradeName: grade.name,
          shiftId: shift.primaryId,
          shiftName: shift.name,
          revenue: totalRevenue / totalShifts,
          payment: payment,
          expense: expenseForShift,
          totalRevenue: totalRevenueForShift,
          profit: profit,
        });
      });
    });

    // Sort by grade name, then shift name
    result.sort((a, b) => {
      if (a.gradeName !== b.gradeName) {
        return a.gradeName.localeCompare(b.gradeName);
      }
      return a.shiftName.localeCompare(b.shiftName);
    });

    return res.status(200).json({
      message: "Shift breakdown retrieved successfully",
      data: result,
    });
  } catch (error) {
    console.error("Error fetching shift breakdown:", error);
    return res.status(500).json({
      message: "Something went wrong",
      data: error.message,
    });
  }
};

module.exports = { getShiftBreakdown };

