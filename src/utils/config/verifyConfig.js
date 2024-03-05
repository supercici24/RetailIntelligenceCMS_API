const userService = require('../../service/user.service.js')
const departmentService = require('../../service/department.service.js')
const menuService = require('../../service/menu.service.js')
const roleService = require('../../service/role.service.js')
// const categoryService =require('../../service/product/categorycategoryService')

const queryFns = {
  users: userService.getUserByAny,
  department: departmentService.getDepartmentByAny,
  menu: menuService.getMenuByAny,
  role: roleService.getRoleByAny,
  // category: categoryService.getCategoryByAny
}

const queryKeys = {
  users: ['name'],
  department: ['name'],
  menu: ['name', 'url'],
  role: ['name'],
  // category: ['name']
}

module.exports = {
  queryFns,
  queryKeys
}