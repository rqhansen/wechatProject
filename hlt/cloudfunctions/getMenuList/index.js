// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    const res = await db.collection('menu_cate').aggregate()
    .lookup({
      from: 'menus',
      localField: '_id',
      foreignField: 'cate_id',
      as: 'menuList',
    })
    .end();
    return res;
    // const res = await db.collection('menu_cate').get();
    // return res.data;
  } catch (error) {
    return ;
  }
}