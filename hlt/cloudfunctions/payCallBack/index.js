// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

// 云函数入口函数
exports.main = async (event, context) => {
  // 接下来可以写支付成功后的服务器数据更新代码
  const { outTradeNo, returnCode } = event;
  if (returnCode == 'SUCCESS') {
    const db  = cloud.database();
    // 更新云数据库数据
    try {
      const res = await db.collection('orders').where({
        orderNo: outTradeNo
      }).update({
        data: {
          orderStatus: 1
        }
      });
      return { errcode: 0, errmsg: ''}
    } catch (error) {
      console.log(error);
      return { errcode: 0, errmsg: ''}
    }
  }
}