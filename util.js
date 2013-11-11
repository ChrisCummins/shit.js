exports.add = function(array, value) {
  for (var i=0; i < array.length; i++) {
    if (array[i] === value) {
      return;
    }
  }

  array.push(value)
};

exports.sort = function(array, property, desc) {
  function sorter(aa, bb) {
    var a = !desc ? aa : bb;
    var b = !desc ? bb : aa;

    if (typeof a[property] == "number") {
      return (a[property] - b[property]);
    } else {
      return ((a[property] < b[property])
              ? -1 : ((a[property] > b[property]) ? 1 : 0));
    }
  }

  return array.sort(sorter);
};
