const { validationResult } = require("express-validator");
const { Payment } = require("../../Model");
const { Op } = require("sequelize");

const createBulkPayment = async (req, res) => {
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

    const { payments } = req.body;

    if (!Array.isArray(payments) || payments.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Payments array is required and must not be empty",
      });
    }

    const results = {
      created: [],
      updated: [],
      failed: [],
    };

    // Process each payment
    for (const paymentData of payments) {
      try {
        const {
          amount,
          month,
          userId,
          tenant,
          year,
          meta,
          note,
          extra_amount,
          exam_fee,
          total_amount,
          gradeId,
          shiftId,
          batchId,
        } = paymentData;

        // Extract gradeId, shiftId, batchId from meta if not provided at top level
        const finalGradeId = gradeId || meta?.gradeId;
        const finalShiftId = shiftId || meta?.shiftId;
        const finalBatchId = batchId || meta?.batchId;

        // Calculate total_amount if not provided
        const calculatedTotalAmount =
          total_amount ||
          (parseFloat(amount || 0) + parseFloat(extra_amount || 0) + parseFloat(exam_fee || 0));

        // Build where clause to find existing payment
        const whereClause = {
          userId: parseInt(userId),
          month: month,
          year: year ? parseInt(year) : null,
        };

        // Add grade, shift, batch filters if provided
        if (finalGradeId) {
          whereClause.gradePrimaryId = parseInt(finalGradeId);
          whereClause.gradeTenant = tenant || "primary";
        }
        if (finalShiftId) {
          whereClause.shiftPrimaryId = parseInt(finalShiftId);
          whereClause.shiftTenant = tenant || "primary";
        }
        if (finalBatchId) {
          whereClause.batchPrimaryId = parseInt(finalBatchId);
          whereClause.batchTenant = tenant || "primary";
        }

        const existingPayment = await Payment.findOne({ where: whereClause });

        if (existingPayment) {
          // Update existing payment
          const updateData = {
            amount: parseFloat(amount),
            extra_amount: extra_amount ? parseFloat(extra_amount) : 0,
            exam_fee: exam_fee ? parseFloat(exam_fee) : 0,
            total_amount: parseFloat(calculatedTotalAmount),
            meta: meta || null,
            note: note || null,
            tenant: tenant || null,
          };

          // Update grade, shift, batch fields if provided
          if (finalGradeId) {
            updateData.gradeTenant = tenant || "primary";
            updateData.gradePrimaryId = parseInt(finalGradeId);
          }
          if (finalShiftId) {
            updateData.shiftTenant = tenant || "primary";
            updateData.shiftPrimaryId = parseInt(finalShiftId);
          }
          if (finalBatchId) {
            updateData.batchTenant = tenant || "primary";
            updateData.batchPrimaryId = parseInt(finalBatchId);
          }

          await existingPayment.update(updateData);
          results.updated.push({
            userId: parseInt(userId),
            data: existingPayment.toJSON(),
          });
        } else {
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
            exam_fee: exam_fee ? parseFloat(exam_fee) : 0,
            total_amount: parseFloat(calculatedTotalAmount),
            gradeTenant: finalGradeId ? (tenant || "primary") : null,
            gradePrimaryId: finalGradeId ? parseInt(finalGradeId) : null,
            shiftTenant: finalShiftId ? (tenant || "primary") : null,
            shiftPrimaryId: finalShiftId ? parseInt(finalShiftId) : null,
            batchTenant: finalBatchId ? (tenant || "primary") : null,
            batchPrimaryId: finalBatchId ? parseInt(finalBatchId) : null,
          });
          results.created.push({
            userId: parseInt(userId),
            data: newPayment.toJSON(),
          });
        }
      } catch (error) {
        console.error(`Error processing payment for userId ${paymentData.userId}:`, error);
        results.failed.push({
          userId: paymentData.userId,
          error: error.message,
        });
      }
    }

    return res.status(200).json({
      success: true,
      message: `Processed ${payments.length} payment(s): ${results.created.length} created, ${results.updated.length} updated, ${results.failed.length} failed`,
      data: {
        results,
      },
    });
  } catch (error) {
    console.error("Error in createBulkPayment:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
};

module.exports = { createBulkPayment };







