const makes = (data) => {
  return data
    .reduce((list, item) => {
      return list.includes(item.make) ? list : [...list, item.make]
    }, [])
    .sort()
}

const ids = (data) => {
  return data.map((item) => item.vin)
}

const filters = {
  makes,
  ids,
}

module.exports = {
  filters,
}
