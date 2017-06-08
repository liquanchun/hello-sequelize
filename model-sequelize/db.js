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
    console.log('model defined for table: ' + name + '\n' + JSON.stringify(attrs, function (k, v) {
        if (k === 'type') {
            for (let key in Sequelize) {
                if (key === 'ABSTRACT' || key === 'NUMBER') {
                    continue;
                }
                let dbType = Sequelize[key];
                if (typeof dbType === 'function') {
                    if (v instanceof dbType) {
                        if (v._length) {
                            return `${dbType.key}(${v._length})`;
                        }
                        return dbType.key;
                    }
                    if (v === dbType) {
                        return dbType.key;
                    }
                }
            }
        }
        return v;
    }, '  '));
    // 返回格式化数据库格式
    console.log(sequelize.define);
    return sequelize.define(name, attrs, {
        tableName: name,
        timestamps: false,
        hooks: {
            // 数据变化时调用钩子
            beforeValidate: function (obj) {
                let now = Date.now();
                // 如果是新的纪录，添加初始数据
                if (obj.isNewRecord) {
                    console.log('will create entity...' + obj);
                    if (!obj.id) {
                        // 没有id时添加唯一id
                        obj.id = genetateId();
                    }
                    obj.createdAt = now;
                    obj.updatedAt = now;
                    obj.version = 0;
                } else {
                    console.log('will update entity...');
                    obj.updatedAt = now;
                    obj.version++;
                }
            }
        }
    });
}

var exp = {
    defineModel: defineModel,
    sync: () => {
        // 只有在非生产环境下才能创建ddl
        if (process.env.NODE_ENV !== 'production') {
           return sequelize.sync({force: true});
        } else {
            throw new Error ('Cannot sync() when NODE_ENV is set to \'production\'.');
        }
    }
};

// 定义数据类型
const TYPES = ['STRING', 'INTEGER', 'BIGINT', 'TEXT', 'DOUBLE', 'DATEONLY', 'BOOLEAN'];

for (let type of TYPES) {
    exp[type] = Sequelize[type];
}
// 将唯一id暴露

exp.ID = ID_TYPE;
exp.STRING 
module.exports = exp;