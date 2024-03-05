const mapSqlStatement = {
  create(createInfo) {
    const inserts = []
    const placeholders = []
    const values = Object.values(createInfo)

    for (const key in createInfo) {
      inserts.push(key)
      placeholders.push('?')
    }

    return { inserts, placeholders, values }
  },
  update(updateInfo) {
    const updates = []
    const values = Object.values(updateInfo)

    for (const key in updateInfo) {
      updates.push(`${key} = ?`)
    }
    return { updates, values }
  },
  like(info, tableName) {
    const likes = []
    let isFirst = true
    for (const key in info) {
      const value = info[key]
      const TKey = `${tableName}.${key}`

      if (!value && value !== 0) {
        continue
      }
      const sqlLike = `${TKey} like '%${value}%'`
      if (isFirst) {
        likes.push(sqlLike)
        isFirst = false
      } else {
        likes.push(`and ${sqlLike}`)
      }
    }
    return likes
  }
}

module.exports = mapSqlStatement