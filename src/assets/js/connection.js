/**
 * Created by Ghobe on 2018-04-05.
 */
var connection = {
  requestCompare: function (from, to) {
    var target = []
    for (var i in from) {
      for (var j in to) {
        if (from[i].email === to[j].email) {
          target.push(from[i].email)
        }
      }
    }
    return target.length !== 0 ? target : null
  },
  targetRemove: function (target, array) {
    for (var i in array) {
      if (array[i] === target) {
        var temp = array.slice(0, i)
        var temp2 = array.slice(i + 1, array.length - 1)
        return temp.concat(temp2)
      }
    }
  }
}
export default {
  connection
}
