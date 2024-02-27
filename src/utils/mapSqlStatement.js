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
  }
}

module.exports = mapSqlStatement