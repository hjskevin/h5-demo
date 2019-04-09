
// 手写实现call函数
Function.prototype.call2 = function(context) {
  var context = context || window;
  context.fn = this;
  var args = [];
  for (var i = 1; i < arguments.length; i++) {
    args.push("arguments[" + i + "]");
  }
  args = args.join(",");
  var result = eval("context.fn(" + args + ")");
  delete context.fn;
  return result
}