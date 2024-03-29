const { UNAUTHORIZED, FORBID_HANDLE, USER_NOT_ENABLE, NAME_IS_EXISTS, REGEX_MISMATCH, URL_IS_EXISTS, NAME_IS_NOT_EXISTS, PASSWORD_IS_INCORRECT } = require('../config/error')
const userService = require('../service/user.service')
const md5password = require('../utils/md5-password')
const { PUBLIC_KEY } = require('../config/secret')
const jwt = require('jsonwebtoken')
const { regexRulesInfo, hasCUPremise } = require('../utils/verify')
const { loginRules, createRules, updateRules } = require('./config/rulesConfig')
const forbidHandleIds = require('./config/forbidConfig')

// 验证登录
const verifyLogin = async (ctx, next) => {
  const { name, password } = ctx.request.body
  // 1.验证是否符合规则
  const { isSucceed, message } = regexRulesInfo(loginRules, { name, password })
  if (!isSucceed) {
    const error = new Error(REGEX_MISMATCH)
    return ctx.app.emit('error', error, ctx, message)
  }
  // 2.验证名字是否存在
  const result = await hasCUPremise('users', 'create', { name })
  if (result.isHas) {
    const error = new Error(NAME_IS_NOT_EXISTS)
    return ctx.app.emit('error', error, ctx)
  }

  // 3.验证密码
  const user = result.value
  if (md5password(password) !== user.password) {
    const error = new Error(PASSWORD_IS_INCORRECT)
    return ctx.app.emit('error', error, ctx)
  }
  // 4.验证账号是否可用
  if (!user.enable) {
    const error = new Error(USER_NOT_ENABLE)
    return ctx.app.emit('error', error, ctx)
  }

  ctx.user = user
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
// 这是一个中间件函数，用于权限验证
const verifyForbid = async (ctx, next) => {
  // 从参数中获取第一个键值作为参数的键名
  const paramsKey = Object.keys(ctx.params)[0];
  // 尝试将参数的值转换为数字类型作为 id
  const id = parseFloat(ctx.params[paramsKey]);
  // 从请求的 URL 路径中提取出表名
  const tableName = ctx.URL.pathname
    .replace('/', '')
    .replace(`/${id}`, '');
  // 从 forbidHandleIds 中获取对应表名的处理 id
  const forbidHandleId = forbidHandleIds[tableName];
  // 如果 forbidHandleId 包含当前 id，则抛出 FORBID_HANDLE 错误并传递给应用程序的错误处理机制
  if (forbidHandleId.includes(id)) {
    const error = new Error(FORBID_HANDLE);
    return ctx.app.emit('error', error, ctx);
  }

  // 执行下一个中间件函数
  await next();
}


module.exports = {
  verifyLogin,
  verifyAuth,
  verifyCUInfo,
  verifyForbid
}