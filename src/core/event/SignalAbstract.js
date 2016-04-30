define(["require", "exports", "./SignalConnection"], function (require, exports, SignalConnection_1) {
    "use strict";
    var Task = (function () {
        function Task(fn) {
            this.next = null;
            this.fn = fn;
        }
        return Task;
    }());
    exports.Task = Task;
    var SignalAbstract = (function () {
        function SignalAbstract(listener) {
            if (listener === void 0) { listener = null; }
            this._deferredTasks = null;
            this._head = (listener != null) ? new SignalConnection_1.SignalConnection(this, listener) : null;
        }
        SignalAbstract.prototype.hasListeners = function () {
            return this._head != null;
        };
        SignalAbstract.prototype.connect = function (listener, prioritize) {
            var _this = this;
            if (prioritize === void 0) { prioritize = false; }
            var conn = new SignalConnection_1.SignalConnection(this, listener);
            if (this.dispatching()) {
                this.defer(function () { return _this.listAdd(conn, prioritize); });
            }
            else {
                this.listAdd(conn, prioritize);
            }
            return conn;
        };
        SignalAbstract.prototype.disconnect = function (conn) {
            var _this = this;
            if (this._head == SignalAbstract.DISPATCHING_SENTINEL) {
                this.defer(function () { return _this.listRemove(conn); });
            }
            else {
                this.listRemove(conn);
            }
        };
        SignalAbstract.prototype.defer = function (fn) {
            var tail = null;
            var p = this._deferredTasks;
            while (p != null) {
                tail = p;
                p = p.next;
            }
            var task = new Task(fn);
            if (tail != null) {
                tail.next = task;
            }
            else {
                this._deferredTasks = task;
            }
        };
        SignalAbstract.prototype.willEmit = function () {
            var snapshot = this._head;
            this._head = SignalAbstract.DISPATCHING_SENTINEL;
            return snapshot;
        };
        SignalAbstract.prototype.didEmit = function (head) {
            this._head = head;
            var snapshot = this._deferredTasks;
            this._deferredTasks = null;
            while (snapshot != null) {
                snapshot.fn();
                snapshot = snapshot.next;
            }
        };
        SignalAbstract.prototype.dispatching = function () {
            return this._head == SignalAbstract.DISPATCHING_SENTINEL;
        };
        SignalAbstract.prototype.listAdd = function (conn, prioritize) {
            if (prioritize) {
                conn._next = this._head;
                this._head = conn;
            }
            else {
                var tail = null;
                var p = this._head;
                while (p != null) {
                    tail = p;
                    p = p._next;
                }
                if (tail != null) {
                    tail._next = conn;
                }
                else {
                    this._head = conn;
                }
            }
        };
        SignalAbstract.prototype.listRemove = function (conn) {
            var prev = null;
            var p = this._head;
            while (p != null) {
                if (p == conn) {
                    var next = p._next;
                    if (prev == null) {
                        this._head = next;
                    }
                    else {
                        prev._next = next;
                    }
                    return;
                }
                prev = p;
                p = p._next;
            }
        };
        SignalAbstract.DISPATCHING_SENTINEL = new SignalConnection_1.SignalConnection(null, null);
        return SignalAbstract;
    }());
    exports.SignalAbstract = SignalAbstract;
});
