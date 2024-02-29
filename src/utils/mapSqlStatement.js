const mapSqlStatement = {
  create(createInfo) {
    const inserts = []
    const placeholders = []
    const valuse = Object.values(createInfo)

    for (const key in createInfo) {
      inserts.push(key)
      placeholders.push('?')
    }

    return { inserts, placeholders, valuse }
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