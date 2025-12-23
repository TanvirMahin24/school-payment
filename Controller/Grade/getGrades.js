const { Grade, Shift, Batch } = require("../../Model");

const getGrades = async (req, res) => {
  try {
    // Get tenant from query parameter
    const { tenant } = req.query;
    
    // Build where clause
    const whereClause = {
      del: false,
    };
    
    // Filter by tenant if provided
    if (tenant) {
      whereClause.tenant = tenant;
    }

    // Fetch grades with shifts and batches, excluding deleted records
    const gradeList = await Grade.findAll({
      order: [["primaryId", "ASC"]],
      where: whereClause,
    });

    // Build where clause for shifts
    const shiftWhereClause = {
      del: false,
    };
    if (tenant) {
      shiftWhereClause.tenant = tenant;
    }

    // Fetch all shifts for these grades
    const shiftList = await Shift.findAll({
      order: [["primaryId", "ASC"]],
      where: shiftWhereClause,
    });

    // Build where clause for batches
    const batchWhereClause = {
      del: false,
    };
    if (tenant) {
      batchWhereClause.tenant = tenant;
    }

    // Fetch all batches for these shifts
    const batchList = await Batch.findAll({
      order: [["primaryId", "ASC"]],
      where: batchWhereClause,
    });

    // Build hierarchical structure similar to primary-coaching
    const gradesWithRelations = gradeList.map((grade) => {
      const gradeData = {
        id: grade.primaryId,
        name: grade.name,
        shifts: [],
      };

      // Find shifts for this grade
      const gradeShifts = shiftList.filter(
        (shift) =>
          shift.gradeTenant === grade.tenant &&
          shift.gradePrimaryId === grade.primaryId
      );

      gradeShifts.forEach((shift) => {
        const shiftData = {
          id: shift.primaryId,
          name: shift.name,
          batches: [],
        };

        // Find batches for this shift
        const shiftBatches = batchList.filter(
          (batch) =>
            batch.shiftTenant === shift.tenant &&
            batch.shiftPrimaryId === shift.primaryId &&
            batch.gradeTenant === grade.tenant &&
            batch.gradePrimaryId === grade.primaryId
        );

        shiftData.batches = shiftBatches.map((batch) => ({
          id: batch.primaryId,
          name: batch.name,
          year: batch.year,
          shiftId: shift.primaryId,
          gradeId: grade.primaryId,
        }));

        gradeData.shifts.push(shiftData);
      });

      return gradeData;
    });

    return res.status(200).json({
      message: "Grade list with shift and batch",
      data: gradesWithRelations,
    });
  } catch (error) {
    console.error("Error fetching grades:", error);
    return res.status(500).json({
      message: "Something went wrong",
      data: error.message,
    });
  }
};

module.exports = { getGrades };

