const { UNAUTHORIZED, NAME_OR_PASSWORD_IS_REQUIRE, NAME_IS_EXISTS, REGEX_MISMATCH, URL_IS_EXISTS, NAME_IS_NOT_EXISTS, PASSWORD_IS_INCORRECT } = require('../config/error')
const userService = require('../service/user.service')
const md5password = require('../utils/md5-password')
const { PUBLIC_KEY } = require('../config/secret')
const jwt = require('jsonwebtoken')
const { regexRulesInfo, hasCUPremise } = require('../utils/verify')
const { loginRules, createRules, updateRules } = require('./config/rulesConfig')

// 验证登录
const verifyLogin = async (ctx, next) => {
  const { name, password } = ctx.request.body
  // 1.验证用户名和密码是否为空
  if (!name || !password) {
    return ctx.app.emit('error', NAME_OR_PASSWORD_IS_REQUIRE, ctx)
  }
  // 2.查询用户是否存在
  const users = await userService.findUserByName(name)
  const user = users[0]
  if (!user) {
    return ctx.app.emit('error', NAME_IS_NOT_EXISTS, ctx)
  }
  // 3.如果用户存在，那么查询数据库中密码和用户传递的密码是否一致
  // if (user.password !== md5password(password)) {
  //   return ctx.app.emit('error', PASSWORD_IS_INCORRECT, ctx)
  // }
  // 临时
  if (user.password !== password) {
    return ctx.app.emit('error', PASSWORD_IS_INCORRECT, ctx)
  }

  // 4.将user对象保存在ctx中
  ctx.user = user

  // 执行next, 下一个中间件
  await next()
}

// 验证身份信息
const verifyAuth = async (ctx, next) => {
  // 授权信息
  const authorization = ctx.headers.authorization
  if (!authorization) {
    return ctx.app.emit('error', UNAUTHORIZED, ctx)
  }
  // 获取token
  const token = authorization.replace('Bearer ', '')
  // 验证token是否是有效的
  try {
    // 获取token中的信息
    const result = jwt.verify(token, PUBLIC_KEY, {
      algorithms: ['RS256']
    })
    // 将token的信息保存下来
    ctx.user = result
    // 执行下一个中间件
    await next()

  } catch (error) {
    console.log("来这了吗：", error)
    ctx.app.emit('error', UNAUTHORIZED, ctx)
  }
}

// 用于验证和处理创建（Create）和更新（Update）信息
const verifyCUInfo = async (ctx, next) => {
  const rawInfo = ctx.request.body;

  // 获取 URL 参数中的键和值
  const paramsKey = Object.keys(ctx.params)[0];
  const infoId = ctx.params[paramsKey];
  // 是否为创建操作
  const isCreate = !paramsKey;
  let tableName;// 数据表名
  let rule;// 相应数据表的规则

  // 根据操作类型选择对应的规则：注册/更新
  if (isCreate) {
    tableName = ctx.URL.pathname.replace('/', '');// 获取数据表名
    rule = createRules[tableName];// 获取创建规则
  } else {
    // 获取更新操作的数据表名和规则
    const subStr = `/${infoId}`;
    tableName = ctx.URL.pathname.replace('/').replace(subStr, '');
    rule = updateRules[tableName];
  }
  // 1.使用规则对信息进行正则匹配
  const { isSucceed, message } = regexRulesInfo(rule, rawInfo);
  // 如果匹配不成功，触发错误事件
  if (!isSucceed) {
    return ctx.app.emit('error', new Error(REGEX_MISMATCH), ctx, message);
  }
  // 2.检查是否可以 注册/更新 表
  const result = isCreate
    ? await hasCUPremise(tableName, 'create', rawInfo)
    : await hasCUPremise(tableName, 'update', { id: infoId, ...rawInfo });

  // 如果不满足前提条件，根据情况触发相应错误事件
  if (!result.isHas) {
    const errorTypeKey = result.key === 'name' ? NAME_IS_EXISTS : URL_IS_EXISTS;
    return ctx.app.emit('error', new Error(errorTypeKey), ctx);
  }

  await next();
}


module.exports = {
  verifyLogin,
  verifyAuth,
  verifyCUInfo
}