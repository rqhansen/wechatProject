const mysql = require('mysql');
const { connectConfig } = require('../configs/configs');

const pool = mysql.createPool(connectConfig);


/**
 * 增删改查
 */
module.exports.query = function () {
    let [sqlStr, arr] = arguments;
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                reject(err);
            } else {
                connection.query(sqlStr, arr, (err, rows) => {
                    if (err) {
                        reject(err);
                    } else {
                        // console.log('插入成功');
                        resolve(rows);
                    }
                    connection.release();
                })
            }
        })
    })
}

//插入
// User.saveUser=function(user){
// 	var sqlStr='insert into t (id,name,sex,birth) value(?,?,?,?)';
// 	connection.query(sqlStr,[user.id,user.name,user.sex,user.birth],function(err,data){
// 		if(err){
// 			return;
// 		}
// 		console.log(data);
// 	});
// }
// //User.saveUser({id:100,name:'小林','sex':'1',birth:'1999-09-09'});

// User.delete=function(user){
// 	var sqlStr='delete from t where name=?';
// 	connection.query(sqlStr,[user.name],function(err,data){
// 		if(err){
// 			return ;
// 		}
// 		console.log(data);
// 	});
// }
// //User.delete({name:'晶晶'});

// //更新
// User.update=function(user){
// 	var sqlStr='update t set name=?where id=?';
// 	connection.query(sqlStr,[user.name,user.id],function(err,data){
// 		if(err){
// 			return;
// 		}
// 		console.log(data);
// 	});
// }
// //User.update({name:'小云',id:100});

// //查询
// User.select=function(user){
// 	var sqlStr='select * from t where name=?';
// 	connection.query(sqlStr,[user.name],function(err,data){
// 		if(err){
// 			return;
// 		}
// 		console.log(data);
// 	});
// }
// User.select({name:'花花'});