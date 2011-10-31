/*global require:true */
var hooker = require('../lib/hooker');

exports['hook'] = {
  setUp: function(done) {
    this.prop = 1;
    this.execOrder = [];
    this.orig = function(a, b) {
      this.execOrder.push("orig");
      return this.prop + a + b;
    };
    this.result = null;
    this.newFunc1 = function(a, b) {
      this.execOrder.push("newFunc1");
      this.args = [a, b];
      return this.result;
    };
    this.newFunc2 = function(origResult) {
      this.execOrder.push("newFunc2");
      return [this, origResult];
    };
    done();
  },
  'hook.orig, unhook': function(test) {
    test.expect(6);
    var orig = this.orig;
    hooker.hook(this, "orig", this.newFunc1);
    test.strictEqual(hooker.hook.orig(this, "orig"), orig, "should return the original function.");
    test.deepEqual(this.execOrder, [], "nothing should have executed yet.");

    this.result = undefined;

    this.execOrder = [];
    test.strictEqual(this.orig(2, 3), 6, "newFunc1 returned undefined, so it should return the original function's result.");
    test.deepEqual(this.execOrder, ["newFunc1", "orig"], "functions should have executed once each, newFunc1 should execute first.");

    hooker.unhook(this, "orig");

    this.execOrder = [];
    test.strictEqual(this.orig(2, 3), 6, "should just invoke the original function");
    test.deepEqual(this.execOrder, ["orig"], "only the original, unhooked function, should execute.");

    test.done();
  },
  'options: pre (default)': function(test) {
    test.expect(6);
    hooker.hook(this, "orig", this.newFunc1);

    this.execOrder = [];
    this.result = undefined;
    test.strictEqual(this.orig(2, 3), 6, "newFunc1 returned undefined, so it should return the original function's result.");
    test.deepEqual(this.args, [2, 3], "callback should receive arguments.");
    test.deepEqual(this.execOrder, ["newFunc1", "orig"], "functions should have executed once each, newFunc1 should execute first.");

    this.execOrder = [];
    this.result = 999;
    test.strictEqual(this.orig(2, 3), 999, "newFunc1 returned 999, so it should return that.");
    test.deepEqual(this.args, [2, 3], "callback should receive arguments.");
    test.deepEqual(this.execOrder, ["newFunc1", "orig"], "functions should have executed once each, newFunc1 should execute first.");

    test.done();
  },
  'options: pre + preempt': function(test) {
    test.expect(6);
    hooker.hook(this, "orig", {preempt: true}, this.newFunc1);

    this.execOrder = [];
    this.result = undefined;
    test.strictEqual(this.orig(2, 3), 6, "newFunc1 returned undefined, so it should return the original function's result.");
    test.deepEqual(this.args, [2, 3], "callback should receive arguments.");
    test.deepEqual(this.execOrder, ["newFunc1", "orig"], "functions should have executed once each, newFunc1 should execute first.");

    this.execOrder = [];
    this.result = 999;
    test.strictEqual(this.orig(2, 3), 999, "newFunc1 returned 999, so it should return that.");
    test.deepEqual(this.args, [2, 3], "callback should receive arguments.");
    test.deepEqual(this.execOrder, ["newFunc1"], "functions should have executed once each, newFunc1 should execute first.");

    test.done();
  },
  'options: pre + filter': function(test) {
    test.expect(3);
    hooker.hook(this, "orig", {filter: true}, this.newFunc1);

    this.execOrder = [];
    this.result = [{prop: "a", execOrder: this.execOrder}, ["b", "c"]];
    test.strictEqual(this.orig(2, 3), "abc", "newFunc returned a new this value and arguments which the original function was applied with.");
    test.deepEqual(this.args, [2, 3], "callback should receive arguments.");
    test.deepEqual(this.execOrder, ["newFunc1", "orig"], "functions should have executed once each, newFunc1 should execute first.");

    test.done();
  },
  'options: post': function(test) {
    test.expect(6);
    hooker.hook(this, "orig", {post: true}, this.newFunc1);

    this.execOrder = [];
    this.result = undefined;
    test.strictEqual(this.orig(2, 3), 6, "newFunc1 returned undefined, so it should return the original function's result.");
    test.deepEqual(this.args, [2, 3], "callback should receive arguments.");
    test.deepEqual(this.execOrder, ["orig", "newFunc1"], "functions should have executed once each, the original function should execute first.");

    this.execOrder = [];
    this.result = 999;
    test.strictEqual(this.orig(2, 3), 999, "newFunc1 returned 999, so it should return that.");
    test.deepEqual(this.args, [2, 3], "callback should receive arguments.");
    test.deepEqual(this.execOrder, ["orig", "newFunc1"], "functions should have executed once each, the original function should execute first.");

    test.done();
  },
  'options: post + filter': function(test) {
    test.expect(2);
    hooker.hook(this, "orig", {post: true, filter: true}, this.newFunc2);

    this.execOrder = [];
    test.deepEqual(this.orig(2, 3), [this, 6], "the this value and arguments passed into newFunc2 should have been returned.");
    test.deepEqual(this.execOrder, ["orig", "newFunc2"], "functions should have executed once each, the original function should execute first.");

    test.done();
  }
};