// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database();
var $ = db.command.aggregate;

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    const res = await db.collection('menus').aggregate()
    .lookup({
      from: 'menu_cate',
      localField: 'cate_id',
      foreignField: '_id',
      as: 'menusList'
    })
    .replaceRoot({
      newRoot: $.mergeObjects([
        $.arrayElemAt(['$menusList',0]),'$$ROOT'])
    })
    .project({
      menusList: 0
    })
    .end();
    return res.list
  } catch (error) {
    return
  } 
}