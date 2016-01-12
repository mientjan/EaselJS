define(["require", "exports"], function (require, exports) {
    var Flag = (function () {
        function Flag(value) {
            if (value === void 0) { value = 0; }
            this._value = 0 + value;
        }
        Flag.prototype.contains = function (value) {
            var n = 0 + value;
            return (this._value & n) === n;
        };
        Flag.prototype.add = function (value) {
            var n = 0 + value;
            this._value |= n;
        };
        Flag.prototype.remove = function (value) {
            var n = 0 + value;
            this._value = (this._value ^ n) & this._value;
        };
        Flag.prototype.equals = function (value) {
            var n = 0 + value;
            return this._value === n;
        };
        Flag.prototype.diff = function (value) {
            var n = 0 + value;
            return new Flag(this._value ^ n);
        };
        Flag.prototype.intersection = function (value) {
            var n = 0 + value;
            return new Flag(this._value & n);
        };
        Flag.prototype.valueOf = function () {
            return this._value;
        };
        Flag.prototype.toString = function (value) {
            return this._value.toString(value);
        };
        return Flag;
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Flag;
});
