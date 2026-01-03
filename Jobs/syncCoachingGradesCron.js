const cron = require("node-cron");
const { syncCoachingGrades } = require("../Services/syncCoachingGrades");

let cronJob = null;

const startSyncCron = () => {
  // Run daily at 00:40 (40 minutes after primary students job, 10 minutes after school students)
  cronJob = cron.schedule("40 0 * * *", async () => {
    console.log("Starting scheduled sync of coaching grades, shifts, and batches...");
    const result = await syncCoachingGrades("coaching");
    if (result.success) {
      console.log("Coaching sync completed successfully:", result.stats);
    } else {
      console.error("Coaching sync failed:", result.error);
    }
  });

  console.log("CRON job scheduled: Sync coaching grades/shifts/batches daily at 00:40");
};

const stopSyncCron = () => {
  if (cronJob) {
    cronJob.stop();
    console.log("Coaching grades sync CRON job stopped");
  }
};

// Manual trigger function for testing
const triggerSync = async () => {
  console.log("Manually triggering coaching grades sync...");
  const result = await syncCoachingGrades("coaching");
  return result;
};

module.exports = {
  startSyncCron,
  stopSyncCron,
  triggerSync,
};

