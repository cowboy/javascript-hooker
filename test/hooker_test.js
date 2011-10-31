/*global require:true */
var hooker = require('../lib/hooker');

exports['hook'] = {
  setUp: function(done) {
    this.order = [];
    this.track = function() {
      [].push.apply(this.order, arguments);
    };
    
    this.prop = 1;
    this.add = function(a, b) {
      this.track("add", this.prop, a, b);
      return this.prop + a + b;
    };
    
    done();
  },
  'hook.orig': function(test) {
    test.expect(1);
    var orig = this.add;
    hooker.hook(this, "add", function() {});
    test.strictEqual(this.add.orig, orig, "should reference the original function.");
    test.done();
  },
  'unhook': function(test) {
    test.expect(3);
    var orig = this.add;
    hooker.hook(this, "add", function() {});
    hooker.unhook(this, "add");
    test.strictEqual(this.add, orig, "should have unhooked, restoring the original function");
    hooker.unhook(this, "add");
    test.strictEqual(this.add, orig, "shouldn't explode if already unhooked");
    test.strictEqual(this.add.orig, undefined, "original function shouldn't have an orig property");
    test.done();
  },
  'once': function(test) {
    test.expect(5);
    var orig = this.add;
    hooker.hook(this, "add", {
      once: true,
      pre: function(a, b) {
        // Arguments are passed into pre-hook as specified.
        this.track("before", this.prop, a, b);
      }
    });
    test.strictEqual(this.add(2, 3), 6, "should return the original function's result.");
    test.deepEqual(this.order, ["before", 1, 2, 3, "add", 1, 2, 3], "functions should execute in-order.");
    test.strictEqual(this.add, orig, "should automatically unhook when once is specified.");
    this.order = [];
    test.strictEqual(this.add(2, 3), 6, "should return the original function's result.");
    test.deepEqual(this.order, ["add", 1, 2, 3], "only the original function should execute.");
    test.done();
  },
  'pre-hook (simple syntax)': function(test) {
    test.expect(2);
    // Pre-hook.
    hooker.hook(this, "add", function(a, b) {
      // Arguments are passed into pre-hook as specified.
      this.track("before", this.prop, a, b);
    });
    test.strictEqual(this.add(2, 3), 6, "should return the original function's result.");
    test.deepEqual(this.order, ["before", 1, 2, 3, "add", 1, 2, 3], "functions should execute in-order.");
    test.done();
  },
  'pre-hook': function(test) {
    test.expect(2);
    // Pre-hook.
    hooker.hook(this, "add", {
      pre: function(a, b) {
        // Arguments are passed into pre-hook as specified.
        this.track("before", this.prop, a, b);
      }
    });
    test.strictEqual(this.add(2, 3), 6, "should return the original function's result.");
    test.deepEqual(this.order, ["before", 1, 2, 3, "add", 1, 2, 3], "functions should execute in-order.");
    test.done();
  },
  'post-hook': function(test) {
    test.expect(2);
    // Post-hook.
    hooker.hook(this, "add", {
      post: function(result, a, b) {
        // Arguments to post-hook are the original function's return value,
        // followed by the specified function arguments.
        this.track("after", this.prop, a, b, result);
      }
    });
    test.strictEqual(this.add(2, 3), 6, "should return the original function's result.");
    test.deepEqual(this.order, ["add", 1, 2, 3, "after", 1, 2, 3, 6], "functions should execute in-order.");
    test.done();
  },
  'pre- & post-hook': function(test) {
    test.expect(2);
    // Pre- & post-hook.
    hooker.hook(this, "add", {
      pre: function(a, b) {
        // Arguments are passed into pre-hook as specified.
        this.track("before", this.prop, a, b);
      },
      post: function(result, a, b) {
        // Arguments to post-hook are the original function's return value,
        // followed by the specified function arguments.
        this.track("after", this.prop, a, b, result);
      }
    });
    test.strictEqual(this.add(2, 3), 6, "should return the original function's result.");
    test.deepEqual(this.order, ["before", 1, 2, 3, "add", 1, 2, 3, "after", 1, 2, 3, 6], "functions should execute in-order.");
    test.done();
  },

  'pre-hook, return value override': function(test) {
    test.expect(2);
    // Pre-hook.
    hooker.hook(this, "add", {
      pre: function(a, b) {
        // Arguments are passed into pre-hook as specified.
        this.track("before", this.prop, a, b);
        // This return value will override the original function's return value.
        return hooker.override("b" + this.prop + a + b);
      }
    });
    test.strictEqual(this.add(2, 3), "b123", "should return the overridden result.");
    test.deepEqual(this.order, ["before", 1, 2, 3, "add", 1, 2, 3], "functions should execute in-order.");
    test.done();
  },
  'post-hook, return value override': function(test) {
    test.expect(2);
    // Post-hook.
    hooker.hook(this, "add", {
      post: function(result, a, b) {
        // Arguments to post-hook are the original function's return value,
        // followed by the specified function arguments.
        this.track("after", this.prop, a, b, result);
        // This return value will override the original function's return value.
        return hooker.override("a" + this.prop + a + b + result);
      }
    });
    test.strictEqual(this.add(2, 3), "a1236", "should return the post-hook overridden result.");
    test.deepEqual(this.order, ["add", 1, 2, 3, "after", 1, 2, 3, 6], "functions should execute in-order.");
    test.done();
  },
  'pre- & post-hook, return value override': function(test) {
    test.expect(2);
    // Pre- & post-hook.
    hooker.hook(this, "add", {
      pre: function(a, b) {
        // Arguments are passed into pre-hook as specified.
        this.track("before", this.prop, a, b);
        // This return value will override the original function's return value.
        return hooker.override("b" + this.prop + a + b);
      },
      post: function(result, a, b) {
        // Arguments to post-hook are the original function's return value,
        // followed by the specified function arguments.
        this.track("after", this.prop, a, b, result);
        // This return value will override the original function's return value
        // AND the pre-hook's return value.
        return hooker.override("a" + this.prop + a + b + result);
      }
    });
    test.strictEqual(this.add(2, 3), "a1236", "should return the overridden result, and post-hook result should take precedence over pre-hook result.");
    test.deepEqual(this.order, ["before", 1, 2, 3, "add", 1, 2, 3, "after", 1, 2, 3, 6], "functions should execute in-order.");
    test.done();
  },

  'pre-hook, filtering arguments': function(test) {
    test.expect(2);
    // Pre-hook.
    hooker.hook(this, "add", {
      pre: function(a, b) {
        // Arguments are passed into pre-hook as specified.
        this.track("before", this.prop, a, b);
        // Return hooker.filter(context, arguments) and they will be passed into
        // the original function. The "track" and "order" propterites are just
        // set here for the same of this unit test.
        return hooker.filter({prop: "x", track: this.track, order: this.order}, ["y", "z"]);
      }
    });
    test.strictEqual(this.add(2, 3), "xyz", "should return the original function's result, given filtered context and arguments.");
    test.deepEqual(this.order, ["before", 1, 2, 3, "add", "x", "y", "z"], "functions should execute in-order.");
    test.done();
  },
  'pre- & post-hook, filtering arguments': function(test) {
    test.expect(2);
    // Pre- & post-hook.
    hooker.hook(this, "add", {
      pre: function(a, b) {
        // Arguments are passed into pre-hook as specified.
        this.track("before", this.prop, a, b);
        // Return hooker.filter(context, arguments) and they will be passed into
        // the original function. The "track" and "order" propterites are just
        // set here for the same of this unit test.
        return hooker.filter({prop: "x", track: this.track, order: this.order}, ["y", "z"]);
      },
      post: function(result, a, b) {
        // Arguments to post-hook are the original function's return value,
        // followed by the specified function arguments.
        this.track("after", this.prop, a, b, result);
      }
    });
    test.strictEqual(this.add(2, 3), "xyz", "should return the original function's result, given filtered context and arguments.");
    test.deepEqual(this.order, ["before", 1, 2, 3, "add", "x", "y", "z", "after", 1, 2, 3, "xyz"], "functions should execute in-order.");
    test.done();
  },
  'pre- & post-hook, filtering arguments, return value override': function(test) {
    test.expect(2);
    // Pre- & post-hook.
    hooker.hook(this, "add", {
      pre: function(a, b) {
        // Arguments are passed into pre-hook as specified.
        this.track("before", this.prop, a, b);
        // Return hooker.filter(context, arguments) and they will be passed into
        // the original function. The "track" and "order" propterites are just
        // set here for the same of this unit test.
        return hooker.filter({prop: "x", track: this.track, order: this.order}, ["y", "z"]);
      },
      post: function(result, a, b) {
        // Arguments to post-hook are the original function's return value,
        // followed by the specified function arguments.
        this.track("after", this.prop, a, b, result);
        // This return value will override the original function's return value
        // AND the pre-hook's return value.
        return hooker.override("a" + this.prop + a + b + result);
      }
    });
    test.strictEqual(this.add(2, 3), "a123xyz", "should return the post-hook overridden result.");
    test.deepEqual(this.order, ["before", 1, 2, 3, "add", "x", "y", "z", "after", 1, 2, 3, "xyz"], "functions should execute in-order.");
    test.done();
  },

  'pre-hook, preempt original function': function(test) {
    test.expect(2);
    // Pre-hook.
    hooker.hook(this, "add", {
      pre: function(a, b) {
        // Arguments are passed into pre-hook as specified.
        this.track("before", this.prop, a, b);
        // Returning hooker.preempt will prevent the original function from being
        // invoked and optionally set a return value.
        return hooker.preempt();
      }
    });
    test.strictEqual(this.add(2, 3), undefined, "should return the value passed to preempt.");
    test.deepEqual(this.order, ["before", 1, 2, 3], "functions should execute in-order.");
    test.done();
  },
  'pre-hook, preempt original function with value': function(test) {
    test.expect(2);
    // Pre-hook.
    hooker.hook(this, "add", {
      pre: function(a, b) {
        // Arguments are passed into pre-hook as specified.
        this.track("before", this.prop, a, b);
        // Returning hooker.preempt will prevent the original function from being
        // invoked and optionally set a return value.
        return hooker.preempt(9000);
      }
    });
    test.strictEqual(this.add(2, 3), 9000, "should return the value passed to preempt.");
    test.deepEqual(this.order, ["before", 1, 2, 3], "functions should execute in-order.");
    test.done();
  },
  'pre- & post-hook, preempt original function with value': function(test) {
    test.expect(2);
    // Pre- & post-hook.
    hooker.hook(this, "add", {
      pre: function(a, b) {
        // Arguments are passed into pre-hook as specified.
        this.track("before", this.prop, a, b);
        // Returning hooker.preempt will prevent the original function from being
        // invoked and optionally set a return value.
        return hooker.preempt(9000);
      },
      post: function(result, a, b) {
        // Arguments to post-hook are the original function's return value,
        // followed by the specified function arguments.
        this.track("after", this.prop, a, b, result);
      }
    });
    test.strictEqual(this.add(2, 3), 9000, "should return the value passed to preempt.");
    test.deepEqual(this.order, ["before", 1, 2, 3, "after", 1, 2, 3, 9000], "functions should execute in-order.");
    test.done();
  },
  'pre- & post-hook, preempt original function with value, return value override': function(test) {
    test.expect(2);
    // Pre- & post-hook.
    hooker.hook(this, "add", {
      pre: function(a, b) {
        // Arguments are passed into pre-hook as specified.
        this.track("before", this.prop, a, b);
        // Returning hooker.preempt will prevent the original function from being
        // invoked and optionally set a return value.
        return hooker.preempt(9000);
      },
      post: function(result, a, b) {
        // Arguments to post-hook are the original function's return value,
        // followed by the specified function arguments.
        this.track("after", this.prop, a, b, result);
        // This return value will override any preempt value set in pre-hook.
        return hooker.override("a" + this.prop + a + b + result);
      }
    });
    test.strictEqual(this.add(2, 3), "a1239000", "should return the overridden result, and post-hook result should take precedence over preempt value.");
    test.deepEqual(this.order, ["before", 1, 2, 3, "after", 1, 2, 3, 9000], "functions should execute in-order.");
    test.done();
  }
};
