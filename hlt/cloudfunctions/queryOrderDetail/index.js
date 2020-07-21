// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
  const { orderNo } = event;
  const { OPENID } = cloud.getWXContext();
  try {
    const res = await db.collection('orders')
    .field({
      createTime: true,
      foodList: true,
      orderNo: true,
      orderStatus: true,
      payment: true,
      totalFee: true
    })
    .where({
      orderNo,
      'userInfo.openId': OPENID
    }).get();
    console.log(res);
    return res;
  } catch (error) {
    console.log(error);
  }
}
  