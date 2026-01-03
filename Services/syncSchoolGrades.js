const axios = require("axios");
const Sequelize = require("sequelize");
const { Grade, Shift, Batch } = require("../Model");

const syncSchoolGrades = async (tenant = "school") => {
  try {
    // Validate tenant
    if (!tenant || typeof tenant !== "string") {
      return { success: false, error: "Invalid tenant parameter" };
    }

    const apiUrl = process.env.SCHOOL_API_URL;
    const apiKey = process.env.SCHOOL_API_KEY;

    if (!apiUrl || !apiKey) {
      console.error("SCHOOL_API_URL or SCHOOL_API_KEY not configured");
      return { success: false, error: "Configuration missing" };
    }

    // Fetch data from school API
    let response;
    try {
      response = await axios.get(`${apiUrl}/api/external/grades`, {
        headers: {
          "x-api-key": apiKey,
        },
      });
    } catch (axiosError) {
      console.error("Axios error details:", {
        message: axiosError.message,
        status: axiosError.response?.status,
        statusText: axiosError.response?.statusText,
        data: axiosError.response?.data,
      });
      throw axiosError;
    }

    if (!response.data.success || !response.data.data) {
      console.error("Invalid response from school API:", response.data);
      return { success: false, error: "Invalid API response" };
    }

    const { grades, shifts, batches } = response.data.data;

    // Validate data structure
    if (!Array.isArray(grades) || !Array.isArray(shifts) || !Array.isArray(batches)) {
      console.error("Invalid data structure in API response:", response.data.data);
      return { success: false, error: "Invalid data structure in API response" };
    }

    // Sync Grades
    const syncedGradeIds = new Set();
    for (const grade of grades) {
      const [gradeRecord, created] = await Grade.findOrCreate({
        where: {
          tenant: tenant,
          primaryId: grade.id,
        },
        defaults: {
          tenant: tenant,
          primaryId: grade.id,
          name: grade.name,
          del: false,
        },
      });

      if (!created) {
        // Update existing record
        await gradeRecord.update({
          name: grade.name,
          del: false,
        });
      }

      syncedGradeIds.add(grade.id);
    }

    // Mark grades as deleted if they exist in DB but not in API response
    await Grade.update(
      { del: true },
      {
        where: {
          tenant: tenant,
          primaryId: { [Sequelize.Op.notIn]: Array.from(syncedGradeIds) },
          del: false,
        },
      }
    );

    // Sync Shifts
    const syncedShiftIds = new Set();
    for (const shift of shifts) {
      const [shiftRecord, created] = await Shift.findOrCreate({
        where: {
          tenant: tenant,
          primaryId: shift.id,
        },
        defaults: {
          tenant: tenant,
          primaryId: shift.id,
          name: shift.name,
          gradeTenant: tenant,
          gradePrimaryId: shift.gradeId,
          del: false,
        },
      });

      if (!created) {
        await shiftRecord.update({
          name: shift.name,
          gradeTenant: tenant,
          gradePrimaryId: shift.gradeId,
          del: false,
        });
      }

      syncedShiftIds.add(shift.id);
    }

    // Mark shifts as deleted if they exist in DB but not in API response
    await Shift.update(
      { del: true },
      {
        where: {
          tenant: tenant,
          primaryId: { [Sequelize.Op.notIn]: Array.from(syncedShiftIds) },
          del: false,
        },
      }
    );

    // Sync Batches
    const syncedBatchIds = new Set();
    for (const batch of batches) {
      const [batchRecord, created] = await Batch.findOrCreate({
        where: {
          tenant: tenant,
          primaryId: batch.id,
        },
        defaults: {
          tenant: tenant,
          primaryId: batch.id,
          name: batch.name,
          year: batch.year,
          gradeTenant: tenant,
          gradePrimaryId: batch.gradeId,
          shiftTenant: tenant,
          shiftPrimaryId: batch.shiftId,
          del: false,
        },
      });

      if (!created) {
        await batchRecord.update({
          name: batch.name,
          year: batch.year,
          gradeTenant: tenant,
          gradePrimaryId: batch.gradeId,
          shiftTenant: tenant,
          shiftPrimaryId: batch.shiftId,
          del: false,
        });
      }

      syncedBatchIds.add(batch.id);
    }

    // Mark batches as deleted if they exist in DB but not in API response
    await Batch.update(
      { del: true },
      {
        where: {
          tenant: tenant,
          primaryId: { [Sequelize.Op.notIn]: Array.from(syncedBatchIds) },
          del: false,
        },
      }
    );

    console.log(`School sync completed: ${grades.length} grades, ${shifts.length} shifts, ${batches.length} batches`);
    return {
      success: true,
      stats: {
        grades: grades.length,
        shifts: shifts.length,
        batches: batches.length,
      },
    };
  } catch (error) {
    console.error("Error syncing school grades:", error.message);
    if (error.response) {
      console.error("Response status:", error.response.status);
      console.error("Response data:", error.response.data);
    }
    if (error.stack) {
      console.error("Stack trace:", error.stack);
    }
    return {
      success: false,
      error: error.message,
    };
  }
};

module.exports = { syncSchoolGrades };

