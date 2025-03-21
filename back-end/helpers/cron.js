const cron = require("node-cron");
const moment = require("moment-timezone");
const { updateFundRescheduleStatus, updateStockRescheduleStatus } = require("./general");

function cronJob() {
    console.log(`Cron Jobs started successfully...`);
    cron.schedule("0 0 * * *", async () => {
        console.log(`Midnight Cron jon running at ${moment().tz('Asia/Kolkata').format('MMM DD YYYY, h:mm:ss A')}`);

        // Change Rescheduled Fund Transfer Data to Pending Status to Rescheduled date
        await updateFundRescheduleStatus();

        // Change Rescheduled Stock Transfer Data to Pending Status to Rescheduled date
        await updateStockRescheduleStatus();
    });

    // ! To test any function running as Cron Job
    // cron.schedule("* * * * *", async () => {
    //     console.log('Test cron running every minute');

    // })
}

module.exports = { cronJob };
