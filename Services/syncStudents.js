const axios = require("axios");
const Sequelize = require("sequelize");
const { Student } = require("../Model");

const TENANT = "primary";

const syncStudents = async (updatedSince = null) => {
  try {
    const apiUrl = process.env.PRIMARY_COACHING_API_URL;
    const apiKey = process.env.PRIMARY_COACHING_API_KEY;

    if (!apiUrl || !apiKey) {
      console.error(
        "PRIMARY_COACHING_API_URL or PRIMARY_COACHING_API_KEY not configured"
      );
      return { success: false, error: "Configuration missing" };
    }

    // Build API URL with optional updatedSince parameter
    let apiEndpoint = `${apiUrl}/api/external/students`;
    if (updatedSince) {
      const updatedSinceISO = updatedSince.toISOString();
      apiEndpoint += `?updatedSince=${updatedSinceISO}`;
    }

    // Fetch data from primary-coaching API
    let response;
    try {
      response = await axios.get(apiEndpoint, {
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
      console.error(
        "Invalid response from primary-coaching API:",
        response.data
      );
      return { success: false, error: "Invalid API response" };
    }

    const { students } = response.data.data;

    // Validate data structure
    if (!Array.isArray(students)) {
      console.error(
        "Invalid data structure in API response:",
        response.data.data
      );
      return {
        success: false,
        error: "Invalid data structure in API response",
      };
    }

    // Sync Students
    let createdCount = 0;
    let updatedCount = 0;
    const syncedStudentIds = new Set();

    for (const student of students) {
      const [studentRecord, created] = await Student.findOrCreate({
        where: {
          tenant: TENANT,
          primaryId: student.id,
        },
        defaults: {
          tenant: TENANT,
          primaryId: student.id,
          uid: student.uid,
          name: student.name,
          phone: student.phone,
          year: student.year,
          father: student.father || "",
          mother: student.mother || "",
          address: student.address || "",
          blood: student.blood || "",
          dob: student.dob || null,
          image: student.image || null,
          del: student.del || false,
          gradeTenant: student.gradeId ? TENANT : null,
          gradePrimaryId: student.gradeId || null,
          shiftTenant: student.shiftId ? TENANT : null,
          shiftPrimaryId: student.shiftId || null,
          batchTenant: student.batchId ? TENANT : null,
          batchPrimaryId: student.batchId || null,
        },
      });

      if (!created) {
        // Update existing record
        await studentRecord.update({
          uid: student.uid,
          name: student.name,
          phone: student.phone,
          year: student.year,
          father: student.father || "",
          mother: student.mother || "",
          address: student.address || "",
          blood: student.blood || "",
          dob: student.dob || null,
          image: student.image || null,
          del: student.del || false,
          gradeTenant: student.gradeId ? TENANT : null,
          gradePrimaryId: student.gradeId || null,
          shiftTenant: student.shiftId ? TENANT : null,
          shiftPrimaryId: student.shiftId || null,
          batchTenant: student.batchId ? TENANT : null,
          batchPrimaryId: student.batchId || null,
        });
        updatedCount++;
      } else {
        createdCount++;
      }

      syncedStudentIds.add(student.id);
    }

    // Mark students as deleted if they exist in DB but not in API response
    // Only do this for full sync (when updatedSince is null)
    if (!updatedSince) {
      await Student.update(
        { del: true },
        {
          where: {
            tenant: TENANT,
            primaryId: { [Sequelize.Op.notIn]: Array.from(syncedStudentIds) },
            del: false,
          },
        }
      );
    }

    console.log(
      `Student sync completed: ${createdCount} created, ${updatedCount} updated, ${students.length} total`
    );
    return {
      success: true,
      stats: {
        created: createdCount,
        updated: updatedCount,
        total: students.length,
      },
    };
  } catch (error) {
    console.error("Error syncing students:", error.message);
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

module.exports = { syncStudents };






