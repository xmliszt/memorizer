export function searchFilter(search, data) {
  var target = false;
  var keys = Object.keys(data);
  try{
    keys.forEach(k => {
      var value = data[k];
      if (typeof value != "string") {
        value = String(value);
      }
      if (value.toLowerCase().includes(search.toLowerCase())) {
        target = true;
        throw "";
      }
    })
  } catch (e) {
    e;
  }
  return !search || target;
}