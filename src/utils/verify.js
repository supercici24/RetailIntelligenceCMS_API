const { queryFns, queryKeys } = require('./config/verifyConfig')
/**
 * 检查创建（create）或更新（update）操作的前提条件
 * @param {string} table 规则表名称
 * @param {string} type 操作类型，可选值为 'create' 或 'update'
 * @param {object} info 信息对象
 * @returns {object} 返回是否满足前提条件的结果对象
 */
const hasCUPremise = async (table, type, info) => {
  // 初始化结果对象，初始值为 true
  const result = {
    isHas: true
  }

  // 修改结果对象并返回的内部函数
  function changeResult(queryResult, key) {
    result.isHas = false
    result.key = key
    result.value = queryResult
    return result
  }

  // 获取特定数据表的查询函数和查询键
  const queryFn = queryFns[table]
  const queryKey = queryKeys[table]
  if (queryFn && queryKey) {
    // 遍历查询键数组
    for (const key of queryKey) {
      // 执行查询函数并获取结果
      const queryResultArr = await queryFn(key, info[key] ?? '')
      const queryResult = queryResultArr[0]

      if (queryResult) {
        if (type === 'create') {
          // 对于创建操作，直接返回修改后的结果对象
          return changeResult(queryResult, key)
        } else {
          // 对于更新操作，进一步检查是否与现有信息重复
          const infoResultArr = await queryFn('id', info.id ?? '')
          const infoResult = infoResultArr[0]
          if (
            queryResult[key] == info[key] &&
            queryResult.id !== infoResult.id
          ) {
            // 若重复，则返回修改后的结果对象
            return changeResult(queryResult, key)
          }
        }
      }
    }
  }

  // 返回结果对象，表明满足创建或更新操作的前提条件
  return result
}

/**
 * 根据规则验证信息对象中的值是否符合要求
 * @param {object} rules 规则对象，包含各个字段的验证规则
 * @param {object} infos 需要验证的信息对象
 * @returns {object} 返回验证结果，包括是否验证成功和相关提示信息
 */
const regexRulesInfo = (rules, infos) => {
  // 初始化结果对象
  const result = {
    isSucceed: true,
    message: '成功~'
  }

  // 验证单条规则项
  function verify(rule, value) {
    if (rule.required && !value && value !== 0 && value !== null) {
      return false
    }

    if (rule.pattern) {
      const regex = new RegExp(rule.pattern)
      if (!regex.test(value)) {
        return false
      }
    }

    return true
  }

  // 遍历规则对象中的每个字段
  for (const key in rules) {
    const rule = rules[key]
    const value = infos[key]

    // 如果规则是一个数组（含有多条验证规则），逐条验证
    if (Array.isArray(rule)) {
      for (const ruleItem of rule) {
        if (!verify(ruleItem, value)) {
          // 若验证失败，则更新结果对象并返回
          result.isSucceed = false
          result.message = ruleItem.message ?? '失败~'
          return result
        }
      }
    } else {
      // 验证单条规则
      if (!verify(rule, value)) {
        // 若验证失败，则更新结果对象并返回
        result.isSucceed = false
        result.message = rule.message ?? '失败~'
        return result
      }
    }
  }

  // 所有规则验证通过，返回成功结果对象
  return result
}


module.exports = {
  hasCUPremise,
  regexRulesInfo
}
