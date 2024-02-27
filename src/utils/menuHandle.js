function allotChildren(parents, childrens) {
  for (const parent of parents) {
    for (const children of childrens) {
      if (parent.id === children.parentId) {
        if (!parent.childrens) { parent.childrens = [] }

        parent.childrens.push(children)
      }
    }
  }
}

function menuListHandle(menus) {
  const menuType1 = []
  const menuType2 = []
  const menuType3 = []

  for (const menu of menus) {
    if (menu.type === 1) {
      menuType1.push({ ...menu })
    } else if (menu.type === 2) {
      menuType2.push({ ...menu })
    } else if (menu.type === 3) {
      menuType3.push({ ...menu })
    }
  }
  allotChildren(menuType2, menuType3)
  allotChildren(menuType1, menuType2)

  return menuType1
}

module.exports = {
  menuListHandle
}

