const Sequelize = require('sequelize')
// 用于生成全局id
const uuid = require('node-uuid')

const config = require('./config')
// 定义id生成函数
function genetateId () {
	return uuid.v4();
}