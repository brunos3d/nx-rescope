export function renameObjKeys(obj, keyMap) {
  return Object.keys(obj).reduce((acc, key) => {
    const newKey = keyMap[key] || key;
    return { ...acc, [newKey]: obj[key] };
  }, {});
}

export function sortObjKeys(obj) {
  return Object.keys(obj)
    .sort()
    .reduce((acc, key) => {
      return { ...acc, [key]: obj[key] };
    }, {});
}

export function objKeysDiff(obj1, obj2) {
  return Object.keys(obj1).filter((key) => !obj2[key]);
}
