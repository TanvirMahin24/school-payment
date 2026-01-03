const cron = require("node-cron");
const { syncCoachingStudents } = require("../Services/syncCoachingStudents");

let cronJob = null;

const startSyncCron = () => {
  // Run daily at 00:50 (50 minutes after primary students job, 10 minutes after coaching grades)
  cronJob = cron.schedule("50 0 * * *", async () => {
    console.log("Starting scheduled sync of coaching students (last 48 hours)...");
    const updatedSince = new Date(Date.now() - 48 * 60 * 60 * 1000);
    const result = await syncCoachingStudents(updatedSince);
    if (result.success) {
      console.log("Coaching student sync completed successfully:", result.stats);
    } else {
      console.error("Coaching student sync failed:", result.error);
    }
  });

  console.log("CRON job scheduled: Sync coaching students daily at 00:50 (last 48 hours)");
};

const stopSyncCron = () => {
  if (cronJob) {
    cronJob.stop();
    console.log("Coaching student sync CRON job stopped");
  }
};

// Manual trigger function for testing
const triggerSync = async () => {
  console.log("Manually triggering coaching student sync (last 48 hours)...");
  const updatedSince = new Date(Date.now() - 48 * 60 * 60 * 1000);
  const result = await syncCoachingStudents(updatedSince);
  return result;
};

module.exports = {
  startSyncCron,
  stopSyncCron,
  triggerSync,
};

