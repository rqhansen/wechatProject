const schedule = require('node-schedule');
const { updateAccessToken,storeAccessToken } = require('./handleToken');
let myTask = null; 

// BNORPHMM
// 005260282869
// Angelyn Abena Allanigue

module.exports = () => {
    if(myTask) {
        myTask.cancel();
    }
    let updateTimes = 0;
    let rule = new schedule.RecurrenceRule();
    // const diffHours =  [1,50.3];
    const diffHours = [1,2.98,4.96,6.94,8.92,10.9,12.88,14.86,16.84,18.82,20.8,22.78,24.76]; // 每隔7128秒执行一次
    rule.hour = diffHours;
    myTask = schedule.scheduleJob(rule,() =>{
        timedTask();
    });
    async function timedTask() {
        console.log(1);
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