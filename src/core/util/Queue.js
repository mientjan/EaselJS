define(["require", "exports"], function (require, exports) {
    var Queue = (function () {
        function Queue() {
            this._list = [];
            this.current = null;
        }
        Queue.prototype.add = function (item) {
            this._list.push(item);
            return this;
        };
        Queue.prototype.next = function () {
            this.kill();
            if (this._list.length > 0) {
                this.current = this._list.shift();
            }
            else {
                this.current = null;
            }
            return this.current;
        };
        Queue.prototype.end = function (all) {
            if (all === void 0) { all = false; }
            if (all) {
                this._list.length = 0;
            }
            if (this.current) {
                this.current.times = 1;
            }
            return this;
        };
        Queue.prototype.kill = function (all) {
            if (all === void 0) { all = false; }
            if (all) {
                this._list.length = 0;
            }
            if (this.current) {
                this.current.finish();
                this.current.destruct();
            }
            return this;
        };
        return Queue;
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Queue;
});
