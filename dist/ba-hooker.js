/* JavaScript Hooker - v0.2.1 - 10/31/2011
 * http://github.com/cowboy/javascript-hooker
 * Copyright (c) 2011 "Cowboy" Ben Alman; Licensed MIT, GPL */

(function(exports) {
  // Since undefined can be overwritten, an internal reference is kept.
  var undef;
  // Get an array from an array-like object with slice.call(arrayLikeObject).
  var slice = [].slice;

  // I can't think of a better way to ensure a value is a specific type other
  // than to create instances and use the `instanceof` operator.
  function HookerOverride(v) { this.value = v; }
  function HookerPreempt(v) { this.value = v; }
  function HookerFilter(c, a) { this.context = c; this.args = a; }

  // When a pre- or post-hook returns the result of this function, the value
  // passed will be used in place of the original function's return value. Any
  // post-hook override value will take precedence over a pre-hook override
  // value.
  exports.override = function(value) {
    return new HookerOverride(value);
  };

  // When a pre-hook returns the result of this function, the value passed will
  // be used in place of the original function's return value, and the original
  // function will NOT be executed.
  exports.preempt = function(value) {
    return new HookerPreempt(value);
  };

  // When a pre-hook returns the result of this function, the context and
  // arguments passed will be applied into the original function.
  exports.filter = function(context, args) {
    return new HookerFilter(context, args);
  };

  // Monkey-patch (hook) a method of an object.
  exports.hook = function(obj, methodName, options) {
    // If just a function is passed instead of an options hash, use that as a
    // pre-hook function.
    if (typeof options === "function") {
      options = {pre: options};
    }
    // The original (current) method.
    var orig = obj[methodName];
    // Re-define the method.
    obj[methodName] = function() {
      var result, origResult, tmp;
      // If a pre-hook function was specified, invoke it in the current context
      // with the passed-in arguments, and store its result.
      if (options.pre) {
        result = options.pre.apply(this, arguments);
      }

      if (result instanceof HookerFilter) {
        // If the pre-hook returned hooker.filter(context, args), invoke the
        // original function with that context and arguments, and store its
        // result.
        origResult = result = orig.apply(result.context, result.args);
      } else if (result instanceof HookerPreempt) {
        // If the pre-hook returned hooker.preempt(value) just use the passed
        // value and don't execute the original function.
        origResult = result = result.value;
      } else {
        // Invoke the original function in the current context with the
        // passed-in arguments, and store its result.
        origResult = orig.apply(this, arguments);
        // If the pre-hook returned hooker.override(value), use the passed
        // value, otherwise use the original function's result.
        result = result instanceof HookerOverride ? result.value : origResult;
      }

      if (options.post) {
        // If a post-hook function was specified, invoke it in the current
        // context, passing in the result of the original function as the first
        // argument, followed by any passed-in arguments.
        tmp = options.post.apply(this, [origResult].concat(slice.call(arguments)));
        if (tmp instanceof HookerOverride) {
          // If the post-hook returned hooker.override(value), use the passed
          // value, otherwise use the previously computed result.
          result = tmp.value;
        }
      }
      // Unhook if the "once" option was specified.
      if (options.once) {
        exports.unhook(obj, methodName);
      }
      // Return the result!
      return result;
    };
    // Store a reference to the original method as a property on the new one.
    obj[methodName]._orig = orig;
  };
  
  // Get a reference to the original method from a hooked function.
  exports.orig = function(obj, methodName) {
    return obj[methodName]._orig;
  };

  // Un-monkey-patch (unhook) a method of an object.
  exports.unhook = function(obj, methodName) {
    var orig = exports.orig(obj, methodName);
    // Only unhook if it hasn't already been unhooked.
    if (orig) {
      obj[methodName] = orig;
    }
  };
}(typeof exports === "object" && exports || this));