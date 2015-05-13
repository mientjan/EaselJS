var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", './SignalAbstract'], function (require, exports, SignalAbstract) {
    var Signal3 = (function (_super) {
        __extends(Signal3, _super);
        function Signal3() {
            _super.apply(this, arguments);
        }
        Signal3.prototype.emit = function (arg1, arg2, arg3) {
            var _this = this;
            if (this.dispatching()) {
                this.defer(function () { return _this.emitImpl(arg1, arg2, arg3); });
            }
            else {
                this.emitImpl(arg1, arg2, arg3);
            }
        };
        Signal3.prototype.emitImpl = function (arg1, arg2, arg3) {
            var head = this.willEmit();
            var p = head;
            while (p != null) {
                p._listener(arg1, arg2, arg3);
                if (!p.stayInList) {
                    p.dispose();
                }
                p = p._next;
            }
            this.didEmit(head);
        };
        return Signal3;
    })(SignalAbstract);
    return Signal3;
});
