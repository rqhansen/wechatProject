'use strict';
const connection = require('../database/db');
const { movieTypes, limitSeconds } = require('../configs/configs');

async function searchMoive(keyword) {
    // let {keyword,page} = ctx.request.body;
    const page = 1;
    let result = await connection.query(`select id,typeId,indexImgSrc,trim(year),trim(country),trim(pureName),trim(fullName),actor,date_format(pubDate,"%Y-%m-%d"),left(shortIntro,90) from action where fullName like "%${keyword}%" 
                                        union select id,typeId,indexImgSrc,trim(year),trim(country),trim(pureName),trim(fullName),actor,date_format(pubDate,"%Y-%m-%d"),left(shortIntro,90) from comedy where fullName like "%${keyword}%"
                                        union select id,typeId,indexImgSrc,trim(year),trim(country),trim(pureName),trim(fullName),actor,date_format(pubDate,"%Y-%m-%d"),left(shortIntro,90) from romance where fullName like "%${keyword}%"
                                        union select id,typeId,indexImgSrc,trim(year),trim(country),trim(pureName),trim(fullName),actor,date_format(pubDate,"%Y-%m-%d"),left(shortIntro,90) from science where fullName like "%${keyword}%"
                                        union select id,typeId,indexImgSrc,trim(year),trim(country),trim(pureName),trim(fullName),actor,date_format(pubDate,"%Y-%m-%d"),left(shortIntro,90) from drama where fullName like "%${keyword}%"
                                        union select id,typeId,indexImgSrc,trim(year),trim(country),trim(pureName),trim(fullName),actor,date_format(pubDate,"%Y-%m-%d"),left(shortIntro,90) from suspense where fullName like "%${keyword}%"
                                        union select id,typeId,indexImgSrc,trim(year),trim(country),trim(pureName),trim(fullName),actor,date_format(pubDate,"%Y-%m-%d"),left(shortIntro,90) from war where fullName like "%${keyword}%"
                                        union select id,typeId,indexImgSrc,trim(year),trim(country),trim(pureName),trim(fullName),actor,date_format(pubDate,"%Y-%m-%d"),left(shortIntro,90) from thrill where fullName like "%${keyword}%"
                                        union select id,typeId,indexImgSrc,trim(year),trim(country),trim(pureName),trim(fullName),actor,date_format(pubDate,"%Y-%m-%d"),left(shortIntro,90) from horror where fullName like "%${keyword}%"
                                        union select id,typeId,indexImgSrc,trim(year),trim(country),trim(pureName),trim(fullName),actor,date_format(pubDate,"%Y-%m-%d"),left(shortIntro,90) from disaster where fullName like "%${keyword}%"
                                        union select id,typeId,indexImgSrc,trim(year),trim(country),trim(pureName),trim(fullName),actor,date_format(pubDate,"%Y-%m-%d"),left(shortIntro,90) from cartoon where fullName like "%${keyword}%"`);
    let { length } = result;
    result = result.slice((page - 1) * 10, (page - 1) * 10 + 10);
    result.forEach(item => {
        item.type = Object.values(movieTypes.filter(type => type[`${item.typeId}`])[0])[0];
        item.year = item['trim(year)'];
        item.country = item['trim(country)'];
        item.pureName = item['trim(pureName)'];
        item.pubDate = item['date_format(pubDate,"%Y-%m-%d")'];
        item.shortIntro = item['left(shortIntro,90)'];
        let fullName = item['trim(fullName)'];
        item.sharpness = fullName ? fullName.split(item.pureName)[1] : '';
        item.actor = item.actor ? item.actor.split('$').slice(0, 1) : '';
        item.isNew = new Date() - new Date(item.pubDate) < limitSeconds;
        delete item.typeId;
        delete item['trim(country)'];
        delete item['trim(year)'];
        delete item['trim(pureName)'];
        delete item['date_format(pubDate,"%Y-%m-%d")'];
        delete item['trim(fullName)'];
        delete item['left(shortIntro,90)'];
    })
    return result.slice(0,1);
    // ctx.body = {
    //     code: 0,
    //     data: {
    //         keyword,
    //         movies: result,
    //         total: length
    //     }
    // }
}

module.exports = searchMoive