'use strict';
const sha1 = require('sha1');
const { token } = require('../configs');
const updateTokenTask = require('../utils/timedTask');
module.exports = () =>{
    // 应用开启定时更新access_token
    updateTokenTask();
    return async (ctx,next) => {
        const { method,url } = ctx.request;
        if(method.toLowerCase() != 'get' || !url.includes('mp/rq')) {
            await next();
        } else { // get ----- /mp/rq
            const {signature,echostr,timestamp,nonce } = ctx.query;
            if(!signature) {
                ctx.body = 'fail';
            } else {
                const str = [token,timestamp,nonce].sort().join('');
                const sha = sha1(str); // sha1加密
                if(sha === signature) {
                    ctx.body = echostr;
                } else {
                    ctx.body = 'fail';
                }
            }
        }
    }
}
