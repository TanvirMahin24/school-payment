const { validationResult } = require("express-validator");
const { Payment } = require("../../Model");

const createPayment = async (req, res) => {
  try {
    // Validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    // Form data
    const { amount, month, userId } = req.body;

    // Check Payment exist or not
    const existingPayment = await Payment.findAll({
      where: {
        month,
        userId: parseInt(userId),
      },
    });

    if (existingPayment.length > 0) {
      return res.status(400).json({
        message: "Payment for this month already exists",
      });
    }

    // Create new payment
    const newPayment = await Payment.create({
      amount: parseFloat(amount),
      month,
      userId: parseInt(userId),
    });

    return res.status(200).json({
      message: "Payment created successfully",
      data: newPayment,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong",
      data: error.message,
    });
  }
};

module.exports = { createPayment };


