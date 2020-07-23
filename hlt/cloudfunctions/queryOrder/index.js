// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database();

const _ = db.command;
const $ = db.command.aggregate;

// 云函数入口函数
exports.main = async (event, context) => {
  const { OPENID } = cloud.getWXContext();
  let query = { 'openId': OPENID };
  const { orderStatus } = event;
  if (orderStatus!=undefined) { // undefined查询全部
    query.orderStatus = orderStatus;
  }
  if (orderStatus === 2) {
    query.expireTime = _.lt(new Date().getTime())
  }
  try {
    const res = await db.collection('orders')
    .aggregate()
    .addFields({
      orderExpired: new Date().getTime() - '$expireTime' >= 0
    })
    .match(query)
    .sort({
      createTime: -1
    })
    .limit(10)
    .end();
    return res;
  } catch (error) {
    console.log(error);
  }
}