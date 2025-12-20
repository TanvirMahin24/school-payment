const { Payment, User } = require("../../Model");

const getPayments = async (req, res) => {
  try {
    // Payment list
    const paymentList = await Payment.findAll({
      order: [["id", "DESC"]],
      include: [User],
    });

    return res.status(200).json({
      message: "Payment list",
      data: paymentList,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong",
      data: error.message,
    });
  }
};

module.exports = { getPayments };

