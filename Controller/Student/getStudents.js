const Sequelize = require("sequelize");
const { Student } = require("../../Model");

const getStudents = async (req, res) => {
  try {
    const { tenant, year, gradeId, shiftId, batchId } = req.query;

    // Build where clause
    const whereClause = {
      del: false,
    };

    if (tenant) {
      whereClause.tenant = tenant;
    }

    if (year) {
      whereClause.year = year;
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
          message: "Student list",
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
          message: "Student list",
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
          message: "Student list",
          data: [],
        });
      }
    }

    // Fetch students
    const studentList = await Student.findAll({
      where: whereClause,
      order: [["uid", "ASC"]],
    });

    // Transform to match primary-coaching format (id, uid, name, etc.)
    const transformedStudents = studentList.map((student) => ({
      id: student.primaryId, // Use primaryId as id for frontend compatibility
      uid: student.uid,
      name: student.name,
      phone: student.phone,
      year: student.year,
      father: student.father,
      mother: student.mother,
      address: student.address,
      blood: student.blood,
      dob: student.dob,
      image: student.image,
    }));

    return res.status(200).json({
      message: "Student list",
      data: transformedStudents,
    });
  } catch (error) {
    console.error("Error fetching students:", error);
    return res.status(500).json({
      message: "Something went wrong",
      data: error.message,
    });
  }
};

module.exports = { getStudents };



