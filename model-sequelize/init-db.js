const model = require('./model.js');

// 将models里的找到的model创建表的SQL
model.sync().then(()=>{
    console.log('sync done');
    process.exit(0);
}).catch((e)=>{
    console.log('failed with: '+e);
    process.exit(0);});
