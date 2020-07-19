// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event) => {
  try {
    const res = await cloud.cloudPay.unifiedOrder(event);
    return res;
  } catch (error) {
    return {
      errCode: 0,
      errMsg: "cloudPay.unifiedOrder:ok",
      returnCode: 'FAIL',
      returnMsg: '创建订单失败，请稍后重试'
    }
  }
  return res;
}