function splitObj(info, abandonKey) {
  const retain = {}
  const abandon = {}
  for (const key in info) {
    if (abandonKey.includes(key)) {
      abandon[key] = info[key]
    } else {
      retain[key] = info[key]
    }
  }

  return [retain, abandon]
}

module.exports = {
  splitObj
}