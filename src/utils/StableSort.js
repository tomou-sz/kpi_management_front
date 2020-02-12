export default (array, cmp) => {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = cmp(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map(el => el[0]);
}

export function getSorting(order, orderBy) {
  return order === 'desc' ? (a, b) => desc(a, b, orderBy) : (a, b) => -desc(a, b, orderBy);
}

export function getNestedObject(data, propertiesName) {
  return propertiesName.split('.').reduce((obj, key) =>
    (obj && obj[key] !== 'undefined') ? obj[key] : undefined, data);
}

export function desc(a, b, orderBy) {
  if (getNestedObject(b, orderBy) < getNestedObject(a, orderBy)) {
    return -1;
  }
  if (getNestedObject(b, orderBy) > getNestedObject(a, orderBy)) {
    return 1;
  }
  return 0;
}
