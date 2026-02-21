const { Payment, Grade, Revenue, RevenueCategory } = require("../../Model");
const { Sequelize } = require("sequelize");

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const getYearlyIncomeReport = async (req, res) => {
  try {
    const { tenant, year } = req.query;

    if (!tenant || !year) {
      return res.status(400).json({
        message: "Tenant and year are required",
      });
    }

    const yearInt = parseInt(year);

    const grades = await Grade.findAll({
      where: { tenant, del: false },
      order: [["name", "ASC"]],
      attributes: ["primaryId", "name"],
    });

    const payments = await Payment.findAll({
      where: { tenant, year: yearInt },
      attributes: [
        "month",
        "gradePrimaryId",
        [Sequelize.literal("SUM(amount + COALESCE(extra_amount, 0) + COALESCE(exam_fee, 0))"), "total"],
        [Sequelize.literal("COUNT(DISTINCT userId)"), "studentCount"],
      ],
      group: ["month", "gradePrimaryId"],
      raw: true,
    });

    const paymentMap = new Map();
    const studentCountMap = new Map();
    payments.forEach((p) => {
      const key = `${p.month}_${p.gradePrimaryId}`;
      paymentMap.set(key, parseFloat(p.total || 0));
      studentCountMap.set(key, parseInt(p.studentCount || 0, 10));
    });

    const gradeYearlyTotals = {};
    grades.forEach((g) => {
      gradeYearlyTotals[g.primaryId] = 0;
    });

    const monthlyData = MONTHS.map((month) => {
      const gradeTotals = {};
      const studentCounts = {};
      let rowTotal = 0;
      let totalStudents = 0;

      grades.forEach((grade) => {
        const key = `${month}_${grade.primaryId}`;
        const val = paymentMap.get(key) || 0;
        const count = studentCountMap.get(key) || 0;
        gradeTotals[grade.primaryId] = val;
        studentCounts[grade.primaryId] = count;
        rowTotal += val;
        totalStudents += count;
        gradeYearlyTotals[grade.primaryId] = (gradeYearlyTotals[grade.primaryId] || 0) + val;
      });

      return {
        month,
        gradeTotals,
        studentCounts,
        total: rowTotal,
        totalStudents,
      };
    });

    const tableGrandTotal = Object.values(gradeYearlyTotals).reduce((a, b) => a + b, 0);

    const revenues = await Revenue.findAll({
      where: { tenant, year: yearInt },
      attributes: [
        "categoryId",
        [Sequelize.fn("SUM", Sequelize.col("amount")), "yearlyTotal"],
      ],
      group: ["categoryId"],
      raw: true,
    });

    const categoryIds = [...new Set(revenues.map((r) => r.categoryId).filter(Boolean))];
    const categories = categoryIds.length
      ? await RevenueCategory.findAll({
          where: { id: categoryIds },
          attributes: ["id", "name"],
        })
      : [];
    const categoryNameMap = new Map(categories.map((c) => [c.id, c.name]));

    const revenueByCategory = revenues.map((r) => ({
      categoryName: categoryNameMap.get(r.categoryId) || "—",
      yearlyTotal: parseFloat(r.yearlyTotal || 0),
    }));

    const revenueGrandTotal = revenueByCategory.reduce((sum, r) => sum + r.yearlyTotal, 0);
    const finalTotal = tableGrandTotal + revenueGrandTotal;

    return res.status(200).json({
      message: "Yearly income report retrieved successfully",
      data: {
        grades: grades.map((g) => ({ id: g.primaryId, name: g.name })),
        monthlyData,
        gradeYearlyTotals,
        tableGrandTotal,
        revenueByCategory,
        revenueGrandTotal,
        finalTotal,
      },
    });
  } catch (error) {
    console.error("Error fetching yearly income report:", error);
    return res.status(500).json({
      message: "Something went wrong",
      data: error.message,
    });
  }
};

module.exports = { getYearlyIncomeReport };
