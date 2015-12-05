var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "./SignalAbstract"], function (require, exports, SignalAbstract_1) {
    var Signal = (function (_super) {
        __extends(Signal, _super);
        function Signal() {
            _super.apply(this, arguments);
        }
        Signal.prototype.emit = function () {
            var _this = this;
            if (this.dispatching()) {
                this.defer(function () { return _this.emitImpl(); });
            }
            else {
                this.emitImpl();
            }
        };
        Signal.prototype.emitImpl = function () {
            var head = this.willEmit();
            var p = head;
            while (p != null) {
                p._listener();
                if (!p.stayInList) {
                    p.dispose();
                }
                p = p._next;
            }
            this.didEmit(head);
        };
        return Signal;
    })(SignalAbstract_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Signal;
});
