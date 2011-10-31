# JavaScript Hooker

Monkey-patch (hook) functions for debugging and stuff.

## Getting Started

This code should work just fine in Node.js:

```javascript
var hooker = require('lib/hooker');
hooker.hook(Math, "max", function() {
  console.log(arguments.length + " arguments passed");
});
Math.max(5, 6, 7) // 7 (logs: "3 arguments passed")
```

Or in the browser:

```html
<script src="dist/ba-hooker.min.js"></script>
<script>
hook(Math, "max", function() {
  console.log(arguments.length + " arguments passed");
});
Math.max(5, 6, 7) // 7 (logs: "3 arguments passed")
</script>
```

In the browser, you can attach Hooker's methods to any object.

```html
<script>
this.exports = Bocoup.utils;
</script>
<script src="dist/ba-hooker.min.js"></script>
<script>
Bocoup.utils.hook(Math, "max", function() {
  console.log(arguments.length + " arguments passed");
});
Math.max(5, 6, 7) // 7 (logs: "3 arguments passed")
</script>
```

## Sample Usage
```javascript
var hooker = require('lib/hooker');
// Simple logging.
hooker.hook(Math, "max", function() {
  console.log(arguments.length + " arguments passed");
});
Math.max(5, 6, 7) // 7 (logs: "3 arguments passed")

hooker.unhook(Math, "max");
Math.max(5, 6, 7) // 7

// Returning a value overrides the original value.
hooker.hook(Math, "max", function() {
  if (arguments.length === 0) {
    return 9000;
  }
});
Math.max(5, 6, 7) // 7
Math.max() // 9000
```

## Documentation
For now, look at the unit tests.

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [grunt](https://github.com/cowboy/node-grunt).

_Also, please don't edit files in the "dist" subdirectory as they are generated via grunt. You'll find source code in the "lib" subdirectory!_

## Release History
Nothing official yet...

## License
Copyright (c) 2011 "Cowboy" Ben Alman  
Dual licensed under the MIT and GPL licenses.  
<http://benalman.com/about/license/>
