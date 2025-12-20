const { validationResult } = require("express-validator");
const { Payment } = require("../../Model");

const updatePayment = async (req, res) => {
  try {
    // Validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    // Form data
    const { amount, month, userId } = req.body;

    // Find payment by id
    const payment = await Payment.findByPk(parseInt(req.params.id));

    // Check if payment exists
    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    // Update payment
    const updatedPayment = await payment.update({
      amount: parseFloat(amount),
      month,
      userId: parseInt(userId),
    });

    return res.status(200).json({
      message: "Payment updated successfully",
      data: updatedPayment,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong",
      data: error.message,
    });
  }
};

module.exports = { updatePayment };

