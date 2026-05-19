const Sequelize = require("sequelize");
const { validationResult } = require("express-validator");
const { Payment, Student, Grade, Shift, Batch } = require("../../Model");
const { canAccessTenant } = require("../../Utils/permissions");
const { parseBoolean } = require("../../Utils/parseBoolean");

const formatValidationErrors = (errors) => ({
  success: false,
  message: "Validation failed",
  errors: errors.array(),
});

const emptyDuePaymentResponse = (res, message = "Due payment list") =>
  res.status(200).json({
    success: true,
    message,
    data: [],
  });

const buildDuePaymentWhereClause = async ({ tenant, year, month, gradeId, shiftId, batchId }) => {
  const whereClause = {
    tenant,
    year: parseInt(year),
    month,
    due: true,
  };

  if (gradeId) {
    const grade = await Grade.findOne({
      where: {
        tenant,
        primaryId: parseInt(gradeId),
        del: false,
      },
    });

    if (!grade) return { empty: true };

    whereClause.gradeTenant = grade.tenant;
    whereClause.gradePrimaryId = grade.primaryId;
  }

  if (shiftId) {
    const shift = await Shift.findOne({
      where: {
        tenant,
        primaryId: parseInt(shiftId),
        del: false,
      },
    });

    if (!shift) return { empty: true };

    whereClause.shiftTenant = shift.tenant;
    whereClause.shiftPrimaryId = shift.primaryId;
  }

  if (batchId) {
    const batch = await Batch.findOne({
      where: {
        tenant,
        primaryId: parseInt(batchId),
        del: false,
      },
    });

    if (!batch) return { empty: true };

    whereClause.batchTenant = batch.tenant;
    whereClause.batchPrimaryId = batch.primaryId;
  }

  return { whereClause };
};

const attachStudentData = async (payments) => {
  const tenants = [...new Set(payments.map((payment) => payment.tenant).filter(Boolean))];
  const userIds = [...new Set(payments.map((payment) => payment.userId).filter(Boolean))];

  let students = [];
  if (tenants.length > 0 && userIds.length > 0) {
    students = await Student.findAll({
      where: {
        tenant: { [Sequelize.Op.in]: tenants },
        primaryId: { [Sequelize.Op.in]: userIds },
        del: false,
      },
    });
  }

  const studentMap = new Map();
  students.forEach((student) => {
    studentMap.set(`${student.tenant}_${student.primaryId}`, {
      id: student.primaryId,
      uid: student.uid,
      name: student.name,
      phone: student.phone,
    });
  });

  return payments.map((payment) => {
    const data = payment.toJSON();
    data.student = studentMap.get(`${payment.tenant}_${payment.userId}`) || null;
    return data;
  });
};

const getDuePayments = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(formatValidationErrors(errors));
    }

    const { tenant, year, month, gradeId, shiftId, batchId } = req.query;
    const { whereClause, empty } = await buildDuePaymentWhereClause({
      tenant,
      year,
      month,
      gradeId,
      shiftId,
      batchId,
    });

    if (empty) return emptyDuePaymentResponse(res);

    const paymentList = await Payment.findAll({
      where: whereClause,
      order: [["id", "DESC"]],
    });

    const duePayments = await attachStudentData(paymentList);

    return res.status(200).json({
      success: true,
      message: "Due payment list",
      data: duePayments,
    });
  } catch (error) {
    console.error("Error fetching due payments:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      data: error.message,
    });
  }
};

const updatePaymentDue = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(formatValidationErrors(errors));
    }

    const payment = await Payment.findByPk(parseInt(req.params.id));
    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found",
      });
    }

    if (req.user && !canAccessTenant(req.user, payment.tenant)) {
      return res.status(403).json({
        success: false,
        message: `You do not have permission to access ${payment.tenant} tenant`,
      });
    }

    const due = parseBoolean(req.body.due, false);

    await payment.update({
      due,
      due_amount: due ? payment.due_amount : 0,
    });

    return res.status(200).json({
      success: true,
      message: "Due payment updated successfully",
      data: {
        id: payment.id,
        due: payment.due,
        due_amount: payment.due_amount,
        tenant: payment.tenant,
        year: payment.year,
        month: payment.month,
        userId: payment.userId,
      },
    });
  } catch (error) {
    console.error("Error updating due payment:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      data: error.message,
    });
  }
};

module.exports = {
  getDuePayments,
  updatePaymentDue,
};
