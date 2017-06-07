const Sequelize = require('sequelize')
// 用于生成全局id
const uuid = require('node-uuid')

const config = require('./config')
// 定义id生成函数
function genetateId () {
	return uuid.v4();
}

//初始化链接数据库参数v
var sequelize = new Sequelize(config.database, config.username, config.password,{
	host: config.host,
	dialect: config.dialect,
	pool: {
		max:5,
		min:0,
		idle: 10000
	}
});