const fs = require('fs');
const request = require('request');
const {urls: { upLoadTemporyMaterial,upLoadPermantMaterial} } = require('../configs/configs');
const  { getLocalAccessToken } = require('./handleToken');

/**
 * 上传临时素材
 */
async function upLoadTempMaterial(type,filepath) {
    const form = {
        media: fs.createReadStream(filepath)
    }
    const res = await getLocalAccessToken();
    if(!res) {
        throw new Error('获取access_token异常');
    }
    return new Promise((resolve,reject) =>{
        request({url: `${upLoadTemporyMaterial}?access_token=${res.access_token}&type=${type}`,method: 'POST',formData: form,json: true},(error,res,body)=>{
            if(error) {
               return reject(error);
            } else {
                resolve(body);
            }
        });
    })
}

/**
 * 上传永久素材
 */
async function upLoadPermanMaterial(type,filepath) {
    let form = {
        media: fs.createReadStream(filepath)
    }
    const res = await getLocalAccessToken();
    if(!res) {
        throw new Error('获取access_token异常');
    }
    return new Promise((resolve,reject) =>{
        request({url: `${upLoadPermantMaterial}?access_token=${res.access_token}&type=${type}`,method: 'POST',formData: form,json: true},(error,res,body)=>{
            if(error) {
               return reject(error);
            } else {
                resolve(body);
            }
        });
    })
}

module.exports = {
    upLoadTempMaterial,
    upLoadPermanMaterial
}