// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await db.collection('banner_pics').field({
        _id: false,
        url: true
      })
      .get();
      resolve(res.data);
    } catch (error) {
      resolve();
    }
  })
  return 
}