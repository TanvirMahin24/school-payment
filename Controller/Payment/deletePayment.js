const { Payment } = require("../../Model");

const deletePayment = async (req, res) => {
  try {
    const { id } = req.params;
    // Check Payment exist or not
    const payment = await Payment.findByPk(id);
    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    // Delete payment
    await payment.destroy();

    return res.status(200).json({
      message: "Payment deleted",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Something went wrong",
      data: error.message,
    });
  }
};

module.exports = { deletePayment };

