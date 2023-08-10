"use strict"

module.exports = createRBTree

var RED   = 0
var BLACK = 1

function recount(node) {
  node._count = 1 + (node.left ? node.left._count : 0) + (node.right ? node.right._count : 0)
}

class RedBlackTree {
  constructor(compare, root) {
    this._compare = compare
    this.root = root
  }

  get keys() {
    var result = []
    this.forEach(function(k,v) {
      result.push(k)
    })
    return result
  }

  get values() {
    var result = []
    this.forEach(function(k,v) {
      result.push(v)
    })
    return result
  }

  //Returns the number of nodes in the tree
  get length() {
    if(this.root) {
      return this.root._count
    }
    return 0
  }

  //Insert a new item into the tree
  insert(key, value) {
    var cmp = this._compare
    //Find point to insert new node at
    var n = this.root
    var n_stack = []
    var d_stack = []
    while(n) {
      var d = cmp(key, n.key)
      n_stack.push(n)
      d_stack.push(d)
      if(d <= 0) {
        n = n.left
      } else {
        n = n.right
      }
    }
    //Rebuild path to leaf node
    n_stack.push({
      _color: RED,
      key,
      value,
      left: null,
      right: null,
      _count: 1
    })
    for(var s=n_stack.length-2; s>=0; --s) {
      var n = n_stack[s]
      if(d_stack[s] <= 0) {
        n_stack[s] = { ...n, left: n_stack[s+1], _count: n._count+1 }
      } else {
        n_stack[s] = { ...n, right: n_stack[s+1], _count: n._count+1 }
      }
    }
    //Rebalance tree using rotations
    //console.log("start insert", key, d_stack)
    for(var s=n_stack.length-1; s>1; --s) {
      var p = n_stack[s-1]
      var n = n_stack[s]
      if(p._color === BLACK || n._color === BLACK) {
        break
      }
      var pp = n_stack[s-2]
      if(pp.left === p) {
        if(p.left === n) {
          var y = pp.right
          if(y && y._color === RED) {
            //console.log("LLr")
            p._color = BLACK
            pp.right = { ...y, _color: BLACK }
            pp._color = RED
            s -= 1
          } else {
            //console.log("LLb")
            pp._color = RED
            pp.left = p.right
            p._color = BLACK
            p.right = pp
            n_stack[s-2] = p
            n_stack[s-1] = n
            recount(pp)
            recount(p)
            if(s >= 3) {
              var ppp = n_stack[s-3]
              if(ppp.left === pp) {
                ppp.left = p
              } else {
                ppp.right = p
              }
            }
            break
          }
        } else {
          var y = pp.right
          if(y && y._color === RED) {
            //console.log("LRr")
            p._color = BLACK
            pp.right = { ...y, _color: BLACK }
            pp._color = RED
            s -= 1
          } else {
            //console.log("LRb")
            p.right = n.left
            pp._color = RED
            pp.left = n.right
            n._color = BLACK
            n.left = p
            n.right = pp
            n_stack[s-2] = n
            n_stack[s-1] = p
            recount(pp)
            recount(p)
            recount(n)
            if(s >= 3) {
              var ppp = n_stack[s-3]
              if(ppp.left === pp) {
                ppp.left = n
              } else {
                ppp.right = n
              }
            }
            break
          }
        }
      } else {
        if(p.right === n) {
          var y = pp.left
          if(y && y._color === RED) {
            //console.log("RRr", y.key)
            p._color = BLACK
            pp.left = { ...y, _color: BLACK }
            pp._color = RED
            s -= 1
          } else {
            //console.log("RRb")
            pp._color = RED
            pp.right = p.left
            p._color = BLACK
            p.left = pp
            n_stack[s-2] = p
            n_stack[s-1] = n
            recount(pp)
            recount(p)
            if(s >= 3) {
              var ppp = n_stack[s-3]
              if(ppp.right === pp) {
                ppp.right = p
              } else {
                ppp.left = p
              }
            }
            break
          }
        } else {
          var y = pp.left
          if(y && y._color === RED) {
            //console.log("RLr")
            p._color = BLACK
            pp.left = { ...y, _color: BLACK }
            pp._color = RED
            s -= 1
          } else {
            //console.log("RLb")
            p.left = n.right
            pp._color = RED
            pp.right = n.left
            n._color = BLACK
            n.right = p
            n.left = pp
            n_stack[s-2] = n
            n_stack[s-1] = p
            recount(pp)
            recount(p)
            recount(n)
            if(s >= 3) {
              var ppp = n_stack[s-3]
              if(ppp.right === pp) {
                ppp.right = n
              } else {
                ppp.left = n
              }
            }
            break
          }
        }
      }
    }
    //Return new tree
    n_stack[0]._color = BLACK
    return new RedBlackTree(cmp, n_stack[0])
  }

  forEach(visit, lo, hi) {
    if(!this.root) {
      return
    }
    switch(arguments.length) {
      case 1:
        return doVisitFull(visit, this.root)
        break

      case 2:
        return doVisitHalf(lo, this._compare, visit, this.root)
        break

      case 3:
        if(this._compare(lo, hi) >= 0) {
          return
        }
        return doVisit(lo, hi, this._compare, visit, this.root)
        break
    }
  }

  //First item in list
  get begin() {
    var stack = []
    var n = this.root
    while(n) {
      stack.push(n)
      n = n.left
    }
    return new RedBlackTreeIterator(this, stack)
  }

  //Last item in list
  get end() {
    var stack = []
    var n = this.root
    while(n) {
      stack.push(n)
      n = n.right
    }
    return new RedBlackTreeIterator(this, stack)
  }

  //Find the ith item in the tree
  at(idx) {
    if(idx < 0) {
      return new RedBlackTreeIterator(this, [])
    }
    var n = this.root
    var stack = []
    while(true) {
      stack.push(n)
      if(n.left) {
        if(idx < n.left._count) {
          n = n.left
          continue
        }
        idx -= n.left._count
      }
      if(!idx) {
        return new RedBlackTreeIterator(this, stack)
      }
      idx -= 1
      if(n.right) {
        if(idx >= n.right._count) {
          break
        }
        n = n.right
      } else {
        break
      }
    }
    return new RedBlackTreeIterator(this, [])
  }

  ge(key) {
    var cmp = this._compare
    var n = this.root
    var stack = []
    var last_ptr = 0
    while(n) {
      var d = cmp(key, n.key)
      stack.push(n)
      if(d <= 0) {
        last_ptr = stack.length
      }
      if(d <= 0) {
        n = n.left
      } else {
        n = n.right
      }
    }
    stack.length = last_ptr
    return new RedBlackTreeIterator(this, stack)
  }

  gt(key) {
    var cmp = this._compare
    var n = this.root
    var stack = []
    var last_ptr = 0
    while(n) {
      var d = cmp(key, n.key)
      stack.push(n)
      if(d < 0) {
        last_ptr = stack.length
      }
      if(d < 0) {
        n = n.left
      } else {
        n = n.right
      }
    }
    stack.length = last_ptr
    return new RedBlackTreeIterator(this, stack)
  }

  lt(key) {
    var cmp = this._compare
    var n = this.root
    var stack = []
    var last_ptr = 0
    while(n) {
      var d = cmp(key, n.key)
      stack.push(n)
      if(d > 0) {
        last_ptr = stack.length
      }
      if(d <= 0) {
        n = n.left
      } else {
        n = n.right
      }
    }
    stack.length = last_ptr
    return new RedBlackTreeIterator(this, stack)
  }

  le(key) {
    var cmp = this._compare
    var n = this.root
    var stack = []
    var last_ptr = 0
    while(n) {
      var d = cmp(key, n.key)
      stack.push(n)
      if(d >= 0) {
        last_ptr = stack.length
      }
      if(d < 0) {
        n = n.left
      } else {
        n = n.right
      }
    }
    stack.length = last_ptr
    return new RedBlackTreeIterator(this, stack)
  }

  //Finds the item with key if it exists
  find(key) {
    var cmp = this._compare
    var n = this.root
    var stack = []
    var last_ptr = 0
    while(n) {
      var d = cmp(key, n.key)
      stack.push(n)
      if(d === 0) {
        last_ptr = stack.length
      }
      if(d <= 0) {
        n = n.left
      } else {
        n = n.right
      }
    }
    stack.length = last_ptr
    return new RedBlackTreeIterator(this, stack)
  }

  //Removes item with key from tree
  remove(key) {
    return this.find(key).remove()
  }

  //Returns the item at `key`
  get(key) {
    var cmp = this._compare
    var n = this.root
    var value
    while(n) {
      var d = cmp(key, n.key)
      if(d === 0) {
        value = n.value
      }
      if(d <= 0) {
        n = n.left
      } else {
        n = n.right
      }
    }
    return value
  }
}

//Visit all nodes inorder
function doVisitFull(visit, node) {
  if(node.left) {
    var v = doVisitFull(visit, node.left)
    if(v) { return v }
  }
  var v = visit(node.key, node.value)
  if(v) { return v }
  if(node.right) {
    return doVisitFull(visit, node.right)
  }
}

//Visit half nodes in order
function doVisitHalf(lo, compare, visit, node) {
  var l = compare(lo, node.key)
  if(l <= 0) {
    if(node.left) {
      var v = doVisitHalf(lo, compare, visit, node.left)
      if(v) { return v }
    }
    var v = visit(node.key, node.value)
    if(v) { return v }
  }
  if(node.right) {
    return doVisitHalf(lo, compare, visit, node.right)
  }
}

//Visit all nodes within a range
function doVisit(lo, hi, compare, visit, node) {
  var l = compare(lo, node.key)
  var h = compare(hi, node.key)
  var v
  if(l <= 0) {
    if(node.left) {
      v = doVisit(lo, hi, compare, visit, node.left)
      if(v) { return v }
    }
    if(h > 0) {
      v = visit(node.key, node.value)
      if(v) { return v }
    }
  }
  if(h > 0 && node.right) {
    return doVisit(lo, hi, compare, visit, node.right)
  }
}

//Iterator for red black tree
class RedBlackTreeIterator {
  constructor(tree, stack) {
    this.tree = tree
    this._stack = stack
  }

  get valid() {
    return this._stack.length > 0
  }

  //Makes a copy of an iterator
  clone() {
    return new RedBlackTreeIterator(this.tree, this._stack.slice())
  }

  //Removes item at iterator from tree
  remove() {
    var stack = this._stack
    if(stack.length === 0) {
      return this.tree
    }
    //First copy path to node
    var cstack = new Array(stack.length)
    var n = stack[stack.length-1]
    cstack[cstack.length-1] = { ...n }
    for(var i=stack.length-2; i>=0; --i) {
      var n = stack[i]
      if(n.left === stack[i+1]) {
        cstack[i] = { ...n, left: cstack[i+1] }
      } else {
        cstack[i] = { ...n, right: cstack[i+1] }
      }
    }

    //Get node
    n = cstack[cstack.length-1]
    //console.log("start remove: ", n.value)

    //If not leaf, then swap with previous node
    if(n.left && n.right) {
      //console.log("moving to leaf")

      //First walk to previous leaf
      var split = cstack.length
      n = n.left
      while(n.right) {
        cstack.push(n)
        n = n.right
      }
      //Copy path to leaf
      var v = cstack[split-1]
      cstack.push({ ...n, key: v.key, value: v.value })
      cstack[split-1].key = n.key
      cstack[split-1].value = n.value

      //Fix up stack
      for(var i=cstack.length-2; i>=split; --i) {
        n = cstack[i]
        cstack[i] = { ...n, right: cstack[i+1] }
      }
      cstack[split-1].left = cstack[split]
    }
    //console.log("stack=", cstack.map(function(v) { return v.value }))

    //Remove leaf node
    n = cstack[cstack.length-1]
    if(n._color === RED) {
      //Easy case: removing red leaf
      //console.log("RED leaf")
      var p = cstack[cstack.length-2]
      if(p.left === n) {
        p.left = null
      } else if(p.right === n) {
        p.right = null
      }
      cstack.pop()
      for(var i=0; i<cstack.length; ++i) {
        cstack[i]._count--
      }
      return new RedBlackTree(this.tree._compare, cstack[0])
    } else {
      if(n.left || n.right) {
        //Second easy case:  Single child black parent
        //console.log("BLACK single child")
        if(n.left) {
          Object.assign(n, n.left)
        } else if(n.right) {
          Object.assign(n, n.right)
        }
        //Child must be red, so repaint it black to balance color
        n._color = BLACK
        for(var i=0; i<cstack.length-1; ++i) {
          cstack[i]._count--
        }
        return new RedBlackTree(this.tree._compare, cstack[0])
      } else if(cstack.length === 1) {
        //Third easy case: root
        //console.log("ROOT")
        return new RedBlackTree(this.tree._compare, null)
      } else {
        //Hard case: Repaint n, and then do some nasty stuff
        //console.log("BLACK leaf no children")
        for(var i=0; i<cstack.length; ++i) {
          cstack[i]._count--
        }
        var parent = cstack[cstack.length-2]
        fixDoubleBlack(cstack)
        //Fix up links
        if(parent.left === n) {
          parent.left = null
        } else {
          parent.right = null
        }
      }
    }
    return new RedBlackTree(this.tree._compare, cstack[0])
  }

  //Advances iterator to next element in list
  next() {
    var stack = this._stack
    if(stack.length === 0) {
      return
    }
    var n = stack[stack.length-1]
    if(n.right) {
      n = n.right
      while(n) {
        stack.push(n)
        n = n.left
      }
    } else {
      stack.pop()
      while(stack.length > 0 && stack[stack.length-1].right === n) {
        n = stack[stack.length-1]
        stack.pop()
      }
    }
  }

  //Checks if iterator is at end of tree
  get hasNext() {
    var stack = this._stack
    if(stack.length === 0) {
      return false
    }
    if(stack[stack.length-1].right) {
      return true
    }
    for(var s=stack.length-1; s>0; --s) {
      if(stack[s-1].left === stack[s]) {
        return true
      }
    }
    return false
  }

  //Update value
  update(value) {
    var stack = this._stack
    if(stack.length === 0) {
      throw new Error("Can't update empty node!")
    }
    var cstack = new Array(stack.length)
    var n = stack[stack.length-1]
    cstack[cstack.length-1] = { ...n, value }
    for(var i=stack.length-2; i>=0; --i) {
      n = stack[i]
      if(n.left === stack[i+1]) {
        cstack[i] = { ...n, left: cstack[i+1] }
      } else {
        cstack[i] = { ...n, right: cstack[i+1] }
      }
    }
    return new RedBlackTree(this.tree._compare, cstack[0])
  }

  //Moves iterator backward one element
  prev() {
    var stack = this._stack
    if(stack.length === 0) {
      return
    }
    var n = stack[stack.length-1]
    if(n.left) {
      n = n.left
      while(n) {
        stack.push(n)
        n = n.right
      }
    } else {
      stack.pop()
      while(stack.length > 0 && stack[stack.length-1].left === n) {
        n = stack[stack.length-1]
        stack.pop()
      }
    }
  }

  //Checks if iterator is at start of tree
  get hasPrev() {
    var stack = this._stack
    if(stack.length === 0) {
      return false
    }
    if(stack[stack.length-1].left) {
      return true
    }
    for(var s=stack.length-1; s>0; --s) {
      if(stack[s-1].right === stack[s]) {
        return true
      }
    }
    return false
  }
}

Object.defineProperties(RedBlackTreeIterator.prototype, {
  //Node of the iterator
  node: {
    get() {
      if(this._stack.length > 0) {
        return this._stack[this._stack.length-1]
      }
      return null
    },
    enumerable: true
  },
  //Returns key
  key: {
    get() {
      if(this._stack.length > 0) {
        return this._stack[this._stack.length-1].key
      }
      return null
    },
    enumerable: true
  },
  //Returns value
  value: {
    get() {
      if(this._stack.length > 0) {
        return this._stack[this._stack.length-1].value
      }
      return
    },
    enumerable: true
  },
  //Returns the position of this iterator in the sorted list
  index: {
    get() {
      var idx = 0
      var stack = this._stack
      if(stack.length === 0) {
        var r = this.tree.root
        if(r) {
          return r._count
        }
        return 0
      } else if(stack[stack.length-1].left) {
        idx = stack[stack.length-1].left._count
      }
      for(var s=stack.length-2; s>=0; --s) {
        if(stack[s+1] === stack[s].right) {
          ++idx
          if(stack[s].left) {
            idx += stack[s].left._count
          }
        }
      }
      return idx
    },
    enumerable: true
  }
})

//Fix up a double black node in a tree
function fixDoubleBlack(stack) {
  var n, p, s, z
  for(var i=stack.length-1; i>=0; --i) {
    n = stack[i]
    if(i === 0) {
      n._color = BLACK
      return
    }
    //console.log("visit node:", n.key, i, stack[i].key, stack[i-1].key)
    p = stack[i-1]
    if(p.left === n) {
      //console.log("left child")
      s = p.right
      if(s.right && s.right._color === RED) {
        //console.log("case 1: right sibling child red")
        s = p.right = { ...s }
        z = s.right = { ...s.right }
        p.right = s.left
        s.left = p
        s.right = z
        s._color = p._color
        n._color = BLACK
        p._color = BLACK
        z._color = BLACK
        recount(p)
        recount(s)
        if(i > 1) {
          var pp = stack[i-2]
          if(pp.left === p) {
            pp.left = s
          } else {
            pp.right = s
          }
        }
        stack[i-1] = s
        return
      } else if(s.left && s.left._color === RED) {
        //console.log("case 1: left sibling child red")
        s = p.right = { ...s }
        z = s.left = { ...s.left }
        p.right = z.left
        s.left = z.right
        z.left = p
        z.right = s
        z._color = p._color
        p._color = BLACK
        s._color = BLACK
        n._color = BLACK
        recount(p)
        recount(s)
        recount(z)
        if(i > 1) {
          var pp = stack[i-2]
          if(pp.left === p) {
            pp.left = z
          } else {
            pp.right = z
          }
        }
        stack[i-1] = z
        return
      }
      if(s._color === BLACK) {
        if(p._color === RED) {
          //console.log("case 2: black sibling, red parent", p.right.value)
          p._color = BLACK
          p.right = { ...s, _color: RED }
          return
        } else {
          //console.log("case 2: black sibling, black parent", p.right.value)
          p.right = { ...s, _color: RED }
          continue
        }
      } else {
        //console.log("case 3: red sibling")
        s = { ...s }
        p.right = s.left
        s.left = p
        s._color = p._color
        p._color = RED
        recount(p)
        recount(s)
        if(i > 1) {
          var pp = stack[i-2]
          if(pp.left === p) {
            pp.left = s
          } else {
            pp.right = s
          }
        }
        stack[i-1] = s
        stack[i] = p
        if(i+1 < stack.length) {
          stack[i+1] = n
        } else {
          stack.push(n)
        }
        i = i+2
      }
    } else {
      //console.log("right child")
      s = p.left
      if(s.left && s.left._color === RED) {
        //console.log("case 1: left sibling child red", p.value, p._color)
        s = p.left = { ...s }
        z = s.left = { ...s.left }
        p.left = s.right
        s.right = p
        s.left = z
        s._color = p._color
        n._color = BLACK
        p._color = BLACK
        z._color = BLACK
        recount(p)
        recount(s)
        if(i > 1) {
          var pp = stack[i-2]
          if(pp.right === p) {
            pp.right = s
          } else {
            pp.left = s
          }
        }
        stack[i-1] = s
        return
      } else if(s.right && s.right._color === RED) {
        //console.log("case 1: right sibling child red")
        s = p.left = { ...s }
        z = s.right = { ...s.right }
        p.left = z.right
        s.right = z.left
        z.right = p
        z.left = s
        z._color = p._color
        p._color = BLACK
        s._color = BLACK
        n._color = BLACK
        recount(p)
        recount(s)
        recount(z)
        if(i > 1) {
          var pp = stack[i-2]
          if(pp.right === p) {
            pp.right = z
          } else {
            pp.left = z
          }
        }
        stack[i-1] = z
        return
      }
      if(s._color === BLACK) {
        if(p._color === RED) {
          //console.log("case 2: black sibling, red parent")
          p._color = BLACK
          p.left = { ...s, _color: RED }
          return
        } else {
          //console.log("case 2: black sibling, black parent")
          p.left = { ...s, _color: RED }
          continue
        }
      } else {
        //console.log("case 3: red sibling")
        s = { ...s }
        p.left = s.right
        s.right = p
        s._color = p._color
        p._color = RED
        recount(p)
        recount(s)
        if(i > 1) {
          var pp = stack[i-2]
          if(pp.right === p) {
            pp.right = s
          } else {
            pp.left = s
          }
        }
        stack[i-1] = s
        stack[i] = p
        if(i+1 < stack.length) {
          stack[i+1] = n
        } else {
          stack.push(n)
        }
        i = i+2
      }
    }
  }
}

//Default comparison function
function defaultCompare(a, b) {
  if(a < b) {
    return -1
  }
  if(a > b) {
    return 1
  }
  return 0
}

//Build a tree
function createRBTree(compare) {
  return new RedBlackTree(compare || defaultCompare, null)
}
