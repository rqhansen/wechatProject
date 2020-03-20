'user strict';
const { getLocalAccessToken,updateAccessToken,storeAccessToken } = require('../utils/handleToken');
/**
 * 考虑到高并发，应该使用中控服务器统一获取和刷新access_token，其它业务逻辑服务器所以用
 * 的access_token均来自该中控服务器，否则容易造成冲突，导致access_token覆盖而影响业务
 */
module.exports = () => {
    return async (ctx,next) => {
        const { method }  = ctx.request;
        if(method.toLowerCase() !='post') {
            await next();
        } else {
            const accessTokenInfo = await getLocalAccessToken();
            // console.log(accessTokenInfo);
            if(!accessTokenInfo) {
                ctx.body = 'fail';
            } else {
                const { access_token,expires_in } = accessTokenInfo;
                if(access_token && Date.now() < expires_in) {
                    console.log('access_token未过期');
                    await next();
                } else {
                    // console.log('access_token过期或为空');
                    const newAccessToken = await updateAccessToken();
                    if(!newAccessToken) {
                        ctx.body = 'fail';
                    } else {
                        let { access_token,expires_in } = newAccessToken;
                        // console.log(newAccessToken);
                        expires_in = Date.now() + expires_in * 1000 - 30 * 1000; // 提前30s过期
                        const json = JSON.stringify({ expires_in,access_token},'','\t');
                        const result = await storeAccessToken(json);
                        if(result) {
                            // console.log('存储token失败');
                            ctx.body = 'fail';
                        } else {
                            // console.log('检查checkToken成功');
                            await next();
                        }
                    }
                }
            }
        }
    }
}