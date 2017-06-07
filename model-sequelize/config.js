const defaultConfig = './config-default.js';
const overrideConfig = './config-override.js';
const testConfig = './config-test.js';

const fs = require('fs')

var config = null

if (process.env.NODE_ENV === 'test') {
	// 测试环境下加载测试配置
	console.log(`Load ${testConfig}...`);
    config = require(testConfig);
} else {
	// 默认加载默认配置
	console.log(`Load ${defaultConfig}...`);
    config = require(defaultConfig);
    try {
    	if (fs.statSync(overrideConfig).isFile()) {
    		// 如果有重写配置文件那么就与默认配置合并
    		console.log(`Load${overrideConfig}...`);
    		config = Object.assign(config, require(overrideConfig))
    	}
    } catch (err) {
    	console.log(`Cannot load ${overrideConfig}.`)
    }
}

module.exports = config;