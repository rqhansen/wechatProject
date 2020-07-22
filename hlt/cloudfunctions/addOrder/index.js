// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
  const { OPENID } = cloud.getWXContext();
  let { userInfo, ...orderInfo} = event;
  let createTime = new Date().getTime();
  let expireTime = createTime + 1.999 * 60 * 60 * 1000;
  orderInfo = {createTime, expireTime, openId: OPENID, ...orderInfo};
  try {
    const res = await db.collection('orders').add({ data: orderInfo});
    return res;
  } catch (error) {
    console.log(error);
  }
}