'use strict';
const request = require('request');
const { urls: { createMenu },menus } = require('../configs/configs');

const  { getLocalAccessToken } = require('../utils/handleToken');
module.exports = () =>{
    return async (ctx,next) => {
        const res = await getLocalAccessToken();
        if(!res) {
            await next();
        } else {
            request({url:`${createMenu}?access_token=${res.access_token}`,method: 'POST',data: menus},(error,res,body) =>{
                if(error) {
                  throw new Error('创建菜单失败');
                } else {
                    // console.log(body);
                }
            })
            await next();
        }
    }
}