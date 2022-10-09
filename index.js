var a = require('./api/pars')

// 输入需要解析的语句
// 语句格式一般为$语句名 参数1 参数2 ....... 参数n$
let input = 'aaaaaa $测试 123$'

console.log(a.interpreter(input))
// a.interpreter(input)