const Sequelize = require("sequelize");
const { Payment, Student } = require("../../Model");

const getPaymentsByStudents = async (req, res) => {
  try {
    const { tenant, year, gradeId, shiftId, batchId, studentIds, month } = req.query;

    if (!studentIds) {
      return res.status(400).json({
        message: "Student IDs are required",
        data: [],
      });
    }

    // Parse studentIds (can be comma-separated string or array)
    const studentIdArray = Array.isArray(studentIds)
      ? studentIds.map((id) => parseInt(id))
      : studentIds.split(",").map((id) => parseInt(id.trim()));

    // Build where clause
    const whereClause = {
      userId: { [Sequelize.Op.in]: studentIdArray },
    };

    if (tenant) {
      whereClause.tenant = tenant;
    }

    if (year) {
      whereClause.year = parseInt(year);
    }

    if (month) {
      whereClause.month = month;
    }

    if (gradeId) {
      // For composite key, we need to find the grade first to get tenant
      const { Grade } = require("../../Model");
      const grade = await Grade.findOne({
        where: {
          primaryId: parseInt(gradeId),
          del: false,
        },
      });

      if (grade) {
        whereClause.gradeTenant = grade.tenant;
        whereClause.gradePrimaryId = grade.primaryId;
      }
    }

    if (shiftId) {
      const { Shift } = require("../../Model");
      const shift = await Shift.findOne({
        where: {
          primaryId: parseInt(shiftId),
          del: false,
        },
      });

      if (shift) {
        whereClause.shiftTenant = shift.tenant;
        whereClause.shiftPrimaryId = shift.primaryId;
      }
    }

    if (batchId) {
      const { Batch } = require("../../Model");
      const batch = await Batch.findOne({
        where: {
          primaryId: parseInt(batchId),
          del: false,
        },
      });

      if (batch) {
        whereClause.batchTenant = batch.tenant;
        whereClause.batchPrimaryId = batch.primaryId;
      }
    }

    // Fetch payments
    const paymentList = await Payment.findAll({
      where: whereClause,
      order: [["id", "DESC"]],
    });

    // Create a map of userId to payment for easy lookup
    const paymentMap = {};
    paymentList.forEach((payment) => {
      paymentMap[payment.userId] = payment.toJSON();
    });

    return res.status(200).json({
      message: "Payments retrieved successfully",
      data: paymentMap,
    });
  } catch (error) {
    console.error("Error fetching payments by students:", error);
    return res.status(500).json({
      message: "Something went wrong",
      data: error.message,
    });
  }
};

module.exports = { getPaymentsByStudents };







