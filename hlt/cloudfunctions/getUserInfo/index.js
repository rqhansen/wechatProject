// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
  let { openid } = event;
  try {
    const res = await db.collection('users').where({
      openid: openid
    }).get();
    return res;
  } catch (error) {
    return {}
  }
}