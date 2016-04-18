define(["require", "exports"], function (require, exports) {
    "use strict";
    var NumberUtil = (function () {
        function NumberUtil() {
        }
        NumberUtil.pair = function (x, y) {
            var value = x << 16 & 0xffff0000 | y & 0x0000ffff;
            if (Number.MAX_VALUE < value) {
                throw 'pair created greater than allowed max uint value';
            }
            return value;
        };
        NumberUtil.depair = function (p) {
            return [p >> 16 & 0xFFFF, p & 0xFFFF];
        };
        return NumberUtil;
    }());
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = NumberUtil;
});
