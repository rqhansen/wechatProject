
const xml2js = require('xml2js');

const parseXML = async (xml) => {
    return new Promise((resolve,reject) => {
        xml2js.parseString(xml,{ trim: true },(err,obj) =>{
            if(err) {
                return reject(error);
            }
            resolve(obj);
        })
    })
}

const formatMsg = (msg) => {
    let message = {};
    if(typeof msg === 'object') {
        for(let key in msg) {
            if(!Array.isArray(msg[key]) || msg[key].length === 0) {
                continue;
            }
            if(msg[key].length === 1) {
                let val = msg[key][0];
                if(typeof val === 'object') {
                    message[key] = formatMsg(val);  
                } else {
                    message[key] = (val || '').trim();
                }
            } else {
                message[key] = msg[key].map((item) =>{
                    return formatMsg(item);
                })
            }
        }
    }
    return message;
}

module.exports = {
    parseXML,
    formatMsg
}