const { Payment } = require("../../Model");

const getDashboard = async (req, res) => {
  try {
    const d = new Date();
    const currentMonth = d.toLocaleString("default", { month: "long" });
    const currentYear = d.getFullYear().toString();

    const paymentCount = await Payment.count();

    const totalAmountResult = await Payment.sum("amount");
    const totalAmount = totalAmountResult || 0;

    const thisMonthPayments = await Payment.count({
      where: {
        month: currentMonth,
      },
    });

    return res.status(200).json({
      message: "Admin data",
      data: {
        payments: paymentCount,
        totalAmount: totalAmount.toFixed(2),
        thisMonth: thisMonthPayments,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong",
      data: error.message,
    });
  }
};

module.exports = { getDashboard };


