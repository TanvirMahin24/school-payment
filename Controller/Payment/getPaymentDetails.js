const { Payment } = require("../../Model");

const getPaymentDetails = async (req, res) => {
  try {
    const { id } = req.params;

    // Find payment by id
    // Note: userId is from primary-coaching project, not a foreign key to User table
    const payment = await Payment.findByPk(id);

    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    return res.status(200).json({
      message: "Payment details",
      data: payment,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong",
      data: error.message,
    });
  }
};

module.exports = { getPaymentDetails };


