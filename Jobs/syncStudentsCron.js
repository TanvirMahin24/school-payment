const cron = require("node-cron");
const { syncStudents } = require("../Services/syncStudents");

let cronJob = null;

const startSyncCron = () => {
  // Run every minute for development (* * * * *)
  // Change to hourly (0 * * * *) for production
  cronJob = cron.schedule("* * * * *", async () => {
    console.log("Starting scheduled sync of students (last 48 hours)...");
    const updatedSince = new Date(Date.now() - 48 * 60 * 60 * 1000);
    const result = await syncStudents(updatedSince);
    if (result.success) {
      console.log("Student sync completed successfully:", result.stats);
    } else {
      console.error("Student sync failed:", result.error);
    }
  });

  console.log("CRON job scheduled: Sync students every minute (last 48 hours)");
};

const stopSyncCron = () => {
  if (cronJob) {
    cronJob.stop();
    console.log("Student sync CRON job stopped");
  }
};

// Manual trigger function for testing
const triggerSync = async () => {
  console.log("Manually triggering student sync (last 48 hours)...");
  const updatedSince = new Date(Date.now() - 48 * 60 * 60 * 1000);
  const result = await syncStudents(updatedSince);
  return result;
};

module.exports = {
  startSyncCron,
  stopSyncCron,
  triggerSync,
};



