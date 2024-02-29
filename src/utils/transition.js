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
function toString(value) {
  return value || value === 0 ? value.toString() : value;
}

module.exports = {
  splitObj,
  toString
}