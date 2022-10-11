// 导入函数包
const funcPack = require('./function/function').funcPack
// 导入配置包
const config = require('./config/config').configData
// 左边界符号配置
const leftBoundarySymbol = config.leftBoundarySymbol
// 右边界符号配置
const rightBoundarySymbol = config.rightBoundarySymbol

// -----------------------------------------------------------------------------------
//
// 上访是配置，下方是嵌套解析语句的
//
// -----------------------------------------------------------------------------------

// 判断$后面是否有标识
const isMark = (input) => {
    const message = input[0]+input[1]
    if (Object.keys(funcPack).indexOf(message) > -1) {
        return true
    } else {
        return false
    }
} 

// 核心递归解析语句
const pers2 = (inText) => {
    const outArr = []
    let T = inText

    while (T.length > 0) {
        const a = T.splice(0, 1)[0]
        if (a[0] === leftBoundarySymbol && isMark(T)) {
            outArr.push(pers2(T))
        
        } else if (a[0] === rightBoundarySymbol && !isMark(T)) {
            return outArr
        
        } else {
            outArr.push(a[0])

        }
    }

    return outArr
}

// -----------------------------------------------------------------------------------
//
// 上方是嵌套解析语句的，下方是输出合理结构的
//
// -----------------------------------------------------------------------------------

// 合并同类项
const makePar = (data) => {
    let inArr = data
    let outArr = []
    let index = 0

    while (inArr.length > 0) {
        const a = inArr.shift() // 取出传入数组的第一项
        if (Array.isArray(a)) {
            outArr.push(makePar(a))
            index = outArr.length
        } else if (a === ' ') {
            outArr.push(' ')
            index = outArr.length
        } else {
            if (!outArr[index]) { outArr[index] = '' }
            outArr[index] = outArr[index] + a
        }
    }
    
    return outArr
}

// 生成最终结果
const generateResults = (in2) => {
    const inArr = in2
    const Arr = []
    const outArr = []

    for (let i1 = 0; i1 < inArr.length; i1++) {
        if (inArr[i1] === ' ') { Arr.push(i1) }
    }
    
    let index = 0
    outArr[0] = inArr[0]
    for (let i2 = 1; i2 < inArr.length; i2++) {
        if (Arr.indexOf(i2) > -1) { index++ }
        if (inArr[i2] !== ' ') {
            if (!outArr[index]) { outArr[index] = [] }

            if (Array.isArray(inArr[i2])) {
                outArr[index].push(generateResults(inArr[i2]))
            } else {
                outArr[index].push(inArr[i2])
            }    
        }
    }

    for (let i3 = 1; i3 < outArr.length; i3++) {
        if (outArr[i3].length === 1) {
            outArr[i3] = outArr[i3][0]
        }
    }

    return outArr
}

// 获取结果
const getResult = (arrIn) => {
    let wordOrigin = arrIn.split('')
    const Merge = makePar(pers2(wordOrigin))

    const result = []
    while (Merge.length > 0) {
        const intermediateVariable = Merge.shift()
        if (Array.isArray(intermediateVariable)) {
            result.push(generateResults(intermediateVariable))
        } else {
            result.push(intermediateVariable)
        }
    }
    return result
}


// -----------------------------------------------------------------------------------
//
// 上方是输出合理结构的，下方是对应到函数包的
//
// -----------------------------------------------------------------------------------


// 解析出数组
const interpreter = (inData) => {
  const inArr = getResult(inData)
  // inArr是解析好的数组...下面的操作就是把解析好的嵌套数组一步步解析成未嵌套的
  const outArr = []
  try {
    while (inArr.length > 0) {
      const a = inArr.shift()

      if (Array.isArray(a)) {
        outArr.push(ArrayInterpreter(a))
      } else {
        outArr.push(a)
      }
    }
    return outArr
  } catch (err) {
    return err
  }
  
}

// 将数组进行递归处理
const ArrayInterpreter = (needInterpreterArr) => {
  let inArr = needInterpreterArr

  for (let i = 0; i < inArr.length; i++) {
    if (Array.isArray(inArr[i])) {
      inArr[i] = ArrayInterpreter(inArr[i])

    }
  }

  if (Object.keys(funcPack).indexOf(inArr[0]) > -1) {
    let o = funcPack[inArr[0]](inArr)
    if (!o) { o = ''}
    return o

  } else {
    inArr = inArr.join('')
  }

  return inArr
}

module.exports = { interpreter }
