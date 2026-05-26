const { Payment, Revenue, RevenueCategory } = require("../../Model");
const { Sequelize } = require("sequelize");

const getCombinedIncomeDetail = async (req, res) => {
  try {
    const { tenant, month, year } = req.query;

    if (!tenant || !month || !year) {
      return res.status(400).json({
        message: "Tenant, month, and year are required",
      });
    }

    const whereClause = {
      tenant,
      month,
      year: parseInt(year, 10),
    };

    const paymentRows = await Payment.findAll({
      where: whereClause,
      attributes: [
        [Sequelize.fn("SUM", Sequelize.col("amount")), "payment"],
        [Sequelize.fn("SUM", Sequelize.col("extra_amount")), "extraPayment"],
        [Sequelize.fn("SUM", Sequelize.col("exam_fee")), "examPayment"],
      ],
      raw: true,
    });

    const payment = parseFloat(paymentRows[0]?.payment || 0);
    const extraPayment = parseFloat(paymentRows[0]?.extraPayment || 0);
    const examPayment = parseFloat(paymentRows[0]?.examPayment || 0);
    const totalPaymentIncome = payment + extraPayment + examPayment;

    const revenues = await Revenue.findAll({
      where: whereClause,
      include: [
        {
          model: RevenueCategory,
          as: "category",
        },
      ],
      order: [["id", "DESC"]],
    });

    const revenueEntries = revenues.map((revenue) => ({
      id: revenue.id,
      amount: parseFloat(revenue.amount || 0),
      description: revenue.description || "",
      note: revenue.note || "",
      categoryName: revenue.category?.name || "—",
    }));

    const manualRevenueTotal = revenueEntries.reduce(
      (sum, entry) => sum + entry.amount,
      0,
    );

    return res.status(200).json({
      message: "Combined income detail retrieved successfully",
      data: {
        paymentSummary: {
          payment,
          extraPayment,
          examPayment,
          totalPaymentIncome,
        },
        revenueEntries,
        totalIncome: totalPaymentIncome + manualRevenueTotal,
      },
    });
  } catch (error) {
    console.error("Error fetching combined income detail:", error);
    return res.status(500).json({
      message: "Something went wrong",
      data: error.message,
    });
  }
};

module.exports = { getCombinedIncomeDetail };
