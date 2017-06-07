const db = require('../db');
// 在基本配置下，定义pets数据库
module.exports = db.defineModel('pets', {
    ownerId: db.ID,
    name: db.STRING(100),
    gender: db.BOOLEAN,
    birth: db.STRING(10),
});
