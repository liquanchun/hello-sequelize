// 获取model
const model = require('./model');

let
    Pet = model.Pet,
    User = model.user;
// 创建数据库
console.log(User, Pet);
(async () => {
    var user = await User.create({
        name: 'John',
        gender: false,
        email: 'john-' + Date.now() + '@garfield.pet',
        passwd: 'hahaha'
    });
    console.log('created: ' + JSON.stringify(user));
    var cat = await Pet.create({
        ownerId: user.id,
        name: 'Garfield',
        gender: false,
        birth: '2007-07-07',
    });
    console.log('created: ' + JSON.stringify(cat));
    var dog = await Pet.create({
        ownerId: user.id,
        name: 'Odie',
        gender: false,
        birth: '2008-08-08',
    });
    console.log('created: ' + JSON.stringify(dog));
})();