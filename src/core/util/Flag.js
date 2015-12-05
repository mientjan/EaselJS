define(["require", "exports"], function (require, exports) {
    var Flag = (function () {
        function Flag() {
            this.value = 0;
        }
        Flag.prototype.contains = function (value) {
            var n = value;
            return (this.value & n) === value;
        };
        Flag.prototype.add = function (value) {
            var n = value;
            this.value |= n;
            return this.contains(value);
        };
        Flag.prototype.remove = function (value) {
            var n = value;
            this.value = (this.value ^ n) & this.value;
            return !this.contains(value);
        };
        Flag.prototype.equals = function (value) {
            var n = value;
            return this.value === (n + 0);
        };
        Flag.prototype.valueOf = function () {
            return this.value;
        };
        return Flag;
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Flag;
});
