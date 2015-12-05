var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "./SignalAbstract"], function (require, exports, SignalAbstract_1) {
    var Signal2 = (function (_super) {
        __extends(Signal2, _super);
        function Signal2() {
            _super.apply(this, arguments);
        }
        Signal2.prototype.emit = function (arg1, arg2) {
            var _this = this;
            if (this.dispatching()) {
                this.defer(function () { return _this.emitImpl(arg1, arg2); });
            }
            else {
                this.emitImpl(arg1, arg2);
            }
        };
        Signal2.prototype.emitImpl = function (arg1, arg2) {
            var head = this.willEmit();
            var p = head;
            while (p != null) {
                p._listener(arg1, arg2);
                if (!p.stayInList) {
                    p.dispose();
                }
                p = p._next;
            }
            this.didEmit(head);
        };
        return Signal2;
    })(SignalAbstract_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Signal2;
});
