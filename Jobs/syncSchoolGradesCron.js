const cron = require("node-cron");
const { syncSchoolGrades } = require("../Services/syncSchoolGrades");

let cronJob = null;

const startSyncCron = () => {
  // Run daily at 00:20 (20 minutes after primary students job)
  cronJob = cron.schedule("20 0 * * *", async () => {
    console.log("Starting scheduled sync of school grades, shifts, and batches...");
    const result = await syncSchoolGrades("school");
    if (result.success) {
      console.log("School sync completed successfully:", result.stats);
    } else {
      console.error("School sync failed:", result.error);
    }
  });

  console.log("CRON job scheduled: Sync school grades/shifts/batches daily at 00:20");
};

const stopSyncCron = () => {
  if (cronJob) {
    cronJob.stop();
    console.log("School grades sync CRON job stopped");
  }
};

// Manual trigger function for testing
const triggerSync = async () => {
  console.log("Manually triggering school grades sync...");
  const result = await syncSchoolGrades("school");
  return result;
};

module.exports = {
  startSyncCron,
  stopSyncCron,
  triggerSync,
};

