// 随机数生成姬
const random = (n, m) => { return Math.floor(Math.random() * (m - n + 1) + n) }

// 函数包
const funcPack = {
  '添加': (inData) => { 
    // 当发现有添加语句的时候会触发这个
    return `添加了 ${inData[1]} 这个物品 ${inData[2]} 个`
  },
  
  '概率': (inData) => {
    // 当发现有概率语句的时候会触发这个
    const number = Number(inData[1])
    
    if (random(0,100) > number) { throw '概率判断失败' } // thow的话会让词库直接抛出问题

  },
  
  '测试': (inData) => {
    // 当发现有测试语句的时候会触发这个
    return inData[1]
  }
}

module.exports = { funcPack }
