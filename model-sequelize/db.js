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

const ID_TYPE = Sequelize.STRING(50)
// 定义数据库模型
function defineModel(name, attributes) {
	var attrs = {}
	// 遍历属性，并把属性值传递给attrs对象
	for (let key in attributes) {
	let value = attributes[key];
	// 如果属性值有type属性 那么 保留它的allowNull属性,否则allowNull等于false
        if (typeof value === 'object' && value['type']) {
            value.allowNull = value.allowNull || false;
            attrs[key] = value;
        } else {
            attrs[key] = {
                type: value,
                allowNull: false
            };
        }
    }
    // 给每个数据表统一格式 包括id 创建修改时间 和版本号
    attrs.id = {
        type: ID_TYPE,
        primaryKey: true
    };
    attrs.createdAt = {
        type: Sequelize.BIGINT,
        allowNull: false
    };
    attrs.updatedAt = {
        type: Sequelize.BIGINT,
        allowNull: false
    };
    attrs.version = {
        type: Sequelize.BIGINT,
        allowNull: false
    };
}