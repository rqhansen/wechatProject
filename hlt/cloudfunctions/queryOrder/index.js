// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
  const { OPENID } = cloud.getWXContext();
  let query = { 'openId': OPENID };
  const { orderStatus } = event;
  if (orderStatus!=undefined) {
    query.orderStatus = orderStatus;
  }
  try {
    const res = await db.collection('orders')
    .field({
      createTime: true,
      expireTime: true,
      foodList: true,
      orderStatus: true,
      orderNo: true,
      totalFee: true,
      payment: true
    })
    .orderBy('createTime','desc')
    .limit(10)
    .where(query).get();
    return res;
  } catch (error) {
    console.log(error);
  }
}