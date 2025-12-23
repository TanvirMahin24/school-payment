const { validationResult } = require("express-validator");
const { Payment } = require("../../Model");

const createExternalPayment = async (req, res) => {
  try {
    // Validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    // Extract data from request body
    const {
      amount,
      month,
      userId,
      tenant,
      year,
      meta,
      note,
      extra_amount,
      total_amount,
    } = req.body;

    // Calculate total_amount if not provided
    const calculatedTotalAmount =
      total_amount ||
      (parseFloat(amount || 0) + parseFloat(extra_amount || 0));

    // Create payment entry
    const newPayment = await Payment.create({
      amount: parseFloat(amount),
      month,
      userId: parseInt(userId),
      tenant: tenant || null,
      year: year ? parseInt(year) : null,
      meta: meta || null,
      note: note || null,
      extra_amount: extra_amount ? parseFloat(extra_amount) : 0,
      total_amount: parseFloat(calculatedTotalAmount),
    });

    return res.status(201).json({
      success: true,
      message: "Payment created successfully",
      data: {
        id: newPayment.id,
        amount: newPayment.amount,
        month: newPayment.month,
        userId: newPayment.userId,
        tenant: newPayment.tenant,
        year: newPayment.year,
        meta: newPayment.meta,
        note: newPayment.note,
        extra_amount: newPayment.extra_amount,
        total_amount: newPayment.total_amount,
        createdAt: newPayment.createdAt,
        updatedAt: newPayment.updatedAt,
      },
    });
  } catch (error) {
    console.error("Error creating external payment:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

module.exports = { createExternalPayment };

