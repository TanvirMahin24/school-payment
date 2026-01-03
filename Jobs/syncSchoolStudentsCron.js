const cron = require("node-cron");
const { syncSchoolStudents } = require("../Services/syncSchoolStudents");

let cronJob = null;

const startSyncCron = () => {
  // Run daily at 00:30 (30 minutes after primary students job, 10 minutes after school grades)
  cronJob = cron.schedule("30 0 * * *", async () => {
    console.log("Starting scheduled sync of school students (last 48 hours)...");
    const updatedSince = new Date(Date.now() - 48 * 60 * 60 * 1000);
    const result = await syncSchoolStudents(updatedSince);
    if (result.success) {
      console.log("School student sync completed successfully:", result.stats);
    } else {
      console.error("School student sync failed:", result.error);
    }
  });

  console.log("CRON job scheduled: Sync school students daily at 00:30 (last 48 hours)");
};

const stopSyncCron = () => {
  if (cronJob) {
    cronJob.stop();
    console.log("School student sync CRON job stopped");
  }
};

// Manual trigger function for testing
const triggerSync = async () => {
  console.log("Manually triggering school student sync (last 48 hours)...");
  const updatedSince = new Date(Date.now() - 48 * 60 * 60 * 1000);
  const result = await syncSchoolStudents(updatedSince);
  return result;
};

module.exports = {
  startSyncCron,
  stopSyncCron,
  triggerSync,
};

