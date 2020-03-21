const fs = require('fs');
const request = require('request');
const { urls, APPID, APPSECRET } = require('../configs/configs');


/**
 * 获取本地access_token
 */ 
function getLocalAccessToken() {
    return new Promise((resolve,reject) => {
        fs.readFile('configs/accessToken.json',(error,data) => {
            if(error) {
               return reject(error);
            }
            resolve(JSON.parse(data));
        });
    })
}

/**
 * 存储access_token
 */
function storeAccessToken(json) {
    return new Promise((resolve,reject) => {
        fs.writeFile('configs/accessToken.json',json,(error) => {
            if(error) {
            //    return resolve(error);
                reject(error);
            } else {
                resolve();
            }
        });
    })
}

/**
 * 请求access_token
 */
function updateAccessToken() {
    return new Promise((resolve,reject) => {
        request(`${urls.getAccessToken}?grant_type=client_credential&appid=${APPID}&secret=${APPSECRET}`,(error,res,body) =>{
            if(error) {
            //    return resolve(error);
                reject(error);
            } else {
                resolve(JSON.parse(body));
            }
        });
    })
}

module.exports = {
    getLocalAccessToken,
    updateAccessToken,
    storeAccessToken
}