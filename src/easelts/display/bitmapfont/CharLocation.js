define(["require", "exports"], function (require, exports) {
    "use strict";
    var CharLocation = (function () {
        function CharLocation(char) {
            this.scale = 0;
            this.x = 0;
            this.y = 0;
            this.char = char;
        }
        return CharLocation;
    }());
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = CharLocation;
});
