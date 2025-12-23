const { validationResult } = require("express-validator");
const { Payment, Grade, Shift, Batch } = require("../../Model");

const createPayment = async (req, res) => {
  try {
    // Validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    // Form data
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
      gradeId,
      shiftId,
      batchId,
    } = req.body;

    // Check Payment exist or not
    const existingPayment = await Payment.findAll({
      where: {
        month,
        userId: parseInt(userId),
        ...(tenant && { tenant }),
      },
    });

    if (existingPayment.length > 0) {
      return res.status(400).json({
        message: "Payment for this month already exists",
      });
    }

    // Validate grade/shift/batch if provided
    let gradeTenant = null;
    let gradePrimaryId = null;
    let shiftTenant = null;
    let shiftPrimaryId = null;
    let batchTenant = null;
    let batchPrimaryId = null;

    if (gradeId) {
      const grade = await Grade.findOne({
        where: {
          primaryId: parseInt(gradeId),
          del: false,
          ...(tenant && { tenant }),
        },
      });

      if (!grade) {
        return res.status(400).json({
          message: "Invalid grade ID or grade does not belong to the specified tenant",
        });
      }

      gradeTenant = grade.tenant;
      gradePrimaryId = grade.primaryId;
    }

    if (shiftId) {
      const shift = await Shift.findOne({
        where: {
          primaryId: parseInt(shiftId),
          del: false,
          ...(tenant && { tenant }),
        },
      });

      if (!shift) {
        return res.status(400).json({
          message: "Invalid shift ID or shift does not belong to the specified tenant",
        });
      }

      shiftTenant = shift.tenant;
      shiftPrimaryId = shift.primaryId;

      // Validate shift belongs to grade if both provided
      if (gradeId && (shift.gradeTenant !== gradeTenant || shift.gradePrimaryId !== gradePrimaryId)) {
        return res.status(400).json({
          message: "Shift does not belong to the specified grade",
        });
      }
    }

    if (batchId) {
      const batch = await Batch.findOne({
        where: {
          primaryId: parseInt(batchId),
          del: false,
          ...(tenant && { tenant }),
        },
      });

      if (!batch) {
        return res.status(400).json({
          message: "Invalid batch ID or batch does not belong to the specified tenant",
        });
      }

      batchTenant = batch.tenant;
      batchPrimaryId = batch.primaryId;

      // Validate batch belongs to grade and shift if provided
      if (gradeId && (batch.gradeTenant !== gradeTenant || batch.gradePrimaryId !== gradePrimaryId)) {
        return res.status(400).json({
          message: "Batch does not belong to the specified grade",
        });
      }

      if (shiftId && (batch.shiftTenant !== shiftTenant || batch.shiftPrimaryId !== shiftPrimaryId)) {
        return res.status(400).json({
          message: "Batch does not belong to the specified shift",
        });
      }
    }

    // Calculate total_amount if not provided
    const calculatedTotalAmount =
      total_amount ||
      (parseFloat(amount || 0) + parseFloat(extra_amount || 0));

    // Create new payment
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
      gradeTenant,
      gradePrimaryId,
      shiftTenant,
      shiftPrimaryId,
      batchTenant,
      batchPrimaryId,
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


