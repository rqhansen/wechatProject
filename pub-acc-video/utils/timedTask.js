const CronJob = require('cron').CronJob;
const { updateAccessToken,storeAccessToken } = require('./handleToken');

let myTask = null; 

module.exports = () => {
    if(myTask) {
        myTask.stop();
    }
    let updateTimes = 0;
    myTask = new CronJob('0 */1 * * *',function() {
        timedTask();
    },null,true);
    async function timedTask() {
        let json = '';
        try {
            const newAccessToken = await updateAccessToken();
            try {
                let json = JSON.stringify(newAccessToken,'','\t');
                storeAccessToken(json);
            } catch (error) {
                storeAccessToken(json);
            }   
        } catch (error) {
            updateTimes++;
            if(updateTimes < 3) {
                timedTask();
            }
        }
    }
}