Function.prototype.apply2 = function(context, arr) {
  var context = context || window;
  context.fn = this;
  var args = [];
  var params = arr[] || [];
  for (var i = o; i < params.length; i++) {
    args.push("params[" + i + "]");
  }
  args = args.join(",");
  var result = eval("context.fn(" + args + ")");
  delete context.fn;
  return result;
}   