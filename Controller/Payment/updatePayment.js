const { validationResult } = require("express-validator");
const { Payment, Grade, Shift, Batch } = require("../../Model");

const updatePayment = async (req, res) => {
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

    // Find payment by id
    const payment = await Payment.findByPk(parseInt(req.params.id));

    // Check if payment exists
    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    // Calculate total_amount if not provided
    const calculatedTotalAmount =
      total_amount !== undefined
        ? parseFloat(total_amount)
        : parseFloat(amount || payment.amount) +
          parseFloat(extra_amount !== undefined ? extra_amount : payment.extra_amount || 0);

    // Prepare update data
    const updateData = {
      amount: parseFloat(amount),
      month,
      userId: parseInt(userId),
    };

    // Validate and set grade/shift/batch if provided
    let gradeTenant = null;
    let gradePrimaryId = null;

    if (gradeId !== undefined) {
      if (gradeId) {
        const grade = await Grade.findOne({
          where: {
            primaryId: parseInt(gradeId),
            del: false,
            ...(tenant !== undefined && tenant ? { tenant } : {}),
          },
        });

        if (!grade) {
          return res.status(400).json({
            message: "Invalid grade ID or grade does not belong to the specified tenant",
          });
        }

        gradeTenant = grade.tenant;
        gradePrimaryId = grade.primaryId;
        updateData.gradeTenant = gradeTenant;
        updateData.gradePrimaryId = gradePrimaryId;
      } else {
        updateData.gradeTenant = null;
        updateData.gradePrimaryId = null;
      }
    }

    if (shiftId !== undefined) {
      if (shiftId) {
        const shift = await Shift.findOne({
          where: {
            primaryId: parseInt(shiftId),
            del: false,
            ...(tenant !== undefined && tenant ? { tenant } : {}),
          },
        });

        if (!shift) {
          return res.status(400).json({
            message: "Invalid shift ID or shift does not belong to the specified tenant",
          });
        }

        updateData.shiftTenant = shift.tenant;
        updateData.shiftPrimaryId = shift.primaryId;

        // Validate shift belongs to grade if both provided
        if (gradeId && (shift.gradeTenant !== gradeTenant || shift.gradePrimaryId !== gradePrimaryId)) {
          return res.status(400).json({
            message: "Shift does not belong to the specified grade",
          });
        }
      } else {
        updateData.shiftTenant = null;
        updateData.shiftPrimaryId = null;
      }
    }

    if (batchId !== undefined) {
      if (batchId) {
        const batch = await Batch.findOne({
          where: {
            primaryId: parseInt(batchId),
            del: false,
            ...(tenant !== undefined && tenant ? { tenant } : {}),
          },
        });

        if (!batch) {
          return res.status(400).json({
            message: "Invalid batch ID or batch does not belong to the specified tenant",
          });
        }

        updateData.batchTenant = batch.tenant;
        updateData.batchPrimaryId = batch.primaryId;

        // Validate batch belongs to grade and shift if provided
        if (gradeId && (batch.gradeTenant !== gradeTenant || batch.gradePrimaryId !== gradePrimaryId)) {
          return res.status(400).json({
            message: "Batch does not belong to the specified grade",
          });
        }

        if (shiftId && (batch.shiftTenant !== updateData.shiftTenant || batch.shiftPrimaryId !== updateData.shiftPrimaryId)) {
          return res.status(400).json({
            message: "Batch does not belong to the specified shift",
          });
        }
      } else {
        updateData.batchTenant = null;
        updateData.batchPrimaryId = null;
      }
    }

    // Add optional fields if provided
    if (tenant !== undefined) updateData.tenant = tenant || null;
    if (year !== undefined) updateData.year = year ? parseInt(year) : null;
    if (meta !== undefined) updateData.meta = meta || null;
    if (note !== undefined) updateData.note = note || null;
    if (extra_amount !== undefined) updateData.extra_amount = parseFloat(extra_amount) || 0;
    if (total_amount !== undefined || amount !== undefined || extra_amount !== undefined) {
      updateData.total_amount = parseFloat(calculatedTotalAmount);
    }

    // Update payment
    const updatedPayment = await payment.update(updateData);

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


