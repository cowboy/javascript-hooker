/*
 * JavaScript Hooker
 * http://benalman.com/
 *
 * Copyright (c) 2011 "Cowboy" Ben Alman
 * Dual licensed under the MIT and GPL licenses.
 * http://benalman.com/about/license/
 */

(function (exports) {
 // Monkey-patch a function property of an object.
 exports.hook = function(obj, prop, options, callback) {
   // If options object is omitted, shuffle arguments.
   if (typeof options === "function") {
     callback = options;
     options = {};
   }
   // The original function.
   var orig = obj[prop];

   if (options.post) {
     // Execute callback after original is executed.
     obj[prop] = function() {
       // Unbind if once option specified.
       if (options.once) { exports.unhook(obj, prop); }
       // Invoke original function.
       var result = orig.apply(this, arguments);
       if (options.filter) {
         // In filter mode, pass orig's return value into callback as its
         // first argument, returning its value.
         return callback.call(this, result);
       }
       // Call callback.
       var callbackResult = callback.apply(this, arguments);
       // Return callback's result if not undefined, otherwise original
       // function's result.
       return callbackResult !== undefined ? callbackResult : result;
     };
   } else {
     // Execute callback before original is executed. If callback returns a
     // value, return that, otherwise invoke original function, returning its
     // result.
     obj[prop] = function() {
       // Unbind if once option specified.
       if (options.once) { exports.unhook(obj, prop); }
       // Call callback.
       var result = callback.apply(this, arguments);
       
       if (options.filter) {
         // In filter mode, pass callback's return value, which must be a
         // two-element array: [thisValue, argumentsArray] into the original
         // function, returning its value.
         return orig.apply(result[0], result[1]);
       } else if (result !== undefined) {
         // Otherwise, if callback returned a value...
         if (!options.preempt) {
           // Execute the original function if not preempting.
           orig.apply(this, arguments);
         }
         // Return callback's result.
         return result;
       }
       // Otherwise, return original function's result.
       return orig.apply(this, arguments);
     };
   }
   // Set property on new function to allow unhooking.
   obj[prop]._orig = orig;
 };

 // Get the original function from a hooked function.
 exports.hook.orig = function(obj, prop) {
   return obj[prop]._orig;
 };

 // Un-monkey-patch a function property of an object.
 exports.unhook = function(obj, prop) {
   var orig = exports.hook.orig(obj, prop);
   // If there's an original function, restore it.
   if (orig) {
     obj[prop] = orig;
   }
 };
}(typeof exports === "object" && exports || this));
