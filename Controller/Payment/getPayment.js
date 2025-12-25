const Sequelize = require("sequelize");
const { Payment, Student } = require("../../Model");

const getPayments = async (req, res) => {
  try {
    // Get filter parameters from query string
    const {
      tenant,
      year,
      gradeId,
      shiftId,
      batchId,
    } = req.query;

    // Build where clause
    const whereClause = {};

    if (tenant) {
      whereClause.tenant = tenant;
    }

    if (year) {
      whereClause.year = parseInt(year);
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
      } else {
        // If grade doesn't exist, return empty result
        return res.status(200).json({
          message: "Payment list",
          data: [],
        });
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
      } else {
        return res.status(200).json({
          message: "Payment list",
          data: [],
        });
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
      } else {
        return res.status(200).json({
          message: "Payment list",
          data: [],
        });
      }
    }

    // Payment list with student data
    // Note: userId is from primary-coaching project, not a foreign key to User table
    const paymentList = await Payment.findAll({
      where: whereClause,
      order: [["id", "DESC"]],
    });

    // Get unique tenant values from payments
    const tenants = [...new Set(paymentList.map((p) => p.tenant).filter(Boolean))];
    
    // Get unique userId values from payments
    const userIds = [...new Set(paymentList.map((p) => p.userId).filter(Boolean))];

    // Fetch all relevant students in one query
    let students = [];
    if (tenants.length > 0 && userIds.length > 0) {
      students = await Student.findAll({
        where: {
          tenant: { [Sequelize.Op.in]: tenants },
          primaryId: { [Sequelize.Op.in]: userIds },
        },
      });
    }

    // Create a map for quick student lookup: key = `${tenant}_${primaryId}`
    const studentMap = new Map();
    students.forEach((student) => {
      const key = `${student.tenant}_${student.primaryId}`;
      studentMap.set(key, {
        name: student.name,
        uid: student.uid,
      });
    });

    // Map payments with student data
    const paymentsWithStudents = paymentList.map((payment) => {
      const paymentData = payment.toJSON();
      
      // Find student in map
      if (payment.userId && payment.tenant) {
        const key = `${payment.tenant}_${payment.userId}`;
        const student = studentMap.get(key);
        if (student) {
          paymentData.student = student;
        }
      }
      
      return paymentData;
    });

    return res.status(200).json({
      message: "Payment list",
      data: paymentsWithStudents,
    });
  } catch (error) {
    console.error("Error fetching payments:", error);
    return res.status(500).json({
      message: "Something went wrong",
      data: error.message,
    });
  }
};

module.exports = { getPayments };


