// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database();

// const _ = db.command;
const $ = db.command.aggregate;

// 云函数入口函数
exports.main = async (event, context) => {
  const { orderNo } = event;
  const { OPENID } = cloud.getWXContext();
  try {
    const res = await db.collection('orders')
    .aggregate()
    .project({
      _id: 0,
      openid: 0
    })
    .addFields({
      orderExpired: $.subtract([Date.now(), '$expireTime'])
    })
    .match({
      orderNo,
      'openId': OPENID
    })
    .end();
    return res;
  } catch (error) {
    console.log(error);
  }
}
  