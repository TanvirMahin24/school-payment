const cron = require("node-cron");
const { syncGrades } = require("../Services/syncGrades");

let cronJob = null;

const startSyncCron = () => {
  // Run every hour at minute 0 (0 * * * *)
  cronJob = cron.schedule("0 * * * *", async () => {
    console.log("Starting scheduled sync of grades, shifts, and batches...");
    const result = await syncGrades();
    if (result.success) {
      console.log("Sync completed successfully:", result.stats);
    } else {
      console.error("Sync failed:", result.error);
    }
  });

  console.log("CRON job scheduled: Sync grades/shifts/batches every hour");
};

const stopSyncCron = () => {
  if (cronJob) {
    cronJob.stop();
    console.log("CRON job stopped");
  }
};

// Manual trigger function for testing
const triggerSync = async () => {
  console.log("Manually triggering sync...");
  const result = await syncGrades();
  return result;
};

module.exports = {
  startSyncCron,
  stopSyncCron,
  triggerSync,
};
