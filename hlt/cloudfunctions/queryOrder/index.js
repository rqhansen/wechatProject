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
  if (orderStatus==undefined) { // 查询所有
      try {
      const res = await db.collection('orders')
      .aggregate()
      .addFields({
        orderExpired: $.subtract([Date.now(), '$expireTime'])
      })
      .sort({
        createTime: -1
      })
      .limit(10)
      .end();
      return res;
    } catch (error) {
      console.log(error);
    }
  } else if (orderStatus === 0) { // 待付款
    try {
      const res = await db.collection('orders')
      .aggregate()
      .addFields({
        orderExpired: $.subtract([Date.now(), '$expireTime'])
      })
      .match({
        orderStatus: 0,
        expireTime : _.gt(new Date().getTime())
      })
      .sort({
        createTime: -1
      })
      .limit(10)
      .end();
      return res;
    } catch (error) {
      console.log(error);
    }
  }  else if (orderStatus === 1) { // 已完成
    try {
       const res = await db.collection('orders')
       .aggregate()
       .addFields({
         orderExpired: $.subtract([Date.now(), '$expireTime'])
       })
       .match({
         orderStatus: 1,
 
       })
       .sort({
         createTime: -1
       })
       .limit(10)
       .end();
       return res;
       } catch (error) {
       console.log(error);
     }
   } else if (orderStatus === 2) { // 已取消
    try {
      const res = await db.collection('orders')
      .aggregate()
      .addFields({
        orderExpired: $.subtract([Date.now(), '$expireTime'])
      })
      .match({
        orderStatus: 0,
        expireTime : _.lt(new Date().getTime())
      })
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
}