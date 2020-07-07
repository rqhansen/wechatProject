// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
    const { openid, userInfo } = event;
    try {
      const res = db.collection('users').add({
        data: {
          openid,
          userInfo
        }
      });
      return res;
    } catch (error) {
      console.log(error);
    }
}