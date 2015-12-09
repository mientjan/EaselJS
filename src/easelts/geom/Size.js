define(["require", "exports"], function (require, exports) {
    var Size = (function () {
        function Size(width, height) {
            this.width = width;
            this.height = height;
        }
        Size.prototype.copy = function (size) {
            return new Size(size.width, size.height);
        };
        Size.prototype.clone = function () {
            return new Size(this.width, this.height);
        };
        Size.prototype.toString = function () {
            return "[Size (x=" + this.width + " y=" + this.height + ")]";
        };
        return Size;
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Size;
});
