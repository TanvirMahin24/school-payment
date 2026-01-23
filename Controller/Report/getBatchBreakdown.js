const { Expense, Revenue, Payment, Grade, Shift, Batch } = require("../../Model");
const { Op, Sequelize } = require("sequelize");

// Helper function to get month index
function getMonthIndex(monthName) {
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  return months.indexOf(monthName);
}

const getBatchBreakdown = async (req, res) => {
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

    // Get all shifts
    const shifts = await Shift.findAll({
      where: {
        tenant,
        del: false,
      },
    });

    // Get all batches
    const batches = await Batch.findAll({
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

    // Group batches by shift
    const batchesByShift = new Map();
    batches.forEach((batch) => {
      if (batch.shiftTenant === tenant && batch.gradeTenant === tenant) {
        const key = `${batch.gradePrimaryId}_${batch.shiftPrimaryId}`;
        if (!batchesByShift.has(key)) {
          batchesByShift.set(key, []);
        }
        batchesByShift.get(key).push(batch);
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

    // Get payments grouped by grade, shift, and batch - separate amount and extra_amount
    const payments = await Payment.findAll({
      where: paymentWhere,
      attributes: [
        "gradePrimaryId",
        "shiftPrimaryId",
        "batchPrimaryId",
        [Sequelize.fn("SUM", Sequelize.col("amount")), "payment"],
        [Sequelize.fn("SUM", Sequelize.col("extra_amount")), "extraPayment"],
      ],
      group: ["gradePrimaryId", "shiftPrimaryId", "batchPrimaryId"],
      raw: true,
    });

    // Create maps for payments by grade-shift-batch
    const paymentMap = new Map();
    const extraPaymentMap = new Map();
    payments.forEach((p) => {
      if (p.gradePrimaryId && p.shiftPrimaryId && p.batchPrimaryId) {
        const key = `${p.gradePrimaryId}_${p.shiftPrimaryId}_${p.batchPrimaryId}`;
        paymentMap.set(key, parseFloat(p.payment || 0));
        extraPaymentMap.set(key, parseFloat(p.extraPayment || 0));
      }
    });

    // Count total batches for expense distribution
    let totalBatches = 0;
    grades.forEach((grade) => {
      const gradeShifts = shiftsByGrade.get(grade.primaryId) || [];
      gradeShifts.forEach((shift) => {
        const key = `${grade.primaryId}_${shift.primaryId}`;
        const shiftBatches = batchesByShift.get(key) || [];
        totalBatches += shiftBatches.length;
      });
    });

    // Build result array
    const result = [];
    grades.forEach((grade) => {
      const gradeShifts = shiftsByGrade.get(grade.primaryId) || [];
      gradeShifts.forEach((shift) => {
        const key = `${grade.primaryId}_${shift.primaryId}`;
        const shiftBatches = batchesByShift.get(key) || [];
        shiftBatches.forEach((batch) => {
          const batchKey = `${grade.primaryId}_${shift.primaryId}_${batch.primaryId}`;
          const payment = paymentMap.get(batchKey) || 0;
          const extraPayment = extraPaymentMap.get(batchKey) || 0;
          const totalPayment = payment + extraPayment;
          const totalRevenueForBatch = totalPayment + (totalRevenue / totalBatches); // Distribute revenue
          const expenseForBatch = totalExpense / totalBatches; // Distribute expense equally
          const profit = totalRevenueForBatch - expenseForBatch;

          result.push({
            gradeId: grade.primaryId,
            gradeName: grade.name,
            shiftId: shift.primaryId,
            shiftName: shift.name,
            batchId: batch.primaryId,
            batchName: batch.name,
            revenue: totalRevenue / totalBatches,
            payment: payment,
            extraPayment: extraPayment,
            expense: expenseForBatch,
            totalRevenue: totalRevenueForBatch,
            profit: profit,
          });
        });
      });
    });

    // Sort by grade name, then shift name, then batch name
    result.sort((a, b) => {
      if (a.gradeName !== b.gradeName) {
        return a.gradeName.localeCompare(b.gradeName);
      }
      if (a.shiftName !== b.shiftName) {
        return a.shiftName.localeCompare(b.shiftName);
      }
      return a.batchName.localeCompare(b.batchName);
    });

    return res.status(200).json({
      message: "Batch breakdown retrieved successfully",
      data: result,
    });
  } catch (error) {
    console.error("Error fetching batch breakdown:", error);
    return res.status(500).json({
      message: "Something went wrong",
      data: error.message,
    });
  }
};

module.exports = { getBatchBreakdown };

