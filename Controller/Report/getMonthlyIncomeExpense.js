const { Expense, Revenue, Payment, Grade, ExpenseCategory, RevenueCategory } = require("../../Model");
const { Sequelize } = require("sequelize");

const getMonthlyIncomeExpense = async (req, res) => {
  try {
    const { tenant, gradeId, shiftId, batchId, month, year } = req.query;

    if (!tenant || !month || !year) {
      return res.status(400).json({
        message: "Tenant, month, and year are required",
      });
    }

    const monthStr = String(month);
    const yearInt = parseInt(year);

    const paymentWhere = {
      tenant,
      month: monthStr,
      year: yearInt,
    };
    if (gradeId) paymentWhere.gradePrimaryId = parseInt(gradeId);
    if (shiftId) paymentWhere.shiftPrimaryId = parseInt(shiftId);
    if (batchId) paymentWhere.batchPrimaryId = parseInt(batchId);

    const gradeWhere = { tenant, del: false };
    if (gradeId) gradeWhere.primaryId = parseInt(gradeId);

    const grades = await Grade.findAll({
      where: gradeWhere,
      order: [["name", "ASC"]],
    });

    const payments = await Payment.findAll({
      where: paymentWhere,
      attributes: [
        "gradePrimaryId",
        [Sequelize.fn("SUM", Sequelize.col("exam_fee")), "examFee"],
        [Sequelize.fn("SUM", Sequelize.col("amount")), "serviceCharge"],
        [Sequelize.fn("SUM", Sequelize.col("extra_amount")), "sessionCharge"],
        [Sequelize.literal("COUNT(DISTINCT userId)"), "studentCount"],
      ],
      group: ["gradePrimaryId"],
      raw: true,
    });

    const paymentMap = new Map();
    payments.forEach((p) => {
      if (p.gradePrimaryId) {
        paymentMap.set(p.gradePrimaryId, {
          examFee: parseFloat(p.examFee || 0),
          serviceCharge: parseFloat(p.serviceCharge || 0),
          sessionCharge: parseFloat(p.sessionCharge || 0),
          studentCount: parseInt(p.studentCount || 0, 10),
        });
      }
    });

    const incomeByGrade = grades
      .map((grade) => {
        const data = paymentMap.get(grade.primaryId);
        if (!data) return null;
        const total = data.examFee + data.serviceCharge + data.sessionCharge;
        return {
          gradeId: grade.primaryId,
          gradeName: grade.name,
          examFee: data.examFee,
          serviceCharge: data.serviceCharge,
          sessionCharge: data.sessionCharge,
          total,
          studentCount: data.studentCount,
        };
      })
      .filter(Boolean);

    const expenses = await Expense.findAll({
      where: { tenant, month: monthStr, year: yearInt },
      include: [{ model: ExpenseCategory, as: "category" }],
      order: [["id", "ASC"]],
    });

    const revenues = await Revenue.findAll({
      where: { tenant, month: monthStr, year: yearInt },
      include: [{ model: RevenueCategory, as: "category" }],
      order: [["id", "ASC"]],
    });

    const totalPaymentIncome = incomeByGrade.reduce((sum, g) => sum + g.total, 0);
    const totalRevenue = revenues.reduce((sum, r) => sum + parseFloat(r.amount || 0), 0);
    const totalExpense = expenses.reduce((sum, e) => sum + parseFloat(e.amount || 0), 0);
    const totalStudents = incomeByGrade.reduce((sum, g) => sum + g.studentCount, 0);

    return res.status(200).json({
      message: "Monthly income and expense statement retrieved successfully",
      data: {
        incomeByGrade,
        expenses: expenses.map((e) => ({
          id: e.id,
          categoryName: e.category?.name || "—",
          amount: parseFloat(e.amount || 0),
        })),
        revenues: revenues.map((r) => ({
          id: r.id,
          categoryName: r.category?.name || "—",
          amount: parseFloat(r.amount || 0),
          description: r.description || "",
        })),
        totalPaymentIncome,
        totalRevenue,
        totalExpense,
        totalStudents,
      },
    });
  } catch (error) {
    console.error("Error fetching monthly income expense:", error);
    return res.status(500).json({
      message: "Something went wrong",
      data: error.message,
    });
  }
};

module.exports = { getMonthlyIncomeExpense };
